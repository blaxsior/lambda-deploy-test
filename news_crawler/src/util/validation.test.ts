import { describe, expect, it } from 'vitest';
import {readFile} from 'fs/promises';
import {resolve} from 'path';
import { validateNewsCommentsObj } from './validation';

describe('validateNewsCommentsObj()', () => {
  it('should return true if data is valid', async () => {
    const content = await readFile(resolve('src','util','test.json'));
    const input = JSON.parse(content.toString('utf-8'));

    const result =  validateNewsCommentsObj(input);

    expect(result).toEqual(true);
  });

  it('should return true if data is valid(morePage X)', async () => {
    const content = await readFile(resolve('src','util','test2.json'));
    const input = JSON.parse(content.toString('utf-8'));

    const result =  validateNewsCommentsObj(input);

    expect(result).toEqual(true);
  });
});