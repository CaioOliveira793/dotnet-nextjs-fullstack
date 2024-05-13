import { ApiError, ApiErrorType } from '@/error/ApiError';
import { jsonDeserializer } from '@/util/serde';

export const JSON_CONTENT_TYPE = 'application/json';

export const enum HttpMethod {
	POST = 'POST',
	PUT = 'PUT',
	GET = 'GET',
	DELETE = 'DELETE',
}

export const enum HeaderName {
	ContentType = 'Content-Type',
	Accept = 'Accept',
	Authorization = 'Authorization',
}

export interface ApiErrorResult {
	type: 'API_ERROR';
	value: ApiError;
}

export function apiEndpoint(path: string): string {
	return process.env.NEXT_PUBLIC_APP_API_ADDRESS + path;
}

export async function safeFetch(request: Request): Promise<ApiError | Response> {
	try {
		return await fetch(request);
	} catch (err: unknown) {
		return ApiError.handleFetchError(err);
	}
}

export async function parseResponse<T = unknown>(response: Response): Promise<T | ApiError> {
	const str = await response.text();
	try {
		return jsonDeserializer(str);
	} catch (err: unknown) {
		return new ApiError(ApiErrorType.InvalidResponseBody, response.status, str, err as Error);
	}
}
