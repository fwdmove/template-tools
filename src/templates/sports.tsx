import { Art, Layer, PhotoSlot, TextSlot, useEditor, useOpt } from '../core/editor';
import { OptColor, OptImage, OptNum, OptSelect, OptText, OptToggle, type TemplateDef } from '../core/ui';

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

/* ================================================================ NBA JERSEY */

// [name, chest wordmark, primary, secondary (text), trim]
export const NBA_TEAMS: [string, string, string, string, string][] = [
  ['Atlanta Hawks', 'HAWKS', '#E03A3E', '#FFFFFF', '#26282A'],
  ['Boston Celtics', 'CELTICS', '#007A33', '#FFFFFF', '#BA9653'],
  ['Brooklyn Nets', 'BROOKLYN', '#000000', '#FFFFFF', '#777D84'],
  ['Charlotte Hornets', 'HORNETS', '#1D1160', '#00788C', '#A1A1A4'],
  ['Chicago Bulls', 'BULLS', '#CE1141', '#FFFFFF', '#000000'],
  ['Cleveland Cavaliers', 'CAVS', '#860038', '#FDBB30', '#041E42'],
  ['Dallas Mavericks', 'DALLAS', '#00538C', '#FFFFFF', '#B8C4CA'],
  ['Denver Nuggets', 'DENVER', '#0E2240', '#FEC524', '#8B2131'],
  ['Detroit Pistons', 'DETROIT', '#C8102E', '#FFFFFF', '#1D42BA'],
  ['Golden State Warriors', 'WARRIORS', '#1D428A', '#FFC72C', '#FFFFFF'],
  ['Houston Rockets', 'ROCKETS', '#CE1141', '#FFFFFF', '#000000'],
  ['Indiana Pacers', 'PACERS', '#002D62', '#FDBB30', '#BEC0C2'],
  ['LA Clippers', 'CLIPPERS', '#1D428A', '#FFFFFF', '#C8102E'],
  ['Los Angeles Lakers', 'LAKERS', '#FDB927', '#552583', '#552583'],
  ['Memphis Grizzlies', 'MEMPHIS', '#5D76A9', '#12173F', '#F5B112'],
  ['Miami Heat', 'HEAT', '#000000', '#FFFFFF', '#98002E'],
  ['Milwaukee Bucks', 'BUCKS', '#00471B', '#EEE1C6', '#0077C0'],
  ['Minnesota Timberwolves', 'MINNESOTA', '#0C2340', '#FFFFFF', '#78BE20'],
  ['New Orleans Pelicans', 'PELICANS', '#0C2340', '#FFFFFF', '#C8102E'],
  ['New York Knicks', 'NEW YORK', '#006BB6', '#FFFFFF', '#F58426'],
  ['Oklahoma City Thunder', 'THUNDER', '#007AC1', '#FFFFFF', '#EF3B24'],
  ['Orlando Magic', 'MAGIC', '#0077C0', '#FFFFFF', '#000000'],
  ['Philadelphia 76ers', '76ERS', '#006BB6', '#FFFFFF', '#ED174C'],
  ['Phoenix Suns', 'SUNS', '#1D1160', '#FFFFFF', '#E56020'],
  ['Portland Trail Blazers', 'BLAZERS', '#000000', '#FFFFFF', '#E03A3E'],
  ['Sacramento Kings', 'KINGS', '#5A2D81', '#FFFFFF', '#63727A'],
  ['San Antonio Spurs', 'SPURS', '#000000', '#FFFFFF', '#C4CED4'],
  ['Toronto Raptors', 'RAPTORS', '#CE1141', '#FFFFFF', '#000000'],
  ['Utah Jazz', 'UTAH', '#002B5C', '#FFFFFF', '#F9A01B'],
  ['Washington Wizards', 'WASHINGTON', '#002B5C', '#FFFFFF', '#E31837'],
];

