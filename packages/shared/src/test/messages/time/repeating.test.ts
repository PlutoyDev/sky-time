import {
  calculate,
  repeating,
  ReptConfig,
  ReptStringsSettings,
  ReptTimeSettings,
} from '../../../messages/time/repeating';

describe('calculate', () => {
  it('should be able to calculate from 1650970205', () => {
    const { unixes } = calculate(1650970205, {
      offset: 5,
      interval: 120,
      duration: 10,
    });
    expect(unixes.ongoing).toBeUndefined();
    expect(unixes.upcoming).toBe(1650971100);
    for (let i = 0; i < 12; i++) {
      expect(unixes.occurrences[i]).toBe(1650956700 + i * 120 * 60);
    }
  });

  it('should be able to calculate from 1651016405', () => {
    const { unixes } = calculate(1651016405, {
      offset: 35,
      interval: 120,
      duration: 10,
    });
    expect(unixes.ongoing).toBe(1651016700);
    expect(unixes.upcoming).toBe(1651023300);
    for (let i = 0; i < 12; i++) {
      expect(unixes.occurrences[i]).toBe(1650958500 + i * 120 * 60);
    }
  });
});

describe('repeating', () => {
  const expected = `**__Current Timestamps for Forest Grandma Dinner Wax__** (by <@281091553269645312>)
<t:1650958500:t>➡️<t:1650965700:t>➡️<t:1650972900:t>➡️<t:1650980100:t>➡️<t:1650987300:t>➡️<t:1650994500:t>➡️<t:1651001700:t>➡️<t:1651008900:t>➡️<t:1651016100:t>➡️<t:1651023300:t>➡️<t:1651030500:t>➡️<t:1651037700:t>
Ongoing until: <t:1651016700:t> (<t:1651016700:R>)
Upcoming: <t:1651023300:t> (<t:1651023300:R>)`;

  const config: ReptConfig = {
    strings: {},
    enables: {},
    formats: {},
  };

  const settings: ReptStringsSettings & ReptTimeSettings = {
    defaultTitle: '**__Current Timestamps for Forest Grandma Dinner Wax__**',
    credits: 'by <@281091553269645312>',
    offset: 35,
    interval: 120,
    duration: 10,
  };

  const result = calculate(1651016405, settings);
  const generated = repeating(config, result.unixes, settings);
  const eLines = expected.split('\n');
  const gLines = generated.split('\n');

  it('should generate the correct number of lines', () => {
    expect(gLines.length).toBe(eLines.length);
  });

  test.each(gLines.map((line, i) => [i, line, eLines[i]]))('Line %d', (i, g, e) => {
    expect(g).toBe(e);
  });
});
