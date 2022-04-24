export function timeFormatter(format: string, unix: number) {
}

export function formatter<
  TStrings extends Record<string, string>,
  TEnables extends Record<string, boolean>,
  TFormats extends Record<string, string>,
>(strings: TStrings, enables: TEnables, formats: TFormats) {
  type TArgs = keyof TStrings | [keyof TEnables, string] | [keyof TFormats, number];

  return (str: TemplateStringsArray, ...args: TArgs[]) => {
  };
}