export function Jersey({ body, text, trim, wordmark, number, font, w = 600 }: { body: string; text: string; trim: string; wordmark: string; number: string; font: string; w?: number }) {
  const h = (w * 760) / 600;
  const fontFamily = font === 'script' ? "'Bangers', cursive" : font === 'modern' ? "'Oswald', sans-serif" : "'Anton', sans-serif";
  return (
    <svg viewBox="0 0 600 760" width={w} height={h} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id="jshade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.35" />
          <stop offset="0.18" stopColor="#000" stopOpacity="0.05" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.1" />
          <stop offset="0.82" stopColor="#000" stopOpacity="0.05" />
          <stop offset="1" stopColor="#000" stopOpacity="0.38" />
        </linearGradient>
        <linearGradient id="jfold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="0.6" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.2" />
        </linearGradient>
        <path id="jarc" d="M110 318 Q300 236 490 318" />
        <clipPath id="jclip">
          <path d="M150 20 L232 20 Q300 128 368 20 L450 20 Q452 168 560 232 L566 760 L34 760 L40 232 Q148 168 150 20 Z" />
        </clipPath>
      </defs>
      <path d="M150 20 L232 20 Q300 128 368 20 L450 20 Q452 168 560 232 L566 760 L34 760 L40 232 Q148 168 150 20 Z" fill={body} />
      <g clipPath="url(#jclip)">
        {/* side panels */}
        <rect x="20" y="230" width="34" height="540" fill={trim} />
        <rect x="546" y="230" width="34" height="540" fill={trim} />
        <rect x="54" y="230" width="8" height="540" fill={text} />
        <rect x="538" y="230" width="8" height="540" fill={text} />
      </g>
      {/* collar + armholes trim */}
      <path d="M232 20 Q300 128 368 20" fill="none" stroke={trim} strokeWidth="20" />
      <path d="M232 20 Q300 112 368 20" fill="none" stroke={text} strokeWidth="5" />
      <path d="M150 20 Q148 168 40 232" fill="none" stroke={trim} strokeWidth="18" />
      <path d="M450 20 Q452 168 560 232" fill="none" stroke={trim} strokeWidth="18" />
      {/* wordmark */}
      <text fontFamily={fontFamily} fontSize={wordmark.length > 8 ? 70 : 88} fill={text} stroke={trim} strokeWidth="5" paintOrder="stroke" textAnchor="middle" letterSpacing="2">
        <textPath href="#jarc" startOffset="50%">
          {wordmark}
        </textPath>
      </text>
      {/* number */}
      <text x="300" y="590" fontFamily={fontFamily} fontSize="250" fill={text} stroke={trim} strokeWidth="9" paintOrder="stroke" textAnchor="middle">
        {number}
      </text>
      {/* jock tag */}
      <rect x="390" y="690" width="70" height="40" rx="3" fill={trim} />
      <path d="M150 20 L232 20 Q300 128 368 20 L450 20 Q452 168 560 232 L566 760 L34 760 L40 232 Q148 168 150 20 Z" fill="url(#jshade)" />
      <path d="M150 20 L232 20 Q300 128 368 20 L450 20 Q452 168 560 232 L566 760 L34 760 L40 232 Q148 168 150 20 Z" fill="url(#jfold)" />
    </svg>
  );
}

