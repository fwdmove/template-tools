import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';

export type ImgVal = { src?: string; x: number; y: number; scale: number; rot: number };
export type TxtVal = { text?: string; dx: number; dy: number; size: number; color?: string };
export type LayerVal = { x: number; y: number; scale: number; rot: number; src?: string };

export type SlotKind = 'photo' | 'text' | 'layer';
export type SlotMeta = { id: string; kind: SlotKind; label: string; def?: string };

export type TemplateState = { slots: Record<string, any>; opts: Record<string, any> };

type Ctx = {
  state: TemplateState;
  setSlot: (id: string, patch: any) => void;
  setOpt: (k: string, v: any) => void;
  selected: string | null;
  select: (id: string | null) => void;
  metas: SlotMeta[];
  register: (m: SlotMeta) => void;
  unregister: (id: string) => void;
  scaleRef: { current: number };
  pickFile: (id: string) => void;
};

const EditorCtx = createContext<Ctx | null>(null);
export const useEditor = () => useContext(EditorCtx)!;

export const IMG_DEFAULT: ImgVal = { x: 0, y: 0, scale: 1, rot: 0 };
export const TXT_DEFAULT: TxtVal = { dx: 0, dy: 0, size: 1 };
export const LAYER_DEFAULT: LayerVal = { x: 0, y: 0, scale: 1, rot: 0 };

/** Read a photo, shrink it to a sane size, return a data URL (keeps PNG transparency). */
export async function fileToDataUrl(file: File, max = 1800): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = url;
    });
    const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement('canvas');
    c.width = Math.round(img.naturalWidth * k);
    c.height = Math.round(img.naturalHeight * k);
    c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
    const png = /png|webp|gif/.test(file.type);
    return c.toDataURL(png ? 'image/png' : 'image/jpeg', 0.92);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function EditorProvider({
  state,
  onChange,
  children,
}: {
  state: TemplateState;
  onChange: (fn: (s: TemplateState) => TemplateState) => void;
  children: ReactNode;
}) {
  const [selected, select] = useState<string | null>(null);
  const [metas, setMetas] = useState<SlotMeta[]>([]);
  const scaleRef = useRef(1);
  const fileRef = useRef<HTMLInputElement>(null);
  const pendingId = useRef<string | null>(null);

  const setSlot = useCallback(
    (id: string, patch: any) =>
      onChange((s) => ({ ...s, slots: { ...s.slots, [id]: { ...(s.slots[id] ?? {}), ...patch } } })),
    [onChange],
  );
  const setOpt = useCallback(
    (k: string, v: any) => onChange((s) => ({ ...s, opts: { ...s.opts, [k]: v } })),
    [onChange],
  );
  const register = useCallback((m: SlotMeta) => {
    setMetas((ms) => (ms.some((x) => x.id === m.id && x.label === m.label) ? ms : [...ms.filter((x) => x.id !== m.id), m]));
  }, []);
  const unregister = useCallback((id: string) => setMetas((ms) => ms.filter((x) => x.id !== id)), []);
  const pickFile = useCallback((id: string) => {
    pendingId.current = id;
    fileRef.current?.click();
  }, []);

  return (
    <EditorCtx.Provider value={{ state, setSlot, setOpt, selected, select, metas, register, unregister, scaleRef, pickFile }}>
      {children}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={async (e) => {
          const f = e.target.files?.[0];
          e.target.value = '';
          const id = pendingId.current;
          if (!f || !id) return;
          const src = await fileToDataUrl(f);
          if (id.startsWith('opt:')) setOpt(id.slice(4), src);
          else setSlot(id, { src, x: 0, y: 0, scale: 1, rot: 0 });
          if (!id.startsWith('opt:')) select(id);
        }}
      />
    </EditorCtx.Provider>
  );
}

export function useOpt<T>(key: string, def: T): [T, (v: T) => void] {
  const { state, setOpt } = useEditor();
  const v = key in state.opts ? (state.opts[key] as T) : def;
  return [v, (nv: T) => setOpt(key, nv)];
}

export function useTextValue(id: string, def: string) {
  const { state } = useEditor();
  return (state.slots[id]?.text as string | undefined) ?? def;
}

function useRegister(m: SlotMeta) {
  const { register, unregister } = useEditor();
  useEffect(() => {
    register(m);
  }, [m.id, m.label, register]); // eslint-disable-line
  useEffect(() => () => unregister(m.id), [m.id, unregister]);
}

