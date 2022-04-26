import { MainConfig, main, calculate } from '../../../messages/time/main';

describe('calculate', () => {
  it('should be able to calculate from 1650850349', () => {
    const { unixes, traveling_spirit_number } = calculate(1650850349);
    expect(unixes.last_update).toBe(1650850349);
    expect(unixes.daily_reset).toBe(1650870000);
    expect(unixes.eden_reset).toBe(1651388400);
    expect(unixes.traveling_spirit_arrival).toBe(1651129200);
    expect(unixes.traveling_spirit_departure).toBe(1651474800);
    expect(traveling_spirit_number).toBe(60);
  });
});

describe('Main', () => {
  const expected = `⏰ **__Main game Timestamps__** Last Updated: <t:1650850349:t> (<t:1650850349:R>)
Daily Reset: <t:1650870000> (<t:1650870000:R>)
Eden Reset: <t:1651388400> (<t:1651388400:R>)

__Traveling Spirit__ (60)
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
