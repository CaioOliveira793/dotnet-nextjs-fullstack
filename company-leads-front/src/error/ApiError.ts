export const enum ApiErrorType {
	UnknownResponse = 'UNKNOWN_RESPONSE',
	InvalidResponseBody = 'INVALID_RESPONSE_BODY',
	InvalidFetchCall = 'INVALID_FETCH',
	Aborted = 'ABORTED',
	NetworkError = 'NETWORK_ERROR',
	UnknownError = 'UNKNOWN_ERROR',
}

/**
 * Regex to match fetch Error messages
 *
 * ## WebKit (Safari)
 *
 * The default error message returned by WebKit in any network request that fails synchronously
 * is assumed to be an access control error. [Source code](https://github.com/WebKit/WebKit/blob/a7a424ab6eb48fee09affb42ac3e1eea7b47b562/Source/WebCore/loader/cache/CachedResourceLoader.cpp#L1211-L1213).
 *
 * Example message: `Fetch API cannot load https://example.com/whatever due to access control checks`.
 *
 * Match regex: `/fetch api/i`.
 *
 * ## Blink (Chrome, Chromium, Microsoft Edge)
 *
 * Example message: `Failed to fetch`.
 *
 * Match regex: `/failed to fetch/i`.
 *
 * ## Gecko (Firefox)
 *
 * Example message: `NetworkError when attempting to fetch resource.`.
 *
 * Match regex: `/network/i`.
 */
const NETWORK_ERROR_MESSAGE_REGEX = /(network|failed to fetch|fetch api)/i;

/**
 * `DOMException` error type with name `'AbortError'`
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMException
 */
const ABORT_ERROR_TYPE_NAME = 'AbortError';

/**
 * `DOMException` error type with name `'NetworkError'`
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMException
 */
const NETWORK_ERROR_TYPE_NAME = 'NetworkError';

export class ApiError extends Error {
	public readonly type: ApiErrorType;
	public readonly data: unknown;
	public readonly status: number | null;

	constructor(type: ApiErrorType, status: number | null = null, data?: unknown, cause?: Error) {
		super('api error ' + type, { cause });
		this.type = type;
		this.data = data;
		this.status = status;
	}

	public static async unknownResponse(response: Response, cause?: Error): Promise<ApiError> {
		const data = response.bodyUsed ? null : await response.text();
		return new ApiError(ApiErrorType.UnknownResponse, response.status, data, cause);
	}

	public static handleFetchError(err: unknown): ApiError {
		if (!(err instanceof Error)) {
			return new ApiError(ApiErrorType.UnknownError, null, undefined);
		}

		if (err.name === ABORT_ERROR_TYPE_NAME) {
			return new ApiError(ApiErrorType.Aborted, null, undefined, err);
		}

		if (err.name === NETWORK_ERROR_TYPE_NAME || NETWORK_ERROR_MESSAGE_REGEX.test(err.message)) {
			return new ApiError(ApiErrorType.NetworkError, null, undefined, err);
		}

		return new ApiError(ApiErrorType.InvalidFetchCall, null, undefined, err);
	}
}
