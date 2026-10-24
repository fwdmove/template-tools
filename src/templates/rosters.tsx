/*
 * Roster screens built on real screenshots (public/rosters/*.jpg). Each portrait gets a photo slot
 * placed exactly over it (geometry measured by scripts/roster-geo.py). Untouched spots keep showing
 * the original screenshot; replaced names reveal a "clean" copy (scripts/rosters.py) under the new text.
 */
import type { CSSProperties, ReactNode } from 'react';
import { PhotoSlot, TextSlot, useEditor, useOpt } from '../core/editor';
import { OptSelect, OptToggle, type TemplateDef } from '../core/ui';
import GEO from './rosters-geo.json';

type Shape =
  | { t: 'c'; cx: number; cy: number; r: number }
  | { t: 'r'; x: number; y: number; w: number; h: number }
  | { t: 'q'; x: number; y: number; w: number; h: number; sk: number };
type Geo = { w: number; h: number; cells: Shape[]; big?: Shape; p1?: Shape; p2?: Shape; sel?: Shape | null; selIndex?: number };
const G = GEO as unknown as Record<string, Geo>;

const TARGET_W = 1920;
const scaleFor = (key: string) => Math.max(1, TARGET_W / G[key].w);
const sizeFor = (key: string): [number, number] => {
  const k = scaleFor(key);
  return [Math.round(G[key].w * k), Math.round(G[key].h * k)];
};

function shapeStyle(s: Shape, k: number): CSSProperties {
  if (s.t === 'c') return { left: (s.cx - s.r) * k, top: (s.cy - s.r) * k, width: 2 * s.r * k, height: 2 * s.r * k, borderRadius: '50%' };
  if (s.t === 'r') return { left: s.x * k, top: s.y * k, width: s.w * k, height: s.h * k };
  const p = (s.sk / s.w) * 100;
  return { left: s.x * k, top: s.y * k, width: s.w * k, height: s.h * k, clipPath: `polygon(${p}% 0, 100% 0, ${100 - p}% 100%, 0 100%)`, borderRadius: 4 * k };
}

/** The screenshot itself, full size. */
export function Shot({ k: key, clean, empty, dir = 'rosters' }: { k: string; clean?: boolean; empty?: boolean; dir?: string }) {
  return <img src={`/${dir}/${key}${empty ? '-empty' : clean ? '-clean' : ''}.jpg`} alt="" draggable={false} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />;
}

/** A rectangle of another copy of the screenshot (clean or original), e.g. to hide old text or re-draw UI on top. */
export function Crop({ k: key, box, scale, clean = true, dir = 'rosters', size }: { k: string; box: [number, number, number, number]; scale: number; clean?: boolean; dir?: string; size?: [number, number] }) {
  const [x0, y0, x1, y1] = box;
  const [W, H] = size ?? sizeFor(key);
  return (
    <div
      style={{
        position: 'absolute',
        left: x0 * scale,
        top: y0 * scale,
        width: (x1 - x0) * scale,
        height: (y1 - y0) * scale,
        backgroundImage: `url(/${dir}/${key}${clean ? '-clean' : ''}.jpg)`,
        backgroundSize: `${W}px ${H}px`,
        backgroundPosition: `${-x0 * scale}px ${-y0 * scale}px`,
        pointerEvents: 'none',
      }}
    />
  );
}

/** True once the user has changed this slot in any way. */
export function useTouched() {
  const { state } = useEditor();
  return (id: string) => state.slots[id] !== undefined && Object.keys(state.slots[id]).length > 0;
}
export function useSrc() {
  const { state } = useEditor();
  return (id: string): string | undefined => state.slots[id]?.src;
}

