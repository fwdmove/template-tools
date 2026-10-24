import type { CSSProperties, ReactNode } from 'react';
import { Art, PhotoSlot, TextSlot, useOpt, useTextValue } from '../core/editor';
import { OptNum, OptSelect, OptText, OptToggle, type TemplateDef } from '../core/ui';

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

/* ================================================================ LEGO */

type LegoTheme = {
  title: string;
  bg: string;
  overlay?: string;
  ring: string;
  ringDark: string;
  hilite: string;
  font: string;
  text: string;
  panel: string;
};

const LEGO: Record<string, LegoTheme> = {
  marvel: {
    title: 'LEGO MARVEL SUPER HEROES',
    bg: 'radial-gradient(ellipse at 60% 40%, #24508f 0%, #102a57 45%, #060f24 100%)',
    overlay: 'repeating-linear-gradient(60deg, rgba(255,255,255,.035) 0 2px, transparent 2px 46px), repeating-linear-gradient(-60deg, rgba(255,255,255,.035) 0 2px, transparent 2px 46px)',
    ring: '#f2f4f8',
    ringDark: '#8a96ab',
    hilite: '#ff2b2b',
    font: "'Bangers', cursive",
    text: '#ffffff',
    panel: 'linear-gradient(180deg, rgba(10,25,60,.85), rgba(5,12,30,.92))',
  },
  batman: {
    title: 'LEGO BATMAN',
    bg: 'radial-gradient(ellipse at 50% 30%, #2a3442 0%, #11161e 55%, #05070a 100%)',
    overlay: 'linear-gradient(180deg, transparent 60%, rgba(245,196,0,.06))',
    ring: '#f5c400',
    ringDark: '#7a6200',
    hilite: '#ffffff',
    font: "'Anton', sans-serif",
    text: '#f5c400',
    panel: 'linear-gradient(180deg, rgba(20,24,32,.9), rgba(5,6,10,.95))',
  },
  starwars: {
    title: 'LEGO STAR WARS',
    bg: '#02030a',
    overlay:
      'radial-gradient(1px 1px at 10% 20%, #fff, transparent), radial-gradient(1px 1px at 30% 70%, #fff, transparent), radial-gradient(1.5px 1.5px at 55% 35%, #fff, transparent), radial-gradient(1px 1px at 80% 15%, #fff, transparent), radial-gradient(1px 1px at 90% 80%, #fff, transparent), radial-gradient(1.5px 1.5px at 65% 90%, #fff, transparent), radial-gradient(1px 1px at 20% 90%, #fff, transparent), radial-gradient(ellipse at 70% 50%, rgba(60,90,160,.25), transparent 60%)',
    ring: '#ffe81f',
    ringDark: '#7d7000',
    hilite: '#4fc3ff',
    font: "'Oswald', sans-serif",
    text: '#ffe81f',
    panel: 'linear-gradient(180deg, rgba(10,12,22,.85), rgba(0,0,0,.92))',
  },
  hp: {
    title: 'LEGO HARRY POTTER',
    bg: 'radial-gradient(ellipse at 50% 40%, #6e4a22 0%, #3b2410 55%, #160c04 100%)',
    overlay: 'repeating-linear-gradient(0deg, rgba(255,230,180,.03) 0 3px, transparent 3px 9px)',
    ring: '#e3b955',
    ringDark: '#6d5220',
    hilite: '#fff2c4',
    font: "'Cinzel', serif",
    text: '#f6e2a6',
    panel: 'linear-gradient(180deg, rgba(60,36,14,.88), rgba(25,14,4,.94))',
  },
  indy: {
    title: 'LEGO INDIANA JONES',
    bg: 'radial-gradient(ellipse at 50% 40%, #d9ad6a 0%, #a8763b 50%, #4a2c10 100%)',
    overlay: 'repeating-radial-gradient(circle at 30% 60%, rgba(80,40,0,.06) 0 2px, transparent 2px 22px)',
    ring: '#4a2c12',
    ringDark: '#2a170a',
    hilite: '#ffe9b0',
    font: "'Bebas Neue', sans-serif",
    text: '#3a210c',
    panel: 'linear-gradient(180deg, rgba(240,210,150,.88), rgba(190,145,80,.92))',
  },
};

function Minifig() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
      <svg viewBox="0 0 100 100" width="62%" height="62%" style={{ opacity: 0.5 }}>
        <rect x="38" y="6" width="24" height="12" rx="3" fill="#000" />
        <rect x="24" y="16" width="52" height="56" rx="16" fill="#000" />
        <rect x="30" y="74" width="40" height="12" rx="3" fill="#000" />
      </svg>
      <span className="no-export slot-hint">+</span>
    </div>
  );
}

function LegoLogo() {
  return (
    <div style={{ width: 96, height: 96, background: '#e3000b', borderRadius: 6, display: 'grid', placeItems: 'center', boxShadow: 'inset 0 0 0 4px #fff, 0 4px 10px rgba(0,0,0,.5)' }}>
      <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 30, color: '#fff', WebkitTextStroke: '2px #000', paintOrder: 'stroke', textShadow: '0 0 0 #ffd500, 2px 2px 0 #ffd500' }}>LEGO</span>
    </div>
  );
}