/** Pointer drag + two-finger pinch, reported in stage pixels. */
function useGesture(
  onStart: () => void,
  onPan: (dx: number, dy: number) => void,
  onPinch?: (ratio: number) => void,
) {
  const { scaleRef } = useEditor();
  const pts = useRef(new Map<number, { x: number; y: number }>());
  const base = useRef<{ x: number; y: number; d: number } | null>(null);
  const moved = useRef(false);
  return {
    moved,
    handlers: {
      onPointerDown: (e: React.PointerEvent) => {
        e.stopPropagation();
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
        moved.current = false;
        onStart();
        const p = [...pts.current.values()];
        base.current = {
          x: p[0].x,
          y: p[0].y,
          d: p.length > 1 ? Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y) : 0,
        };
      },
      onPointerMove: (e: React.PointerEvent) => {
        if (!pts.current.has(e.pointerId) || !base.current) return;
        pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
        const p = [...pts.current.values()];
        const s = scaleRef.current || 1;
        if (p.length > 1 && onPinch && base.current.d) {
          moved.current = true;
          onPinch(Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y) / base.current.d);
        } else if (p.length === 1) {
          const dx = (p[0].x - base.current.x) / s;
          const dy = (p[0].y - base.current.y) / s;
          if (Math.abs(dx) + Math.abs(dy) > 2) moved.current = true;
          onPan(dx, dy);
        }
      },
      onPointerUp: (e: React.PointerEvent) => {
        pts.current.delete(e.pointerId);
        base.current = null;
        if (pts.current.size) {
          const p = [...pts.current.values()];
          base.current = { x: p[0].x, y: p[0].y, d: 0 };
          onStart();
        }
      },
      onPointerCancel: (e: React.PointerEvent) => {
        pts.current.delete(e.pointerId);
        base.current = null;
      },
    },
  };
}

export function Placeholder({ dark = true, label = '+' }: { dark?: boolean; label?: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        overflow: 'hidden',
        background: dark ? 'rgba(0,0,0,.18)' : 'rgba(255,255,255,.2)',
      }}
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMax meet" style={{ width: '78%', height: '86%', opacity: 0.38 }}>
        <circle cx="50" cy="34" r="19" fill={dark ? '#000' : '#fff'} />
        <path d="M10 100 C12 66 30 58 50 58 C70 58 88 66 90 100 Z" fill={dark ? '#000' : '#fff'} />
      </svg>
      <span className="no-export slot-hint">{label}</span>
    </div>
  );
}

export function PhotoSlot({
  id,
  label,
  style,
  imgStyle,
  fit = 'cover',
  filter,
  placeholder,
  children,
  dark = true,
  fallback,
}: {
  id: string;
  label: string;
  style: CSSProperties;
  /** Image shown (unmovable) while this slot has no photo of its own. */
  fallback?: string;
  imgStyle?: CSSProperties;
  fit?: 'cover' | 'contain';
  filter?: string;
  placeholder?: ReactNode | false;
  children?: ReactNode;
  dark?: boolean;
}) {
  const { state, setSlot, selected, select, pickFile } = useEditor();
  useRegister({ id, kind: 'photo', label });
  const v: ImgVal = { ...IMG_DEFAULT, ...(state.slots[id] ?? {}) };
  const start = useRef(v);
  const { handlers, moved } = useGesture(
    () => (start.current = { ...IMG_DEFAULT, ...(state.slots[id] ?? {}) }),
    (dx, dy) => v.src && setSlot(id, { x: start.current.x + dx, y: start.current.y + dy }),
    (r) => v.src && setSlot(id, { scale: Math.max(0.1, Math.min(8, start.current.scale * r)) }),
  );
  return (
    <div
      data-slot={id}
      className={'slot' + (selected === id ? ' sel' : '')}
      style={{ position: 'absolute', overflow: 'hidden', touchAction: 'none', cursor: v.src ? 'move' : 'pointer', ...style }}
      {...handlers}
      onClick={(e) => {
        e.stopPropagation();
        select(id);
        if (!v.src && !moved.current) pickFile(id);
      }}
    >
      {v.src || fallback ? (
        <img
          src={v.src || fallback}
          draggable={false}
          alt=""
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            objectFit: fit,
            transform: v.src ? `translate(${v.x}px, ${v.y}px) scale(${v.scale}) rotate(${v.rot}deg)` : undefined,
            filter,
            pointerEvents: 'none',
            userSelect: 'none',
            ...imgStyle,
          }}
        />
      ) : placeholder === false ? null : (
        placeholder ?? <Placeholder dark={dark} />
      )}
      {children}
    </div>
  );
}