/** Text that stays invisible (the original is in the screenshot) until it is edited. */
export function SwapText({ id, label, def, style, patch, fit = true, force }: { id: string; label: string; def: string; style: CSSProperties & { fontSize: number }; patch?: ReactNode; fit?: boolean; force?: boolean }) {
  const touched = useTouched()(id) || !!force;
  return (
    <>
      {touched && patch}
      <TextSlot
        id={id}
        label={label}
        def={def}
        fit={fit}
        style={touched ? style : { ...style, color: 'transparent', WebkitTextStroke: '0', textShadow: 'none' }}
      />
    </>
  );
}

/** One photo slot per portrait. "Empty out" swaps in the pre-made empty screen (scripts/empty.py) underneath. */
function CellSlots({ k: key, prefix, scale, labelFor, skip }: { k: string; prefix: string; scale: number; labelFor: (i: number) => string; skip?: number }) {
  return (
    <>
      {G[key].cells.map((c, i) =>
        i === skip ? null : (
          <PhotoSlot
            key={i}
            id={`${prefix}c${i}`}
            label={labelFor(i)}
            style={shapeStyle(c, scale)}
            placeholder={false}
          />
        ),
      )}
    </>
  );
}

/* ================================================================ LEGO */

type LegoCfg = {
  label: string;
  name?: { def: string; cx: number; cy: number; size: number; style: CSSProperties; box: [number, number, number, number] };
  sel?: number;
  p2From?: number;
};

const LEGO: Record<string, LegoCfg> = {
  marvel: {
    label: 'LEGO Marvel Super Heroes',
    name: {
      def: 'Iron Man (Mark 42)',
      cx: 840,
      cy: 349,
      size: 34,
      box: [660, 326, 1020, 372],
      style: { color: '#ffd21c', fontFamily: "'Exo 2', sans-serif", fontWeight: 800, fontStyle: 'italic', letterSpacing: '0.14em', WebkitTextStroke: '5px #2b1a00', paintOrder: 'stroke' } as CSSProperties,
    },
  },
  batman: {
    label: 'LEGO Batman 3',
    name: {
      def: 'Batman',
      cx: 640,
      cy: 261,
      size: 23,
      box: [580, 246, 700, 276],
      style: { color: '#ffffff', fontFamily: "'Courier New', Courier, monospace", fontWeight: 700, letterSpacing: '0.14em', textShadow: '0 1px 2px #000' },
    },
  },
  starwars: { label: 'LEGO Star Wars: The Skywalker Saga', sel: 26, p2From: 18 },
  hp: {
    label: 'LEGO Harry Potter: Years 1-4',
    name: {
      def: 'Luna (Lion Head)',
      cx: 239,
      cy: 134.5,
      size: 14,
      box: [176, 124, 302, 145],
      style: { color: '#f2cf72', fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 700, letterSpacing: '0.04em', WebkitTextStroke: '2px #3a2408', paintOrder: 'stroke' } as CSSProperties,
    },
  },
  indy: {
    label: 'LEGO Indiana Jones',
    p2From: 1,
    name: {
      def: 'Indiana Jones',
      cx: 640,
      cy: 370,
      size: 31,
      box: [520, 348, 762, 392],
      style: { color: '#f5a51b', fontFamily: "'Trebuchet MS', 'Montserrat', sans-serif", fontWeight: 700, letterSpacing: '0.02em', textShadow: '0 2px 3px #000' },
    },
  },
};

