import { describe, expect, it, vi } from 'vitest';
import { createMutationQueue } from './mutation-queue';

const deferred = () => {
  let resolve!: (value: string) => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<string>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
};

describe('createMutationQueue', () => {
  it('holds the second call until the first settles', async () => {
    const enqueue = createMutationQueue();
    const first = deferred();
    const second = vi.fn(async () => 'second');

    const firstResult = enqueue(() => first.promise);
    const secondResult = enqueue(second);

    expect(second).not.toHaveBeenCalled();

    first.resolve('first');
    await firstResult;
    await secondResult;

    expect(second).toHaveBeenCalledOnce();
  });

  it('keeps draining after a rejection instead of wedging the queue', async () => {
    const enqueue = createMutationQueue();
    const second = vi.fn(async () => 'second');

    const failing = enqueue(async () => {
      throw new Error('409');
    });

    await expect(failing).rejects.toThrow('409');
    await expect(enqueue(second)).resolves.toBe('second');
  });

  it('runs the calls in the order they were enqueued', async () => {
    const enqueue = createMutationQueue();
    const order: number[] = [];

    const run = (id: number, delay: number) =>
      enqueue(async () => {
        await new Promise((resolve) => setTimeout(resolve, delay));
        order.push(id);
      });

    await Promise.all([run(1, 20), run(2, 1), run(3, 0)]);

    expect(order).toEqual([1, 2, 3]);
  });
});
