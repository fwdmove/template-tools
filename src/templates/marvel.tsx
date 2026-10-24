import { Art, PhotoSlot, TextSlot, useOpt } from '../core/editor';
import { OptNum, OptSelect, OptText, OptToggle, type TemplateDef } from '../core/ui';

/* ---------------------------------------------------------------- Will Return */

function WillReturn() {
  const [color] = useOpt('color', 'white');
  const [font] = useOpt('font', 'sans');
  const [countdown] = useOpt('countdown', false);
  const [layout] = useOpt('layout', 'stacked');
  const c = color === 'green' ? '#5dff7a' : '#f4f4f4';
  const glow = color === 'green' ? '0 0 18px rgba(80,255,120,.55)' : 'none';
  const ff = font === 'serif' ? "'Cinzel', serif" : "'Montserrat', sans-serif";
  const base = { fontFamily: ff, color: c, textShadow: glow, fontWeight: 600, letterSpacing: '0.16em', textAlign: 'center' as const, left: 0, width: 1920 };
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#000' }}>
      {layout === 'stacked' ? (
        <>
          <TextSlot id="name" label="Name" def="STEVE ROGERS" fit style={{ ...base, top: countdown ? 330 : 400, fontSize: 92, textTransform: 'uppercase', padding: '0 120px', boxSizing: 'border-box' }} />
          <TextSlot id="will" label="Middle line" def="WILL RETURN IN" style={{ ...base, top: countdown ? 460 : 530, fontSize: 44, fontWeight: 500, letterSpacing: '0.3em' }} />
          <TextSlot id="movie" label="Movie title" def="AVENGERS: DOOMSDAY" fit style={{ ...base, top: countdown ? 540 : 610, fontSize: 64, letterSpacing: '0.22em', padding: '0 120px', boxSizing: 'border-box' }} />
        </>
      ) : (
        <TextSlot
          id="line"
          label="Full sentence"
          def="STEVE ROGERS WILL RETURN IN AVENGERS: DOOMSDAY"
          fit
          style={{ ...base, top: countdown ? 470 : 515, fontSize: 52, letterSpacing: '0.14em', padding: '0 110px', boxSizing: 'border-box' }}
        />
      )}
      {countdown && (
        <div style={{ position: 'absolute', top: 700, left: 0, width: 1920, display: 'flex', justifyContent: 'center', gap: 70, color: c, textShadow: glow, fontFamily: "'Montserrat', sans-serif" }}>
          {(
            [
              ['d', 'DAYS', '365'],
              ['h', 'HOURS', '12'],
              ['m', 'MINUTES', '45'],
              ['s', 'SECONDS', '09'],
            ] as const
          ).map(([k, lab, dv]) => (
            <div key={k} style={{ position: 'relative', width: 200, height: 150 }}>
              <TextSlot id={'cd_' + k} label={'Countdown ' + lab.toLowerCase()} def={dv} style={{ left: 0, top: 0, width: 200, textAlign: 'center', fontSize: 86, fontWeight: 500, letterSpacing: '0.05em', color: c }} />
              <div style={{ position: 'absolute', top: 108, width: 200, textAlign: 'center', fontSize: 20, letterSpacing: '0.35em', fontWeight: 600 }}>{lab}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const willReturn: TemplateDef = {
  id: 'will-return',
  tab: 'marvel',
  title: '(Name) Will Return',
  blurb: 'The end card from the Avengers: Doomsday teasers.',
  size: () => [1920, 1080],
  Render: WillReturn,
  thumb: { bg: 'linear-gradient(135deg,#000,#0b2a12)', emoji: '🟩' },
  Controls: () => (
    <>
      <OptSelect k="layout" label="Layout" def="stacked" options={[['stacked', 'Name on its own line'], ['line', 'One sentence']]} />
      <OptSelect k="color" label="Text color" def="white" options={[['white', 'White'], ['green', 'Doom green']]} />
      <OptSelect k="font" label="Font" def="sans" options={[['sans', 'Clean sans'], ['serif', 'Classic serif']]} />
      <OptToggle k="countdown" label="Show countdown clock" def={false} />
    </>
  ),
};

/* ---------------------------------------------------------------- Doomsday chairs */

/** A black canvas director's chair seen from behind. Coordinates in a 600x900 box. */
function DirectorChair({ id, idx, single }: { id: string; idx: number; single: boolean }) {
  const g = `ch${idx}`;
  return (
    <>
      <svg viewBox="0 0 600 900" width="600" height="900" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <linearGradient id={g + 'c'} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1d1d1f" />
            <stop offset="0.5" stopColor="#111113" />
            <stop offset="1" stopColor="#09090a" />
          </linearGradient>
          <linearGradient id={g + 'w'} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#151515" />
            <stop offset="0.45" stopColor="#3a3a3c" />
            <stop offset="1" stopColor="#101010" />
          </linearGradient>
          <radialGradient id={g + 'sh'} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#000" stopOpacity="0.75" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="300" cy="872" rx="290" ry="26" fill={`url(#${g}sh)`} />
        {/* X legs */}
        <path d="M120 560 L470 860 L500 860 L150 560 Z" fill={`url(#${g}w)`} />
        <path d="M480 560 L130 860 L100 860 L450 560 Z" fill={`url(#${g}w)`} />
        <rect x="95" y="845" width="110" height="18" rx="4" fill="#1a1a1a" />
        <rect x="395" y="845" width="110" height="18" rx="4" fill="#1a1a1a" />
        {/* seat */}
        <path d="M95 520 L505 520 L520 570 L80 570 Z" fill="#0d0d0e" />
        <rect x="80" y="560" width="440" height="22" rx="4" fill={`url(#${g}w)`} />
        {/* arm rests */}
        <rect x="58" y="388" width="104" height="22" rx="6" fill={`url(#${g}w)`} />
        <rect x="438" y="388" width="104" height="22" rx="6" fill={`url(#${g}w)`} />
        {/* posts */}
        <rect x="78" y="60" width="34" height="520" rx="6" fill={`url(#${g}w)`} />
        <rect x="488" y="60" width="34" height="520" rx="6" fill={`url(#${g}w)`} />
        <circle cx="95" cy="62" r="17" fill="#2b2b2d" />
        <circle cx="505" cy="62" r="17" fill="#2b2b2d" />
        {/* canvas back */}
        <path d="M108 80 L492 80 L492 300 L108 300 Z" fill={`url(#${g}c)`} />
        <path d="M108 80 L492 80 L492 92 L108 92 Z" fill="#000" opacity="0.5" />
        <path d="M108 292 Q300 304 492 292 L492 300 L108 300 Z" fill="#000" opacity="0.6" />
        <rect x="108" y="80" width="384" height="220" fill="none" stroke="#2a2a2c" strokeWidth="3" strokeDasharray="7 6" opacity="0.7" />
        {/* light sheen */}
        <rect x="108" y="80" width="384" height="220" fill="url(#sheen)" opacity="0.35" />
      </svg>
      <TextSlot
        id={id}
        label={`Chair ${idx + 1} name`}
        def={idx === 0 ? 'CHRIS HEMSWORTH' : 'NAME HERE'}
        fit
        style={{
          left: 130,
          top: single ? 162 : 160,
          width: 340,
          fontSize: 46,
          color: '#f2f2f2',
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 800,
          textAlign: 'center',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}
      />
    </>
  );
}

function Chairs() {
  const [n] = useOpt('count', 1);
  const [scene] = useOpt('scene', 'stage');
  const single = n === 1;
  const scale = single ? 1.08 : Math.min(0.92, 1700 / (n * 600));
  const gap = single ? 0 : (1920 - n * 600 * scale) / (n + 1);
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#050505', overflow: 'hidden' }}>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.25" />
            <stop offset="0.4" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <Art>
        {scene === 'stage' ? (
          <>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 55% 60% at 50% 32%, #3a3631 0%, #1b1a18 40%, #070707 80%)' }} />
            {/* back wall panels */}
            <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 700, background: 'repeating-linear-gradient(90deg, rgba(255,255,255,.025) 0 2px, transparent 2px 240px)' }} />
            {/* floor */}
            <div style={{ position: 'absolute', left: 0, right: 0, top: 700, bottom: 0, background: 'linear-gradient(#1a1816, #0a0a0a 70%)' }} />
            <div style={{ position: 'absolute', left: '15%', right: '15%', top: 690, height: 300, background: 'radial-gradient(ellipse at 50% 30%, rgba(255,235,200,.16), transparent 70%)' }} />
          </>
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(#0c0c0c,#000)' }} />
        )}
      </Art>
      {Array.from({ length: n }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: 600,
            height: 900,
            left: single ? (1920 - 600 * scale) / 2 : gap + i * (600 * scale + gap),
            top: single ? 1080 - 900 * scale + 40 : 1080 - 900 * scale - 30,
            transform: `scale(${scale})`,
            transformOrigin: '0 0',
          }}
        >
          <DirectorChair id={'name' + i} idx={i} single={single} />
        </div>
      ))}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 80% 80% at 50% 45%, transparent 55%, rgba(0,0,0,.65))' }} />
    </div>
  );
}

export const chairs: TemplateDef = {
  id: 'doomsday-chairs',
  tab: 'marvel',
  title: 'Doomsday Chairs',
  blurb: 'Put any names on the director’s chairs from the cast reveal livestream.',
  size: () => [1920, 1080],
  Render: Chairs,
  allowBg: true,
  thumb: { bg: 'linear-gradient(135deg,#2c2925,#050505)', emoji: '🪑' },
  Controls: () => (
    <>
      <OptNum k="count" label="Chairs" def={1} min={1} max={6} />
      <OptSelect k="scene" label="Backdrop" def="stage" options={[['stage', 'Livestream stage'], ['black', 'Plain black']]} />
    </>
  ),
};

/* ---------------------------------------------------------------- Endgame posters */

export function AvengersA({ size = 200, color = '#d9d9d9' }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size}>
      <circle cx="100" cy="100" r="80" fill="none" stroke={color} strokeWidth="14" strokeDasharray="420 83" strokeDashoffset="-30" />
      <path d="M100 18 L44 182 L76 182 L88 146 L120 146 L120 182 L150 182 L150 18 Z M96 120 L120 52 L120 120 Z" fill={color} />
      <path d="M150 50 L188 30 L178 62 Z" fill={color} />
    </svg>
  );
}