function LegoRoster() {
  const [fr] = useOpt('franchise', 'marvel');
  const [cols] = useOpt('cols', 7);
  const [rows] = useOpt('rows', 5);
  const [title] = useOpt('title', 'CHARACTER SELECT');
  const t = LEGO[fr] ?? LEGO.marvel;
  const gx = 700, gy = 175, gw = 1150, gh = 760;
  const d = Math.min(gw / cols, gh / rows) * 0.86;
  const cw = gw / cols, ch = gh / rows;
  return (
    <div style={{ position: 'absolute', inset: 0, background: t.bg }}>
      <Art>
        {t.overlay && <div style={{ position: 'absolute', inset: 0, background: t.overlay }} />}
      </Art>
      {/* header */}
      <div style={{ position: 'absolute', left: 50, top: 36, display: 'flex', alignItems: 'center', gap: 20 }}>
        <LegoLogo />
        <div style={{ fontFamily: t.font, color: t.text, fontSize: 64, letterSpacing: '0.04em', textShadow: '0 4px 0 rgba(0,0,0,.45)' }}>{title}</div>
      </div>
      <div style={{ position: 'absolute', right: 60, top: 70, fontFamily: t.font, color: t.text, opacity: 0.85, fontSize: 30, letterSpacing: '0.12em' }}>{t.title}</div>
      {/* left selected panel */}
      <div style={{ position: 'absolute', left: 50, top: 175, width: 600, height: 760, borderRadius: 28, background: t.panel, border: `6px solid ${t.ring}`, boxShadow: '0 12px 30px rgba(0,0,0,.5)', overflow: 'hidden' }}>
        <PhotoSlot id="big" label="Selected character (big)" fit="contain" style={{ left: 20, top: 20, width: 548, height: 560, borderRadius: 18 }} placeholder={<Minifig />} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 150, background: 'rgba(0,0,0,.35)' }} />
        <TextSlot id="bigname" label="Selected character name" def="IRON MAN" fit style={{ left: 30, top: 615, width: 528, textAlign: 'center', fontSize: 72, color: t.text, fontFamily: t.font, letterSpacing: '0.03em', textShadow: '0 4px 0 rgba(0,0,0,.5)' }} />
      </div>
      {/* circles */}
      {range(rows * cols).map((i) => {
        const c = i % cols, r = Math.floor(i / cols);
        const sel = i === 0;
        return (
          <div key={i} style={{ position: 'absolute', left: gx + c * cw + (cw - d) / 2, top: gy + r * ch + (ch - d) / 2, width: d, height: d }}>
            <div
              style={{
                position: 'absolute',
                inset: -7,
                borderRadius: '50%',
                background: `radial-gradient(circle at 35% 30%, ${t.ring}, ${t.ringDark})`,
                boxShadow: sel ? `0 0 0 6px ${t.hilite}, 0 0 28px 8px ${t.hilite}` : '0 6px 10px rgba(0,0,0,.55)',
              }}
            />
            <PhotoSlot id={'c' + i} label={`Circle ${i + 1}`} style={{ inset: 0, borderRadius: '50%', background: 'radial-gradient(circle at 50% 35%, rgba(255,255,255,.22), rgba(0,0,0,.35))', boxShadow: 'inset 0 4px 10px rgba(0,0,0,.6)' }} placeholder={<Minifig />} />
          </div>
        );
      })}
      {/* bottom prompts */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 34, display: 'flex', justifyContent: 'center', gap: 60, fontFamily: t.font, color: t.text, fontSize: 32, letterSpacing: '0.06em' }}>
        {[
          ['A', '#3fbf3f', 'SELECT'],
          ['B', '#e23b3b', 'BACK'],
          ['Y', '#f0c419', 'CUSTOMIZE'],
        ].map(([k, c, l]) => (
          <span key={k} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 44, height: 44, borderRadius: '50%', background: c, color: '#fff', display: 'grid', placeItems: 'center', fontFamily: "'Archivo Black'", fontSize: 24 }}>{k}</span>
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

export const lego: TemplateDef = {
  id: 'lego-roster',
  tab: 'games',
  title: 'LEGO Roster',
  blurb: 'LEGO game character select (Marvel, Batman, Star Wars, Harry Potter, Indiana Jones). Put anyone in the circles.',
  size: () => [1920, 1080],
  Render: LegoRoster,
  allowBg: true,
  thumb: { bg: 'linear-gradient(135deg,#e3000b,#ffcf00)', emoji: '🧱' },
  Controls: () => (
    <>
      <OptSelect
        k="franchise"
        label="Game"
        def="marvel"
        options={[
          ['marvel', 'LEGO Marvel'],
          ['batman', 'LEGO Batman'],
          ['starwars', 'LEGO Star Wars'],
          ['hp', 'LEGO Harry Potter'],
          ['indy', 'LEGO Indiana Jones'],
        ]}
      />
      <OptNum k="cols" label="Columns" def={7} min={3} max={10} />
      <OptNum k="rows" label="Rows" def={5} min={2} max={7} />
      <OptText k="title" label="Header" def="CHARACTER SELECT" />
    </>
  ),
};

/* ================================================================ SMASH */

type SmashStyle = {
  bg: string;
  overlay?: string;
  tileBg: string;
  tileBorder: string;
  radius: number;
  gap: number;
  nameBar: CSSProperties;
  nameFont: string;
  header: string;
  headerStyle: CSSProperties;
  panelColors: string[];
  panelRadius: number;
  panelStyle: (c: string) => CSSProperties;
  gridTop: number;
  gridBottom: number;
  defCols: number;
  defRows: number;
  light?: boolean;
};

const SMASH: Record<string, SmashStyle> = {
  ultimate: {
    bg: 'radial-gradient(ellipse at 50% 0%, #3a0c10 0%, #150608 55%, #050505 100%)',
    overlay: 'repeating-linear-gradient(115deg, rgba(255,255,255,.025) 0 30px, transparent 30px 60px)',
    tileBg: 'linear-gradient(160deg, #3a3a40, #17171a)',
    tileBorder: '#000',
    radius: 0,
    gap: 4,
    nameBar: { background: 'linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,.92) 45%)', color: '#fff', fontStyle: 'italic', fontWeight: 800 },
    nameFont: "'Barlow Condensed', sans-serif",
    header: '',
    headerStyle: {},
    panelColors: ['#e5303a', '#2d6ff0', '#f5c21b', '#2cb550'],
    panelRadius: 0,
    panelStyle: (c) => ({ background: `linear-gradient(160deg, ${c} 0%, ${c} 55%, rgba(0,0,0,.85) 100%)`, clipPath: 'polygon(6% 0, 100% 0, 94% 100%, 0 100%)' }),
    gridTop: 22,
    gridBottom: 700,
    defCols: 13,
    defRows: 6,
  },
  smash4: {
    bg: 'radial-gradient(ellipse at 50% 30%, #ffffff 0%, #dfe3ea 50%, #a9b0bd 100%)',
    overlay: 'repeating-linear-gradient(90deg, rgba(0,0,0,.03) 0 2px, transparent 2px 80px)',
    tileBg: 'linear-gradient(180deg, #f6f7fa, #c6ccd6)',
    tileBorder: '#ffffff',
    radius: 6,
    gap: 6,
    nameBar: { background: 'rgba(30,30,36,.88)', color: '#fff', fontWeight: 700 },
    nameFont: "'Roboto Condensed', sans-serif",
    header: '',
    headerStyle: {},
    panelColors: ['#e3262f', '#1f6ae8', '#f0b81a', '#24a84a'],
    panelRadius: 14,
    panelStyle: (c) => ({ background: `linear-gradient(180deg, #ffffff 0%, #e6e8ee 60%, ${c} 60%, ${c} 100%)`, border: `6px solid ${c}` }),
    gridTop: 20,
    gridBottom: 690,
    defCols: 12,
    defRows: 5,
    light: true,
  },
  brawl: {
    bg: 'linear-gradient(180deg, #2c2f36 0%, #15171b 100%)',
    overlay: 'radial-gradient(ellipse at 50% 120%, rgba(255,255,255,.18), transparent 60%)',
    tileBg: 'linear-gradient(180deg, #fafafa, #c8ccd2)',
    tileBorder: '#e9ecf0',
    radius: 10,
    gap: 10,
    nameBar: { background: 'linear-gradient(180deg, #4a4f58, #24272c)', color: '#fff', fontWeight: 700 },
    nameFont: "'Roboto Condensed', sans-serif",
    header: '',
    headerStyle: {},
    panelColors: ['#d8252f', '#2457d6', '#e9b41a', '#28a046'],
    panelRadius: 20,
    panelStyle: (c) => ({ background: `radial-gradient(ellipse at 50% 20%, #fff, #c9ced6)`, border: `8px solid ${c}`, boxShadow: `inset 0 0 0 3px #fff` }),
    gridTop: 40,
    gridBottom: 670,
    defCols: 10,
    defRows: 4,
  },
  melee: {
    bg: 'radial-gradient(ellipse at 50% 30%, #23305c 0%, #0f1530 55%, #05060f 100%)',
    overlay: 'repeating-linear-gradient(0deg, rgba(255,255,255,.035) 0 2px, transparent 2px 6px)',
    tileBg: 'linear-gradient(180deg, #2a3150, #10142a)',
    tileBorder: '#9fa7c7',
    radius: 4,
    gap: 8,
    nameBar: { display: 'none' },
    nameFont: "'Exo 2', sans-serif",
    header: 'CHOOSE YOUR CHARACTER',
    headerStyle: { fontFamily: "'Exo 2', sans-serif", fontStyle: 'italic', fontWeight: 800, color: '#fff', textShadow: '0 0 12px #6a8cff' },
    panelColors: ['#d93a2b', '#2f5fe0', '#e4b21c', '#2fa64a'],
    panelRadius: 6,
    panelStyle: (c) => ({ background: `linear-gradient(180deg, ${c}, #1a1a1a)`, border: '6px solid #b4b9c9', boxShadow: 'inset 0 0 0 3px #2a2a2a' }),
    gridTop: 100,
    gridBottom: 640,
    defCols: 9,
    defRows: 3,
  },
  n64: {
    bg: 'linear-gradient(180deg, #3155c9 0%, #1b2f80 100%)',
    overlay: 'repeating-linear-gradient(45deg, rgba(255,255,255,.04) 0 14px, transparent 14px 28px)',
    tileBg: 'linear-gradient(180deg, #2a2a2a, #000)',
    tileBorder: '#ffcf2a',
    radius: 0,
    gap: 18,
    nameBar: { display: 'none' },
    nameFont: "'Russo One', sans-serif",
    header: 'CHARACTER SELECT',
    headerStyle: { fontFamily: "'Russo One', sans-serif", color: '#ffcf2a', WebkitTextStroke: '3px #8a3a00', paintOrder: 'stroke' },
    panelColors: ['#e0262a', '#2a52e0', '#e6c116', '#29a54a'],
    panelRadius: 0,
    panelStyle: (c) => ({ background: '#d9d9d9', border: `10px solid ${c}`, boxShadow: 'inset 0 0 0 4px #333' }),
    gridTop: 120,
    gridBottom: 600,
    defCols: 6,
    defRows: 2,
  },
};

function SmashRoster() {
  const [game] = useOpt('game', 'ultimate');
  const s = SMASH[game] ?? SMASH.ultimate;
  const [cols] = useOpt('cols_' + game, s.defCols);
  const [rows] = useOpt('rows_' + game, s.defRows);
  const [players] = useOpt('players', 2);
  const [names] = useOpt('names', true);
  const pad = 40;
  const gw = 1920 - pad * 2;
  const gh = s.gridBottom - s.gridTop;
  const tw = (gw - s.gap * (cols - 1)) / cols;
  const th = (gh - s.gap * (rows - 1)) / rows;
  const showName = names && s.nameBar.display !== 'none';
  const nameUnder = names && s.nameBar.display === 'none';
  const pw = 1920 / 4 - 30;
  const panelW = Math.min(440, (1920 - 80 - (players - 1) * 30) / players);
  return (
    <div style={{ position: 'absolute', inset: 0, background: s.bg }}>
      <Art>{s.overlay && <div style={{ position: 'absolute', inset: 0, background: s.overlay }} />}</Art>
      {s.header && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 26, textAlign: 'center', fontSize: 56, letterSpacing: '0.06em', ...s.headerStyle }}>{s.header}</div>
      )}
      {range(rows * cols).map((i) => {
        const c = i % cols, r = Math.floor(i / cols);
        const nh = Math.max(20, Math.min(34, th * 0.2));
        return (
          <div key={i} style={{ position: 'absolute', left: pad + c * (tw + s.gap), top: s.gridTop + r * (th + s.gap), width: tw, height: nameUnder ? th - 26 : th }}>
            <PhotoSlot
              id={'t' + i}
              label={`Fighter ${i + 1}`}
              dark={!s.light}
              style={{ inset: 0, background: s.tileBg, borderRadius: s.radius, boxShadow: `0 0 0 3px ${s.tileBorder}${game === 'ultimate' ? '' : ', 0 4px 8px rgba(0,0,0,.4)'}` }}
            >
              {showName && (
                <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: nh * 1.35, ...s.nameBar, pointerEvents: 'none' }} />
              )}
            </PhotoSlot>
            {showName && (
              <TextSlot
                id={'n' + i}
                label={`Fighter ${i + 1} name`}
                def="NAME"
                fit
                style={{ left: 4, width: tw - 8, top: (nameUnder ? th - 26 : th) - nh * 1.15, fontSize: nh, textAlign: game === 'ultimate' ? 'left' : 'center', fontFamily: s.nameFont, color: '#fff', fontStyle: s.nameBar.fontStyle, fontWeight: s.nameBar.fontWeight as any, textTransform: 'uppercase', paddingLeft: game === 'ultimate' ? 4 : 0, boxSizing: 'border-box' }}
              />
            )}
            {nameUnder && (
              <TextSlot id={'n' + i} label={`Fighter ${i + 1} name`} def="NAME" fit style={{ left: 0, width: tw, top: th - 22, fontSize: 20, textAlign: 'center', fontFamily: s.nameFont, color: game === 'n64' ? '#ffcf2a' : '#fff', textTransform: 'uppercase' }} />
            )}
          </div>
        );
      })}
      {/* player panels */}
      {range(players).map((p) => {
        const left = (1920 - (players * panelW + (players - 1) * 30)) / 2 + p * (panelW + 30);
        const top = s.gridBottom + 30;
        const h = 1080 - top - 24;
        const c = s.panelColors[p];
        return (
          <div key={p} style={{ position: 'absolute', left, top, width: panelW, height: h }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: s.panelRadius, overflow: 'hidden', ...s.panelStyle(c) }} />
            <PhotoSlot id={'p' + p} label={`Player ${p + 1} fighter (big)`} fit="contain" placeholder={false} style={{ left: 10, top: -40, width: panelW - 20, height: h + 30 }} />
            <div style={{ position: 'absolute', left: game === 'ultimate' ? 24 : 16, top: 10, fontFamily: s.nameFont, fontStyle: 'italic', fontWeight: 800, fontSize: 40, color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,.6)' }}>P{p + 1}</div>
            <TextSlot
              id={'pn' + p}
              label={`Player ${p + 1} name`}
              def="FIGHTER"
              fit
              style={{ left: 20, width: panelW - 40, top: h - 74, fontSize: 56, color: s.light || game === 'n64' || game === 'brawl' ? '#1a1a1a' : '#fff', fontFamily: s.nameFont, fontStyle: 'italic', fontWeight: 800, textTransform: 'uppercase', textAlign: game === 'ultimate' ? 'right' : 'center', textShadow: s.light || game === 'n64' || game === 'brawl' ? 'none' : '0 3px 6px rgba(0,0,0,.7)' }}
            />
          </div>
        );
      })}
      <div style={{ display: 'none' }}>{pw}</div>
    </div>
  );
}

