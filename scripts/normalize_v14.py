from pathlib import Path

p = Path('kingfisher.js')
s = p.read_text()
s = s.replace(
    "5:[1,0,1,1,1,1,1],6:[1,0,1,1,1,1,1]",
    "5:[1,0,1,1,0,1,1],6:[1,0,1,1,1,1,1]",
)
s = s.replace(
    "    $('#detailTitle').textContent=a.title;\n    $('#detailDek').textContent=a.summary;\n",
    "    $('#detailTitle').textContent=a.title;\n",
)
old = """    const overview=body[0]?`<section class=\"news-section overview\"><h2>${detailSectionLabel(0)}</h2><p>${esc(body[0])}</p></section>`:'';
    const rest=body.slice(1).map((p,i)=>`<section class=\"news-section\"><h2>${detailSectionLabel(i+1)}</h2><p>${esc(p)}</p></section>`).join('');"""
new = """    const overview=`<section class=\"news-section overview\"><h2>${detailSectionLabel(0)}</h2><p>${esc(a.summary)}</p></section>`;
    const rest=body.map((p,i)=>`<section class=\"news-section\"><h2>${detailSectionLabel(i+1)}</h2><p>${esc(p)}</p></section>`).join('');"""
if old not in s:
    raise SystemExit('Expected detail render block not found')
s = s.replace(old, new)
p.write_text(s)
