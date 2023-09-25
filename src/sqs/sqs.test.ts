import { describe, expect, it } from 'vitest';
import { getSqsDataFromBodyStr } from '.';

describe('getSqsDataFromEvent()', () => {
  it('should return data if body is valid', () => {
    const input = '{"keywords":["test"], "news_sources":["1020"]}';
    const expected = {keywords:['test'], news_sources:['1020']};

    const result = getSqsDataFromBodyStr(input);
  
    expect(result).toEqual(expected);
  });

  it('throw error if input is not valid', () => {
    const input = 'invalid';

    const action = () => {getSqsDataFromBodyStr(input)};
    expect(action).toThrowError();
  });

  it('throw error if some properties are missing', () => {
    const input1 = '{"news_sources":["1020"]}';
    const input2 = '{"keywords":["test"]}';

    const action1 = () => {getSqsDataFromBodyStr(input1)};
    const action2 = () => {getSqsDataFromBodyStr(input1)};
 
    expect(action1).toThrowError();
    expect(action2).toThrowError();
  });
});