/** A text label that can be dragged and resized. `fit` squeezes it horizontally like game UIs do. */
export function TextSlot({
  id,
  label,
  def,
  style,
  fit,
  multiline,
}: {
  id: string;
  label: string;
  def: string;
  style: CSSProperties & { fontSize: number };
  fit?: boolean;
  multiline?: boolean;
}) {
  const { state, setSlot, selected, select } = useEditor();
  useRegister({ id, kind: 'text', label, def });
  const v: TxtVal = { ...TXT_DEFAULT, ...(state.slots[id] ?? {}) };
  const text = v.text ?? def;
  const start = useRef(v);
  const { handlers } = useGesture(
    () => (start.current = { ...TXT_DEFAULT, ...(state.slots[id] ?? {}) }),
    (dx, dy) => setSlot(id, { dx: start.current.dx + dx, dy: start.current.dy + dy }),
    (r) => setSlot(id, { size: Math.max(0.2, Math.min(5, start.current.size * r)) }),
  );
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLSpanElement>(null);
  const [sq, setSq] = useState(1);
  useLayoutEffect(() => {
    if (!fit) return;
    const measure = () => {
      if (!outer.current || !inner.current) return;
      const avail = outer.current.clientWidth;
      const need = inner.current.scrollWidth;
      setSq(need > avail && avail > 0 ? avail / need : 1);
    };
    measure();
    document.fonts?.ready.then(measure);
  }, [text, v.size, fit, style.fontSize, style.width]);
  const { transform, ...rest } = style;
  return (
    <div
      ref={outer}
      data-slot={id}
      className={'slot txt' + (selected === id ? ' sel' : '')}
      style={{
        position: 'absolute',
        touchAction: 'none',
        cursor: 'move',
        whiteSpace: multiline ? 'pre-wrap' : 'nowrap',
        lineHeight: 1,
        ...rest,
        fontSize: style.fontSize * v.size,
        color: v.color ?? style.color,
        minWidth: text ? undefined : 160,
        minHeight: text ? undefined : style.fontSize * v.size,
        transform: `translate(${v.dx}px, ${v.dy}px) ${transform ?? ''}`,
      }}
      {...handlers}
      onClick={(e) => {
        e.stopPropagation();
        select(id);
      }}
    >
      {fit ? (
        <span
          ref={inner}
          style={{
            display: 'inline-block',
            transform: `scaleX(${sq})`,
            transformOrigin:
              style.textAlign === 'center' ? 'center' : style.textAlign === 'right' ? 'right' : 'left',
            width: sq < 1 ? undefined : '100%',
          }}
        >
          {text}
        </span>
      ) : (
        text
      )}
    </div>
  );
}

/** A movable overlay (e.g. a jersey) with position, scale and rotation. */
export function Layer({
  id,
  label,
  style,
  children,
}: {
  id: string;
  label: string;
  style: CSSProperties;
  children: ReactNode;
}) {
  const { state, setSlot, selected, select } = useEditor();
  useRegister({ id, kind: 'layer', label });
  const v: LayerVal = { ...LAYER_DEFAULT, ...(state.slots[id] ?? {}) };
  const start = useRef(v);
  const { handlers } = useGesture(
    () => (start.current = { ...LAYER_DEFAULT, ...(state.slots[id] ?? {}) }),
    (dx, dy) => setSlot(id, { x: start.current.x + dx, y: start.current.y + dy }),
    (r) => setSlot(id, { scale: Math.max(0.1, Math.min(6, start.current.scale * r)) }),
  );
  return (
    <div
      className={'slot' + (selected === id ? ' sel' : '')}
      style={{
        position: 'absolute',
        touchAction: 'none',
        cursor: 'move',
        ...style,
        transform: `translate(${v.x}px, ${v.y}px) scale(${v.scale}) rotate(${v.rot}deg)`,
      }}
      {...handlers}
      onClick={(e) => {
        e.stopPropagation();
        select(id);
      }}
    >
      {children}
    </div>
  );
}

/** Wrap built-in background art; hidden when the user supplies their own background image. */
export function Art({ children }: { children: ReactNode }) {
  const { state } = useEditor();
  if (state.opts.__bg) return null;
  return <>{children}</>;
}
