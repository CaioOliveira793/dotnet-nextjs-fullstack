interface PromiseResolve<T> {
	(value: T | PromiseLike<T>): void;
}

interface PromiseReject {
	(reason?: unknown): void;
}

interface PromiseObj<T> {
	promise: Promise<T>;
	resolve: PromiseResolve<T>;
	reject: PromiseReject;
}

// TODO: use Promise.withResolvers() when widely available
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers
function makePromiseObj<T>(): PromiseObj<T> {
	let resolve, reject;
	const promise = new Promise<T>((res, rej) => {
		resolve = res;
		reject = rej;
	});
	return { promise, resolve, reject } as unknown as PromiseObj<T>;
}

export class DebouncerAbortError extends Error {
	public readonly reason: unknown;

	public constructor(reason?: unknown, options?: ErrorOptions) {
		super('debounced operation aborted', options);
		this.reason = reason;
	}
}

export interface Func<This, Args extends Array<unknown>, Return> {
	(this: This, ...args: Args): Return;
}

// NOTE: take into account the calling context e.g. this
export class Debouncer<Args extends Array<unknown>, T> {
	/**
	 * Delay (in milliseconds)
	 */
	public readonly delay: number;
	/**
	 * Callback function
	 */
	public readonly callback: Func<null, Args, T>;

	public constructor(callback: Func<null, Args, T>, delay: number) {
		this.callback = callback;
		this.delay = delay;
	}

	public exec(...args: Args): Promise<Awaited<T>> {
		clearTimeout(this.timeoutID);
		this.lastFn = () => this.callback.call(null, ...args);

		if (this.promiseObj === null) {
			this.promiseObj = makePromiseObj();
		}

		this.timeoutID = setTimeout(() => {
			try {
				this.promiseObj?.resolve(this.lastFn?.() as Awaited<T>);
			} catch (err: unknown) {
				this.promiseObj?.reject(err);
			} finally {
				this.clear();
			}
		}, this.delay) as unknown as number;

		return this.promiseObj.promise;
	}

	public async execSafeAbort(...args: Args): Promise<Awaited<T> | DebouncerAbortError> {
		try {
			return await this.exec(...args);
		} catch (error) {
			return resolveDebouncerAbort(error);
		}
	}

	public ready(value: T): void {
		clearTimeout(this.timeoutID);
		this.promiseObj?.resolve(value as Awaited<T>);
		this.clear();
	}

	public flush(): T | void {
		clearTimeout(this.timeoutID);
		try {
			const value = this.lastFn?.();
			this.promiseObj?.resolve(value as Awaited<T>);
			return value;
		} finally {
			this.clear();
		}
	}

	public abort(reason?: unknown, options?: ErrorOptions): void {
		clearTimeout(this.timeoutID);
		this.promiseObj?.reject(new DebouncerAbortError(reason, options));
		this.clear();
	}

	private clear() {
		this.lastFn = null;
		this.promiseObj = null;
		this.timeoutID = 0;
	}

	private lastFn: Func<typeof this, [], T> | null = null;
	private promiseObj: PromiseObj<Awaited<T>> | null = null;
	private timeoutID: number = 0;
}

/**
 * @template Err
 *
 * Return the error if it is a debouncer abort error and throw it otherwise.
 *
 * ---
 * @param error unknown error
 * @returns debouncer abort error
 * @throws {Err} unknown error that is not a debouncer abort error.
 * ---
 * @example
 * ```
 * const result: T | DebouncerAbortError = await debouncer.exec()
 * 	.catch(resolveDebouncerAbort)
 * 	.catch(err => {
 * 		// handle some other error ...
 * 	});
 * ```
 */
export function resolveDebouncerAbort<Err>(error: Err): DebouncerAbortError {
	if (error instanceof DebouncerAbortError) {
		return error;
	}

	throw error;
}
