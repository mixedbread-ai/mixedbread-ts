/**
 * Utilities for polling operations
 */

type ConditionFunction<T> = (result: T) => boolean;
type IntervalFunction<T> = (result: T) => number;
type ErrorHandlerFunction = (error: Error) => number | null;
type RetryCallback<T> = (result: T, attempt: number) => void;

// Use a more generic setTimeout type
declare const setTimeout: (callback: (...args: any[]) => void, ms: number) => any;

/**
 * Asynchronously polls an operation until a condition is met or timeout/max attempts are reached.
 *
 * @param fn - Async function that performs the operation to be polled
 * @param condition - Function that evaluates if the polling should continue
 * @param maxAttempts - Maximum number of polling attempts (undefined for infinite)
 * @param timeoutSeconds - Maximum total time to poll in seconds (undefined for infinite)
 * @param intervalSeconds - Time between polls in seconds, or function that returns interval
 * @param onRetry - Optional callback for each retry attempt
 * @param errorHandler - Optional callback for handling exceptions during polling
 * @returns The result of the operation once condition is met
 * @throws Error if maxAttempts is reached
 * @throws Error if timeoutSeconds is reached
 */
export async function poll<T>(
  fn: () => Promise<T>,
  condition: ConditionFunction<T>,
  maxAttempts?: number,
  timeoutSeconds?: number,
  intervalSeconds: number | IntervalFunction<T> = 1.0,
  onRetry?: RetryCallback<T>,
  errorHandler?: ErrorHandlerFunction
): Promise<T> {
  const startTime = new Date();
  let attempt = 0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    attempt += 1;

    try {
      const result = await fn();

      if (condition(result)) {
        return result;
      }

      if (onRetry) {
        onRetry(result, attempt);
      }

      let waitTime: number;
      
      if (typeof intervalSeconds === 'function') {
        waitTime = intervalSeconds(result);
      } else {
        waitTime = intervalSeconds;
      }

      // Check timeout and attempts before sleeping
      if (maxAttempts && attempt >= maxAttempts) {
        throw new Error(`Maximum attempts (${maxAttempts}) reached`);
      }

      if (timeoutSeconds) {
        const elapsed = (new Date().getTime() - startTime.getTime()) / 1000;
        if (elapsed >= timeoutSeconds) {
          throw new Error(`Timeout (${timeoutSeconds}s) reached`);
        }
      }

      // Sleep asynchronously
      await new Promise(resolve => setTimeout(resolve, waitTime * 1000));

    } catch (e) {
      if (errorHandler && e instanceof Error) {
        const sleepTime = errorHandler(e);
        if (sleepTime !== null) {
          // Sleep and continue
          await new Promise(resolve => setTimeout(resolve, sleepTime * 1000));
          continue;
        }
      }
      throw e;
    }
  }
}