function LegoRoster() {
  const [fr] = useOpt('franchise', 'marvel');
  const src = useSrc();
  const cfg = LEGO[fr] ?? LEGO.marvel;
  const g = G[fr];
  const k = scaleFor(fr);
  const [W] = sizeFor(fr);
  const p = fr + '_';
  const selId = g.sel ? p + 'sel' : p + 'c' + (cfg.sel ?? g.selIndex ?? 0);
  const selPhoto = src(selId);
  const p2Photo = cfg.p2From !== undefined ? src(p + 'c' + cfg.p2From) : undefined;
  const n = cfg.name;
  const [clear] = useOpt('clear', false);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Shot k={fr} empty={clear} />
      <CellSlots k={fr} prefix={p} scale={k} skip={g.sel ? g.selIndex : undefined} labelFor={(i) => `Circle ${i + 1}`} />
      {g.sel && <PhotoSlot id={p + 'sel'} label="Selected circle (in the grid)" style={shapeStyle(g.sel, k)} placeholder={false} />}
      {g.big && <PhotoSlot id={p + 'big'} label="Big circle (top)" style={shapeStyle(g.big, k)} placeholder={false} fallback={selPhoto} />}
      {g.p1 && <PhotoSlot id={p + 'p1'} label="Player 1 icon" style={shapeStyle(g.p1, k)} placeholder={false} fallback={selPhoto} />}
      {g.p2 && <PhotoSlot id={p + 'p2'} label="Player 2 icon" style={shapeStyle(g.p2, k)} placeholder={false} fallback={p2Photo} />}
      {n && (
        <SwapText
          id={p + 'name'}
          label="Selected character name"
          force={clear}
          def={clear ? '' : n.def}
          patch={<Crop k={fr} box={n.box} scale={k} />}
          style={{ ...n.style, left: 0, width: W, top: (n.cy - n.size * 0.55) * k, fontSize: n.size * k, textAlign: 'center' }}
          fit={false}
        />
      )}
    </div>
  );
}

export const lego: TemplateDef = {
  id: 'lego-roster',
  tab: 'games',
  title: 'LEGO Roster',
  blurb: 'The real character select screens from LEGO Marvel, Batman 3, Star Wars, Harry Potter and Indiana Jones. Put anyone in the circles.',
  size: (o) => sizeFor(o.franchise ?? 'marvel'),
  Render: LegoRoster,
  thumb: { bg: '#000', emoji: '🧱', img: '/rosters/marvel.jpg' },
  Controls: () => (
    <>
      <OptSelect k="franchise" label="Game" def="marvel" options={Object.entries(LEGO).map(([k, v]) => [k, v.label] as [string, string])} />
      <OptToggle k="clear" label="Empty out the original characters" def={false} />
      <p className="hint">Tap any circle to add a photo. Spots you don’t touch keep the original character. The big top circle and player icon copy whoever is in the highlighted circle unless you give them their own photo.</p>
    </>
  ),
};

/* ================================================================ SMASH ULTIMATE */

const SMASH_NAMES = [
  'MARIO', 'DONKEY KONG', 'LINK', 'SAMUS', 'DARK SAMUS', 'YOSHI', 'KIRBY', 'FOX', 'PIKACHU', 'LUIGI', 'NESS', 'CAPTAIN FALCON', 'JIGGLYPUFF',
  'PEACH', 'DAISY', 'BOWSER', 'ICE CLIMBERS', 'SHEIK', 'ZELDA', 'DR. MARIO', 'PICHU', 'FALCO', 'MARTH', 'LUCINA', 'YOUNG LINK', 'GANONDORF',
  'MEWTWO', 'ROY', 'CHROM', 'MR. GAME & WATCH', 'META KNIGHT', 'PIT', 'DARK PIT', 'ZERO SUIT SAMUS', 'WARIO', 'SNAKE', 'IKE', 'POKÉMON TRAINER', 'DIDDY KONG',
  'LUCAS', 'SONIC', 'KING DEDEDE', 'OLIMAR', 'LUCARIO', 'R.O.B.', 'TOON LINK', 'WOLF', 'VILLAGER', 'MEGA MAN', 'Wii Fit TRAINER', 'ROSALINA & LUMA', 'LITTLE MAC',
  'GRENINJA', 'PALUTENA', 'PAC-MAN', 'ROBIN', 'SHULK', 'BOWSER JR.', 'DUCK HUNT', 'RYU', 'KEN', 'CLOUD', 'CORRIN', 'BAYONETTA', 'INKLING',
  'RIDLEY', 'SIMON', 'RICHTER', 'KING K. ROOL', 'ISABELLE', 'INCINEROAR', 'PIRANHA PLANT', 'JOKER', 'HERO', 'BANJO & KAZOOIE', 'TERRY', 'BYLETH', 'MIN MIN',
  'STEVE', 'SEPHIROTH', 'PYRA/MYTHRA', 'KAZUYA', 'SORA', 'Mii BRAWLER', 'Mii SWORDFIGHTER', 'Mii GUNNER',
];

