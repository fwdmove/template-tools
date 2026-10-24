import type { CSSProperties, ReactNode } from 'react';
import { PhotoSlot, TextSlot, useOpt } from '../core/editor';
import { OptNum, OptSelect, OptText, OptToggle, type TemplateDef } from '../core/ui';

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

/* ================================================================ POKÉMON */

const GILL = "'Gill Sans', 'Gill Sans MT', 'Lato', 'Montserrat', sans-serif";

const TYPES: Record<string, { label: string; c: string; card: string; glyph: string }> = {
  grass: { label: 'Grass', c: '#5fa83a', card: 'linear-gradient(160deg,#d9edb0,#9fcf6a 55%,#7db446)', glyph: '#fff' },
  fire: { label: 'Fire', c: '#e2403a', card: 'linear-gradient(160deg,#ffd2a8,#f38a5a 55%,#df5b3a)', glyph: '#fff' },
  water: { label: 'Water', c: '#2f8fd8', card: 'linear-gradient(160deg,#cfe9ff,#7ec0f0 55%,#4c9ee0)', glyph: '#fff' },
  lightning: { label: 'Lightning', c: '#f2c71c', card: 'linear-gradient(160deg,#fff6c2,#f8de6a 55%,#ecc23a)', glyph: '#222' },
  psychic: { label: 'Psychic', c: '#9b55b4', card: 'linear-gradient(160deg,#f0d6f2,#cf9ad9 55%,#b170c0)', glyph: '#fff' },
  fighting: { label: 'Fighting', c: '#c0622d', card: 'linear-gradient(160deg,#f2d2b0,#d99a68 55%,#c07a48)', glyph: '#fff' },
  darkness: { label: 'Darkness', c: '#2a4651', card: 'linear-gradient(160deg,#a9bcc2,#5e7a84 55%,#3d5660)', glyph: '#fff' },
  metal: { label: 'Metal', c: '#8e9aa3', card: 'linear-gradient(160deg,#eef1f3,#c5ccd2 55%,#a3adb5)', glyph: '#fff' },
  dragon: { label: 'Dragon', c: '#b39b2a', card: 'linear-gradient(160deg,#f3e8b6,#d4c070 55%,#b8a248)', glyph: '#fff' },
  colorless: { label: 'Colorless', c: '#e9e7df', card: 'linear-gradient(160deg,#ffffff,#e9e7df 55%,#cfccc2)', glyph: '#222' },
};

function Glyph({ t }: { t: string }) {
  const f = TYPES[t]?.glyph ?? '#fff';
  switch (t) {
    case 'grass':
      return <path d="M30 70 C30 40 50 25 72 26 C72 50 58 70 30 70 Z M30 70 L60 40" fill={f} stroke={f} strokeWidth="3" />;
    case 'fire':
      return <path d="M50 20 C62 38 74 46 70 64 C67 78 56 82 50 82 C40 82 30 75 30 62 C30 50 40 46 42 36 C48 44 48 50 52 54 C56 44 54 32 50 20 Z" fill={f} />;
    case 'water':
      return <path d="M50 18 C58 36 70 48 70 62 C70 74 61 82 50 82 C39 82 30 74 30 62 C30 48 42 36 50 18 Z" fill={f} />;
    case 'lightning':
      return <path d="M56 16 L32 54 L48 54 L42 84 L68 42 L52 42 Z" fill={f} />;
    case 'psychic':
      return (
        <>
          <path d="M18 50 C32 30 68 30 82 50 C68 70 32 70 18 50 Z" fill={f} />
          <circle cx="50" cy="50" r="11" fill={TYPES.psychic.c} />
        </>
      );
    case 'fighting':
      return <path d="M32 40 h36 v30 a8 8 0 0 1 -8 8 h-20 a8 8 0 0 1 -8 -8 Z M32 40 v-10 h9 v10 M41 40 v-12 h9 v12 M50 40 v-12 h9 v12 M59 40 v-10 h9 v10" fill={f} stroke={f} strokeWidth="2" />;
    case 'darkness':
      return <path d="M58 20 A30 30 0 1 0 80 62 A24 24 0 1 1 58 20 Z" fill={f} />;
    case 'metal':
      return <path d="M50 18 L80 34 L80 66 L50 82 L20 66 L20 34 Z M50 34 L66 42 L66 58 L50 66 L34 58 L34 42 Z" fill={f} fillRule="evenodd" />;
    case 'dragon':
      return <path d="M50 16 L58 40 L84 40 L62 55 L70 80 L50 64 L30 80 L38 55 L16 40 L42 40 Z" fill={f} />;
    default:
      return <path d="M50 14 L58 42 L86 50 L58 58 L50 86 L42 58 L14 50 L42 42 Z" fill={f} />;
  }
}

