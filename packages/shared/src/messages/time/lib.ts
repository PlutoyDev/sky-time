import { getUnixTime } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';

export function timeFormatter(format: string, unix: number) {
  return format.replaceAll(/%([tTdDfFR]?)/g, (match, f) => `<t:${unix}` + (f ? `:${f}>` : '>'));
}

export function LaToUtc(date: Date) {
  return zonedTimeToUtc(date, 'America/Los_Angeles');
}

export function utcToLa(date: Date) {
  return utcToZonedTime(date, 'America/Los_Angeles');
}

export function LaToUnix(date: Date) {
  return getUnixTime(LaToUtc(date));
}