function EndgameLogo({ w = 760, color = '#cfd2d6' }: { w?: number; color?: string }) {
  return (
    <div style={{ width: w, textAlign: 'center', fontFamily: "'Russo One', sans-serif", lineHeight: 1 }}>
      <div
        style={{
          fontSize: w * 0.15,
          letterSpacing: '0.06em',
          color: color,
          textShadow: '0 -2px 0 #ffffff, 0 3px 0 #6b6f76, 0 6px 10px rgba(0,0,0,.7)',
        }}
      >
        AVENGERS
      </div>
      <div style={{ fontSize: w * 0.06, letterSpacing: '0.42em', color: '#c9ccd1', marginTop: w * 0.012, fontFamily: "'Montserrat', sans-serif", fontWeight: 600, paddingLeft: '0.42em' }}>
        ENDGAME
      </div>
    </div>
  );
}

function Billing() {
  return (
    <TextSlot
      id="billing"
      label="Credits block"
      def={'MARVEL STUDIOS PRESENTS  A TEMPLATE TOOLS PRODUCTION  "AVENGERS: ENDGAME"  MUSIC BY ALAN SILVESTRI\nEDITED BY JEFFREY FORD  JEFF ORLAND  PRODUCTION DESIGNER CHARLES WOOD  DIRECTOR OF PHOTOGRAPHY TRENT OPALOCH\nEXECUTIVE PRODUCERS LOUIS D\'ESPOSITO  VICTORIA ALONSO  PRODUCED BY KEVIN FEIGE  DIRECTED BY ANTHONY AND JOE RUSSO'}
      multiline
      style={{ left: 60, top: 1480, width: 960, fontSize: 13.5, lineHeight: 1.45, color: '#8c8f94', textAlign: 'center', fontFamily: "'Roboto Condensed', sans-serif", letterSpacing: '0.04em', transform: 'scaleY(1.35)' }}
    />
  );
}

