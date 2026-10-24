import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getFontEmbedCSS, toPng } from 'html-to-image';
import { EditorProvider, useEditor, IMG_DEFAULT, TXT_DEFAULT, LAYER_DEFAULT, type TemplateState } from './editor';
import { Field, OptImage, type TemplateDef } from './ui';

const isApple = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent) && 'ontouchend' in document;
const isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent);

function StageView({ def, stageRef }: { def: TemplateDef; stageRef: React.RefObject<HTMLDivElement | null> }) {
  const { state, select, scaleRef } = useEditor();
  const [w, h] = def.size(state.opts);
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.4);
  useLayoutEffect(() => {
    const el = box.current!;
    const calc = () => {
      const cw = el.clientWidth;
      const maxH = window.innerWidth > 900 ? window.innerHeight - 130 : window.innerHeight * 0.62;
      const s = Math.min(cw / w, maxH / h);
      scaleRef.current = s;
      setScale(s);
    };
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    window.addEventListener('resize', calc);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', calc);
    };
  }, [w, h, scaleRef]);
  const Render = def.Render;
  return (
    <div ref={box} className="stage-box" onClick={() => select(null)}>
      <div style={{ width: w * scale, height: h * scale, position: 'relative', margin: '0 auto' }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: '0 0', position: 'absolute', left: 0, top: 0 }}>
          <div ref={stageRef} className={'stage' + (state.opts.__bg ? ' has-bg' : '')} style={{ width: w, height: h }}>
            {state.opts.__bg && (
              <img
                src={state.opts.__bg}
                alt=""
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
            <Render />
          </div>
        </div>
      </div>
    </div>
  );
}

function SelectedPanel() {
  const { selected, metas, state, setSlot, select, pickFile } = useEditor();
  const m = metas.find((x) => x.id === selected);
  if (!m) return <p className="hint">Tap any photo spot or name on the template to edit it. Drag to move. Pinch or use the sliders to resize.</p>;
  const v = state.slots[m.id] ?? {};
  return (
    <div className="panel sel-panel">
      <div className="panel-head">
        <strong>{m.label}</strong>
        <button className="ghost" onClick={() => select(null)}>
          Done
        </button>
      </div>
      {m.kind === 'photo' && (
        <>
          <div className="row">
            <button onClick={() => pickFile(m.id)}>{v.src ? 'Replace photo' : 'Add photo'}</button>
            {v.src && (
              <button className="ghost" onClick={() => setSlot(m.id, { src: undefined })}>
                Remove
              </button>
            )}
          </div>
          {v.src && (
            <>
              <Field label={`Size: ${Math.round((v.scale ?? 1) * 100)}%`}>
                <input type="range" min={0.1} max={5} step={0.01} value={v.scale ?? 1} onChange={(e) => setSlot(m.id, { scale: +e.target.value })} />
              </Field>
              <Field label={`Rotate: ${Math.round(v.rot ?? 0)}°`}>
                <input type="range" min={-180} max={180} step={1} value={v.rot ?? 0} onChange={(e) => setSlot(m.id, { rot: +e.target.value })} />
              </Field>
              <Field label="Left / right">
                <input type="range" min={-1500} max={1500} step={1} value={v.x ?? 0} onChange={(e) => setSlot(m.id, { x: +e.target.value })} />
              </Field>
              <Field label="Up / down">
                <input type="range" min={-1500} max={1500} step={1} value={v.y ?? 0} onChange={(e) => setSlot(m.id, { y: +e.target.value })} />
              </Field>
              <button className="ghost" onClick={() => setSlot(m.id, { ...IMG_DEFAULT })}>
                Reset position &amp; size
              </button>
            </>
          )}
        </>
      )}
      {m.kind === 'text' && (
        <>
          <Field label="Text">
            <textarea rows={2} value={v.text ?? m.def ?? ''} onChange={(e) => setSlot(m.id, { text: e.target.value })} />
          </Field>
          <Field label={`Size: ${Math.round((v.size ?? 1) * 100)}%`}>
            <input type="range" min={0.2} max={4} step={0.01} value={v.size ?? 1} onChange={(e) => setSlot(m.id, { size: +e.target.value })} />
          </Field>
          <Field label="Left / right">
            <input type="range" min={-1500} max={1500} step={1} value={v.dx ?? 0} onChange={(e) => setSlot(m.id, { dx: +e.target.value })} />
          </Field>
          <Field label="Up / down">
            <input type="range" min={-1500} max={1500} step={1} value={v.dy ?? 0} onChange={(e) => setSlot(m.id, { dy: +e.target.value })} />
          </Field>
          <div className="row">
            <Field label="Color">
              <input type="color" value={v.color ?? '#ffffff'} onChange={(e) => setSlot(m.id, { color: e.target.value })} />
            </Field>
            {v.color && (
              <button className="ghost" onClick={() => setSlot(m.id, { color: undefined })}>
                Original color
              </button>
            )}
          </div>
          <button className="ghost" onClick={() => setSlot(m.id, { ...TXT_DEFAULT })}>
            Reset position &amp; size
          </button>
        </>
      )}
      {m.kind === 'layer' && (
        <>
          <Field label="Left / right">
            <input type="range" min={-1500} max={1500} step={1} value={v.x ?? 0} onChange={(e) => setSlot(m.id, { x: +e.target.value })} />
          </Field>
          <Field label="Up / down">
            <input type="range" min={-1500} max={1500} step={1} value={v.y ?? 0} onChange={(e) => setSlot(m.id, { y: +e.target.value })} />
          </Field>
          <Field label={`Size: ${Math.round((v.scale ?? 1) * 100)}%`}>
            <input type="range" min={0.1} max={4} step={0.01} value={v.scale ?? 1} onChange={(e) => setSlot(m.id, { scale: +e.target.value })} />
          </Field>
          <Field label={`Rotate: ${Math.round(v.rot ?? 0)}°`}>
            <input type="range" min={-180} max={180} step={1} value={v.rot ?? 0} onChange={(e) => setSlot(m.id, { rot: +e.target.value })} />
          </Field>
          <button className="ghost" onClick={() => setSlot(m.id, { ...LAYER_DEFAULT })}>
            Reset position &amp; size
          </button>
        </>
      )}
    </div>
  );
}

