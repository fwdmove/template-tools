/*
 * Templates built on real images: the AEW "is All Elite" graphic (public/rosters/aew*.jpg, made by
 * scripts/aew.py) and WWE 2K covers (public/covers/*, made by scripts/covers.py). The original shows
 * until you change something; then the cleaned copy is revealed underneath your photo and text.
 */
import type { CSSProperties } from 'react';
import { PhotoSlot, TextSlot, useOpt } from '../core/editor';
import { OptSelect, OptToggle, type TemplateDef } from '../core/ui';
import { Crop, Shot, SwapText, useSrc, useTouched } from './rosters';
import META from './covers-meta.json';

/* ================================================================ AEW */

const AEW_K = 1920 / 1024;
const AEW_SIZE: [number, number] = [1920, 1080];
const AEW_FONT: CSSProperties = { fontFamily: "'Anton', sans-serif", color: '#fff', letterSpacing: '0.01em', textAlign: 'center' };
const GOLD = '#d4a94a';

function Aew() {
  const k = AEW_K;
  const src = useSrc();
  const touched = useTouched();
  const [fit] = useOpt('fit', 'contain');
  const [clear] = useOpt('clear', false);
  const hasPhoto = !!src('photo');
  const tagTouched = touched('tag1') || touched('tag2') || clear;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Shot k="aew" />
      {(hasPhoto || clear) && <Crop k="aew" box={[470, 0, 1024, 576]} scale={k} size={AEW_SIZE} />}
      <PhotoSlot id="photo" label="Wrestler photo (a cut-out PNG looks best)" placeholder={false} fit={fit as 'cover' | 'contain'} style={{ left: 470 * k, top: 0, width: 554 * k, height: 576 * k }} />
      <SwapText
        id="name"
        label="Name"
        def={clear ? '' : 'WILL OSPREAY'}
        force={clear}
        patch={<Crop k="aew" box={[62, 266, 572, 364]} scale={k} size={AEW_SIZE} />}
        style={{ ...AEW_FONT, left: 60 * k, width: 516 * k, top: 271 * k, fontSize: 94 * k }}
      />
      <SwapText
        id="is"
        label="Middle word"
        def={clear ? '' : 'IS'}
        force={clear}
        fit={false}
        patch={<Crop k="aew" box={[290, 376, 358, 434]} scale={k} size={AEW_SIZE} />}
        style={{ ...AEW_FONT, left: 60 * k, width: 516 * k, top: 380 * k, fontSize: 52 * k }}
      />
      {tagTouched && <Crop k="aew" box={[156, 446, 482, 524]} scale={k} size={AEW_SIZE} />}
      <div style={{ position: 'absolute', left: 60 * k, width: 516 * k, top: 449 * k, display: 'flex', justifyContent: 'center', alignItems: 'baseline' }}>
        {(
          [
            ['tag1', 'Hashtag (white part)', '#ALL', '#fff'],
            ['tag2', 'Hashtag (gold part)', 'ELITE', GOLD],
          ] as const
        ).map(([id, label, def, color]) => (
          <TextSlot
            key={id}
            id={id}
            label={label}
            def={clear ? '' : def}
            style={{ ...AEW_FONT, position: 'relative', fontSize: 83 * k, color: tagTouched ? color : 'transparent' }}
          />
        ))}
      </div>
    </div>
  );
}

export const aew: TemplateDef = {
  id: 'aew-all-elite',
  tab: 'sports',
  title: 'AEW “Is All Elite”',
  blurb: 'The real AEW signing graphic. Swap the wrestler and the name.',
  size: () => AEW_SIZE,
  Render: Aew,
  thumb: { bg: '#000', emoji: '🏆', img: '/rosters/aew.jpg' },
  Controls: () => (
    <>
      <OptSelect k="fit" label="Photo fit" def="contain" options={[['contain', 'Show the whole picture (cut-outs)'], ['cover', 'Fill the space']]} />
      <OptToggle k="clear" label="Empty it out (no wrestler, no text)" def={false} />
      <p className="hint">Tap the wrestler to add your photo — a picture with the background removed looks just like the real thing. Tap the name, “IS” or #ALLELITE to change them.</p>
    </>
  ),
};

/* ================================================================ WWE 2K COVERS */

type CoverMeta = { w: number; h: number; logo: [number, number, number, number]; badges: [number, number, number, number][] };
const COVERS = META as unknown as Record<string, CoverMeta>;
const COVER_IDS = Object.keys(COVERS).sort();
const label = (id: string) => `WWE ${id.toUpperCase()}`;

function WweCover() {
  const [g] = useOpt('game', '2k26');
  const [fit] = useOpt('fit', 'cover');
  const [clear] = useOpt('clear', false);
  const src = useSrc();
  const m = COVERS[g] ?? COVERS['2k26'];
  const size: [number, number] = [m.w, m.h];
  const replaced = !!src('star') || clear;
  const [lx0, ly0, lx1, ly1] = m.logo;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Shot k={g} dir="covers" clean={replaced} />
      <PhotoSlot id="star" label="Cover star photo" placeholder={false} fit={fit as 'cover' | 'contain'} style={{ inset: 0 }} />
      {replaced && (
        <>
          <img src={`/covers/${g}-logo.png`} alt="" draggable={false} style={{ position: 'absolute', left: lx0, top: ly0, width: lx1 - lx0, height: ly1 - ly0, pointerEvents: 'none' }} />
          {m.badges.map((b, i) => (
            <Crop key={i} k={g} dir="covers" box={b} scale={1} clean={false} size={size} />
          ))}
        </>
      )}
    </div>
  );
}

export const wweCover: TemplateDef = {
  id: 'wwe-cover',
  tab: 'sports',
  title: 'WWE 2K Cover',
  blurb: 'The real WWE 2K14 – 2K26 covers. Put any wrestler on the cover — the logo stays in front.',
  size: (o) => {
    const m = COVERS[o.game ?? '2k26'] ?? COVERS['2k26'];
    return [m.w, m.h];
  },
  Render: WweCover,
  thumb: { bg: '#000', emoji: '🎮', img: '/covers/2k26.jpg' },
  Controls: () => (
    <>
      <OptSelect k="game" label="Game" def="2k26" options={[...COVER_IDS].reverse().map((id) => [id, label(id)] as [string, string])} />
      <OptSelect k="fit" label="Photo fit" def="cover" options={[['cover', 'Fill the cover'], ['contain', 'Show the whole picture (cut-outs)']]} />
      <OptToggle k="clear" label="Empty cover (remove the original star)" def={false} />
      <p className="hint">Add a photo and the original cover star is painted out automatically. Drag and resize your photo — the WWE 2K logo, 2K badge and rating stay on top. A cut-out PNG looks most like the real covers.</p>
    </>
  ),
};