function NbaJersey() {
  const { state, selected } = useEditor();
  const [team] = useOpt('team', 'Chicago Bulls');
  const [ed] = useOpt('edition', 'icon');
  const [num] = useOpt('number', '23');
  const [font] = useOpt('font', 'block');
  const [opacity] = useOpt('opacity', 100);
  const t = NBA_TEAMS.find((x) => x[0] === team) ?? NBA_TEAMS[4];
  const [wm] = useOpt('wordmark', '');
  let body = t[2], text = t[3], trim = t[4];
  if (ed === 'association') {
    body = '#F4F4F2';
    text = t[2] === '#FDB927' ? t[3] : t[2];
    trim = t[4] === '#FFFFFF' ? t[2] : t[4];
  } else if (ed === 'statement') {
    body = '#111111';
    text = t[2] === '#000000' ? t[4] : t[2];
    trim = t[3];
  }
  body = state.opts.c1 ?? body;
  text = state.opts.c2 ?? text;
  trim = state.opts.c3 ?? trim;
  const custom = state.opts.jerseyImg as string | undefined;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Art>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 35%, #e9eaec 0%, #b8bbc0 60%, #8a8e95 100%)' }} />
      </Art>
      <PhotoSlot id="player" label="Player media day photo" dark={false} style={{ inset: 0 }} />
      <Layer id="jersey" label="Jersey (drag to fit the body)" style={{ left: 240, top: 560, width: 600, height: 760, opacity: opacity / 100 }}>
        {custom ? (
          <img src={custom} alt="" style={{ width: 600, height: 760, objectFit: 'contain', display: 'block' }} draggable={false} />
        ) : (
          <Jersey body={body} text={text} trim={trim} wordmark={(wm || t[1]).toUpperCase()} number={num} font={font} />
        )}
      </Layer>
      {/* Only catches taps while selected (pick it from the Photos list), so the jersey stays draggable. */}
      <PhotoSlot id="overlay" label="Arms / head on top (transparent PNG, optional)" fit="contain" placeholder={false} style={{ inset: 0, pointerEvents: selected === 'overlay' ? 'auto' : 'none' }} />
    </div>
  );
}

export const nbaJersey: TemplateDef = {
  id: 'nba-jersey',
  tab: 'sports',
  title: 'NBA Jersey Swap',
  blurb: 'Put any team’s jersey on any player’s media day photo. Drag and resize the jersey to fit.',
  size: () => [1080, 1350],
  Render: NbaJersey,
  thumb: { bg: 'linear-gradient(135deg,#CE1141,#000)', emoji: '🏀' },
  Controls: () => (
    <>
      <p className="hint">1) Add the player’s media day photo. 2) Pick the team. 3) Drag the jersey over the body and use the size slider. For a perfect look, add a cut-out of the player’s arms/head as the top layer.</p>
      <OptSelect k="team" label="Team jersey" def="Chicago Bulls" options={NBA_TEAMS.map((t) => t[0])} />
      <OptSelect k="edition" label="Edition" def="icon" options={[['icon', 'Icon (team color)'], ['association', 'Association (white)'], ['statement', 'Statement (dark)']]} />
      <OptText k="number" label="Number" def="23" />
      <OptText k="wordmark" label="Chest wordmark (blank = team default)" def="" />
      <OptSelect k="font" label="Lettering" def="block" options={[['block', 'Block'], ['modern', 'Modern'], ['script', 'Script-style']]} />
      <OptNum k="opacity" label="Jersey opacity %" def={100} min={30} max={100} />
      <ResetColors />
      <div className="row">
        <OptColor k="c1" label="Body" def="#CE1141" />
        <OptColor k="c2" label="Letters" def="#FFFFFF" />
        <OptColor k="c3" label="Trim" def="#000000" />
      </div>
      <OptImage k="jerseyImg" label="Or use your own jersey picture (PNG)" />
    </>
  ),
};

function ResetColors() {
  const { setOpt, state } = useEditor();
  if (!state.opts.c1 && !state.opts.c2 && !state.opts.c3) return <p className="hint">Change the colors below to make a custom jersey.</p>;
  return (
    <button type="button" className="ghost" onClick={() => ['c1', 'c2', 'c3'].forEach((k) => setOpt(k, undefined))}>
      Use team colors again
    </button>
  );
}

/* ================================================================ AEW */

function AewLogo({ size = 220 }: { size?: number }) {
  return (
    <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: size, lineHeight: 0.8, letterSpacing: '-0.06em', color: '#fff', transform: 'skewX(-14deg)', textShadow: '6px 6px 0 #000' }}>
      <span style={{ color: '#d8ae52', textShadow: '0 -3px 0 #f9e7a6, 0 3px 0 #8a6420, 6px 8px 0 #000' }}>AEW</span>
    </div>
  );
}

