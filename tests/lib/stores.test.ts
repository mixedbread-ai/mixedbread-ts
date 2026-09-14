import { withStoreHelpers } from '../../src/lib/stores';

const settled = (status: string) => ({ id: 'vs_copy', name: 'copy', status });

function createStores(statuses: string[]) {
  const retrieve = jest.fn();
  for (const status of statuses) retrieve.mockResolvedValueOnce(settled(status));
  const copy = jest.fn().mockResolvedValue(settled('in_progress'));
  class Base {
    retrieve = retrieve;
    copy = copy;
  }
  const Stores = withStoreHelpers(Base as any);
  return { stores: new Stores(), retrieve, copy };
}

describe('withStoreHelpers', () => {
  test('copyAndPoll starts the copy and polls the new store until it settles', async () => {
    const { stores, retrieve, copy } = createStores(['in_progress', 'in_progress', 'completed']);

    const result = await stores.copyAndPoll('vs_source', { name: 'copy' }, 1);

    expect(copy).toHaveBeenCalledWith('vs_source', { name: 'copy' }, undefined);
    expect(retrieve).toHaveBeenCalledTimes(3);
    expect(retrieve).toHaveBeenCalledWith('vs_copy', undefined);
    expect(result.status).toBe('completed');
  });

  test('poll returns a failed copy instead of waiting forever', async () => {
    const { stores } = createStores(['in_progress', 'failed']);

    const result = await stores.poll({ storeIdentifier: 'vs_copy', pollIntervalMs: 1 });

    expect(result.status).toBe('failed');
  });
});
