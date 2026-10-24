# Template Tools

Put anyone on famous templates, then save the result to your Photos.

- **Marvel**: Doomsday cast-reveal chairs, Endgame one-person posters, "(Name) Will Return" end cards
- **Video Games**: LEGO rosters (Marvel, Batman 3, Star Wars, Harry Potter, Indiana Jones), Super Smash Bros. Ultimate roster, WWE 2K15 roster, Fortnite skins, Marvel Ultimate Alliance 3 roster — built on the real screens
- **Sports**: NBA jersey swap, AEW "is All Elite", WWE 2K14 – 2K26 covers — built on the real graphics

Every photo and name can be dragged, pinched or slider-adjusted. "Save image" exports a full-resolution PNG; on iPhone, "Save to Photos" opens the share sheet.

Everything runs in the browser — photos never leave your device. Templates are fan-made recreations drawn with CSS/SVG; they don't include official logos or artwork. Most templates let you upload a screenshot of the real screen as the background.

```bash
npm install
npm run dev
npm run build
node scripts/icons.mjs   # regenerate icons + thumbnail
```

The screen-based templates are generated from source screenshots by the scripts in `scripts/`
(`roster-geo.py` measures the slots, `rosters.py`/`aew.py` make clean backgrounds, `empty.py` makes the
"Empty out" versions, `covers.py` builds the WWE covers).
