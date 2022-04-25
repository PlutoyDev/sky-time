import { add, addDays, differenceInDays, nextSunday, startOfDay, sub, getUnixTime, fromUnixTime } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';
import { ITimeConfig } from '../../model/TimeConfig';

const tsPivotDate = new Date(2022, 0, 10);
const tsPivotNum = 52;

const mainStrings = [
  ['title_main', '⏰ **__Main game Timestamps__**'],
  ['label_last_update', 'Last Updated:'],
  ['label_daily_reset', 'Daily Reset: '],
  ['label_eden_reset', 'Eden Reset: '],
  ['title_traveling_spirit', '__Traveling Spirit__'],
  ['label_traveling_spirit_arrival', 'Arrival: '],
  ['label_traveling_spirit_departure', 'Departure: '],
] as const;

const mainEnables = [
  ['show_last_update', true],
  ['show_traveling_spirit_number', true],
  ['show_promotion', true],
] as const;

const mainFormats = [
  ['last_update', '%t (%R)'],
  ['daily_reset', '%f (%R)'],
  ['eden_reset', '%f (%R)'],
  ['traveling_spirit_arrival', '%f (%R)'],
  ['traveling_spirit_departure', '%f (%R)'],
] as const;
export function timeFormatter(format: string, unix: number) {
  return format.replaceAll(/%([tTdDfFR]?)/g, (match, f) => `<t:${unix}` + (f ? `:${f}>` : '>'));
}

export function formatter<
  TStrings extends Record<string, string>,
  TEnables extends Record<string, boolean>,
  TFormats extends Record<string, string>,
>(strings: TStrings, enables: TEnables, formats: TFormats) {
  type TArgs =
    | keyof TStrings
    | [keyof TFormats, number]
    | [keyof TEnables, keyof TStrings | [keyof TFormats, number] | string];

  const kStrings = Object.keys(strings) as Array<keyof TStrings>;
  const kEnables = Object.keys(enables) as Array<keyof TEnables>;
  const kFormats = Object.keys(formats) as Array<keyof TFormats>;

  return (str: TemplateStringsArray, ...args: TArgs[]) => {
    let result = '';
    for (let i = 0; i < str.length; i++) {
      const arg = args[i];
      if (typeof arg === 'string') {
        result += str[i] + strings[arg];
      } else if (Array.isArray(arg)) {
        const [key, value] = arg;
        if (typeof key === 'string') {
          if (kFormats.includes(key)) {
            result += str[i] + timeFormatter(formats[key], value as number);
          }
          if (kEnables.includes(key)) {
            if (enables[key]) {
              if (typeof value === 'string') {
                if (kStrings.includes(value)) {
                  result += str[i] + strings[value];
                } else {
                  result += str[i] + value;
                }
              } else if (Array.isArray(value) && value) {
                const [key2, value2] = value;
                if (typeof key2 === 'string') {
                  if (kFormats.includes(key2)) {
                    result += str[i] + timeFormatter(formats[key2], value2);
                  }
                }
              }
            }
          }
        }
      }
    }
    return result;
  };
}

export function generateMessage<TUnixes extends Record<string, number>, TStrings extends Record<string, string>>(
  timestamps: TUnixes,
  strings: TStrings,
  formats: Record<keyof TUnixes, string>,
) {
  const kUnixes = Object.keys(timestamps) as Array<keyof TUnixes>;
  const kStrings = Object.keys(strings) as Array<keyof TStrings>;

  type TArgs = keyof TStrings | keyof TUnixes;

  return (str: TemplateStringsArray, ...args: TArgs[]) => {
    let result = '';
    for (let i = 0; i < str.length; i++) {
      const arg = args[i];
      if (typeof arg !== 'string') {
        continue;
      } else if (kStrings.includes(arg)) {
        result += str[i] + strings[arg];
      } else if (kUnixes.includes(arg)) {
        result += str[i] + timeFormatter(formats[arg], timestamps[arg]);
      }
    }
    return result;
  };
}

export function skyToUnix(date: Date) {
  return getUnixTime(zonedTimeToUtc(date, 'America/Los_Angeles'));
}

export function calculateUnixes(currentTime: number): Record<typeof mainFormats[number][0], number> {
  const now = utcToZonedTime(fromUnixTime(currentTime), 'America/Los_Angeles');
  const today = startOfDay(now);
  const daily_reset = add(today, { days: 1 });
  const eden_reset = nextSunday(today);
  const traveling_spirit_departure = addDays(today, 14 - (differenceInDays(today, tsPivotDate) % 14));
  const traveling_spirit_arrival = sub(traveling_spirit_departure, { days: 4 });

  return {
    last_update: currentTime,
    daily_reset: skyToUnix(daily_reset),
    eden_reset: skyToUnix(eden_reset),
    traveling_spirit_arrival: skyToUnix(traveling_spirit_arrival),
    traveling_spirit_departure: skyToUnix(traveling_spirit_departure),
  };
}
