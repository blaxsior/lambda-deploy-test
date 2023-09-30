import { describe, expect, it, vi } from 'vitest';
import { setTimeout } from 'timers/promises';
import { withRetry } from './retry';

vi.mock('timers/promises');

describe('withRetry()', () => {
  const retryOptions = { retry: 3, waitTime: 0 }; // 기본 옵션

  it('works well if there is no error', async () => {
    const input_function = async () => Promise.resolve();

    const action = withRetry(input_function, retryOptions);
    await expect(action).resolves.not.toThrow();
  });

  it('throw error if error happened over "retry" times(3)', async () => {
    const input_function = async () => Promise.reject();
    const retry_count = retryOptions.retry;

    const action = withRetry(input_function, retryOptions);

    await expect(action).rejects.toThrow();
    expect(setTimeout).toBeCalledTimes(retry_count);
  });
});