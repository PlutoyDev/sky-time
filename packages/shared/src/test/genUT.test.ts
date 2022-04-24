import { timeFormatter, formatter } from '../messages/time/main';
import { ITimeConfig } from '../model/TimeConfig';

describe('timeFormatter', () => {
  const unixTime = 1598486400;
  test.each([
    ['%', `<t:${unixTime}>`],
    ['%t', `<t:${unixTime}:t>`],
    ['%T', `<t:${unixTime}:T>`],
    ['%d', `<t:${unixTime}:d>`],
    ['%D', `<t:${unixTime}:D>`],
    ['%f', `<t:${unixTime}:f>`],
    ['%F', `<t:${unixTime}:F>`],
    ['%R', `<t:${unixTime}:R>`],
    ['%t (%R)', `<t:${unixTime}:t> (<t:${unixTime}:R>)`],
    ['% (%R)', `<t:${unixTime}> (<t:${unixTime}:R>)`],
    ['%f (%R)', `<t:${unixTime}:f> (<t:${unixTime}:R>)`],
  ])('Format %s', (input, expected) => {
    expect(timeFormatter(input, unixTime)).toBe(expected);
  });
});

describe('formatter', () => {
});
