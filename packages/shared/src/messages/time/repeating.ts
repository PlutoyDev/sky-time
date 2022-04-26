import { Lazy } from '@luvies/lazy';
import { add, addMinutes, fromUnixTime, getUnixTime, isAfter, isBefore, startOfDay } from 'date-fns';
import { LaToUtc, utcToLa } from './lib';

const reptStrings = [
  ['title_repeating'],
  ['symbol', '➡️'],
  ['label_ongoing', 'Ongoing: '],
  ['label_upcoming', 'Upcoming: '],
] as const;

const reptEnables = [
  ['show_ongoing', true],
  ['show_upcoming', true],
] as const;

const reptFormats = [
  ['interval', '%t'],
  ['ongoing', '%t (%R)'],
  ['upcoming', '%t (%R)'],
] as const;

export type ReptConfig = {
  strings: Partial<Record<typeof reptStrings[number][0], string>>;
  enables: Partial<Record<typeof reptEnables[number][0], boolean>>;
  formats: Partial<Record<typeof reptFormats[number][0], string>>;
};

export type ReptAdminSetting = {
  defaultTitle: string;
  offset: number;
  interval: number;
  duration: number;
};

export interface IUnixes {
  ongoing?: number;
  upcoming: number;
  occurrences: number[];
}

type calculateResult = {
  unixes: IUnixes;
};

export function calculate(currentTime: number, reptSettings: Omit<ReptAdminSetting, 'defaultTitle'>): calculateResult {
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
  const nextEnd = DateIter.first(date => isAfter(addMinutes(date, duration), now)) as Date;
  const isOngoing = isAfter(nextStart, nextEnd);
  return {
    unixes: {
      ongoing: isOngoing ? getUnixTime(nextEnd) : undefined,
      upcoming: getUnixTime(nextStart),
      occurrences,
    },
  };
}
