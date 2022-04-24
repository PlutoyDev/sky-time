export function timeFormatter(format: string, unix: number) {
  return format.replaceAll(/%([tTdDfFR]?)/g, (match, f) => `<t:${unix}` + (f ? `:${f}>` : '>'));
}

export function formatter<
  TStrings extends Record<string, string>,
  TEnables extends Record<string, boolean>,
  TFormats extends Record<string, string>,
>(strings: TStrings, enables: TEnables, formats: TFormats) {
  type TArgs = keyof TStrings | [keyof TEnables, string] | [keyof TFormats, number];

  return (str: TemplateStringsArray, ...args: TArgs[]) => {
    let result = '';
    for (let i = 0; i < str.length; i++) {
      const arg = args[i];
      if (typeof arg === 'string') {
        result += str[i] + strings[arg];
      } else if (Array.isArray(arg)) {
        const [key, value] = arg;
        if (typeof key === 'string') {
          if (typeof value === 'string') {
            result += str[i] + (enables[key] ? value : '');
          } else if (typeof value === 'number') {
            result += str[i] + timeFormatter(formats[key], value);
          }
        }
      }
    }
    return result;
  };
}
