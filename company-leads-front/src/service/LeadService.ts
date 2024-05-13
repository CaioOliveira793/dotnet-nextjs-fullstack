import type { CreateLeadData, LeadResource } from '@/resource/Lead';
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

export interface CreateLeadSuccess {
	type: 'SUCCESS';
	value: LeadResource;
}

export type CreateLeadResult = ApiErrorResult | CreateLeadSuccess;

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

	if (201 === response.status) {
		const value = await parseResponse(response);
		if (value instanceof ApiError) {
			return { type: 'API_ERROR', value };
		}
	}

	return { type: 'API_ERROR', value: await ApiError.unknownResponse(response) };
}
