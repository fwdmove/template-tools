import { PhotoSlot, TextSlot, useOpt, useTextValue } from '../core/editor';
import { OptSelect, OptText, OptToggle, type TemplateDef } from '../core/ui';

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

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
