import { Art, Layer, PhotoSlot, useEditor, useOpt } from '../core/editor';
import { OptColor, OptImage, OptNum, OptSelect, OptText, type TemplateDef } from '../core/ui';

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