export function Energy({ t, size = 40 }: { t: string; size?: number }) {
  const ty = TYPES[t] ?? TYPES.colorless;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: 'inline-block', verticalAlign: 'middle', flex: 'none' }}>
      <circle cx="50" cy="50" r="47" fill={ty.c} stroke="rgba(0,0,0,.35)" strokeWidth="4" />
      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="3" />
      <Glyph t={t} />
    </svg>
  );
}

const RARITIES: Record<string, { label: string; sym: string; color: string }> = {
  common: { label: 'Common ●', sym: '●', color: '#111' },
  uncommon: { label: 'Uncommon ◆', sym: '◆', color: '#111' },
  rare: { label: 'Rare ★', sym: '★', color: '#111' },
  double: { label: 'Double Rare ★★', sym: '★★', color: '#111' },
  ultra: { label: 'Ultra Rare ★★ (silver)', sym: '★★', color: '#c9ccd1' },
  ir: { label: 'Illustration Rare ★ (gold)', sym: '★', color: '#d8b04a' },
  sir: { label: 'Special Illustration Rare ★★ (gold)', sym: '★★', color: '#d8b04a' },
  hyper: { label: 'Hyper Rare ★★★ (gold)', sym: '★★★', color: '#d8b04a' },
  promo: { label: 'Promo', sym: 'PROMO', color: '#111' },
};

const typeOptions = Object.entries(TYPES).map(([k, v]) => [k, v.label] as [string, string]);
const costOptions: [string, string][] = [['', '—'], ...typeOptions];