function SmashControls() {
  const [game] = useOpt('game', 'ultimate');
  const s = SMASH[game] ?? SMASH.ultimate;
  return (
    <>
      <OptSelect
        k="game"
        label="Game"
        def="ultimate"
        options={[
          ['ultimate', 'Super Smash Bros. Ultimate'],
          ['smash4', 'Smash Bros. for Wii U / 3DS'],
          ['brawl', 'Super Smash Bros. Brawl'],
          ['melee', 'Super Smash Bros. Melee'],
          ['n64', 'Super Smash Bros. (N64)'],
        ]}
      />
      <OptNum k={'cols_' + game} label="Columns" def={s.defCols} min={3} max={16} />
      <OptNum k={'rows_' + game} label="Rows" def={s.defRows} min={1} max={8} />
      <OptNum k="players" label="Player panels" def={2} min={0} max={4} />
      <OptToggle k="names" label="Show names on tiles" def={true} />
    </>
  );
}

export const smash: TemplateDef = {
  id: 'smash-roster',
  tab: 'games',
  title: 'Super Smash Bros. Roster',
  blurb: 'Character select screen from Ultimate, Wii U, Brawl, Melee or 64. Add photos and names.',
  size: () => [1920, 1080],
  Render: SmashRoster,
  Controls: SmashControls,
  allowBg: true,
  thumb: { bg: 'linear-gradient(135deg,#e5303a,#2d6ff0)', emoji: '🥊' },
};

