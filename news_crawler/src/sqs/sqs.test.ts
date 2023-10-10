import { describe, expect, it } from 'vitest';
import { getSqsDataFromBodyStr } from './index.js';

describe('getSqsDataFromEvent()', () => {
  it('should return data if body is valid', () => {
    const input = '{"keywords":[{"id": 1, "name": "test"}], "news_sources":["1020"]}';
    const expected = {keywords:[{id: 1, name:'test'}], news_sources:['1020']};
    const result = getSqsDataFromBodyStr(input);

    expect(result).toEqual(expected);
  });

  it('return undefined if input is not valid', () => {
    const input = 'invalid';

    const result = getSqsDataFromBodyStr(input);
    
    expect(result).toBeUndefined();
  });

  it('return undefined if some properties are missing', () => {
    const input = '{"news_sources":["1020"]}';

    const result = getSqsDataFromBodyStr(input);

    expect(result).toBeUndefined();
  });
});