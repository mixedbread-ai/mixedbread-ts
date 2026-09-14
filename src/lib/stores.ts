// Hand-written helpers mixed into the generated `stores` resource.
//
// The generator emits `StoresBase` with the API methods and declares
// `export class Stores extends withStoreHelpers(StoresBase) {}`, so everything defined here is
// part of `client.stores` and can call the generated methods through `this`.

import type { StoresBase, Store, StoreCopyParams } from '../resources/stores/stores';
import type { RequestOptions } from '../internal/request-options';
import * as polling from './polling';

const DEFAULT_POLL_INTERVAL_MS = 1000;

/**
 * Parameters for polling a store until it has settled.
 */
export interface StorePollHelperParams {
  storeIdentifier: string;
  pollIntervalMs?: number | undefined;
  pollTimeoutMs?: number | undefined;
  options?: RequestOptions | undefined;
}

/**
 * Parameters for copying a store and waiting for the copy to finish.
 */
export interface StoreCopyAndPollHelperParams {
  storeIdentifier: string;
  body: StoreCopyParams;
  pollIntervalMs?: number | undefined;
  pollTimeoutMs?: number | undefined;
  options?: RequestOptions | undefined;
}

type Constructor<T> = new (...args: any[]) => T;

/**
 * Methods `withStoreHelpers` adds to the generated `stores` resource.
 *
 * The mixin's return type is spelled out so that declaration emit does not have to name the
 * anonymous class (TS4094: it has the protected `_client` member).
 */
export interface StoreHelpers {
  /**
   * Poll a store until it is no longer `in_progress`. A store is `in_progress` while a copy
   * fills it; it settles as `completed` or `failed` (`copy_state` then carries the error).
   */
  poll(
    storeIdentifier: string,
    pollIntervalMs?: number,
    pollTimeoutMs?: number,
    options?: RequestOptions,
  ): Promise<Store>;
  poll(params: StorePollHelperParams): Promise<Store>;

  /**
   * Copy a store into a new store and wait until the copy has finished. Returns the new store;
   * check `status` (`completed` or `failed`) before using it.
   */
  copyAndPoll(
    storeIdentifier: string,
    body: StoreCopyParams,
    pollIntervalMs?: number,
    pollTimeoutMs?: number,
    options?: RequestOptions,
  ): Promise<Store>;
  copyAndPoll(params: StoreCopyAndPollHelperParams): Promise<Store>;
}

export function withStoreHelpers<TBase extends Constructor<StoresBase>>(
  Base: TBase,
): (new (...args: any[]) => StoreHelpers) & TBase {
  return class extends Base implements StoreHelpers {
    /**
     * Poll a store until it is no longer `in_progress`.
     *
     * Supports positional arguments (`poll(storeIdentifier, pollIntervalMs, pollTimeoutMs, options)`)
     * and a named-parameter object (`poll({ storeIdentifier, ... })`).
     */
    async poll(
      storeIdentifier: string,
      pollIntervalMs?: number,
      pollTimeoutMs?: number,
      options?: RequestOptions,
    ): Promise<Store>;
    async poll(params: StorePollHelperParams): Promise<Store>;
    async poll(
      storeIdentifierOrParams: string | StorePollHelperParams,
      pollIntervalMs?: number,
      pollTimeoutMs?: number,
      options?: RequestOptions,
    ): Promise<Store> {
      const params: StorePollHelperParams =
        typeof storeIdentifierOrParams === 'string' ?
          { storeIdentifier: storeIdentifierOrParams, pollIntervalMs, pollTimeoutMs, options }
        : storeIdentifierOrParams;

      const pollingIntervalMs = params.pollIntervalMs ?? DEFAULT_POLL_INTERVAL_MS;

      return polling.poll({
        fn: () => this.retrieve(params.storeIdentifier, params.options),
        condition: (store) => store.status !== 'in_progress',
        intervalSeconds: pollingIntervalMs / 1000,
        ...(params.pollTimeoutMs && { timeoutSeconds: params.pollTimeoutMs / 1000 }),
      });
    }

    /**
     * Copy a store into a new store and wait until the copy has finished.
     */
    async copyAndPoll(
      storeIdentifier: string,
      body: StoreCopyParams,
      pollIntervalMs?: number,
      pollTimeoutMs?: number,
      options?: RequestOptions,
    ): Promise<Store>;
    async copyAndPoll(params: StoreCopyAndPollHelperParams): Promise<Store>;
    async copyAndPoll(
      storeIdentifierOrParams: string | StoreCopyAndPollHelperParams,
      body?: StoreCopyParams,
      pollIntervalMs?: number,
      pollTimeoutMs?: number,
      options?: RequestOptions,
    ): Promise<Store> {
      const params: StoreCopyAndPollHelperParams =
        typeof storeIdentifierOrParams === 'string' ?
          {
            storeIdentifier: storeIdentifierOrParams,
            body: body as StoreCopyParams,
            pollIntervalMs,
            pollTimeoutMs,
            options,
          }
        : storeIdentifierOrParams;

      const copy = await this.copy(params.storeIdentifier, params.body, params.options);
      return this.poll({
        storeIdentifier: copy.id,
        pollIntervalMs: params.pollIntervalMs,
        pollTimeoutMs: params.pollTimeoutMs,
        options: params.options,
      });
    }
  };
}