const SMASH_TEXT: CSSProperties = { color: '#fff', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, WebkitTextStroke: '3px #000', paintOrder: 'stroke', textTransform: 'uppercase' } as CSSProperties;

function SmashTileName({ i, shape, k }: { i: number; shape: Extract<Shape, { t: 'r' }>; k: number }) {
  const id = 'n' + i;
  const touched = useTouched();
  const has = !!useSrc()('c' + i);
  const show = has || touched(id);
  const style: CSSProperties & { fontSize: number } = {
    ...SMASH_TEXT,
    left: shape.x * k + 2,
    width: shape.w * k - 4,
    top: (shape.y + shape.h - 14) * k,
    fontSize: 12.5 * k,
    textAlign: 'center',
  };
  return (
    <>
      {show && !has && <div style={{ position: 'absolute', left: shape.x * k, top: (shape.y + shape.h - 17) * k, width: shape.w * k, height: 17 * k, background: 'linear-gradient(180deg, rgba(0,0,0,.55), rgba(0,0,0,.85))', pointerEvents: 'none' }} />}
      <TextSlot id={id} label={`Fighter ${i + 1} name`} def={SMASH_NAMES[i] ?? 'NAME'} fit style={show ? style : { ...style, color: 'transparent', WebkitTextStroke: '0' }} />
    </>
  );
}

function Smash() {
  const k = scaleFor('smash');
  const src = useSrc();
  const touched = useTouched();
  const g = G.smash;
  const p1 = !!src('p1') || touched('p1name');
  const p2 = !!src('p2') || touched('p2name');
  const big: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontWeight: 900, color: '#fff', WebkitTextStroke: `${4 * k}px #000`, paintOrder: 'stroke', textAlign: 'right' } as CSSProperties;
  const [clear] = useOpt('clear', false);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Shot k="smash" empty={clear} />
      <CellSlots k="smash" prefix="" scale={k} labelFor={(i) => `Fighter ${i + 1} (${SMASH_NAMES[i]})`} />
      {g.cells.map((c, i) => (
        <SmashTileName key={i} i={i} shape={c as Extract<Shape, { t: 'r' }>} k={k} />
      ))}
      {/* Player 1 panel */}
      {p1 && <Crop k="smash" box={[352, 468, 470, 566]} scale={k} />}
      <PhotoSlot id="p1" label="Player 1 fighter (big)" placeholder={false} fit="contain" style={{ left: 14 * k, top: 438 * k, width: 560 * k, height: 237 * k }} />
      {p1 && <Crop k="smash" box={[305, 578, 538, 675]} scale={k} clean={false} />}
      <TextSlot id="p1name" label="Player 1 fighter name" def="" fit style={{ ...big, left: 250 * k, width: 300 * k, top: 532 * k, fontSize: 30 * k }} />
      {/* Player 2 panel */}
      {p2 && <Crop k="smash" box={[650, 455, 805, 622]} scale={k} />}
      <PhotoSlot id="p2" label="Player 2 fighter (big)" placeholder={false} fit="contain" style={{ left: 588 * k, top: 438 * k, width: 552 * k, height: 237 * k }} />
      {p2 && <Crop k="smash" box={[876, 576, 1110, 675]} scale={k} clean={false} />}
      <SwapText id="p2name" label="Player 2 fighter name" def="Random" force={!!src('p2')} patch={<Crop k="smash" box={[975, 528, 1135, 572]} scale={k} />} style={{ ...big, left: 820 * k, width: 306 * k, top: 532 * k, fontSize: 30 * k }} />
    </div>
  );
}

