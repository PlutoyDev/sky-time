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
  const strings = {
    title: '**__This is a title__**',
    label: 'this is a label',
  };
  const enables = {
    falsy: false,
    truthy: true,
  };
  const formats = {
    now: '%',
    ytd: '%D',
    justNow: '%R',
  };

  const testF = formatter(strings, enables, formats);
  const timeRef = 1598486400;

  it('should be able to parse strings', () => {
    expect(testF`${'title'}`).toBe(strings.title);
    expect(testF`${'label'}`).toBe(strings.label);
  });

  it('should be able to parse enables', () => {
    expect(testF`${['falsy', 'Oops']}`).toBe('');
    expect(testF`${['truthy', 'Good']}`).toBe('Good');
  });

  it('should be able to parse formats', () => {
    expect(testF`${['now', timeRef]}`).toBe(`<t:${timeRef}>`);
    expect(testF`${['ytd', timeRef - 24 * 60 * 60]}`).toBe(`<t:${timeRef - 24 * 60 * 60}:D>`);
    expect(testF`${['justNow', timeRef - 60 * 60]}`).toBe(`<t:${timeRef - 60 * 60}:R>`);
  });
});