/* ================================================================ WWE 2K15 */

function Wwe2k15() {
  const [cols] = useOpt('cols', 7);
  const [rows] = useOpt('rows', 5);
  const [selIdx] = useOpt('sel', 1);
  const gx = 760, gy = 170, gw = 1110, gh = 760, gap = 8;
  const tw = (gw - gap * (cols - 1)) / cols;
  const th = (gh - gap * (rows - 1)) / rows;
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0a0a0b' }}>
      <Art>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 22% 55%, #3a3a3e 0%, #161618 45%, #050505 85%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(135deg, rgba(255,255,255,.018) 0 3px, transparent 3px 9px)' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 120, background: 'linear-gradient(180deg, rgba(0,0,0,.9), rgba(0,0,0,.4))', borderBottom: '2px solid #333' }} />
      </Art>
      <div style={{ position: 'absolute', left: 60, top: 34, fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 52, color: '#fff', letterSpacing: '0.02em' }}>
        SELECT <span style={{ color: '#c8102e' }}>SUPERSTAR</span>
      </div>
      <div style={{ position: 'absolute', right: 60, top: 46, fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 34, color: '#fff' }}>
        <span style={{ background: '#fff', color: '#000', padding: '0 10px', marginRight: 8 }}>WWE</span>
        <span>2K15</span>
      </div>
      {/* featured render */}
      <PhotoSlot id="feature" label="Featured wrestler (big)" fit="contain" placeholder={false} style={{ left: 20, top: 120, width: 720, height: 880 }} />
      <div style={{ position: 'absolute', left: 40, top: 870, width: 690, height: 4, background: '#c8102e' }} />
      <TextSlot id="featname" label="Featured wrestler name" def="JOHN CENA" fit style={{ left: 40, top: 890, width: 690, fontSize: 70, color: '#fff', fontFamily: "'Oswald', sans-serif", fontWeight: 700, textTransform: 'uppercase', textShadow: '0 4px 10px #000' }} />
      <div style={{ position: 'absolute', left: 40, top: 975, display: 'flex', gap: 14, alignItems: 'center', fontFamily: "'Oswald', sans-serif", fontWeight: 500, fontSize: 30, color: '#bbb' }}>
        <span style={{ background: '#c8102e', color: '#fff', padding: '2px 12px', fontWeight: 700 }}>OVR</span>
        <TextSlot id="ovr" label="Overall rating" def="92" style={{ position: 'relative', fontSize: 40, color: '#fff', fontFamily: "'Oswald', sans-serif", fontWeight: 700 }} />
      </div>
      {/* grid */}
      {range(rows * cols).map((i) => {
        const c = i % cols, r = Math.floor(i / cols);
        const sel = i === selIdx - 1;
        return (
          <div key={i} style={{ position: 'absolute', left: gx + c * (tw + gap), top: gy + r * (th + gap), width: tw, height: th }}>
            <PhotoSlot
              id={'w' + i}
              label={`Wrestler ${i + 1}`}
              style={{ inset: 0, background: 'linear-gradient(180deg, #4a4a50, #1b1b1e)', boxShadow: sel ? '0 0 0 5px #fff, 0 0 20px 4px #c8102e' : 'inset 0 0 0 2px #555' }}
            >
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 30, background: sel ? '#c8102e' : 'rgba(0,0,0,.8)', pointerEvents: 'none' }} />
            </PhotoSlot>
            <TextSlot id={'wn' + i} label={`Wrestler ${i + 1} name`} def="SUPERSTAR" fit style={{ left: 6, width: tw - 12, top: th - 25, fontSize: 20, textAlign: 'center', color: '#fff', fontFamily: "'Oswald', sans-serif", fontWeight: 500, textTransform: 'uppercase' }} />
          </div>
        );
      })}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 64, background: 'rgba(0,0,0,.8)', borderTop: '2px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 40, paddingRight: 60, fontFamily: "'Oswald', sans-serif", fontSize: 24, color: '#ddd' }}>
        {[
          ['✕', '#5a8cff', 'Select'],
          ['○', '#ff4a4a', 'Back'],
          ['△', '#3fd28a', 'Change Attire'],
          ['□', '#e676ff', 'Superstar Details'],
        ].map(([g, c, l]) => (
          <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 32, height: 32, borderRadius: '50%', background: '#222', border: '2px solid #555', color: c, display: 'grid', placeItems: 'center', fontSize: 18 }}>{g}</span>
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

export const wwe2k15: TemplateDef = {
  id: 'wwe2k15-roster',
  tab: 'games',
  title: 'WWE 2K15 Roster',
  blurb: 'The WWE 2K15 superstar select screen. Add any wrestlers you want.',
  size: () => [1920, 1080],
  Render: Wwe2k15,
  allowBg: true,
  thumb: { bg: 'linear-gradient(135deg,#c8102e,#111)', emoji: '🤼' },
  Controls: () => (
    <>
      <OptNum k="cols" label="Columns" def={7} min={3} max={10} />
      <OptNum k="rows" label="Rows" def={5} min={2} max={8} />
      <OptNum k="sel" label="Highlighted tile #" def={1} min={0} max={80} />
    </>
  ),
};

/* ================================================================ FORTNITE */

const RARITY: Record<string, { label: string; bg: string; edge: string; bar: string }> = {
  legendary: { label: 'LEGENDARY', bg: 'radial-gradient(circle at 50% 40%, #f6a14b 0%, #d9622b 45%, #7a2b0b 100%)', edge: '#ffba6b', bar: '#e7802c' },
  epic: { label: 'EPIC', bg: 'radial-gradient(circle at 50% 40%, #d16bff 0%, #8e2fd6 45%, #3a0b6b 100%)', edge: '#e28cff', bar: '#a43fe0' },
  rare: { label: 'RARE', bg: 'radial-gradient(circle at 50% 40%, #4fd0ff 0%, #2a7fe0 45%, #0b2a6b 100%)', edge: '#6fd8ff', bar: '#2f8be6' },
  uncommon: { label: 'UNCOMMON', bg: 'radial-gradient(circle at 50% 40%, #8be34a 0%, #3f9a1c 45%, #15420a 100%)', edge: '#a6ff63', bar: '#56b522' },
  common: { label: 'COMMON', bg: 'radial-gradient(circle at 50% 40%, #c6cbd3 0%, #7e8590 45%, #383c44 100%)', edge: '#d9dde4', bar: '#8a919c' },
  icon: { label: 'ICON SERIES', bg: 'radial-gradient(circle at 50% 40%, #5ff0f0 0%, #1aa3b5 45%, #063b4a 100%)', edge: '#8ffcff', bar: '#21b8c7' },
  marvel: { label: 'MARVEL SERIES', bg: 'radial-gradient(circle at 50% 40%, #ff4a4a 0%, #b5121b 45%, #3a0306 100%)', edge: '#ff7070', bar: '#d2232c' },
  gaming: { label: 'GAMING LEGENDS SERIES', bg: 'radial-gradient(circle at 50% 40%, #7a6cff 0%, #3a2fb0 45%, #110a40 100%)', edge: '#a69cff', bar: '#4b3fd0' },
  dc: { label: 'DC SERIES', bg: 'radial-gradient(circle at 50% 40%, #4a78ff 0%, #1c3a9e 45%, #070f3a 100%)', edge: '#7a9cff', bar: '#2448c0' },
  starwars: { label: 'STAR WARS SERIES', bg: 'radial-gradient(circle at 50% 40%, #3b3b45 0%, #17171c 55%, #000 100%)', edge: '#ffe81f', bar: '#1f1f26' },
  shadow: { label: 'SHADOW SERIES', bg: 'radial-gradient(circle at 50% 40%, #6a6a6a 0%, #2a2a2a 50%, #000 100%)', edge: '#9a9a9a', bar: '#333' },
  lava: { label: 'LAVA SERIES', bg: 'radial-gradient(circle at 50% 40%, #ff9a3c 0%, #c1272d 45%, #3a0a0a 100%)', edge: '#ffb070', bar: '#d0402a' },
};

const FN_FONT = "'Luckiest Guy', 'Anton', sans-serif";
const FN_COND = "'Anton', sans-serif";

function VBuck({ size = 44 }: { size?: number }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size}>
      <circle cx="20" cy="20" r="18" fill="#3fb9ff" stroke="#e6f6ff" strokeWidth="3" />
      <path d="M11 11 L17 11 L20 23 L23 11 L29 11 L22 30 L18 30 Z" fill="#fff" />
    </svg>
  );
}