function EndgamePoster() {
  const [style] = useOpt('style', 'fallen');
  const [date] = useOpt('date', '04.26');
  // older saves used 'fallen-bw' / 'fallen-color' as the style
  const [photo] = useOpt('photo', style === 'fallen-color' || style === 'character' ? 'color' : 'bw');
  const bw = photo === 'bw';
  const fallen = style !== 'character';
  return (
    <div style={{ position: 'absolute', inset: 0, background: fallen ? '#0b0b0d' : 'radial-gradient(ellipse at 50% 30%, #4b2c7a, #1a0f33 60%, #07040f)' }}>
      {!fallen && (
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,.12) 0 2px, transparent 3px) 0 0/90px 90px, radial-gradient(circle at 70% 60%, rgba(255,255,255,.1) 0 1px, transparent 2px) 0 0/60px 60px' }} />
      )}
      <PhotoSlot id="photo" label="Character photo" style={{ left: 0, top: 0, width: 1080, height: 1600 }} filter={bw ? 'grayscale(1) contrast(1.15) brightness(.95)' : 'saturate(1.05) contrast(1.05)'} />
      {/* poster grading */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(180deg, rgba(0,0,0,.35) 0%, transparent 18%, transparent 52%, rgba(0,0,0,.85) 74%, #000 88%)' }} />
      {!bw && fallen && <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(180deg, rgba(60,30,110,.18), rgba(20,10,40,.25))' }} />}
      {fallen ? (
        <>
          <div style={{ position: 'absolute', top: 1160, left: 0, width: 1080, display: 'flex', justifyContent: 'center' }}>
            <AvengersA size={120} color={bw ? '#d8d8d8' : '#cdb6ff'} />
          </div>
          <TextSlot id="tag" label="Tagline" def="AVENGE THE FALLEN" style={{ left: 0, top: 1300, width: 1080, textAlign: 'center', fontSize: 50, color: '#f0f0f0', fontFamily: "'Montserrat', sans-serif", fontWeight: 600, letterSpacing: '0.32em' }} />
          <div style={{ position: 'absolute', top: 1385, left: 0, width: 1080, textAlign: 'center', fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: 30, color: '#cfcfcf', letterSpacing: '0.3em' }}>
            AVENGERS: ENDGAME · {date}
          </div>
        </>
      ) : (
        <>
          <TextSlot id="charname" label="Character name" def="" style={{ left: 0, top: 1110, width: 1080, textAlign: 'center', fontSize: 40, color: '#fff', fontFamily: "'Montserrat', sans-serif", fontWeight: 600, letterSpacing: '0.35em' }} />
          <div style={{ position: 'absolute', top: 1180, left: 160 }}>
            <EndgameLogo w={760} />
          </div>
          <div style={{ position: 'absolute', top: 1395, left: 0, width: 1080, textAlign: 'center', fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: 34, color: '#e8e8e8', letterSpacing: '0.3em' }}>{date}</div>
        </>
      )}
      <Billing />
    </div>
  );
}

function EndgamePhotoColor() {
  const [style] = useOpt('style', 'fallen');
  return (
    <OptSelect
      k="photo"
      label="Your picture"
      def={style === 'fallen-color' || style === 'character' ? 'color' : 'bw'}
      options={[
        ['bw', 'Black & white (dusted)'],
        ['color', 'Color (survivor)'],
      ]}
    />
  );
}

export const endgame: TemplateDef = {
  id: 'endgame-poster',
  tab: 'marvel',
  title: 'Endgame Character Poster',
  blurb: 'The one-person Avengers: Endgame posters. Your picture can be black & white or color.',
  size: () => [1080, 1600],
  Render: EndgamePoster,
  thumb: { bg: 'linear-gradient(135deg,#3c2a66,#0b0b0d)', emoji: '🎬' },
  Controls: () => (
    <>
      <OptSelect
        k="style"
        label="Poster style"
        def="fallen"
        options={[
          ['fallen', 'Avenge the Fallen'],
          ['character', 'Character poster with logo'],
        ]}
      />
      <EndgamePhotoColor />
      <OptText k="date" label="Date" def="04.26" />
    </>
  ),
};
