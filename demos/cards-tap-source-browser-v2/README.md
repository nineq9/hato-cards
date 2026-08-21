# CARDS Tap → Source Browser v2

Isolated Owner-review experiment. Production CARDS and canonical UX are unchanged.

## Why v2 exists

The first tap-to-source demo had objective visual defects on iPhone light mode:
- dark card content inherited light-theme dark text and became low contrast,
- the decorative rear card / heavy shadow remained visibly below the active card,
- too much secondary chrome competed with the card,
- gesture labels and footer instructions added noise.

## v2 changes

- card text uses a dedicated high-contrast card palette independent of system theme,
- rear card and heavy drop shadow are removed,
- no footer gesture legend,
- headline / summary / two key points only,
- no vertical article scroll,
- tap opens a full-screen Source Browser shell,
- test Source URL is fixed to `https://news.yahoo.co.jp/pickup/6592556`,
- left swipe dismisses as NEXT,
- right swipe dismisses as SAVE,
- one-card completion shows `CLEAR!`.

## Web limitation

The Source Browser uses an iframe only to prototype the transition. Yahoo! News may block third-party iframe embedding using browser security headers. If it does, use the visible `元サイト ↗` control. This prototype does not copy Yahoo! article text into KAWASEMI.

## Owner check

Check on iPhone:
1. Is all card text immediately readable in light and dark appearance?
2. Is there any unexplained shadow / rear-card residue below the card?
3. Does the card feel visually quieter than v1?
4. Does tap → source → back feel like a plausible replacement for vertical reading inside CARDS?
5. Are NEXT / SAVE easier to operate now that the card never vertically scrolls?