function Fortnite() {
  const [mode] = useOpt('mode', 'locker');
  const [rar] = useOpt('rarity', 'legendary');
  const [price] = useOpt('price', '2,000');
  const [showPrice] = useOpt('showPrice', true);
  const r = RARITY[rar] ?? RARITY.legendary;
  const name = useTextValue('name', 'NEW SKIN');
  if (mode === 'tile') {
    return (
      <div style={{ position: 'absolute', inset: 0, background: '#0d1a3a' }}>
        <div style={{ position: 'absolute', inset: 0, background: r.bg }} />
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-radial-gradient(circle at 50% 45%, rgba(255,255,255,.05) 0 3px, transparent 3px 26px)' }} />
        <PhotoSlot id="render" label="Skin picture" fit="contain" placeholder={false} style={{ inset: 0 }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 250, background: 'linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,.65) 35%, rgba(0,0,0,.85))', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 10, background: r.edge }} />
        <TextSlot id="name" label="Skin name" def="NEW SKIN" fit style={{ left: 36, width: 952, top: 820, fontSize: 92, color: '#fff', fontFamily: FN_COND, textTransform: 'uppercase', letterSpacing: '0.01em' }} />
        {showPrice && (
          <div style={{ position: 'absolute', left: 36, top: 930, display: 'flex', alignItems: 'center', gap: 12, fontFamily: FN_COND, fontSize: 48, color: '#fff' }}>
            <VBuck size={48} />
            {price}
          </div>
        )}
        <TextSlot id="tag" label="Corner tag" def="NEW!" style={{ right: 30, top: 30, fontSize: 40, color: '#1a1a1a', background: '#ffe14a', padding: '8px 16px', fontFamily: FN_COND, transform: 'skewX(-8deg)' }} />
      </div>
    );
  }
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0b1636' }}>
      <div style={{ position: 'absolute', inset: 0, background: r.bg }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0) 40%, rgba(0,0,30,.55) 62%, rgba(0,0,30,.8))' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'repeating-radial-gradient(circle at 30% 50%, rgba(255,255,255,.04) 0 4px, transparent 4px 34px)' }} />
      <PhotoSlot id="render" label="Skin picture" fit="contain" placeholder={false} style={{ left: 60, top: 40, width: 980, height: 1040 }} />
      {/* top bar */}
      <div style={{ position: 'absolute', left: 60, top: 40, fontFamily: FN_COND, color: '#fff', fontSize: 34, opacity: 0.9, letterSpacing: '0.02em' }}>ITEM SHOP</div>
      <div style={{ position: 'absolute', left: 1090, top: 210, display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ background: r.bar, color: '#fff', fontFamily: FN_COND, fontSize: 30, padding: '4px 14px', transform: 'skewX(-10deg)', boxShadow: `0 0 0 3px ${r.edge}` }}>{r.label}</span>
        <TextSlot id="type" label="Item type" def="OUTFIT" style={{ position: 'relative', fontSize: 32, color: '#d7e3ff', fontFamily: FN_COND, letterSpacing: '0.04em' }} />
      </div>
      <TextSlot id="name" label="Skin name" def="NEW SKIN" fit style={{ left: 1086, top: 270, width: 780, fontSize: 150, color: '#fff', fontFamily: FN_FONT, textTransform: 'uppercase', textShadow: '0 6px 0 rgba(0,0,0,.35)', lineHeight: 1.05 }} />
      <TextSlot id="desc" label="Description" def="Ready for anything." multiline style={{ left: 1090, top: 450, width: 760, fontSize: 36, color: '#e9efff', fontFamily: "'Roboto Condensed', sans-serif", fontStyle: 'italic', lineHeight: 1.25 }} />
      <div style={{ position: 'absolute', left: 1090, top: 560, width: 760, height: 2, background: 'rgba(255,255,255,.25)' }} />
      <TextSlot id="set" label="Set" def={`Part of the ${name.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())} Set.`} style={{ left: 1090, top: 590, width: 760, fontSize: 30, color: '#fff', fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700 }} />
      <TextSlot id="intro" label="Introduced in" def="Introduced in Chapter 6, Season 4." style={{ left: 1090, top: 640, width: 760, fontSize: 30, color: '#c9d4f2', fontFamily: "'Roboto Condensed', sans-serif" }} />
      <TextSlot id="extra" label="Extra line (styles, reactive…)" def="Includes 3 Selectable Styles." style={{ left: 1090, top: 690, width: 760, fontSize: 30, color: '#c9d4f2', fontFamily: "'Roboto Condensed', sans-serif" }} />
      {/* style swatches */}
      <div style={{ position: 'absolute', left: 1090, top: 760, display: 'flex', gap: 16 }}>
        {range(3).map((i) => (
          <PhotoSlot key={i} id={'style' + i} label={`Style ${i + 1}`} placeholder={false} style={{ position: 'relative', width: 120, height: 120, background: r.bg, border: i === 0 ? '5px solid #ffe14a' : '5px solid rgba(255,255,255,.4)', borderRadius: 6 }} />
        ))}
      </div>
      {showPrice && (
        <div style={{ position: 'absolute', left: 1090, top: 930, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ background: '#ffe14a', color: '#14234d', fontFamily: FN_COND, fontSize: 48, padding: '14px 36px', transform: 'skewX(-8deg)', display: 'flex', alignItems: 'center', gap: 14 }}>
            <VBuck size={52} /> {price}
          </div>
          <div style={{ fontFamily: FN_COND, fontSize: 34, color: '#fff' }}>PURCHASE</div>
        </div>
      )}
    </div>
  );
}

