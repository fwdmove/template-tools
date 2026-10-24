import type { TabId, TemplateDef } from '../core/ui';
import { chairs, endgame, willReturn } from './marvel';
import { fortnite, lego, mua3, smash, wwe2k15 } from './games';
import { aew, allStar, nbaJersey, wweCover } from './sports';
import { bballCard, pokemon, wweCard } from './cards';

export const TABS: { id: TabId; label: string }[] = [
  { id: 'marvel', label: 'Marvel' },
  { id: 'games', label: 'Video Games' },
  { id: 'sports', label: 'Sports' },
  { id: 'cards', label: 'Cards' },
];

export const TEMPLATES: TemplateDef[] = [
  chairs, endgame, willReturn,
  lego, smash, wwe2k15, fortnite, mua3,
  nbaJersey, aew, allStar, wweCover,
  pokemon, bballCard, wweCard,
];
