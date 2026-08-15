#!/usr/bin/env python3
"""Tuned HATO collector profile.

Keeps the stable selection/update engine in hato_hourly.py but widens discovery,
filters clickbait-heavy sources, and prevents an under-filled live edition.
"""

from collections import Counter
from datetime import timedelta
import hato_hourly as h

h.MAX_FETCHED = 150
h.BASELINE_LOOKBACK_HOURS = 42
h.BLOCKED_SOURCE_HINTS += ["главред", "glavred", "dialog.ua", "znaj.ua"]

h.QUERIES = [
    {"name":"ukraine-core","category":"UKRAINE","weight":14,"q":"Украина"},
    {"name":"ukraine-politics","category":"UKRAINE","weight":13,"q":"Украина (правительство OR парламент OR закон OR Зеленский OR Кабмин OR реформа)"},
    {"name":"ukraine-war","category":"WAR","weight":14,"q":"Украина (война OR фронт OR удар OR атака OR ракеты OR дроны OR ПВО)"},
    {"name":"ukraine-russia","category":"WAR","weight":13,"q":"Украина Россия война"},
    {"name":"ukraine-economy","category":"LIFE","weight":11,"q":"Украина (экономика OR бюджет OR энергетика OR тарифы OR восстановление)"},
    {"name":"ukraine-life","category":"LIFE","weight":9,"q":"Украина (беженцы OR переселенцы OR медицина OR образование OR жилье OR работа)"},
    {"name":"ukraine-regions","category":"REGIONS","weight":10,"q":"Украина (Харьков OR Одесса OR Днепр OR Львов OR Сумы OR Херсон OR Запорожье)"},
    {"name":"nato-ukraine","category":"WORLD","weight":12,"q":"НАТО Украина"},
    {"name":"us-ukraine","category":"WORLD","weight":12,"q":"США Украина"},
    {"name":"eu-ukraine","category":"WORLD","weight":11,"q":"Европа ЕС Украина"},
    {"name":"sanctions-diplomacy","category":"WORLD","weight":11,"q":"Украина (санкции OR переговоры OR дипломатия OR перемирие)"},
    {"name":"miltech","category":"TECH","weight":12,"q":"Украина (военные технологии OR дроны OR ПВО OR РЭБ OR ракеты OR оборонная промышленность)"},
    {"name":"osint","category":"OSINT","weight":9,"q":"Украина (OSINT OR спутниковые снимки OR геолокация OR разведка OR кибербезопасность)"},
]

_original_article = h.article_from_candidate

def article_from_candidate(candidate, article_id, now_local):
    a = _original_article(candidate, article_id, now_local)
    # Google News descriptions often repeat the headline + publisher. Avoid showing
    # that duplication as if it were a real summary.
    if h.similarity(a.get("summary", ""), a.get("title", "")) >= 0.70:
        n = max(1, len(candidate.get("sources", [])))
        a["summary"] = f"HATO отслеживает развитие этой темы и объединяет подтверждения из {n} источника(ов). Новые существенные детали будут добавлены в этот материал, а не вынесены в дубликат."
        a["details"] = a["summary"]
    return a

h.article_from_candidate = article_from_candidate


def pick_baseline(candidates, now):
    cutoff = now - timedelta(hours=h.BASELINE_LOOKBACK_HOURS)
    fresh = [c for c in candidates if (h.parse_iso(c.get("published_at")) or now) >= cutoff]
    fresh.sort(key=lambda x: (int(x.get("score", 0)), x.get("published_at", "")), reverse=True)

    selected = []
    counts = Counter()
    seen = set()

    def add_pool(pool, limit_per_category):
        for c in pool:
            key = h.canonical_text(c.get("title", ""))
            if not key or key in seen:
                continue
            cat = c.get("category", "WORLD")
            if counts[cat] >= limit_per_category:
                continue
            selected.append(c)
            seen.add(key)
            counts[cat] += 1
            if len(selected) >= h.MAX_EDITION:
                return True
        return False

    # A/B quality first.
    if add_pool([c for c in fresh if int(c.get("score", 0)) >= 45], 12):
        return selected[:h.MAX_EDITION]

    # If the news day is quieter, useful C-level context can bring the edition
    # toward ~30 items, but we never pad with obviously low-value material.
    if len(selected) < 30:
        add_pool([c for c in fresh if 32 <= int(c.get("score", 0)) < 45], 10)

    return selected[:h.MAX_EDITION]

h.pick_baseline = pick_baseline

if __name__ == "__main__":
    raise SystemExit(h.main())
