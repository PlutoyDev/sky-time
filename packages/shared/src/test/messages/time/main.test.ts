import { timeFormatter, MainConfig, main, calculateUnixes } from '../../../messages/time/main';

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

// describe('formatter', () => {
//   const strings = {
//     title: '**__This is a title__**',
//     label: 'this is a label',
//   };
//   const enables = {
//     falsy: false,
//     truthy: true,
//   };
//   const formats = {
//     now: '%',
//     ytd: '%D',
//     justNow: '%R',
//   };

//   const testF = formatter(strings, enables, formats);
//   const timeRef = 1598486400;

//   it('should be able to parse strings', () => {
//     expect(testF`${'title'}`).toBe(strings.title);
//     expect(testF`${'label'}`).toBe(strings.label);
//   });

//   it('should be able to parse enables', () => {
//     expect(testF`${['falsy', 'Oops']}`).toBe('');
//     expect(testF`${['truthy', 'Good']}`).toBe('Good');
//     expect(testF`${['falsy', 'label']}`).toBe('');
//     expect(testF`${['truthy', 'label']}`).toBe('this is a label');
//   });

//   it('should be able to parse formats', () => {
//     expect(testF`${['now', timeRef]}`).toBe(`<t:${timeRef}>`);
//     expect(testF`${['ytd', timeRef - 24 * 60 * 60]}`).toBe(`<t:${timeRef - 24 * 60 * 60}:D>`);
//     expect(testF`${['justNow', timeRef - 60 * 60]}`).toBe(`<t:${timeRef - 60 * 60}:R>`);
//   });
// });

describe('calculateUnixes', () => {
  it('should be able to calculate from 1650850349', () => {
    const unixes = calculateUnixes(1650850349);
    expect(unixes.last_update).toBe(1650850349);
    expect(unixes.daily_reset).toBe(1650870000);
    expect(unixes.eden_reset).toBe(1651388400);
    expect(unixes.traveling_spirit_arrival).toBe(1651129200);
    expect(unixes.traveling_spirit_departure).toBe(1651474800);
  });
});

describe('Main', () => {
  const expected = `⏰ **__Main game Timestamps__** Last Updated: <t:1650850349:t> (<t:1650850349:R>)

Daily Reset: <t:1650870000> (<t:1650870000:R>)
Eden Reset: <t:1651388400> (<t:1651388400:R>)

__Traveling Spirit__
Arrival: <t:1651129200> (<t:1651129200:R>)
Departure: <t:1651474800> (<t:1651474800:R>)`;

  const config: MainConfig = {
    strings: {},
    enables: {},
    formats: {},
  };

  const generated = main(config, 1650850349);
  const eLines = expected.split('\n');
  const gLines = generated.split('\n');

  it('should generate the correct number of lines', () => {
    expect(gLines.length).toBe(eLines.length);
  });

  test.each(gLines.map((line, i) => [i, line, eLines[i]]))('Line %d', (i, g, e) => {
    expect(g).toBe(e);
  });
});
