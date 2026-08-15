#!/usr/bin/env python3
"""HATO hourly news collector.

No external Python packages are required. The job collects a wide candidate pool,
clusters duplicate coverage, scores importance, keeps a stable morning edition,
and only adds major breaking stories during the day. Existing stories are updated
when later coverage matches the same event.
"""

from __future__ import annotations

import html
import json
import os
import re
import sys
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from collections import Counter
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path
from difflib import SequenceMatcher
from zoneinfo import ZoneInfo

ROOT = Path(os.environ.get("GITHUB_WORKSPACE", Path(__file__).resolve().parents[1]))
DATA_DIR = ROOT / "hato-media" / "data"
STATE_PATH = DATA_DIR / "news-state.json"
LIVE_PATH = DATA_DIR / "live-articles.json"
KYIV = ZoneInfo("Europe/Kyiv")

MAX_FETCHED = 150
MAX_EDITION = 50
MAX_HOURLY_ADDS = 5
CANDIDATE_TTL_HOURS = 54
BASELINE_LOOKBACK_HOURS = 30

QUERIES = [
    {"name": "ukraine-politics", "category": "UKRAINE", "weight": 12, "q": "Украина правительство парламент закон Зеленский Кабмин реформа"},
    {"name": "ukraine-economy", "category": "LIFE", "weight": 9, "q": "Украина экономика энергетика тарифы бюджет восстановление беженцы"},
    {"name": "ukraine-regions", "category": "REGIONS", "weight": 8, "q": "Украина Харьков Одесса Днепр Львов регионы инфраструктура эвакуация"},
    {"name": "war", "category": "WAR", "weight": 12, "q": "Украина война фронт атака ракеты дроны ПВО наступление удар"},
    {"name": "world", "category": "WORLD", "weight": 10, "q": "НАТО ЕС США Россия Европа Украина санкции дипломатия переговоры"},
    {"name": "miltech", "category": "TECH", "weight": 11, "q": "военные технологии дроны ракеты ПВО РЭБ спутники оборонная промышленность Украина"},
    {"name": "osint", "category": "OSINT", "weight": 8, "q": "OSINT Украина спутниковые снимки геолокация разведка кибербезопасность"},
    {"name": "recovery", "category": "LIFE", "weight": 7, "q": "Украина восстановление гуманитарная помощь медицина образование жилье работа"},
]

TRUSTED_SOURCE_HINTS = [
    "reuters", "associated press", "ap news", "bbc", "dw", "deutsche welle",
    "euronews", "financial times", "the guardian", "the economist", "politico",
    "украинская правда", "українська правда", "suspilne", "суспільне",
    "kyiv independent", "interfax-ukraine", "интерфакс-украина", "liga",
    "liga.net", "rbc-ukraine", "рбк-украина", "новое время", "nv.ua",
    "militarnyi", "mil.in.ua", "defense express", "european pravda",
]

BLOCKED_SOURCE_HINTS = [
    "rt.com", "russia today", "sputnik", "спутник", "царьград",
]

A_TERMS = [
    "перемир", "прекращение огня", "переговор", "мирн", "мобилизац",
    "ракет", "дрон", "беспилот", "пво", "обстрел", "удар", "атак",
    "погиб", "ранен", "эвакуац", "наступлен", "отступлен", "фронт",
    "закон", "парламент", "верховн", "президент", "кабмин", "правительств",
    "санкц", "нато", "евросоюз", "ес ", "военная помощь", "пакет помощи",
    "энергосистем", "электростанц", "блэкаут", "отключен", "критическ.*инфраструкт",
    "ядер", "аэс", "запорожск.*аэс", "границ", "безопасност",
]

B_TERMS = [
    "эконом", "бюджет", "налог", "инфляц", "экспорт", "импорт", "гривн",
    "энергет", "газ", "электроэнерг", "нефт", "тариф", "восстановлен",
    "жиль", "бежен", "переселен", "образован", "школ", "медицин", "больниц",
    "оборонн.*промышлен", "производств.*оруж", "контракт", "инфраструкт",
    "железн", "порт", "логист", "коррупц", "реформ",
]

