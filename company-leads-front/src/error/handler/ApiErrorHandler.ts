import { FORM_ERROR_PATH, FormError } from '@/hook/useForm';
import { ApiErrorResult } from '@/service/ServiceCommon';

export function handleApiError<T>(
	result: ApiErrorResult,
	errors: Array<FormError<T>> = []
): Array<FormError<T>> {
	switch (result.type) {
		case 'API_ERROR': {
			errors.push({
				path: FORM_ERROR_PATH,
				message: 'An unexpected error occurred while interacting with the backend',
			});
			break;
		}
		default: {
			errors.push({ path: FORM_ERROR_PATH, message: 'An unexpected error occurred' });
			break;
		}
	}

	return errors;
}