function SlotList() {
  const { metas, state, setSlot, select, selected, pickFile } = useEditor();
  const photos = metas.filter((m) => m.kind === 'photo');
  const texts = metas.filter((m) => m.kind === 'text');
  const layers = metas.filter((m) => m.kind === 'layer');
  return (
    <>
      {layers.map((m) => (
        <button key={m.id} className={selected === m.id ? 'on' : ''} onClick={() => select(m.id)}>
          Adjust: {m.label}
        </button>
      ))}
      {texts.length > 0 && (
        <details className="panel" open={texts.length <= 14}>
          <summary>Names &amp; text ({texts.length})</summary>
          <div className="list">
            {texts.map((m) => (
              <input
                key={m.id}
                className={selected === m.id ? 'on' : ''}
                aria-label={m.label}
                placeholder={m.label}
                value={state.slots[m.id]?.text ?? m.def ?? ''}
                onFocus={() => select(m.id)}
                onChange={(e) => setSlot(m.id, { text: e.target.value })}
              />
            ))}
          </div>
        </details>
      )}
      {photos.length > 0 && (
        <details className="panel" open={photos.length <= 14}>
          <summary>Photos ({photos.length})</summary>
          <div className="thumbs">
            {photos.map((m) => {
              const src = state.slots[m.id]?.src;
              return (
                <button
                  key={m.id}
                  title={m.label}
                  className={'thumb' + (selected === m.id ? ' on' : '')}
                  onClick={() => {
                    select(m.id);
                    if (!src) pickFile(m.id);
                  }}
                >
                  {src ? <img src={src} alt="" /> : <span>+</span>}
                  <small>{m.label}</small>
                </button>
              );
            })}
          </div>
        </details>
      )}
    </>
  );
}