C_TERMS = [
    "технолог", "искусственн.*интеллект", "спутник", "кибер", "osint", "разведк",
    "регион", "город", "гуманитар", "волонтер", "восстанов", "инновац",
]

LOW_VALUE_TERMS = [
    "футбол", "хоккей", "теннис", "кино", "сериал", "шоу-бизнес", "гороскоп",
    "рецепт", "мода", "знаменит", "скандал звезд", "лотере",
]

CATEGORY_TERMS = {
    "WAR": ["фронт", "атак", "удар", "обстрел", "ракет", "дрон", "беспилот", "пво", "наступлен", "боев"],
    "TECH": ["технолог", "рэб", "дрон", "беспилот", "ракета", "пво", "спутник", "оборонн.*промышлен", "производств.*оруж"],
    "OSINT": ["osint", "геолокац", "спутников", "разведк", "кибер", "открыт.*источник"],
    "REGIONS": ["харьков", "одес", "днепр", "львов", "сумы", "чернигов", "херсон", "запорож", "донец", "луган", "регион", "област"],
    "LIFE": ["тариф", "жиль", "бежен", "переселен", "школ", "образован", "медицин", "больниц", "работ", "зарплат", "пенси", "энергет", "электроэнерг"],
    "UKRAINE": ["верховн", "парламент", "кабмин", "правительств", "зеленск", "закон", "реформ", "коррупц"],
    "WORLD": ["нато", "евросоюз", "сша", "трамп", "европа", "россия", "путин", "санкц", "дипломат", "переговор"],
}

WHY = {
    "UKRAINE": "Важно, потому что это может изменить государственную политику, правила или повседневную жизнь в Украине.",
    "LIFE": "Важно, потому что это напрямую связано с жизнью людей: работой, жильём, ценами, энергией, медициной или образованием.",
    "REGIONS": "Важно, потому что последствия различаются по регионам и могут напрямую затрагивать безопасность и инфраструктуру на местах.",
    "WAR": "Важно, потому что это может влиять на безопасность, ход войны, возможности обороны или положение гражданского населения.",
    "WORLD": "Важно, потому что внешние решения США, Европы, России и союзников могут изменить условия для Украины.",
    "TECH": "Важно, потому что военные и технологические возможности всё сильнее влияют на баланс сил и защиту инфраструктуры.",
    "OSINT": "Важно, потому что независимые данные и открытые источники помогают отделять проверяемые факты от заявлений сторон.",
}

WATCH = {
    "UKRAINE": "Следим за официальным текстом решения, сроками вступления в силу и практическими последствиями.",
    "LIFE": "Следим за тем, когда изменения начнут действовать и кого они затронут на практике.",
    "REGIONS": "Следим за официальными сообщениями местных властей, инфраструктурой и изменениями ситуации на месте.",
    "WAR": "Следим за подтверждением из нескольких источников и за тем, меняет ли это ситуацию на фронте или угрозу для гражданских.",
    "WORLD": "Следим за официальными решениями, а не только заявлениями, и за реакцией ключевых сторон.",
    "TECH": "Следим за серийным производством, реальным применением и подтверждёнными характеристиками, а не только анонсами.",
    "OSINT": "Следим за независимым подтверждением, геолокацией, спутниковыми данными и первичными материалами.",
}

STOPWORDS = {
    "и", "в", "во", "на", "по", "с", "со", "о", "об", "от", "до", "за", "для", "из", "к", "у",
    "что", "как", "это", "его", "ее", "их", "а", "но", "или", "при", "после", "перед", "между",
    "the", "a", "an", "of", "to", "in", "on", "for", "and", "with", "from", "after", "over",
}

TAG_RE = re.compile(r"<[^>]+>")
SPACE_RE = re.compile(r"\s+")
WORD_RE = re.compile(r"[a-zа-яёіїєґ0-9]+", re.I)


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


