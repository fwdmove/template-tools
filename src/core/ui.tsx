import type { FC, ReactNode } from 'react';
import { useEditor, useOpt } from './editor';

export type TabId = 'marvel' | 'games' | 'sports';

export interface TemplateDef {
  id: string;
  tab: TabId;
  title: string;
  blurb: string;
  /** Canvas size; may depend on the template's options. */
  size: (opts: Record<string, any>) => [number, number];
  Render: FC;
  Controls?: FC;
  /** Show the "use your own background screenshot" option. */
  allowBg?: boolean;
  thumb: { bg: string; emoji: string; img?: string };
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function OptSelect({
  k,
  label,
  def,
  options,
}: {
  k: string;
  label: string;
  def: string;
  options: (string | [string, string])[];
}) {
  const [v, set] = useOpt(k, def);
  return (
    <Field label={label}>
      <select value={v} onChange={(e) => set(e.target.value)}>
        {options.map((o) => {
          const [val, text] = Array.isArray(o) ? o : [o, o];
          return (
            <option key={val} value={val}>
              {text}
            </option>
          );
        })}
      </select>
    </Field>
  );
}

export function OptNum({ k, label, def, min, max, step = 1 }: { k: string; label: string; def: number; min: number; max: number; step?: number }) {
  const [v, set] = useOpt(k, def);
  return (
    <Field label={`${label}: ${v}`}>
      <input type="range" min={min} max={max} step={step} value={v} onChange={(e) => set(Number(e.target.value))} />
    </Field>
  );
}

export function OptText({ k, label, def, area }: { k: string; label: string; def: string; area?: boolean }) {
  const [v, set] = useOpt(k, def);
  return (
    <Field label={label}>
      {area ? (
        <textarea rows={3} value={v} onChange={(e) => set(e.target.value)} />
      ) : (
        <input value={v} onChange={(e) => set(e.target.value)} />
      )}
    </Field>
  );
}

export function OptColor({ k, label, def }: { k: string; label: string; def: string }) {
  const [v, set] = useOpt(k, def);
  return (
    <Field label={label}>
      <input type="color" value={v} onChange={(e) => set(e.target.value)} />
    </Field>
  );
}

export function OptToggle({ k, label, def }: { k: string; label: string; def: boolean }) {
  const [v, set] = useOpt(k, def);
  return (
    <label className="toggle">
      <input type="checkbox" checked={v} onChange={(e) => set(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

export function OptImage({ k, label }: { k: string; label: string }) {
  const { pickFile, state, setOpt } = useEditor();
  const v = state.opts[k];
  return (
    <Field label={label}>
      <div className="row">
        <button type="button" onClick={() => pickFile('opt:' + k)}>
          {v ? 'Replace image' : 'Upload image'}
        </button>
        {v && (
          <button type="button" className="ghost" onClick={() => setOpt(k, undefined)}>
            Remove
          </button>
        )}
      </div>
    </Field>
  );
}