export const fortnite: TemplateDef = {
  id: 'fortnite-skin',
  tab: 'games',
  title: 'Fortnite Skin',
  blurb: 'Make a new Fortnite outfit — picture, name, rarity, description, set and V-Bucks price.',
  size: (o) => (o.mode === 'tile' ? [1024, 1024] : [1920, 1080]),
  Render: Fortnite,
  thumb: { bg: 'radial-gradient(circle,#d16bff,#3a0b6b)', emoji: '🪂' },
  Controls: () => (
    <>
      <OptSelect k="mode" label="Layout" def="locker" options={[['locker', 'Item details screen (16:9)'], ['tile', 'Item shop tile (square)']]} />
      <OptSelect k="rarity" label="Rarity / series" def="legendary" options={Object.entries(RARITY).map(([k, v]) => [k, v.label] as [string, string])} />
      <OptText k="price" label="V-Bucks price" def="2,000" />
      <OptToggle k="showPrice" label="Show price" def={true} />
    </>
  ),
};

/* ================================================================ MUA3 */

function MuaCard({ children, style }: { children: ReactNode; style: CSSProperties }) {
  return <div style={{ position: 'absolute', clipPath: 'polygon(0 0, 88% 0, 100% 10%, 100% 100%, 12% 100%, 0 90%)', ...style }}>{children}</div>;
}