def iso(dt: datetime) -> str:
    return dt.astimezone(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def parse_iso(value: str | None) -> datetime | None:
    if not value:
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(timezone.utc)
    except Exception:
        return None


def strip_html(value: str | None) -> str:
    if not value:
        return ""
    text = TAG_RE.sub(" ", html.unescape(value))
    return SPACE_RE.sub(" ", text).strip()


def clean_title(title: str, source: str = "") -> str:
    title = strip_html(title)
    if source:
        suffix = f" - {source}".lower()
        if title.lower().endswith(suffix):
            title = title[: -len(suffix)].rstrip(" -–—")
    return SPACE_RE.sub(" ", title).strip(" \t\n-–—")


def canonical_text(value: str) -> str:
    value = value.lower().replace("ё", "е")
    value = re.sub(r"https?://\S+", " ", value)
    value = re.sub(r"[^a-zа-яіїєґ0-9 ]+", " ", value, flags=re.I)
    return SPACE_RE.sub(" ", value).strip()


def title_tokens(value: str) -> set[str]:
    return {w for w in WORD_RE.findall(canonical_text(value)) if len(w) > 2 and w not in STOPWORDS}


def similarity(a: str, b: str) -> float:
    aa, bb = canonical_text(a), canonical_text(b)
    if not aa or not bb:
        return 0.0
    ta, tb = title_tokens(aa), title_tokens(bb)
    jac = len(ta & tb) / max(1, len(ta | tb))
    seq = SequenceMatcher(None, aa, bb).ratio()
    return max(jac, seq * 0.86)


def source_is_blocked(source: str) -> bool:
    s = source.lower()
    return any(x in s for x in BLOCKED_SOURCE_HINTS)


def source_trust(source: str) -> int:
    s = source.lower()
    return 10 if any(x in s for x in TRUSTED_SOURCE_HINTS) else 0


def contains(patterns: list[str], text: str) -> int:
    return sum(1 for p in patterns if re.search(p, text, re.I))


def classify(text: str, hint: str) -> str:
    scores: dict[str, int] = {}
    for category, patterns in CATEGORY_TERMS.items():
        scores[category] = contains(patterns, text)
    # Query hint breaks weak ties, but strong title evidence wins.
    scores[hint] = scores.get(hint, 0) + 1
    return max(scores, key=lambda k: scores[k]) if scores else hint


def importance(text: str, source: str, weight: int, published: datetime, now: datetime) -> int:
    age_h = max(0.0, (now - published).total_seconds() / 3600)
    recency = 15 if age_h <= 3 else 11 if age_h <= 8 else 7 if age_h <= 18 else 3
    a = min(40, contains(A_TERMS, text) * 9)
    b = min(26, contains(B_TERMS, text) * 6)
    c = min(12, contains(C_TERMS, text) * 4)
    low = min(35, contains(LOW_VALUE_TERMS, text) * 18)
    return max(0, min(100, weight + recency + source_trust(source) + a + b + c - low))


def tier(score: int) -> str:
    if score >= 75:
        return "A"
    if score >= 55:
        return "B"
    if score >= 40:
        return "C"
    return "D"


def query_url(q: str) -> str:
    params = urllib.parse.urlencode({
        "q": q + " when:2d",
        "hl": "ru",
        "gl": "UA",
        "ceid": "UA:ru",
    })
    return "https://news.google.com/rss/search?" + params


def fetch_query(spec: dict, now: datetime) -> list[dict]:
    req = urllib.request.Request(
        query_url(spec["q"]),
        headers={"User-Agent": "Mozilla/5.0 HATO-NewsBot/1.0 (+https://github.com/nineq9/hato-cards)"},
    )
    try:
        with urllib.request.urlopen(req, timeout=18) as response:
            data = response.read()
    except Exception as exc:
        print(f"WARN fetch {spec['name']}: {exc}", file=sys.stderr)
        return []

    try:
        root = ET.fromstring(data)
    except ET.ParseError as exc:
        print(f"WARN parse {spec['name']}: {exc}", file=sys.stderr)
        return []

    rows: list[dict] = []
    for item in root.findall(".//item")[:28]:
        source_node = item.find("source")
        source = strip_html(source_node.text if source_node is not None else "") or "Google News"
        if source_is_blocked(source):
            continue
        title_raw = item.findtext("title") or ""
        title_clean = clean_title(title_raw, source)
        if len(title_clean) < 12:
            continue
        link = strip_html(item.findtext("link") or "")
        desc = strip_html(item.findtext("description") or "")
        pub_raw = item.findtext("pubDate") or ""
        try:
            published = parsedate_to_datetime(pub_raw)
            if published.tzinfo is None:
                published = published.replace(tzinfo=timezone.utc)
            published = published.astimezone(timezone.utc)
        except Exception:
            published = now
        age_h = (now - published).total_seconds() / 3600
        if age_h > CANDIDATE_TTL_HOURS or age_h < -2:
            continue
        text = canonical_text(title_clean + " " + desc)
        category = classify(text, spec["category"])
        score = importance(text, source, spec["weight"], published, now)
        if score < 22:
            continue
        rows.append({
            "title": title_clean,
            "summary": desc[:420],
            "source": source,
            "sources": [source],
            "url": link,
            "published_at": iso(published),
            "last_seen_at": iso(now),
            "category": category,
            "score": score,
            "tier": tier(score),
            "query": spec["name"],
        })
    return rows


def merge_cluster(base: dict, new: dict, now: datetime) -> dict:
    out = dict(base)
    sources = []
    for src in list(base.get("sources", [])) + list(new.get("sources", [])):
        if src and src not in sources:
            sources.append(src)
    out["sources"] = sources[:8]
    out["source"] = " / ".join(out["sources"][:3])

    old_pub = parse_iso(base.get("published_at")) or datetime.min.replace(tzinfo=timezone.utc)
    new_pub = parse_iso(new.get("published_at")) or old_pub
    if new_pub >= old_pub:
        if len(new.get("summary", "")) >= 35:
            out["summary"] = new["summary"]
        if new.get("title") and len(new["title"]) >= 12:
            out["title"] = new["title"]
        out["published_at"] = new.get("published_at", out.get("published_at"))
        out["url"] = new.get("url") or out.get("url")
        out["category"] = new.get("category") or out.get("category")

    diversity = min(21, max(0, len(out["sources"]) - 1) * 7)
    out["score"] = min(100, max(int(base.get("score", 0)), int(new.get("score", 0))) + diversity)
    out["tier"] = tier(out["score"])
    out["last_seen_at"] = iso(now)
    return out


def cluster_candidates(rows: list[dict], now: datetime) -> list[dict]:
    clusters: list[dict] = []
    for row in sorted(rows, key=lambda x: (int(x.get("score", 0)), x.get("published_at", "")), reverse=True):
        match = None
        for i, existing in enumerate(clusters):
            if similarity(row["title"], existing["title"]) >= 0.62:
                match = i
                break
        if match is None:
            clusters.append(row)
        else:
            clusters[match] = merge_cluster(clusters[match], row, now)
    return clusters


def merge_candidate_memory(memory: list[dict], fresh: list[dict], now: datetime) -> list[dict]:
    cutoff = now - timedelta(hours=CANDIDATE_TTL_HOURS)
    merged = [x for x in memory if (parse_iso(x.get("last_seen_at")) or parse_iso(x.get("published_at")) or now) >= cutoff]
    for row in fresh:
        best_i, best_s = None, 0.0
        for i, existing in enumerate(merged):
            s = similarity(row["title"], existing.get("title", ""))
            if s > best_s:
                best_i, best_s = i, s
        if best_i is not None and best_s >= 0.62:
            merged[best_i] = merge_cluster(merged[best_i], row, now)
        else:
            merged.append(row)
    merged.sort(key=lambda x: (int(x.get("score", 0)), x.get("published_at", "")), reverse=True)
    return merged[:320]


def article_from_candidate(c: dict, article_id: int, now_local: datetime) -> dict:
    published = parse_iso(c.get("published_at")) or now_local.astimezone(timezone.utc)
    local_pub = published.astimezone(KYIV)
    summary = strip_html(c.get("summary", ""))
    if len(summary) < 35:
        summary = "Появилась новая подтверждаемая информация по этой теме. HATO будет обновлять материал по мере появления существенных деталей."
    if len(summary) > 330:
        summary = summary[:327].rstrip() + "…"
    category = c.get("category") or "WORLD"
    source = c.get("source") or "Google News"
    return {
        "id": article_id,
        "category": category,
        "title": c.get("title", "Без заголовка"),
        "summary": summary,
        "source": source,
        "time": local_pub.strftime("%H:%M"),
        "why": WHY.get(category, WHY["WORLD"]),
        "details": summary,
        "statements": "",
        "reality": "",
        "previous": f"Автоматически собрано HATO. Подтверждений/источников в текущем кластере: {len(c.get('sources', [])) or 1}.",
        "watch": WATCH.get(category, WATCH["WORLD"]),
        "source_url": c.get("url", ""),
        "importance": int(c.get("score", 0)),
        "tier": c.get("tier") or tier(int(c.get("score", 0))),
        "published_at": c.get("published_at"),
        "updated_at": iso(now_local.astimezone(timezone.utc)),
        "update_count": 0,
        "_sources": c.get("sources", [source]),
    }


def pick_baseline(candidates: list[dict], now: datetime) -> list[dict]:
    cutoff = now - timedelta(hours=BASELINE_LOOKBACK_HOURS)
    fresh = [c for c in candidates if (parse_iso(c.get("published_at")) or now) >= cutoff]
    primary = [c for c in fresh if int(c.get("score", 0)) >= 55]
    secondary = [c for c in fresh if 42 <= int(c.get("score", 0)) < 55]

    selected: list[dict] = []
    category_counts: Counter[str] = Counter()
    for c in sorted(primary, key=lambda x: int(x.get("score", 0)), reverse=True):
        cat = c.get("category", "WORLD")
        if category_counts[cat] >= 12:
            continue
        selected.append(c)
        category_counts[cat] += 1
        if len(selected) >= MAX_EDITION:
            return selected

    # Do not manufacture a fixed article count, but when enough useful C-tier
    # material exists, bring the morning edition toward ~30 stories.
    if len(selected) < 30:
        for c in sorted(secondary, key=lambda x: int(x.get("score", 0)), reverse=True):
            cat = c.get("category", "WORLD")
            if category_counts[cat] >= 10:
                continue
            selected.append(c)
            category_counts[cat] += 1
            if len(selected) >= 30:
                break
    return selected[:MAX_EDITION]


def match_article(candidate: dict, articles: list[dict]) -> tuple[int | None, float]:
    best_i, best_s = None, 0.0
    for i, article in enumerate(articles):
        s = similarity(candidate.get("title", ""), article.get("title", ""))
        if candidate.get("category") == article.get("category"):
            s += 0.05
        if s > best_s:
            best_i, best_s = i, s
    return best_i, best_s


def update_article(article: dict, candidate: dict, now_local: datetime) -> dict:
    out = dict(article)
    old_pub = parse_iso(article.get("published_at")) or datetime.min.replace(tzinfo=timezone.utc)
    new_pub = parse_iso(candidate.get("published_at")) or old_pub
    sources = []
    for src in list(article.get("_sources", [])) + list(candidate.get("sources", [])):
        if src and src not in sources:
            sources.append(src)
    out["_sources"] = sources[:8]
    out["source"] = " / ".join(out["_sources"][:3]) or out.get("source", "")
    out["importance"] = max(int(out.get("importance", 0)), int(candidate.get("score", 0)))
    out["tier"] = tier(out["importance"])
    if new_pub > old_pub:
        if candidate.get("title"):
            out["title"] = candidate["title"]
        summary = strip_html(candidate.get("summary", ""))
        if len(summary) >= 35:
            out["summary"] = summary[:327].rstrip() + ("…" if len(summary) > 327 else "")
            out["details"] = out["summary"]
        out["published_at"] = candidate.get("published_at")
        out["source_url"] = candidate.get("url", out.get("source_url", ""))
        out["time"] = new_pub.astimezone(KYIV).strftime("%H:%M")
    out["updated_at"] = iso(now_local.astimezone(timezone.utc))
    out["update_count"] = int(out.get("update_count", 0)) + 1
    out["previous"] = f"Материал обновлён в {now_local.strftime('%H:%M')}. Источников в объединённом кластере: {len(out['_sources']) or 1}."
    return out


def edition_date_for(now_local: datetime) -> str:
    date = now_local.date() if now_local.hour >= 6 else (now_local.date() - timedelta(days=1))
    return date.isoformat()


def load_state() -> dict:
    try:
        return json.loads(STATE_PATH.read_text(encoding="utf-8"))
    except Exception:
        return {"edition_date": None, "last_run_at": None, "candidates": [], "articles": []}


def write_json(path: Path, value: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> int:
    now = utcnow()
    now_local = now.astimezone(KYIV)
    state = load_state()

    rows: list[dict] = []
    for spec in QUERIES:
        rows.extend(fetch_query(spec, now))
    rows.sort(key=lambda x: (int(x.get("score", 0)), x.get("published_at", "")), reverse=True)
    rows = rows[:MAX_FETCHED]
    fresh_clusters = cluster_candidates(rows, now)
    memory = merge_candidate_memory(state.get("candidates", []), fresh_clusters, now)

    edition_date = edition_date_for(now_local)
    old_articles = state.get("articles", []) if isinstance(state.get("articles"), list) else []
    rebuilding = not old_articles or state.get("edition_date") != edition_date

    if rebuilding:
        picked = pick_baseline(memory, now)
        articles = [article_from_candidate(c, i + 1, now_local) for i, c in enumerate(picked)]
        mode = "morning" if now_local.hour >= 6 else "bootstrap"
    else:
        articles = [dict(a) for a in old_articles]
        used_candidates: set[int] = set()

        # First: update existing stories when a new candidate is the same event.
        for ci, candidate in enumerate(memory):
            if int(candidate.get("score", 0)) < 40:
                continue
            ai, s = match_article(candidate, articles)
            if ai is not None and s >= 0.60:
                new_pub = parse_iso(candidate.get("published_at"))
                old_pub = parse_iso(articles[ai].get("published_at"))
                source_growth = len(set(candidate.get("sources", []))) > len(set(articles[ai].get("_sources", [])))
                if (new_pub and (not old_pub or new_pub > old_pub)) or source_growth:
                    articles[ai] = update_article(articles[ai], candidate, now_local)
                used_candidates.add(ci)

        # Second: only major breaking items can expand the edition during the day.
        additions = 0
        if len(articles) < MAX_EDITION:
            for ci, candidate in enumerate(memory):
                if ci in used_candidates:
                    continue
                if int(candidate.get("score", 0)) < 75:
                    continue
                _, s = match_article(candidate, articles)
                if s >= 0.58:
                    continue
                next_id = max([int(a.get("id", 0)) for a in articles] + [0]) + 1
                articles.append(article_from_candidate(candidate, next_id, now_local))
                additions += 1
                if additions >= MAX_HOURLY_ADDS or len(articles) >= MAX_EDITION:
                    break
        mode = "hourly-update"

    # Stable ordering: highest priority first within category is handled by existing HATO
    # category layout; IDs remain stable across hourly updates.
    state_out = {
        "edition_date": edition_date,
        "last_run_at": iso(now),
        "candidate_count": len(memory),
        "fetched_count": len(rows),
        "candidates": memory,
        "articles": articles,
    }
    live_out = {
        "generated_at": iso(now),
        "edition_date": edition_date,
        "mode": mode,
        "policy": {
            "fetched_per_hour_max": MAX_FETCHED,
            "edition_max": MAX_EDITION,
            "hourly_new_story_max": MAX_HOURLY_ADDS,
            "new_story_threshold": 75,
            "update_match_threshold": 0.60,
        },
        "articles": articles,
    }
    write_json(STATE_PATH, state_out)
    write_json(LIVE_PATH, live_out)

    counts = Counter(a.get("category", "?") for a in articles)
    print(json.dumps({
        "mode": mode,
        "edition_date": edition_date,
        "fetched": len(rows),
        "candidates": len(memory),
        "published": len(articles),
        "categories": counts,
    }, ensure_ascii=False, default=dict))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
