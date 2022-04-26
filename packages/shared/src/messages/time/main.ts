import { add, addDays, differenceInDays, fromUnixTime, nextSunday, startOfDay, sub } from 'date-fns';
import { LaToUnix, timeFormatter, utcToLa } from './lib';

const tsPivotDate = new Date(2022, 0, 10);
const tsPivotNum = 52;

const mainStrings = [
  ['title_main', '⏰ **__Main game Timestamps__**'],
  ['label_last_update', 'Last Updated: '],
  ['label_daily_reset', 'Daily Reset: '],
  ['label_eden_reset', 'Eden Reset: '],
  ['title_traveling_spirit', '__Traveling Spirit__'],
  ['label_traveling_spirit_arrival', 'Arrival: '],
  ['label_traveling_spirit_departure', 'Departure: '],
] as const;

const mainEnables = [
  ['show_last_update', true],
  ['show_promotion', true],
] as const;

const mainFormats = [
  ['last_update', '%t (%R)'],
  ['daily_reset', '% (%R)'],
  ['eden_reset', '% (%R)'],
  ['traveling_spirit_arrival', '% (%R)'],
  ['traveling_spirit_departure', '% (%R)'],
] as const;

export type MainConfig = {
  strings: Partial<Record<typeof mainStrings[number][0], string>>;
  enables: Partial<Record<typeof mainEnables[number][0], boolean>>;
  formats: Partial<Record<typeof mainFormats[number][0], string>>;
};

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

type calculateResult = {
  unixes: Record<typeof mainFormats[number][0], number>;
  traveling_spirit_number: number;
};

export function calculate(currentTime: number): calculateResult {
  const now = utcToLa(fromUnixTime(currentTime));
  const today = startOfDay(now);
  const daily_reset = add(today, { days: 1 });
  const eden_reset = nextSunday(today);
  const traveling_spirit_departure = addDays(today, 14 - (differenceInDays(today, tsPivotDate) % 14));
  const traveling_spirit_arrival = sub(traveling_spirit_departure, { days: 4 });
  const traveling_spirit_number =
    Math.floor(differenceInDays(traveling_spirit_departure, tsPivotDate) / 14) + tsPivotNum;

  return {
    unixes: {
      last_update: currentTime,
      daily_reset: LaToUnix(daily_reset),
      eden_reset: LaToUnix(eden_reset),
      traveling_spirit_arrival: LaToUnix(traveling_spirit_arrival),
      traveling_spirit_departure: LaToUnix(traveling_spirit_departure),
    },
    traveling_spirit_number,
  };
}

export function main(config: MainConfig, currentTime: number): string {
  const strings = Object.fromEntries(
    mainStrings.map(([key, defaults]) => [key, config.strings[key] ?? defaults]),
  ) as Record<typeof mainStrings[number][0], string>;

  const enables = Object.fromEntries(
    mainEnables.map(([key, defaults]) => [key, config.enables[key] ?? defaults]),
  ) as Record<typeof mainEnables[number][0], boolean>;

  const formats = Object.fromEntries(
    mainFormats.map(([key, defaults]) => [key, config.formats[key] ?? defaults]),
  ) as Record<typeof mainFormats[number][0], string>;

  const { unixes, traveling_spirit_number } = calculate(currentTime);

  const generator = generateMessage(unixes, strings, formats);

  let message = generator`${'title_main'}`;

  if (enables.show_last_update) {
    message += generator` ${'label_last_update'}${'last_update'}`;
  }

  message += generator`
${'label_daily_reset'}${'daily_reset'}
${'label_eden_reset'}${'eden_reset'}

${'title_traveling_spirit'} (${traveling_spirit_number})
${'label_traveling_spirit_arrival'}${'traveling_spirit_arrival'}
${'label_traveling_spirit_departure'}${'traveling_spirit_departure'}`;

  return message;
}
