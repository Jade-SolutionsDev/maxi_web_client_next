export type Enqueue = <T>(run: () => Promise<T>) => Promise<T>;

export const createMutationQueue = (): Enqueue => {
  let tail: Promise<unknown> = Promise.resolve();

  return <T>(run: () => Promise<T>): Promise<T> => {
    const result = tail.then(run, run);

    tail = result.catch(() => undefined);

    return result;
  };
};
