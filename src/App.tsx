import { useCallback, useEffect, useState } from 'react';
import { Workspace } from './core/Workspace';
import type { TemplateState } from './core/editor';
import type { TabId } from './core/ui';
import { TABS, TEMPLATES } from './templates';

function parseHash(): { tab: TabId; tpl?: string } {
  const [tab, tpl] = location.hash.replace(/^#\/?/, '').split('/');
  return { tab: (TABS.some((t) => t.id === tab) ? tab : 'marvel') as TabId, tpl };
}

const STORE_KEY = 'template-tools:v1';
function load(): Record<string, TemplateState> {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
  } catch {
    return {};
  }
}

export default function App() {
  const [route, setRoute] = useState(parseHash);
  const [all, setAll] = useState<Record<string, TemplateState>>(load);

  useEffect(() => {
    const on = () => setRoute(parseHash());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);

  // Best-effort autosave; big photo sets may not fit, which is fine.
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORE_KEY, JSON.stringify(all));
      } catch {
        try {
          const light = Object.fromEntries(
            Object.entries(all).map(([k, s]) => [
              k,
              {
                opts: Object.fromEntries(Object.entries(s.opts).filter(([, v]) => !(typeof v === 'string' && v.startsWith('data:')))),
                slots: Object.fromEntries(Object.entries(s.slots).map(([id, v]) => [id, { ...v, src: undefined }])),
              },
            ]),
          );
          localStorage.setItem(STORE_KEY, JSON.stringify(light));
        } catch {
          /* ignore */
        }
      }
    }, 600);
    return () => clearTimeout(t);
  }, [all]);

  const def = TEMPLATES.find((t) => t.id === route.tpl);
  const onChange = useCallback(
    (fn: (s: TemplateState) => TemplateState) =>
      setAll((a) => {
        if (!def) return a;
        return { ...a, [def.id]: fn(a[def.id] ?? { slots: {}, opts: {} }) };
      }),
    [def],
  );

  return (
    <div className="app">
      <header className="top">
        <a href={`#/${route.tab}`} className="brand">
          <img src="/icon-192.png" alt="" width={34} height={34} />
          <span>Template Tools</span>
        </a>
        <nav className="tabs">
          {TABS.map((t) => (
            <a key={t.id} href={`#/${t.id}`} className={t.id === route.tab ? 'on' : ''}>
              {t.label}
            </a>
          ))}
        </nav>
      </header>
      {def ? (
        <Workspace def={def} state={all[def.id] ?? { slots: {}, opts: {} }} onChange={onChange} onBack={() => (location.hash = `#/${def.tab}`)} />
      ) : (
        <main className="gallery">
          {TEMPLATES.filter((t) => t.tab === route.tab).map((t) => (
            <a key={t.id} className="card" href={`#/${t.tab}/${t.id}`}>
              <div className="card-art" style={{ background: t.thumb.bg }}>
                <span>{t.thumb.emoji}</span>
              </div>
              <div className="card-body">
                <h3>{t.title}</h3>
                <p>{t.blurb}</p>
              </div>
            </a>
          ))}
        </main>
      )}
    </div>
  );
}
