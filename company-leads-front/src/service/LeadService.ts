import type { CreateLeadData, LeadContact, LeadResource, LeadStatus } from '@/resource/Lead';
import {
	ApiErrorResult,
	HeaderName,
	HttpMethod,
	JSON_CONTENT_TYPE,
	apiEndpoint,
	parseResponse,
	safeFetch,
} from '@/service/ServiceCommon';
import { jsonSerializer } from '@/util/serde';
import { ApiError } from '@/error/ApiError';
import { isSome } from '@/validation/CommonValidation';

export interface LeadSuccessResult {
	type: 'SUCCESS';
	value: LeadResource;
}

export type CreateLeadResult = ApiErrorResult | LeadSuccessResult;

export async function createLead(
	data: CreateLeadData,
	signal: AbortSignal | null = null
): Promise<CreateLeadResult> {
	const headers = new Headers();
	headers.set(HeaderName.ContentType, JSON_CONTENT_TYPE);
	headers.set(HeaderName.Accept, JSON_CONTENT_TYPE);

	const url = new URL(apiEndpoint('/leads'));

	const request = new Request(url, {
		method: HttpMethod.POST,
		headers,
		signal,
		body: jsonSerializer(data),
		mode: 'cors',
		cache: 'default',
	});

	const response = await safeFetch(request);
	if (response instanceof ApiError) {
		return { type: 'API_ERROR', value: response };
	}

	if (200 === response.status) {
		const value = await parseResponse<ApiError | LeadResource>(response);
		if (value instanceof ApiError) {
			return { type: 'API_ERROR', value };
		}
		return { type: 'SUCCESS', value };
	}

	return { type: 'API_ERROR', value: await ApiError.unknownResponse(response) };
}

export type AcceptLeadResult = ApiErrorResult | LeadSuccessResult;

export async function acceptLead(
	id: string,
	data: LeadContact,
	signal: AbortSignal | null = null
): Promise<AcceptLeadResult> {
	const headers = new Headers();
	headers.set(HeaderName.ContentType, JSON_CONTENT_TYPE);
	headers.set(HeaderName.Accept, JSON_CONTENT_TYPE);

	const url = new URL(apiEndpoint('/leads/' + id + '/accept'));

	const request = new Request(url, {
		method: HttpMethod.PUT,
		headers,
		signal,
		body: jsonSerializer(data),
		mode: 'cors',
		cache: 'default',
	});

	const response = await safeFetch(request);
	if (response instanceof ApiError) {
		return { type: 'API_ERROR', value: response };
	}

	if (200 === response.status) {
		const value = await parseResponse<ApiError | LeadResource>(response);
		if (value instanceof ApiError) {
			return { type: 'API_ERROR', value };
		}
		return { type: 'SUCCESS', value };
	}

	return { type: 'API_ERROR', value: await ApiError.unknownResponse(response) };
}

export type DeclineLeadResult = ApiErrorResult | LeadSuccessResult;

export async function declineLead(
	id: string,
	signal: AbortSignal | null = null
): Promise<DeclineLeadResult> {
	const headers = new Headers();
	headers.set(HeaderName.Accept, JSON_CONTENT_TYPE);

	const url = new URL(apiEndpoint('/leads/' + id + '/decline'));

	const request = new Request(url, {
		method: HttpMethod.PUT,
		headers,
		signal,
		mode: 'cors',
		cache: 'default',
	});

	const response = await safeFetch(request);
	if (response instanceof ApiError) {
		return { type: 'API_ERROR', value: response };
	}

	if (200 === response.status) {
		const value = await parseResponse<ApiError | LeadResource>(response);
		if (value instanceof ApiError) {
			return { type: 'API_ERROR', value };
		}
		return { type: 'SUCCESS', value };
	}

	return { type: 'API_ERROR', value: await ApiError.unknownResponse(response) };
}

export interface LeadListSuccessResult {
	type: 'SUCCESS';
	value: Array<LeadResource>;
}

export type GetLeadListResult = ApiErrorResult | LeadListSuccessResult;

export interface LeadQueryParams {
	status?: LeadStatus;
	search?: string;
	page?: number;
}

export function applyLeadQuery(
	query: LeadQueryParams,
	params: URLSearchParams = new URLSearchParams()
): URLSearchParams {
	if (isSome(query.page)) params.set('page', query.page!.toString());
	if (isSome(query.search)) params.set('search', query.search!);
	if (isSome(query.status)) params.set('status', query.status!);
	return params;
}

export async function listLeads(
	query: LeadQueryParams,
	signal: AbortSignal | null = null
): Promise<GetLeadListResult> {
	const headers = new Headers();
	headers.set(HeaderName.Accept, JSON_CONTENT_TYPE);

	const url = new URL(apiEndpoint('/leads'));
	applyLeadQuery(query, url.searchParams);

	const request = new Request(url, {
		method: HttpMethod.GET,
		headers,
		signal,
		mode: 'cors',
		cache: 'default',
	});

	const response = await safeFetch(request);
	if (response instanceof ApiError) {
		return { type: 'API_ERROR', value: response };
	}

	if (200 === response.status) {
		const value = await parseResponse<ApiError | LeadResource[]>(response);
		if (value instanceof ApiError) {
			return { type: 'API_ERROR', value };
		}
		return { type: 'SUCCESS', value };
	}

	return { type: 'API_ERROR', value: await ApiError.unknownResponse(response) };
}
