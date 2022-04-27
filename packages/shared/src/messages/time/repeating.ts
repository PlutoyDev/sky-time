import { Lazy } from '@luvies/lazy';
import { add, addMinutes, fromUnixTime, getUnixTime, isAfter, isBefore, startOfDay } from 'date-fns';
import { LaToUtc, timeFormatter, utcToLa } from './lib';

const reptStrings = [
  ['title_repeating'],
  ['separator', '➡️'],
  ['label_ongoing', 'Ongoing until: '],
  ['label_upcoming', 'Upcoming: '],
] as const;

const reptEnables = [
  ['show_ongoing', true],
  ['show_upcoming', true],
] as const;

const reptFormats = [
  ['occurrence', '%t'],
  ['ongoing', '%t (%R)'],
  ['upcoming', '%t (%R)'],
] as const;

export type ReptConfig = {
  strings: Partial<Record<typeof reptStrings[number][0], string>>;
  enables: Partial<Record<typeof reptEnables[number][0], boolean>>;
  formats: Partial<Record<typeof reptFormats[number][0], string>>;
};

export type ReptTimeSettings = {
  offset: number;
  interval: number;
  duration: number;
};

export type ReptStringsSettings = {
  defaultTitle: string;
  credits: string;
};

export interface IUnixes {
  ongoing?: number;
  upcoming: number;
  occurrences: number[];
}

type calculateResult = {
  unixes: IUnixes;
};

export function calculate(currentTime: number, reptSettings: ReptTimeSettings): calculateResult {
  const now = fromUnixTime(currentTime);
  const today = LaToUtc(startOfDay(utcToLa(now)));
  const daily_reset = add(today, { days: 1 });
  //Generate future occurrence
  const { offset, interval, duration } = reptSettings;
  const count = Math.floor(1440 / interval) + 1;
  const start = addMinutes(today, offset);
  const DateIter = Lazy.range(0, count).select(i => addMinutes(start, i * interval));
  const occurrences = DateIter.takeWhile(date => isBefore(date, daily_reset))
    .select(getUnixTime)
    .toArray();
  const nextStart = DateIter.first(date => isAfter(date, now)) as Date;
  const nextEnd = DateIter.select(date => addMinutes(date, duration)).first(date => isAfter(date, now)) as Date;
  const isOngoing = isAfter(nextStart, nextEnd);
  return {
    unixes: {
      ongoing: isOngoing ? getUnixTime(nextEnd) : undefined,
      upcoming: getUnixTime(nextStart),
      occurrences,
    },
  };
}

export function repeating(config: ReptConfig, unixes: IUnixes, settings: ReptStringsSettings): string {
  const strings = Object.fromEntries(
    reptStrings.map(([key, defaults]) => [
      key,
      config.strings[key] ?? key === 'title_repeating' ? settings.defaultTitle : defaults,
    ]),
  ) as Record<typeof reptStrings[number][0], string>;

  const enables = Object.fromEntries(
    reptEnables.map(([key, defaults]) => [key, config.enables[key] ?? defaults]),
  ) as Record<typeof reptEnables[number][0], boolean>;

  const formats = Object.fromEntries(
    reptFormats.map(([key, defaults]) => [key, config.formats[key] ?? defaults]),
  ) as Record<typeof reptFormats[number][0], string>;

  const { ongoing, upcoming, occurrences } = unixes;

  let message = `${strings.title_repeating} (${settings.credits})\n`;

  message += occurrences.reduce((m, u, i) => {
    if (i !== 0) m += strings.separator;
    return m + timeFormatter(formats.occurrence, u);
  }, '');

  if (enables.show_ongoing && ongoing) {
    message += `\n${strings.label_ongoing}${timeFormatter(formats.ongoing, ongoing)}`;
  }

  if (enables.show_upcoming) {
    message += `\n${strings.label_upcoming}${timeFormatter(formats.upcoming, upcoming)}`;
  }

  return message;
}