function ExportModal({ url, name, onClose }: { url: string; name: string; onClose: () => void }) {
  const [msg, setMsg] = useState('');
  // Build the file up front so the share sheet opens straight from the tap (iOS rejects it after an await).
  const [file, setFile] = useState<File | null>(null);
  useEffect(() => {
    fetch(url)
      .then((r) => r.blob())
      .then((b) => setFile(new File([b], name, { type: 'image/png' })));
  }, [url, name]);
  const download = () => {
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
  };
  const share = async () => {
    try {
      if (file && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file] });
        setMsg('Choose “Save Image” to put it in Photos.');
      } else {
        download();
        setMsg('Downloaded. Sharing to Photos isn’t supported in this browser.');
      }
    } catch (e: any) {
      if (e?.name !== 'AbortError') {
        download();
      }
    }
  };
  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <img src={url} alt="Your finished image" />
        <div className="row">
          <button className="primary" onClick={share}>
            Save to Photos
          </button>
          <button onClick={download}>Download PNG</button>
          <button className="ghost" onClick={onClose}>
            Close
          </button>
        </div>
        <p className="hint">{msg || (isApple ? 'Tip: you can also press and hold the picture and tap “Save to Photos”.' : 'Saves a full-resolution PNG.')}</p>
      </div>
    </div>
  );
}

function Inner({ def, onBack, onReset }: { def: TemplateDef; onBack: () => void; onReset: () => void }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const { state, select } = useEditor();
  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState<string | null>(null);
  const Controls = def.Controls;
  const [w, h] = def.size(state.opts);

  const exportImg = async () => {
    const node = stageRef.current;
    if (!node) return;
    setBusy(true);
    select(null);
    node.classList.add('exporting');
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    try {
      await document.fonts.ready;
      // Embed fonts once per save instead of once per render pass.
      const opts = {
        fontEmbedCSS: await getFontEmbedCSS(node),
        width: w,
        height: h,
        pixelRatio: 1,
        filter: (n: HTMLElement) => !n.classList?.contains('no-export'),
      };
      // Safari often drops images on the first pass; a warm-up render fixes it.
      if (isSafari || isApple) await toPng(node, opts);
      const url = await toPng(node, opts);
      setOut(url);
    } catch (e) {
      alert('Sorry, the image could not be created. ' + (e as Error).message);
    } finally {
      node.classList.remove('exporting');
      setBusy(false);
    }
  };

  return (
    <div className="ws">
      <div className="stage-col">
        <div className="toolbar">
          <button className="ghost" onClick={onBack}>
            ← Back
          </button>
          <h2>{def.title}</h2>
          <button className="primary" onClick={exportImg} disabled={busy}>
            {busy ? 'Saving…' : 'Save image'}
          </button>
        </div>
        <StageView def={def} stageRef={stageRef} />
      </div>
      <aside className="inspector">
        <SelectedPanel />
        {Controls && (
          <div className="panel">
            <div className="panel-head">
              <strong>Template options</strong>
            </div>
            <Controls />
          </div>
        )}
        <SlotList />
        {def.allowBg && (
          <div className="panel">
            <OptImage k="__bg" label="Custom background (optional: use a screenshot of the real screen)" />
          </div>
        )}
        <button
          className="ghost danger"
          onClick={() => {
            if (confirm('Clear everything on this template?')) onReset();
          }}
        >
          Start over
        </button>
      </aside>
      {out && <ExportModal url={out} name={`${def.id}.png`} onClose={() => setOut(null)} />}
    </div>
  );
}

export function Workspace({
  def,
  state,
  onChange,
  onBack,
}: {
  def: TemplateDef;
  state: TemplateState;
  onChange: (fn: (s: TemplateState) => TemplateState) => void;
  onBack: () => void;
}) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [def.id]);
  return (
    <EditorProvider key={def.id} state={state} onChange={onChange}>
      <Inner def={def} onBack={onBack} onReset={() => onChange(() => ({ slots: {}, opts: {} }))} />
    </EditorProvider>
  );
}
