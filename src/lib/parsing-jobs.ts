// Hand-written helpers mixed into the generated `parsing.jobs` resource (see store-files.ts).

import type { JobsBase, JobCreateParams, ParsingJob } from '../resources/parsing/jobs';
import type { RequestOptions } from '../internal/request-options';
import type { Uploadable } from '../core/uploads';
import * as polling from './polling';
import { type MultipartUploadConfig } from './upload-file';

const TERMINAL = ['completed', 'failed', 'cancelled'];

type Constructor<T> = new (...args: any[]) => T;

/**
 * Methods `withParsingJobHelpers` adds to the generated `parsing.jobs` resource.
 *
 * The mixin's return type is spelled out so that declaration emit does not have to name the
 * anonymous class (TS4094: it has the protected `_client` member).
 */
export interface ParsingJobHelpers {
  /**
   * Poll for a job's status until it reaches a terminal state.
   *
   * @param jobId - The ID of the job to poll
   * @param pollIntervalMs - The interval between polls in milliseconds (default: 500)
   * @param pollTimeoutMs - The maximum time to poll for in milliseconds (default: no timeout)
   * @param options - Additional request options
   */
  poll(
    jobId: string,
    pollIntervalMs?: number,
    pollTimeoutMs?: number,
    options?: RequestOptions,
  ): Promise<ParsingJob>;

  /**
   * Create a parsing job and wait for it to complete.
   */
  createAndPoll(
    body: JobCreateParams,
    pollIntervalMs?: number,
    pollTimeoutMs?: number,
    options?: RequestOptions,
  ): Promise<ParsingJob>;

  /**
   * Upload a file to the files API and then create a parsing job for it.
   * Note the job will be asynchronously processed.
   */
  upload(
    file: Uploadable,
    body?: Omit<JobCreateParams, 'file_id'>,
    options?: RequestOptions,
    multipartUpload?: MultipartUploadConfig,
  ): Promise<ParsingJob>;

  /**
   * Upload a file and create a parsing job, then poll until processing is complete.
   */
  uploadAndPoll(
    file: Uploadable,
    body?: Omit<JobCreateParams, 'file_id'>,
    pollIntervalMs?: number,
    pollTimeoutMs?: number,
    options?: RequestOptions,
    multipartUpload?: MultipartUploadConfig,
  ): Promise<ParsingJob>;
}

export function withParsingJobHelpers<TBase extends Constructor<JobsBase>>(
  Base: TBase,
): (new (...args: any[]) => ParsingJobHelpers) & TBase {
  return class extends Base implements ParsingJobHelpers {
    /**
     * Poll for a job's status until it reaches a terminal state.
     *
     * @param jobId - The ID of the job to poll
     * @param pollIntervalMs - The interval between polls in milliseconds (default: 500)
     * @param pollTimeoutMs - The maximum time to poll for in milliseconds (default: no timeout)
     * @param options - Additional request options
     */
    async poll(
      jobId: string,
      pollIntervalMs?: number,
      pollTimeoutMs?: number,
      options?: RequestOptions,
    ): Promise<ParsingJob> {
      const pollingIntervalMs = pollIntervalMs || 500;

      return polling.poll({
        fn: () => this.retrieve(jobId, options),
        condition: (result) => TERMINAL.includes(result.status ?? ''),
        intervalSeconds: pollingIntervalMs / 1000,
        ...(pollTimeoutMs && { timeoutSeconds: pollTimeoutMs / 1000 }),
      });
    }

    /**
     * Create a parsing job and wait for it to complete.
     */
    async createAndPoll(
      body: JobCreateParams,
      pollIntervalMs?: number,
      pollTimeoutMs?: number,
      options?: RequestOptions,
    ): Promise<ParsingJob> {
      const job = await this.create(body, options);
      return this.poll(job.id, pollIntervalMs, pollTimeoutMs, options);
    }

    /**
     * Upload a file to the files API and then create a parsing job for it.
     * Note the job will be asynchronously processed.
     */
    async upload(
      file: Uploadable,
      body?: Omit<JobCreateParams, 'file_id'>,
      options?: RequestOptions,
      multipartUpload?: MultipartUploadConfig,
    ): Promise<ParsingJob> {
      const fileUploadResponse = await this._client.files.create(
        { file, ...(multipartUpload && { multipartUpload }) },
        options,
      );
      return this.create({ file_id: fileUploadResponse.id, ...body }, options);
    }

    /**
     * Upload a file and create a parsing job, then poll until processing is complete.
     */
    async uploadAndPoll(
      file: Uploadable,
      body?: Omit<JobCreateParams, 'file_id'>,
      pollIntervalMs?: number,
      pollTimeoutMs?: number,
      options?: RequestOptions,
      multipartUpload?: MultipartUploadConfig,
    ): Promise<ParsingJob> {
      const job = await this.upload(file, body, options, multipartUpload);
      return this.poll(job.id, pollIntervalMs, pollTimeoutMs, options);
    }
  };
}
