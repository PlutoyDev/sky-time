import { mainFormats } from '../messages/time/main';
import { recurFormats, RecurStringsSettings, RecurTimeSettings } from '../messages/time/recurring';

export type Settings = {
  main: Partial<Record<typeof mainFormats[number][0], number>>;
  recurring: (RecurTimeSettings & RecurStringsSettings & Partial<Record<typeof recurFormats[number][0], number>>)[];
};