export const smash: TemplateDef = {
  id: 'smash-roster',
  tab: 'games',
  title: 'Super Smash Bros. Ultimate Roster',
  blurb: 'The real Ultimate character select screen. Replace any fighter’s picture and name, plus the P1 / P2 panels.',
  size: () => sizeFor('smash'),
  Render: Smash,
  thumb: { bg: '#000', emoji: '🥊', img: '/rosters/smash.jpg' },
  Controls: () => (
    <>
      <OptToggle k="clear" label="Empty out the original fighters" def={false} />
      <p className="hint">Tap a fighter to replace the picture — the name label switches on automatically so you can type the new name.</p>
    </>
  ),
};

/* ================================================================ WWE 2K15 */

function Wwe2k15() {
  const k = scaleFor('wwe');
  const src0 = useSrc();
  const touched = useTouched();
  const [clear] = useOpt('clear', false);
  // "Empty out" clears the featured wrestler the same way adding your own photo does
  const src = (id: string) => src0(id) || (clear && id === 'p1' ? 'clear' : undefined);
  const plate: CSSProperties = { fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontStyle: 'italic', color: '#fff', textAlign: 'center' };
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Shot k="wwe" empty={clear} />
      <CellSlots k="wwe" prefix="" scale={k} labelFor={(i) => `Superstar ${i + 1}`} />
      {/* left (player 1) */}
      {src('p1') && (
        <>
          <Crop k="wwe" box={[232, 18, 538, 303]} scale={k} />
          <Crop k="wwe" box={[262, 352, 478, 385]} scale={k} />
          <Crop k="wwe" box={[390, 333, 586, 351]} scale={k} />
        </>
      )}
      <PhotoSlot id="p1" label="Player 1 wrestler (big)" placeholder={false} fit="contain" style={{ left: 232 * k, top: 18 * k, width: 306 * k, height: 285 * k }} />
      {/* the plate is re-drawn above the photo so the wrestler sits behind it, like in the game */}
      {src('p1') && <Crop k="wwe" box={[118, 303, 600, 352]} scale={k} />}
      <SwapText id="p1name" label="Player 1 name" def={clear ? '' : "STING '91"} force={!!src('p1')} patch={<Crop k="wwe" box={[336, 307, 492, 333]} scale={k} />} style={{ ...plate, left: 320 * k, width: 190 * k, top: 309 * k, fontSize: 21 * k }} />
      <SwapText id="ovr" label="Overall rating" def={clear ? '' : '92'} fit={false} force={!!src('p1')} patch={<Crop k="wwe" box={[336, 335, 372, 352]} scale={k} />} style={{ ...plate, fontStyle: 'normal', left: 344 * k, top: 335.5 * k, fontSize: 16 * k, textAlign: 'left' }} />
      {/* right (player 2 / COM) */}
      {src('p2') && (
        <>
          <Crop k="wwe" box={[746, 20, 1060, 303]} scale={k} />
          <Crop k="wwe" box={[700, 352, 1060, 385]} scale={k} />
        </>
      )}
      <PhotoSlot id="p2" label="Player 2 wrestler (big)" placeholder={false} fit="contain" style={{ left: 746 * k, top: 20 * k, width: 314 * k, height: 283 * k }} />
      {src('p2') && <Crop k="wwe" box={[676, 302, 1146, 353]} scale={k} clean={false} />}
      <SwapText
        id="p2name"
        label="Player 2 name"
        def="COM"
        force={!!src('p2')}
        patch={<Crop k="wwe" box={[898, 336, 982, 354]} scale={k} />}
        style={{ ...plate, fontStyle: 'normal', fontWeight: 700, left: 860 * k, width: 158 * k, top: 336 * k, fontSize: 18 * k }}
      />
    </div>
  );
}

