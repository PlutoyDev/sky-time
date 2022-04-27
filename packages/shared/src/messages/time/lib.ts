import { getUnixTime } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

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

export function generateMessage<TUnixes extends Record<string, number>, TStrings extends Record<string, string>>(
  timestamps: TUnixes,
  strings: TStrings,
  formats: Record<keyof TUnixes, string>,
) {
  const kUnixes = Object.keys(timestamps) as Array<keyof TUnixes>;
  const kStrings = Object.keys(strings) as Array<keyof TStrings>;

  type TArgs = keyof TStrings | keyof TUnixes | number;

  return (str: TemplateStringsArray, ...args: TArgs[]) => {
    let result = '';
    for (let i = 0; i < str.length; i++) {
      result += str[i];
      const arg = args[i];
      if (typeof arg === 'number') {
        result += arg;
      } else if (typeof arg !== 'string') {
        continue;
      } else if (kStrings.includes(arg)) {
        result += strings[arg];
      } else if (kUnixes.includes(arg)) {
        result += timeFormatter(formats[arg], timestamps[arg]);
      }
    }
    return result;
  };
}
