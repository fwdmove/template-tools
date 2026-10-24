import type { TabId, TemplateDef } from '../core/ui';
import { chairs, endgame, willReturn } from './marvel';
import { fortnite } from './games';
import { lego, mua3, smash, wwe2k15 } from './rosters';
import { nbaJersey } from './sports';
import { aew, wweCover } from './covers';

export const TABS: { id: TabId; label: string }[] = [
  { id: 'marvel', label: 'Marvel' },
  { id: 'games', label: 'Video Games' },
  { id: 'sports', label: 'Sports' },
];

export const TEMPLATES: TemplateDef[] = [
  chairs, endgame, willReturn,
  lego, smash, wwe2k15, fortnite, mua3,
  nbaJersey, aew, wweCover,
];