function Pokemon() {
  const [type] = useOpt('type', 'lightning');
  const [variant] = useOpt('variant', 'regular');
  const [border] = useOpt('border', 'silver');
  const [stage] = useOpt('stage', 'basic');
  const [rarity] = useOpt('rarity', 'common');
  const [ability] = useOpt('ability', false);
  const [nAtk] = useOpt('attacks', 2);
  const [weak] = useOpt('weak', 'fighting');
  const [res] = useOpt('res', '');
  const [retreat] = useOpt('retreat', 1);
  const [reg] = useOpt('reg', 'H');
  const costs = [
    [useOpt('a1c1', type)[0], useOpt('a1c2', '')[0], useOpt('a1c3', '')[0]],
    [useOpt('a2c1', type)[0], useOpt('a2c2', 'colorless')[0], useOpt('a2c3', 'colorless')[0]],
  ];
  const ty = TYPES[type] ?? TYPES.lightning;
  const full = variant === 'full' || variant === 'ir';
  const isEx = variant === 'ex' || variant === 'full';
  const holo = variant === 'holo';
  const ink = full ? '#fff' : '#111';
  const shadow = full ? '0 2px 4px rgba(0,0,0,.8), 0 0 2px #000' : 'none';
  const r = RARITIES[rarity] ?? RARITIES.common;
  const borderBg =
    border === 'yellow'
      ? 'linear-gradient(135deg,#f9e27a,#e9c534 40%,#f6dc63 60%,#d8b228)'
      : border === 'gold'
        ? 'linear-gradient(135deg,#f6e29a,#c99a35 40%,#f3d77d 60%,#a8781e)'
        : 'linear-gradient(135deg,#e9ebee,#b6bbc2 40%,#eef0f2 60%,#a3a9b1)';
  const cardBg = isEx && !full ? `linear-gradient(160deg, rgba(255,255,255,.55), rgba(255,255,255,0) 40%), ${ty.card}` : ty.card;
  const artTop = stage === 'basic' ? 118 : 124;
  const bodyTop = 585;
  const frame: CSSProperties = full
    ? { inset: 0, borderRadius: 18 }
    : { left: 26, top: artTop, width: 646, height: 404, boxShadow: '0 0 0 7px #d8c37a, 0 0 0 9px #8a7432, 3px 6px 10px rgba(0,0,0,.4)' };
  return (
    <div style={{ position: 'absolute', inset: 0, borderRadius: 34, background: borderBg, padding: 26 }}>
      <div style={{ position: 'absolute', inset: 26, borderRadius: 18, overflow: 'hidden', background: cardBg }}>
        {!full && <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(115deg, rgba(255,255,255,.08) 0 2px, transparent 2px 12px)' }} />}
        {/* art */}
        <PhotoSlot id="art" label="Pokémon picture (anyone!)" style={{ position: 'absolute', ...frame, background: 'linear-gradient(160deg,#fff,#ddd)' }} dark>
          {holo && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(115deg, rgba(255,0,0,.12), rgba(255,255,0,.14), rgba(0,255,0,.12), rgba(0,255,255,.14), rgba(0,0,255,.12), rgba(255,0,255,.14))', pointerEvents: 'none' }} />}
          {full && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,.35) 0%, transparent 14%, transparent 55%, rgba(0,0,0,.55) 75%, rgba(0,0,0,.7))', pointerEvents: 'none' }} />}
        </PhotoSlot>
        {/* header */}
        <div style={{ position: 'absolute', left: 20, top: 14, fontFamily: GILL, fontWeight: 700, fontStyle: 'italic', fontSize: 18, color: ink, textShadow: shadow, background: full ? 'rgba(0,0,0,.25)' : 'linear-gradient(90deg,#c9ccd1,#f2f3f5)', padding: '3px 12px 3px 8px', borderRadius: '0 0 10px 0', clipPath: 'polygon(0 0,100% 0,90% 100%,0 100%)' }}>
          {stage === 'basic' ? 'BASIC' : stage === 'stage1' ? 'STAGE 1' : 'STAGE 2'}
        </div>
        {stage !== 'basic' && (
          <>
            <PhotoSlot id="evo" label="Evolves-from picture" style={{ left: 18, top: 46, width: 60, height: 60, borderRadius: '50%', border: '3px solid #c9ccd1', background: '#eee' }} />
            <TextSlot id="evofrom" label="Evolves from" def="Evolves from Pichu" style={{ left: 120, top: 18, fontSize: 16, color: ink, textShadow: shadow, fontFamily: GILL, fontStyle: 'italic' }} />
          </>
        )}
        <div style={{ position: 'absolute', left: stage === 'basic' ? 26 : 90, top: 46, display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <TextSlot id="name" label="Name" def="Pikachu" style={{ position: 'relative', fontSize: 50, fontWeight: 700, color: ink, textShadow: shadow, fontFamily: GILL, letterSpacing: '-0.01em' }} />
          {isEx && (
            <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 50, fontStyle: 'italic', color: '#e6e8ec', WebkitTextStroke: '2px #222', paintOrder: 'stroke', textShadow: '0 3px 0 #8a9099', letterSpacing: '-0.04em' }}>ex</span>
          )}
        </div>
        <div style={{ position: 'absolute', right: 22, top: 44, display: 'flex', alignItems: 'center', gap: 6, color: ink, textShadow: shadow, fontFamily: GILL, fontWeight: 700 }}>
          <span style={{ fontSize: 20, marginTop: 14 }}>HP</span>
          <TextSlot id="hp" label="HP" def="70" style={{ position: 'relative', fontSize: 48, fontFamily: GILL, fontWeight: 700, color: ink }} />
          <Energy t={type} size={46} />
        </div>
        {/* dex strip */}
        {!full && (
          <div style={{ position: 'absolute', left: 110, right: 110, top: artTop + 414, height: 30, background: 'linear-gradient(90deg,#b9bec5,#eef0f2 30%,#eef0f2 70%,#b9bec5)', clipPath: 'polygon(3% 0,97% 0,100% 100%,0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TextSlot id="dex" label="Pokédex line" def={"NO. 0025  Mouse Pokémon  HT: 1'4\"  WT: 13.2 lbs."} fit style={{ position: 'relative', width: 500, textAlign: 'center', fontSize: 16, fontStyle: 'italic', color: '#222', fontFamily: GILL }} />
          </div>
        )}
        {/* body */}
        <div style={{ position: 'absolute', left: 30, right: 30, top: full ? 600 : bodyTop, display: 'flex', flexDirection: 'column', gap: 14, color: ink, textShadow: shadow, fontFamily: GILL }}>
          {ability && (
            <div style={{ position: 'relative', height: 92 }}>
              <div style={{ position: 'absolute', left: 0, top: 4, background: '#c8102e', color: '#fff', fontSize: 20, fontWeight: 700, fontStyle: 'italic', padding: '3px 12px', borderRadius: 4 }}>Ability</div>
              <TextSlot id="abname" label="Ability name" def="Static Charge" style={{ left: 110, top: 0, fontSize: 32, fontWeight: 700, color: '#c8102e', fontFamily: GILL }} />
              <TextSlot id="abtext" label="Ability text" def="Once during your turn, you may attach a Lightning Energy card from your hand to this Pokémon." multiline style={{ left: 0, top: 42, width: 640, fontSize: 19, lineHeight: 1.2, color: ink, fontFamily: GILL }} />
            </div>
          )}
          {range(nAtk).map((i) => (
            <div key={i} style={{ position: 'relative', height: ability ? 110 : 130 }}>
              <div style={{ position: 'absolute', left: 0, top: 0, display: 'flex', gap: 2 }}>
                {costs[i].filter(Boolean).map((c, j) => (
                  <Energy key={j} t={c} size={38} />
                ))}
              </div>
              <TextSlot id={'atk' + i} label={`Attack ${i + 1} name`} def={i === 0 ? 'Quick Attack' : 'Thunderbolt'} style={{ left: 150, top: 2, fontSize: 34, fontWeight: 700, color: ink, fontFamily: GILL }} />
              <TextSlot id={'dmg' + i} label={`Attack ${i + 1} damage`} def={i === 0 ? '20+' : '120'} style={{ right: 0, top: 0, fontSize: 40, fontWeight: 700, color: ink, fontFamily: GILL, textAlign: 'right' }} />
              <TextSlot
                id={'atxt' + i}
                label={`Attack ${i + 1} text`}
                def={i === 0 ? 'Flip a coin. If heads, this attack does 10 more damage.' : 'Discard all Energy from this Pokémon.'}
                multiline
                style={{ left: 0, top: 46, width: 640, fontSize: 19, lineHeight: 1.2, color: ink, fontFamily: GILL }}
              />
            </div>
          ))}
        </div>
        {/* weakness / resistance / retreat */}
        <div style={{ position: 'absolute', left: 26, right: 26, top: 852, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: GILL, fontSize: 18, color: ink, textShadow: shadow, borderTop: full ? 'none' : '2px solid rgba(0,0,0,.15)', paddingTop: 6 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            weakness {weak && <Energy t={weak} size={28} />} <b style={{ fontSize: 22 }}>{weak ? '×2' : ''}</b>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            resistance {res && <Energy t={res} size={28} />} <b style={{ fontSize: 22 }}>{res ? '-30' : ''}</b>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            retreat
            {range(retreat).map((i) => (
              <Energy key={i} t="colorless" size={28} />
            ))}
          </span>
        </div>
        {/* footer */}
        {isEx ? (
          <div style={{ position: 'absolute', left: 26, right: 26, top: 906, height: 36, borderRadius: 6, background: full ? 'rgba(0,0,0,.4)' : 'rgba(255,255,255,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: GILL, fontSize: 15, color: ink }}>
            <b style={{ marginRight: 6 }}>Pokémon ex rule:</b> When your Pokémon ex is Knocked Out, your opponent takes 2 Prize cards.
          </div>
        ) : (
          <TextSlot
            id="flavor"
            label="Flavor text"
            def="When it is angered, it immediately discharges the energy stored in the pouches in its cheeks."
            multiline
            style={{ left: 300, top: 908, width: 372, boxSizing: 'border-box', fontSize: 14, lineHeight: 1.2, fontStyle: 'italic', color: ink, fontFamily: GILL, border: full ? 'none' : '1.5px solid rgba(0,0,0,.3)', borderRadius: 4, padding: '4px 6px' }}
          />
        )}
        <div style={{ position: 'absolute', left: 26, bottom: 18, display: 'flex', alignItems: 'center', gap: 10, fontFamily: GILL, fontSize: 15, color: ink, textShadow: shadow }}>
          <TextSlot id="illus" label="Illustrator" def="Illus. You" style={{ position: 'relative', fontSize: 15, fontFamily: GILL, color: ink }} />
          <span style={{ border: `1.5px solid ${ink}`, borderRadius: 3, padding: '0 4px', fontWeight: 700 }}>{reg}</span>
          <TextSlot id="num" label="Card number" def="025/198" style={{ position: 'relative', fontSize: 15, fontFamily: GILL, color: ink, fontWeight: 700 }} />
          <span style={{ color: r.color, fontSize: r.sym === 'PROMO' ? 12 : 17, textShadow: r.color !== '#111' ? '0 0 2px #000' : shadow, letterSpacing: '-0.05em' }}>{r.sym}</span>
        </div>
        <div style={{ position: 'absolute', right: 26, bottom: 18, fontFamily: GILL, fontSize: 11, color: ink, opacity: 0.85, textShadow: shadow }}>©2026 Template Tools</div>
      </div>
    </div>
  );
}

export const pokemon: TemplateDef = {
  id: 'pokemon-card',
  tab: 'cards',
  title: 'Pokémon Card',
  blurb: 'Design a Pokémon card with anybody on it — type, HP, attacks, rarity, full art and ex.',
  size: () => [750, 1048],
  Render: Pokemon,
  thumb: { bg: 'linear-gradient(135deg,#f8de6a,#ecc23a)', emoji: '⚡' },
  Controls: () => {
    const [nAtk] = useOpt('attacks', 2);
    const [type] = useOpt('type', 'lightning');
    return (
      <>
        <OptSelect k="type" label="Type" def="lightning" options={typeOptions} />
        <OptSelect k="variant" label="Card style" def="regular" options={[['regular', 'Regular'], ['holo', 'Holo'], ['ex', 'Pokémon ex'], ['full', 'Full Art ex'], ['ir', 'Illustration Rare (full art)']]} />
        <OptSelect k="border" label="Border" def="silver" options={[['silver', 'Silver (Scarlet & Violet)'], ['yellow', 'Yellow (classic)'], ['gold', 'Gold (hyper rare)']]} />
        <OptSelect k="stage" label="Stage" def="basic" options={[['basic', 'Basic'], ['stage1', 'Stage 1'], ['stage2', 'Stage 2']]} />
        <OptSelect k="rarity" label="Rarity" def="common" options={Object.entries(RARITIES).map(([k, v]) => [k, v.label] as [string, string])} />
        <OptToggle k="ability" label="Has an Ability" def={false} />
        <OptNum k="attacks" label="Attacks" def={2} min={1} max={2} />
        {range(nAtk).map((i) => (
          <div className="row" key={i}>
            {range(3).map((j) => (
              <OptSelect key={j} k={`a${i + 1}c${j + 1}`} label={`Atk ${i + 1} cost ${j + 1}`} def={i === 0 ? (j === 0 ? type : '') : j === 0 ? type : 'colorless'} options={costOptions} />
            ))}
          </div>
        ))}
        <OptSelect k="weak" label="Weakness" def="fighting" options={costOptions} />
        <OptSelect k="res" label="Resistance" def="" options={costOptions} />
        <OptNum k="retreat" label="Retreat cost" def={1} min={0} max={4} />
        <OptText k="reg" label="Regulation mark" def="H" />
      </>
    );
  },
};

/* ================================================================ SPORTS CARD SHARED */

const PARALLELS: Record<string, { label: string; tint: string; hi: string }> = {
  silver: { label: 'Silver', tint: '#c9ced6', hi: '#ffffff' },
  gold: { label: 'Gold /10', tint: '#d8a93a', hi: '#fff1b8' },
  red: { label: 'Red /299', tint: '#d42a2a', hi: '#ff9a9a' },
  blue: { label: 'Blue /199', tint: '#2a62d4', hi: '#9ac0ff' },
  green: { label: 'Green', tint: '#2aa04a', hi: '#a6f0b8' },
  purple: { label: 'Purple /49', tint: '#7a3ad4', hi: '#d2b0ff' },
  orange: { label: 'Orange /25', tint: '#f07a1a', hi: '#ffd0a0' },
  pink: { label: 'Pink', tint: '#f05aa8', hi: '#ffc6e2' },
  black: { label: 'Black 1/1', tint: '#141414', hi: '#6a6a6a' },
};

function Prizm({ tint, hi }: { tint: string; hi: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `conic-gradient(from 20deg at 30% 40%, ${hi}, ${tint}, ${hi}88, ${tint}, ${hi}, ${tint}cc, ${hi}), conic-gradient(from 200deg at 75% 70%, ${tint}, ${hi}, ${tint})`,
        backgroundBlendMode: 'overlay',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, background: `repeating-conic-gradient(from 0deg at 50% 50%, rgba(255,255,255,.18) 0 6deg, rgba(0,0,0,.08) 6deg 12deg)` }} />
    </div>
  );
}

function Sig({ id, style }: { id: string; style?: CSSProperties }) {
  return <TextSlot id={id} label="Autograph" def="" style={{ fontSize: 76, color: '#14214d', fontFamily: "'Caveat', cursive", fontWeight: 700, transform: 'rotate(-6deg)', ...style } as any} />;
}

function Serial({ show, style }: { show: boolean; style: CSSProperties }) {
  if (!show) return null;
  return <TextSlot id="serial" label="Serial number" def="07/10" style={{ fontSize: 30, color: '#fff', fontFamily: "'Oswald', sans-serif", fontWeight: 700, background: 'rgba(0,0,0,.55)', padding: '2px 10px', borderRadius: 4, ...style } as any} />;
}

function RcBadge({ style }: { style: CSSProperties }) {
  return (
    <div style={{ position: 'absolute', width: 86, height: 86, borderRadius: '50%', background: 'linear-gradient(180deg,#fff,#d6d9de)', border: '5px solid #c8102e', display: 'grid', placeItems: 'center', fontFamily: "'Archivo Black', sans-serif", fontSize: 34, color: '#c8102e', boxShadow: '0 4px 8px rgba(0,0,0,.4)', ...style }}>
      RC
    </div>
  );
}

function CardShell({ children, radius = 22 }: { children: ReactNode; radius?: number }) {
  return <div style={{ position: 'absolute', inset: 0, borderRadius: radius, overflow: 'hidden', background: '#111' }}>{children}</div>;
}

/* ================================================================ BASKETBALL CARD */

function BballCard() {
  const [style] = useOpt('style', 'prizm');
  const [par] = useOpt('parallel', 'silver');
  const [rc] = useOpt('rc', true);
  const [serial] = useOpt('serial', false);
  const [c1] = useOpt('teamColor', '#1d428a');
  const [c2] = useOpt('teamColor2', '#c8102e');
  const p = PARALLELS[par] ?? PARALLELS.silver;
  if (style === 'retro') {
    return (
      <CardShell radius={10}>
        <div style={{ position: 'absolute', inset: 0, background: '#f4f1ea' }} />
        <div style={{ position: 'absolute', left: 30, top: 30, right: 30, height: 18, background: c2 }} />
        <div style={{ position: 'absolute', left: 30, top: 54, right: 30, height: 8, background: c1 }} />
        <TextSlot id="brand" label="Brand" def="BASKETBALL" style={{ left: 0, width: 750, top: 70, textAlign: 'center', fontSize: 40, color: c1, fontFamily: "'Archivo Black', sans-serif", letterSpacing: '0.12em' }} />
        <div style={{ position: 'absolute', left: 52, top: 124, width: 646, height: 760, background: c2, padding: 12 }}>
          <div style={{ position: 'absolute', inset: 12, background: '#fff', padding: 6 }} />
          <PhotoSlot id="photo" label="Player photo" style={{ left: 18, top: 18, width: 610, height: 724, background: '#bbb' }} />
        </div>
        <div style={{ position: 'absolute', left: 30, right: 30, top: 900, height: 120, background: c1, clipPath: 'polygon(0 0,100% 0,100% 100%,0 100%)' }} />
        <TextSlot id="name" label="Player name" def="PLAYER NAME" fit style={{ left: 50, width: 520, top: 920, fontSize: 52, color: '#fff', fontFamily: "'Archivo Black', sans-serif" }} />
        <TextSlot id="team" label="Team / position" def="TEAM • FORWARD" fit style={{ left: 50, width: 520, top: 980, fontSize: 26, color: '#ffe27a', fontFamily: "'Oswald', sans-serif", fontWeight: 700, letterSpacing: '0.08em' }} />
        <div style={{ position: 'absolute', right: 50, top: 890, width: 130, height: 130, borderRadius: '50%', background: '#fff', border: `6px solid ${c2}`, overflow: 'hidden' }}>
          <PhotoSlot id="logo" label="Team logo" fit="contain" style={{ inset: 8 }} dark={false} />
        </div>
        {rc && <RcBadge style={{ left: 60, top: 790 }} />}
        <Sig id="sig" style={{ left: 120, top: 700 }} />
        <Serial show={serial} style={{ right: 70, top: 140 }} />
      </CardShell>
    );
  }
  if (style === 'hoops') {
    return (
      <CardShell radius={18}>
        <PhotoSlot id="photo" label="Player photo" style={{ inset: 0, background: `linear-gradient(160deg, ${c1}, #111)` }} />
        <div style={{ position: 'absolute', inset: 0, boxShadow: `inset 0 0 0 18px ${p.tint}`, borderRadius: 18, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 260, background: c1, clipPath: 'polygon(0 30%, 100% 0, 100% 100%, 0 100%)' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 270, background: c2, clipPath: 'polygon(0 30%, 100% 0, 100% 4%, 0 34%)' }} />
        <TextSlot id="name" label="Player name" def="PLAYER NAME" fit style={{ left: 40, width: 560, top: 900, fontSize: 64, color: '#fff', fontFamily: "'Anton', sans-serif", letterSpacing: '0.02em' }} />
        <TextSlot id="team" label="Team / position" def="TEAM  |  GUARD" fit style={{ left: 42, width: 560, top: 976, fontSize: 28, color: '#fff', opacity: 0.9, fontFamily: "'Oswald', sans-serif", fontWeight: 500, letterSpacing: '0.1em' }} />
        <TextSlot id="brand" label="Brand" def="HOOPS" style={{ left: 40, top: 40, fontSize: 54, color: '#fff', fontFamily: "'Archivo Black', sans-serif", fontStyle: 'italic', textShadow: '0 3px 8px rgba(0,0,0,.7)' }} />
        <PhotoSlot id="logo" label="Team logo" fit="contain" placeholder={false} style={{ right: 40, top: 860, width: 110, height: 110 }} />
        {rc && <RcBadge style={{ right: 40, top: 40 }} />}
        <Sig id="sig" style={{ left: 120, top: 700, color: '#fff' }} />
        <Serial show={serial} style={{ left: 42, top: 120 }} />
      </CardShell>
    );
  }
  // prizm
  return (
    <CardShell>
      <Prizm tint={p.tint} hi={p.hi} />
      <div style={{ position: 'absolute', left: 36, top: 36, right: 36, bottom: 36, clipPath: 'polygon(0 0, 100% 0, 100% 88%, 92% 100%, 0 100%)', background: `linear-gradient(160deg, ${c1}, #0a0a0a)` }}>
        <PhotoSlot id="photo" label="Player photo" style={{ inset: 0 }} />
      </div>
      <div style={{ position: 'absolute', left: 36, right: 36, bottom: 36, height: 190, background: 'linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,.85))', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', left: 36, top: 860, width: 14, height: 120, background: c2 }} />
      <TextSlot id="name" label="Player name" def="PLAYER NAME" fit style={{ left: 66, width: 520, top: 870, fontSize: 64, color: '#fff', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontStyle: 'italic', letterSpacing: '0.01em', textTransform: 'uppercase' }} />
      <TextSlot id="team" label="Team / position" def="TEAM  •  F" fit style={{ left: 68, width: 520, top: 940, fontSize: 30, color: p.hi, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontStyle: 'italic', letterSpacing: '0.08em' }} />
      <TextSlot id="brand" label="Brand" def="PRIZM" style={{ right: 60, top: 60, fontSize: 46, color: '#fff', fontFamily: "'Exo 2', sans-serif", fontWeight: 800, fontStyle: 'italic', letterSpacing: '0.06em', textShadow: '0 2px 6px rgba(0,0,0,.6)' }} />
      <PhotoSlot id="logo" label="Team logo" fit="contain" placeholder={false} style={{ right: 60, top: 880, width: 110, height: 110 }} />
      {rc && <RcBadge style={{ left: 60, top: 60 }} />}
      <Sig id="sig" style={{ left: 120, top: 700, color: '#fff' }} />
      <Serial show={serial} style={{ right: 70, top: 140 }} />
    </CardShell>
  );
}

const CardControls = ({ brand }: { brand: 'nba' | 'wwe' }) => (
  <>
    {brand === 'nba' ? (
      <OptSelect k="style" label="Card design" def="prizm" options={[['prizm', 'Chrome refractor (Prizm-style)'], ['hoops', 'Modern base (Hoops-style)'], ['retro', "Retro '86 (Fleer-style)"]]} />
    ) : (
      <OptSelect k="style" label="Card design" def="chrome" options={[['chrome', 'Topps Chrome WWE-style'], ['prizm', 'Prizm WWE-style'], ['slam', 'Slam Attax-style']]} />
    )}
    <OptSelect k="parallel" label="Parallel / color" def="silver" options={Object.entries(PARALLELS).map(([k, v]) => [k, v.label] as [string, string])} />
    <OptToggle k="rc" label="Rookie card (RC) logo" def={true} />
    <OptToggle k="serial" label="Serial numbered" def={false} />
    {brand === 'nba' ? (
      <div className="row">
        <TeamColor k="teamColor" label="Team color" def="#1d428a" />
        <TeamColor k="teamColor2" label="Accent" def="#c8102e" />
      </div>
    ) : (
      <OptSelect k="show" label="Brand" def="raw" options={[['raw', 'RAW'], ['sd', 'SmackDown'], ['nxt', 'NXT'], ['legends', 'Legends'], ['aew', 'AEW']]} />
    )}
    <p className="hint">Tip: tap the empty spot on the card to add a signature in the “Autograph” field.</p>
  </>
);

function TeamColor({ k, label, def }: { k: string; label: string; def: string }) {
  const [v, set] = useOpt(k, def);
  return (
    <label className="field">
      <span>{label}</span>
      <input type="color" value={v} onChange={(e) => set(e.target.value)} />
    </label>
  );
}

export const bballCard: TemplateDef = {
  id: 'basketball-card',
  tab: 'cards',
  title: 'Basketball Card',
  blurb: 'Design a basketball trading card — refractor parallels, rookie logo, serial number, autograph.',
  size: () => [750, 1050],
  Render: BballCard,
  thumb: { bg: 'conic-gradient(from 20deg,#fff,#c9ced6,#fff,#9aa,#fff)', emoji: '🃏' },
  Controls: () => <CardControls brand="nba" />,
};

/* ================================================================ WWE CARD */

const SHOWS: Record<string, { label: string; c: string; c2: string }> = {
  raw: { label: 'RAW', c: '#d0021b', c2: '#111' },
  sd: { label: 'SMACKDOWN', c: '#1f4ed8', c2: '#0a0a0a' },
  nxt: { label: 'NXT', c: '#d4a72c', c2: '#111' },
  legends: { label: 'LEGENDS', c: '#8a8f99', c2: '#111' },
  aew: { label: 'AEW', c: '#c79a3a', c2: '#000' },
};

function WweCard() {
  const [style] = useOpt('style', 'chrome');
  const [par] = useOpt('parallel', 'silver');
  const [rc] = useOpt('rc', false);
  const [serial] = useOpt('serial', false);
  const [show] = useOpt('show', 'raw');
  const p = PARALLELS[par] ?? PARALLELS.silver;
  const s = SHOWS[show] ?? SHOWS.raw;
  if (style === 'slam') {
    return (
      <CardShell radius={26}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 30%, ${s.c}, #0a0a0a 75%)` }} />
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, rgba(255,255,255,.05) 0 10px, transparent 10px 20px)' }} />
        <PhotoSlot id="photo" label="Wrestler photo" fit="contain" placeholder={false} style={{ left: 30, top: 60, width: 690, height: 700 }} />
        <div style={{ position: 'absolute', left: 30, top: 30, width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle,#fff,#d6d9de)', border: `8px solid ${s.c}`, display: 'grid', placeItems: 'center' }}>
          <TextSlot id="power" label="Power number" def="165" style={{ position: 'relative', fontSize: 64, color: '#111', fontFamily: "'Anton', sans-serif" }} />
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 740, height: 90, background: s.c, transform: 'skewY(-3deg)' }} />
        <TextSlot id="name" label="Ring name" def="SUPERSTAR" fit style={{ left: 40, width: 670, top: 745, fontSize: 76, color: '#fff', fontFamily: "'Anton', sans-serif", textAlign: 'center', textShadow: '0 4px 0 #000' }} />
        <div style={{ position: 'absolute', left: 40, right: 40, top: 850, bottom: 40, borderRadius: 16, background: 'rgba(0,0,0,.65)', border: `3px solid ${s.c}`, display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '14px 24px', gap: 6, fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 30, color: '#fff' }}>
          {['ATTACK', 'DEFENSE', 'STAMINA', 'CHARISMA'].map((k, i) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', height: 60 }}>
              <span style={{ color: s.c === '#d0021b' ? '#ff6b6b' : '#9fc0ff' }}>{k}</span>
              <TextSlot id={'st' + i} label={`${k.toLowerCase()} stat`} def={String(80 + i * 4)} style={{ position: 'relative', fontSize: 38, color: '#fff', fontFamily: "'Oswald', sans-serif", fontWeight: 700 }} />
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', right: 40, top: 40, fontFamily: "'Archivo Black', sans-serif", fontSize: 40, color: '#fff', fontStyle: 'italic' }}>{s.label}</div>
        <Serial show={serial} style={{ right: 50, top: 100 }} />
      </CardShell>
    );
  }
  const isPrizm = style === 'prizm';
  return (
    <CardShell radius={20}>
      {isPrizm ? (
        <Prizm tint={p.tint} hi={p.hi} />
      ) : (
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${p.hi} 0%, ${p.tint} 22%, ${p.hi} 40%, ${p.tint} 60%, ${p.hi} 78%, ${p.tint} 100%)` }} />
      )}
      <div style={{ position: 'absolute', left: 34, top: 34, right: 34, bottom: 34, borderRadius: 8, overflow: 'hidden', background: `linear-gradient(160deg, ${s.c}, ${s.c2})` }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 30%, rgba(255,255,255,.25), transparent 60%)' }} />
        <PhotoSlot id="photo" label="Wrestler photo" style={{ inset: 0 }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 240, background: 'linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,.85))', pointerEvents: 'none' }} />
      </div>
      {!isPrizm && (
        <div style={{ position: 'absolute', left: 34, right: 34, top: 870, height: 120, background: `linear-gradient(90deg, ${s.c} 0 12px, rgba(10,10,10,.85) 12px)`, clipPath: 'polygon(0 0, 96% 0, 100% 100%, 0 100%)' }} />
      )}
      <TextSlot id="name" label="Ring name" def="SUPERSTAR" fit style={{ left: 70, width: 520, top: 885, fontSize: 66, color: '#fff', fontFamily: isPrizm ? "'Barlow Condensed', sans-serif" : "'Anton', sans-serif", fontWeight: 800, fontStyle: isPrizm ? 'italic' : 'normal', textTransform: 'uppercase', letterSpacing: '0.01em' }} />
      <TextSlot id="brandline" label="Show / title line" def={s.label} fit style={{ left: 72, width: 520, top: 955, fontSize: 28, color: isPrizm ? p.hi : s.c === '#8a8f99' ? '#ddd' : s.c, fontFamily: "'Oswald', sans-serif", fontWeight: 700, letterSpacing: '0.18em' }} />
      <TextSlot id="brand" label="Brand" def={isPrizm ? 'PRIZM' : 'CHROME'} style={{ right: 64, top: 60, fontSize: 40, color: '#fff', fontFamily: "'Exo 2', sans-serif", fontWeight: 800, fontStyle: 'italic', letterSpacing: '0.06em', textShadow: '0 2px 6px rgba(0,0,0,.7)' }} />
      <div style={{ position: 'absolute', left: 60, top: 56, fontFamily: "'Archivo Black', sans-serif", fontSize: 44, color: '#fff', transform: 'skewX(-8deg)', textShadow: '0 3px 8px rgba(0,0,0,.6)' }}>{show === 'aew' ? 'AEW' : 'WWE'}</div>
      {rc && <RcBadge style={{ right: 60, top: 860 }} />}
      <Sig id="sig" style={{ left: 120, top: 700, color: '#fff' }} />
      <Serial show={serial} style={{ right: 70, top: 130 }} />
    </CardShell>
  );
}

export const wweCard: TemplateDef = {
  id: 'wwe-card',
  tab: 'cards',
  title: 'WWE Card',
  blurb: 'Design a wrestling trading card — Chrome, Prizm or Slam Attax-style with stats.',
  size: () => [750, 1050],
  Render: WweCard,
  thumb: { bg: 'linear-gradient(135deg,#d0021b,#111)', emoji: '💪' },
  Controls: () => <CardControls brand="wwe" />,
};