function Aew() {
  const [bw] = useOpt('bw', false);
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#000' }}>
      <Art>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 70% 50%, #2b2416 0%, #0b0906 55%, #000 100%)' }} />
        <div style={{ position: 'absolute', left: 820, top: -200, width: 200, height: 1500, background: 'linear-gradient(180deg, transparent, rgba(199,154,58,.55), transparent)', transform: 'rotate(18deg)' }} />
        <div style={{ position: 'absolute', left: 1000, top: -200, width: 40, height: 1500, background: 'linear-gradient(180deg, transparent, rgba(249,231,166,.6), transparent)', transform: 'rotate(18deg)' }} />
      </Art>
      <PhotoSlot id="photo" label="Wrestler photo" fit="cover" style={{ left: 880, top: 0, width: 1040, height: 1080 }} filter={bw ? 'grayscale(1) contrast(1.1)' : undefined} />
      <div style={{ position: 'absolute', left: 860, top: 0, width: 260, height: 1080, background: 'linear-gradient(90deg, #000, rgba(0,0,0,0))', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', left: 90, top: 120 }}>
        <AewLogo size={200} />
      </div>
      <TextSlot id="name" label="Name" def="YOUR NAME" fit style={{ left: 90, top: 470, width: 860, fontSize: 150, color: '#fff', fontFamily: "'Anton', sans-serif", textTransform: 'uppercase', letterSpacing: '0.01em', textShadow: '0 8px 20px rgba(0,0,0,.8)' }} />
      <TextSlot
        id="elite"
        label="Tagline"
        def="IS ALL ELITE"
        style={{ left: 94, top: 650, fontSize: 96, fontFamily: "'Anton', sans-serif", color: '#d8ae52', letterSpacing: '0.02em', textShadow: '0 6px 16px rgba(0,0,0,.8)' }}
      />
      <div style={{ position: 'absolute', left: 94, top: 790, width: 520, height: 8, background: 'linear-gradient(90deg,#f9e7a6,#c79a3a)' }} />
      <TextSlot id="handle" label="Hashtag / handle" def="#AEW  #ALLELITE" style={{ left: 94, top: 830, fontSize: 40, color: '#bbb', fontFamily: "'Oswald', sans-serif", fontWeight: 500, letterSpacing: '0.12em' }} />
    </div>
  );
}

export const aew: TemplateDef = {
  id: 'aew-all-elite',
  tab: 'sports',
  title: 'AEW “Is All Elite”',
  blurb: 'The AEW signing announcement graphic. Add a photo and a name.',
  size: () => [1920, 1080],
  Render: Aew,
  allowBg: true,
  thumb: { bg: 'linear-gradient(135deg,#000,#c79a3a)', emoji: '🏆' },
  Controls: () => <OptToggle k="bw" label="Black & white photo" def={false} />,
};

/* ================================================================ ALL-STAR */

const ALLSTAR_TEAMS: Record<string, { name: string; color: string; dark: string; pattern: string }[]> = {
  we: [
    { name: 'WEST', color: '#c8102e', dark: '#5a0612', pattern: 'linear-gradient(160deg,#c8102e,#5a0612)' },
    { name: 'EAST', color: '#1d428a', dark: '#0a1a3d', pattern: 'linear-gradient(160deg,#1d428a,#0a1a3d)' },
  ],
  ssw: [
    { name: 'USA STARS', color: '#0b2a6b', dark: '#061538', pattern: 'radial-gradient(circle, rgba(255,255,255,.25) 2px, transparent 3px) 0 0/40px 40px, linear-gradient(160deg,#173d8f,#061538)' },
    { name: 'USA STRIPES', color: '#c8102e', dark: '#5a0612', pattern: 'repeating-linear-gradient(0deg, rgba(255,255,255,.14) 0 14px, transparent 14px 28px), linear-gradient(160deg,#c8102e,#5a0612)' },
    { name: 'WORLD', color: '#0f7a5c', dark: '#063629', pattern: 'radial-gradient(circle at 50% 40%, rgba(255,255,255,.15), transparent 60%), linear-gradient(160deg,#13906c,#063629)' },
  ],
  captains: [
    { name: 'TEAM 1', color: '#7a5af8', dark: '#2a1a6b', pattern: 'linear-gradient(160deg,#7a5af8,#2a1a6b)' },
    { name: 'TEAM 2', color: '#f2a516', dark: '#6b4300', pattern: 'linear-gradient(160deg,#f2a516,#6b4300)' },
  ],
};

function AllStar() {
  const [fmt] = useOpt('format', 'we');
  const teams = ALLSTAR_TEAMS[fmt] ?? ALLSTAR_TEAMS.we;
  const [per] = useOpt('per_' + fmt, fmt === 'ssw' ? 8 : 12);
  const [year] = useOpt('year', '2027');
  const [city] = useOpt('city', 'PHOENIX');
  const top = 200;
  const colW = (1920 - 80 - (teams.length - 1) * 40) / teams.length;
  const gap = 14;
  const availH = 1080 - top - 140;
  // pick the column count that gives the biggest player cards
  let best = { cols: 1, cw: 0, ch: 0 };
  for (let c = 1; c <= per; c++) {
    const r = Math.ceil(per / c);
    let w = (colW - 40 - gap * (c - 1)) / c;
    let h = w * 1.3;
    const hMax = (availH - gap * (r - 1)) / r;
    if (h > hMax) {
      h = hMax;
      w = h / 1.3;
    }
    if (w > best.cw) best = { cols: c, cw: w, ch: h };
  }
  const { cols, cw, ch } = best;
  const padX = (colW - (cols * cw + (cols - 1) * gap)) / 2;
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#05070d' }}>
      <Art>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, #26304a 0%, #0a0e1a 55%, #03040a 100%)' }} />
      </Art>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 34, textAlign: 'center', fontFamily: "'Anton', sans-serif", color: '#fff', fontSize: 92, letterSpacing: '0.04em', lineHeight: 1 }}>
        NBA ALL-STAR {year}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 135, textAlign: 'center', fontFamily: "'Oswald', sans-serif", fontWeight: 500, color: '#c9d1e6', fontSize: 30, letterSpacing: '0.4em' }}>{city}</div>
      {teams.map((t, ti) => {
        const left = 40 + ti * (colW + 40);
        return (
          <div key={ti} style={{ position: 'absolute', left, top, width: colW, height: 1080 - top - 40, borderRadius: 18, background: t.pattern, boxShadow: '0 10px 30px rgba(0,0,0,.5)', overflow: 'hidden' }}>
            <TextSlot id={'team' + ti} label={`Team ${ti + 1} name`} def={t.name} fit style={{ left: 20, top: 18, width: colW - 40, textAlign: 'center', fontSize: 56, color: '#fff', fontFamily: "'Anton', sans-serif", letterSpacing: '0.05em' }} />
            {range(per).map((i) => {
              const c = i % cols, r = Math.floor(i / cols);
              return (
                <div key={i} style={{ position: 'absolute', left: padX + c * (cw + gap), top: 92 + r * (ch + gap), width: cw, height: ch }}>
                  <PhotoSlot id={`p${ti}_${i}`} label={`${t.name} player ${i + 1}`} style={{ inset: 0, borderRadius: 10, background: 'linear-gradient(180deg, rgba(255,255,255,.18), rgba(0,0,0,.25))', border: '2px solid rgba(255,255,255,.35)' }}>
                    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 34, background: 'rgba(0,0,0,.72)', pointerEvents: 'none' }} />
                  </PhotoSlot>
                  <TextSlot id={`n${ti}_${i}`} label={`${t.name} player ${i + 1} name`} def="PLAYER" fit style={{ left: 6, width: cw - 12, top: ch - 29, fontSize: 22, textAlign: 'center', color: '#fff', fontFamily: "'Oswald', sans-serif", fontWeight: 700, textTransform: 'uppercase' }} />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function AllStarControls() {
  const [fmt] = useOpt('format', 'we');
  return (
    <>
      <OptSelect k="format" label="Format" def="we" options={[['we', 'West vs East'], ['ssw', 'USA Stars vs USA Stripes vs World'], ['captains', 'Team vs Team (captains)']]} />
      <OptNum k={'per_' + fmt} label="Players per team" def={fmt === 'ssw' ? 8 : 12} min={3} max={fmt === 'ssw' ? 12 : 15} />
      <OptText k="year" label="Year" def="2027" />
      <OptText k="city" label="Host city" def="PHOENIX" />
    </>
  );
}

export const allStar: TemplateDef = {
  id: 'all-star',
  tab: 'sports',
  title: 'NBA All-Star Rosters',
  blurb: 'West vs East, or the USA Stars vs USA Stripes vs World format. Add photos and names.',
  size: () => [1920, 1080],
  Render: AllStar,
  Controls: AllStarControls,
  allowBg: true,
  thumb: { bg: 'linear-gradient(135deg,#c8102e 0 50%,#1d428a 50%)', emoji: '⭐' },
};

/* ================================================================ WWE COVERS */

type CoverStyle = { label: string; family: 'svr' | 'classic' | '2k' | '2knew'; year: string; bg: string; accent: string; glow: string };
const COVERS: Record<string, CoverStyle> = {
  svr2006: { label: 'SmackDown vs. Raw 2006', family: 'svr', year: '2006', bg: 'radial-gradient(ellipse at 50% 30%, #3a3f52, #0c0d12)', accent: '#d7261e', glow: '#6aa0ff' },
  svr2007: { label: 'SmackDown vs. Raw 2007', family: 'svr', year: '2007', bg: 'radial-gradient(ellipse at 50% 30%, #4a2d1a, #0e0805)', accent: '#e8a21b', glow: '#ffd27a' },
  svr2008: { label: 'SmackDown vs. Raw 2008', family: 'svr', year: '2008', bg: 'radial-gradient(ellipse at 50% 30%, #2b3e5c, #050a14)', accent: '#2f7bff', glow: '#7ab0ff' },
  svr2009: { label: 'SmackDown vs. Raw 2009', family: 'svr', year: '2009', bg: 'radial-gradient(ellipse at 50% 30%, #4b1515, #0d0303)', accent: '#ff3b2b', glow: '#ff8a6a' },
  svr2010: { label: 'SmackDown vs. Raw 2010', family: 'svr', year: '2010', bg: 'radial-gradient(ellipse at 50% 30%, #2a2a2a, #000)', accent: '#c9c9c9', glow: '#ffffff' },
  svr2011: { label: 'SmackDown vs. Raw 2011', family: 'svr', year: '2011', bg: 'radial-gradient(ellipse at 50% 30%, #1d2c4a, #03060d)', accent: '#ff2a2a', glow: '#5a8cff' },
  wwe12: { label: "WWE '12", family: 'classic', year: "'12", bg: 'radial-gradient(ellipse at 50% 30%, #4a0c0c, #0a0101)', accent: '#e4141b', glow: '#ff5a3a' },
  wwe13: { label: "WWE '13", family: 'classic', year: "'13", bg: 'radial-gradient(ellipse at 50% 30%, #303030, #050505)', accent: '#e4141b', glow: '#ffffff' },
  '2k14': { label: 'WWE 2K14', family: '2k', year: '2K14', bg: 'radial-gradient(ellipse at 50% 30%, #3b2a12, #070502)', accent: '#e6b23a', glow: '#ffd27a' },
  '2k15': { label: 'WWE 2K15', family: '2k', year: '2K15', bg: 'radial-gradient(ellipse at 50% 30%, #3a3a3a, #000)', accent: '#c8a24a', glow: '#ffffff' },
  '2k16': { label: 'WWE 2K16', family: '2k', year: '2K16', bg: 'radial-gradient(ellipse at 50% 30%, #3d0d0a, #070101)', accent: '#ff3a1a', glow: '#ff7a3a' },
  '2k17': { label: 'WWE 2K17', family: '2k', year: '2K17', bg: 'radial-gradient(ellipse at 50% 30%, #2b2b2b, #000)', accent: '#e4141b', glow: '#ff3a3a' },
  '2k18': { label: 'WWE 2K18', family: '2k', year: '2K18', bg: 'radial-gradient(ellipse at 50% 30%, #3a1010, #050101)', accent: '#ffffff', glow: '#ff2a2a' },
  '2k19': { label: 'WWE 2K19', family: '2k', year: '2K19', bg: 'radial-gradient(ellipse at 50% 30%, #3b3320, #050402)', accent: '#e8c25a', glow: '#ffe7a0' },
  '2k20': { label: 'WWE 2K20', family: '2k', year: '2K20', bg: 'radial-gradient(ellipse at 50% 30%, #22307a, #070a22)', accent: '#ff3aa0', glow: '#5ad0ff' },
  '2k22': { label: 'WWE 2K22', family: '2knew', year: '2K22', bg: 'radial-gradient(ellipse at 50% 30%, #4a1a7a, #0c0318)', accent: '#ff3ad0', glow: '#3ae0ff' },
  '2k23': { label: 'WWE 2K23', family: '2knew', year: '2K23', bg: 'radial-gradient(ellipse at 50% 30%, #1d3b22, #020803)', accent: '#3aff7a', glow: '#b0ff7a' },
  '2k24': { label: 'WWE 2K24', family: '2knew', year: '2K24', bg: 'radial-gradient(ellipse at 50% 30%, #3a1414, #070202)', accent: '#e8b04a', glow: '#ff6a3a' },
  '2k25': { label: 'WWE 2K25', family: '2knew', year: '2K25', bg: 'radial-gradient(ellipse at 50% 30%, #2a2a2a, #000)', accent: '#ffffff', glow: '#e8c25a' },
  '2k26': { label: 'WWE 2K26', family: '2knew', year: '2K26', bg: 'radial-gradient(ellipse at 50% 30%, #2a2a30, #000)', accent: '#e4141b', glow: '#ffffff' },
  '2k27': { label: 'WWE 2K27', family: '2knew', year: '2K27', bg: 'radial-gradient(ellipse at 50% 30%, #1a2a4a, #02040a)', accent: '#3a9cff', glow: '#a0d8ff' },
};

const PLATFORMS: Record<string, { label: string; bg: string; color: string; text: string }> = {
  none: { label: 'None', bg: '', color: '', text: '' },
  ps5: { label: 'PS5', bg: '#ffffff', color: '#000', text: 'PS5' },
  ps4: { label: 'PS4', bg: '#0b3fa8', color: '#fff', text: 'PS4' },
  xsx: { label: 'Xbox Series X', bg: '#107c10', color: '#fff', text: 'XBOX SERIES X' },
  xone: { label: 'Xbox One', bg: '#107c10', color: '#fff', text: 'XBOX ONE' },
  switch: { label: 'Switch', bg: '#e60012', color: '#fff', text: 'NINTENDO SWITCH' },
  ps3: { label: 'PS3', bg: '#111', color: '#fff', text: 'PS3' },
};

function WweLogo({ size = 200, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: size, lineHeight: 0.85, color, letterSpacing: '-0.05em', transform: 'skewX(-6deg)', textShadow: '0 6px 18px rgba(0,0,0,.7)' }}>
      WWE
    </div>
  );
}

function WweCover() {
  const [g] = useOpt('game', '2k27');
  const [plat] = useOpt('platform', 'ps5');
  const [rating] = useOpt('rating', true);
  const s = COVERS[g] ?? COVERS['2k27'];
  const p = PLATFORMS[plat] ?? PLATFORMS.none;
  const barH = plat === 'none' ? 0 : 80;
  return (
    <div style={{ position: 'absolute', inset: 0, background: s.bg }}>
      <Art>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 45%, ${s.glow}33, transparent 60%)` }} />
      </Art>
      <PhotoSlot id="star" label="Cover wrestler" style={{ left: 0, top: barH, width: 1080, height: 1360 - barH }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 560, background: 'linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,.75) 55%, rgba(0,0,0,.9))', pointerEvents: 'none' }} />
      {plat !== 'none' && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: barH, background: p.bg, display: 'flex', alignItems: 'center', paddingLeft: 40, fontFamily: "'Archivo Black', sans-serif", fontSize: plat.startsWith('ps') ? 46 : 34, color: p.color, letterSpacing: plat.startsWith('ps') ? '0.08em' : '0.04em', boxShadow: '0 2px 0 rgba(0,0,0,.4)' }}>
          {p.text}
        </div>
      )}
      {/* logo */}
      {s.family === 'svr' ? (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 1000, textAlign: 'center', fontFamily: "'Russo One', sans-serif", color: '#fff', lineHeight: 1 }}>
          <div style={{ fontSize: 96, letterSpacing: '0.02em', color: '#e6eaf0', textShadow: `0 3px 0 #6b7380, 0 0 20px ${s.glow}, 0 8px 0 #000` }}>SMACKDOWN</div>
          <div style={{ fontSize: 50, color: s.accent, margin: '4px 0' }}>vs</div>
          <div style={{ fontSize: 96, color: s.accent, textShadow: '0 6px 0 #000' }}>
            RAW <span style={{ color: '#fff' }}>{s.year}</span>
          </div>
        </div>
      ) : s.family === 'classic' ? (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 1030, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 20 }}>
          <WweLogo size={220} />
          <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 170, color: s.accent, lineHeight: 0.85, textShadow: '0 6px 18px rgba(0,0,0,.7)' }}>{s.year}</div>
        </div>
      ) : s.family === '2k' ? (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 1060, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 26 }}>
          <WweLogo size={180} />
          <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 150, color: s.accent, lineHeight: 0.9, textShadow: `0 0 26px ${s.glow}88, 0 6px 16px rgba(0,0,0,.7)` }}>{s.year}</div>
        </div>
      ) : (
        <div style={{ position: 'absolute', left: 60, top: 1050, display: 'flex', alignItems: 'center', gap: 24 }}>
          <WweLogo size={170} />
          <div style={{ width: 6, height: 140, background: s.accent }} />
          <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 150, color: '#fff', lineHeight: 0.9, letterSpacing: '0.02em', textShadow: `0 0 30px ${s.glow}aa` }}>{s.year}</div>
        </div>
      )}
      <TextSlot id="edition" label="Edition / tagline" def="" style={{ left: 0, top: 960, width: 1080, textAlign: 'center', fontSize: 40, color: s.accent, fontFamily: "'Oswald', sans-serif", fontWeight: 700, letterSpacing: '0.2em' }} />
      {rating && (
        <div style={{ position: 'absolute', left: 30, bottom: 30, width: 92, height: 130, background: '#fff', border: '4px solid #000', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: "'Archivo Black', sans-serif", color: '#000' }}>
          <div style={{ fontSize: 76, lineHeight: 1 }}>T</div>
          <div style={{ fontSize: 13, background: '#000', color: '#fff', width: '100%', textAlign: 'center', padding: '3px 0' }}>TEEN</div>
          <div style={{ fontSize: 9, marginTop: 4 }}>CONTENT RATED BY</div>
          <div style={{ fontSize: 12 }}>ESRB</div>
        </div>
      )}
      <div style={{ position: 'absolute', right: 36, bottom: 36, width: 86, height: 86, borderRadius: 16, background: '#e4141b', display: 'grid', placeItems: 'center', fontFamily: "'Archivo Black', sans-serif", fontSize: 44, color: '#fff' }}>2K</div>
    </div>
  );
}

export const wweCover: TemplateDef = {
  id: 'wwe-cover',
  tab: 'sports',
  title: 'WWE Game Cover',
  blurb: 'Put any wrestler on a WWE game cover — SmackDown vs. Raw through WWE 2K27.',
  size: () => [1080, 1360],
  Render: WweCover,
  thumb: { bg: 'radial-gradient(circle,#1a2a4a,#02040a)', emoji: '🎮' },
  Controls: () => (
    <>
      <OptSelect k="game" label="Game" def="2k27" options={Object.entries(COVERS).reverse().map(([k, v]) => [k, v.label] as [string, string])} />
      <OptSelect k="platform" label="Console banner" def="ps5" options={Object.entries(PLATFORMS).map(([k, v]) => [k, v.label] as [string, string])} />
      <OptToggle k="rating" label="Show rating box" def={true} />
    </>
  ),
};