function Mua3() {
  const [cols] = useOpt('cols', 12);
  const [rows] = useOpt('rows', 3);
  const gx = 60, gy = 690, gw = 1800, gh = 330, gap = 10;
  const tw = (gw - gap * (cols - 1)) / cols;
  const th = (gh - gap * (rows - 1)) / rows;
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#040a18' }}>
      <Art>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 20%, #12407a 0%, #081d3d 45%, #02060f 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(90deg, rgba(90,170,255,.06) 0 1px, transparent 1px 64px), repeating-linear-gradient(0deg, rgba(90,170,255,.06) 0 1px, transparent 1px 64px)' }} />
      </Art>
      <div style={{ position: 'absolute', left: 60, top: 28, fontFamily: "'Teko', sans-serif", fontWeight: 600, fontSize: 64, color: '#fff', letterSpacing: '0.04em' }}>
        CHARACTER SELECT
      </div>
      <TextSlot id="team" label="Team name" def="TEAM BONUS: DEFENDERS" style={{ right: 60, top: 46, fontSize: 38, color: '#ffd23f', fontFamily: "'Teko', sans-serif", fontWeight: 600, letterSpacing: '0.05em' }} />
      {/* team of 4 */}
      {range(4).map((i) => (
        <div key={i} style={{ position: 'absolute', left: 60 + i * 455, top: 120, width: 435, height: 540 }}>
          <MuaCard style={{ inset: 0, background: 'linear-gradient(180deg, rgba(40,110,200,.5), rgba(5,20,50,.9))', border: '2px solid #4aa3ff' }}>
            <PhotoSlot id={'hero' + i} label={`Team hero ${i + 1}`} style={{ inset: 0 }} />
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 120, background: 'linear-gradient(180deg, rgba(0,0,0,0), rgba(0,10,30,.95))', pointerEvents: 'none' }} />
          </MuaCard>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 6, background: '#ffd23f' }} />
          <TextSlot id={'heron' + i} label={`Team hero ${i + 1} name`} def={['SPIDER-MAN', 'CAPTAIN AMERICA', 'IRON MAN', 'THOR'][i]} fit style={{ left: 24, width: 390, top: 462, fontSize: 52, color: '#fff', fontFamily: "'Teko', sans-serif", fontWeight: 600, textShadow: '0 3px 6px #000' }} />
          <div style={{ position: 'absolute', left: 24, top: 418, fontFamily: "'Teko', sans-serif", fontWeight: 500, fontSize: 30, color: '#9fd0ff' }}>
            LV <TextSlot id={'herolv' + i} label={`Team hero ${i + 1} level`} def="50" style={{ position: 'relative', display: 'inline-block', fontSize: 30, color: '#fff', fontFamily: "'Teko', sans-serif" }} />
          </div>
        </div>
      ))}
      {/* roster grid */}
      {range(rows * cols).map((i) => {
        const c = i % cols, r = Math.floor(i / cols);
        return (
          <MuaCard key={i} style={{ left: gx + c * (tw + gap), top: gy + r * (th + gap), width: tw, height: th, background: 'linear-gradient(180deg, #1b4f8f, #0a1d3c)', boxShadow: 'inset 0 0 0 2px #3c8de6' }}>
            <PhotoSlot id={'r' + i} label={`Roster ${i + 1}`} style={{ inset: 2 }} />
          </MuaCard>
        );
      })}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 14, textAlign: 'right', paddingRight: 60, fontFamily: "'Teko', sans-serif", fontSize: 28, color: '#b9d8ff', letterSpacing: '0.05em' }}>
        Ⓐ SELECT    Ⓑ BACK    Ⓧ HERO INFO    Ⓨ ALTERNATE COSTUME
      </div>
    </div>
  );
}

export const mua3: TemplateDef = {
  id: 'mua3-roster',
  tab: 'games',
  title: 'Marvel Ultimate Alliance 3 Roster',
  blurb: 'The MUA3 team-of-four character select screen with the full roster grid.',
  size: () => [1920, 1080],
  Render: Mua3,
  allowBg: true,
  thumb: { bg: 'linear-gradient(135deg,#12407a,#02060f)', emoji: '🦸' },
  Controls: () => (
    <>
      <OptNum k="cols" label="Roster columns" def={12} min={4} max={16} />
      <OptNum k="rows" label="Roster rows" def={3} min={1} max={4} />
    </>
  ),
};