export const wwe2k15: TemplateDef = {
  id: 'wwe2k15-roster',
  tab: 'games',
  title: 'WWE 2K15 Roster',
  blurb: 'The real WWE 2K15 superstar select screen. Swap any face in the grid and the big VS renders.',
  size: () => sizeFor('wwe'),
  Render: Wwe2k15,
  thumb: { bg: '#000', emoji: '🤼', img: '/rosters/wwe.jpg' },
  Controls: () => (
    <>
      <OptToggle k="clear" label="Empty out the original faces" def={false} />
      <p className="hint">For the big VS spots, a cut-out PNG (transparent background) looks just like the game.</p>
    </>
  ),
};

/* ================================================================ MUA3 */

const MUA_TEAM = [
  { x: 132, name: 'CAPTAIN AMERICA', tag: 'COM', lvl: 'LEVEL 17', color: '#ffffff', nameBox: [110, 840, 500, 890] as [number, number, number, number] },
  { x: 542, name: 'MS. MARVEL', tag: 'P1', lvl: 'LEVEL 18', color: '#ff2020', nameBox: [560, 840, 870, 890] as [number, number, number, number] },
  { x: 950, name: 'SPIDER-MAN', tag: 'P2', lvl: 'LEVEL 9', color: '#2f8dff', nameBox: [975, 840, 1262, 890] as [number, number, number, number] },
  { x: 1352, name: 'DEADPOOL', tag: 'COM', lvl: 'LEVEL 21', color: '#ffffff', nameBox: [1395, 840, 1650, 890] as [number, number, number, number] },
];

function Mua3() {
  const k = scaleFor('mua3');
  const src = useSrc();
  const [clear] = useOpt('clear', false);
  const label: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontStyle: 'italic', letterSpacing: '0.04em', textShadow: '0 2px 4px rgba(0,0,0,.8)' };
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Shot k="mua3" empty={clear} />
      <CellSlots k="mua3" prefix="" scale={k} labelFor={(i) => `Roster card ${i + 1}`} />
      {MUA_TEAM.map((t, i) => {
        const shape: Shape = { t: 'q', x: t.x, y: 612, w: 375, h: 178, sk: 10 };
        const has = !!src('team' + i);
        return (
          <div key={i}>
            <PhotoSlot
              id={'team' + i}
              label={`Team card ${i + 1} picture`}
              placeholder={false}
              style={shapeStyle(shape, k)}
            >
              {has && <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '35%', background: 'linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,.55))', pointerEvents: 'none' }} />}
            </PhotoSlot>
            {has && (
              <>
                <TextSlot id={'tag' + i} label={`Team card ${i + 1} tag`} def={t.tag} style={{ ...label, left: (t.x + 10) * k, top: 755 * k, fontSize: 32 * k, color: t.color }} />
                <TextSlot id={'lvl' + i} label={`Team card ${i + 1} level`} def={t.lvl} style={{ ...label, fontStyle: 'normal', fontWeight: 700, left: (t.x + 170) * k, width: 195 * k, textAlign: 'right', top: 757 * k, fontSize: 30 * k, color: t.color }} />
              </>
            )}
            <SwapText
              id={'name' + i}
              label={`Team card ${i + 1} name`}
              force={clear}
              def={clear ? '' : t.name}
              patch={<Crop k="mua3" box={t.nameBox} scale={k} />}
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, letterSpacing: '0.06em', color: t.color, left: (t.x - 20) * k, width: 420 * k, top: 845 * k, fontSize: 36 * k, textAlign: 'center' }}
            />
          </div>
        );
      })}
    </div>
  );
}

export const mua3: TemplateDef = {
  id: 'mua3-roster',
  tab: 'games',
  title: 'Marvel Ultimate Alliance 3 Roster',
  blurb: 'The real MUA3 “Choose Your Heroes” screen. Fill the roster cards and the team of four.',
  size: () => sizeFor('mua3'),
  Render: Mua3,
  thumb: { bg: '#000', emoji: '🦸', img: '/rosters/mua3.jpg' },
  Controls: () => (
    <>
      <OptToggle k="clear" label="Empty out the original heroes" def={false} />
      <p className="hint">The gray cards are empty spots — tap them to add new heroes. The four big team cards at the bottom take photos too.</p>
    </>
  ),
};
