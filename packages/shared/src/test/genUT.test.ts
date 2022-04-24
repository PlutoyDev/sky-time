import { timeFormatter, formatter } from '../messages/time/main';
import { ITimeConfig } from '../model/TimeConfig';

describe('timeFormatter', () => {
  const unixTime = 1598486400;
  test.each([
    ['%', `<t:${unixTime}>`],
    ['%R', `<t:${unixTime}:R>`],
    ['%f (%R)', `<t:${unixTime}:f> (<t:${unixTime}:R>)`],
  ])('Format %s', (input, expected) => {
    expect(timeFormatter(input, unixTime)).toBe(expected);
  });
});

describe('formatter', () => {
});
