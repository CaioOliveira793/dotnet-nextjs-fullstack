import type { ZodError, ZodSchema } from 'zod';
import {
	FORM_ERROR_PATH,
	ParseFormResult,
	type FormError,
	type FormErrorPath,
	type ParseFn,
} from '@/hook/useForm';

export function zodToFormError<T>(
	error: ZodError<T>,
	formErrors: Array<FormError<T>> = []
): Array<FormError<T>> {
	const flattened = error.flatten();

	for (const [path, messages] of Object.entries(flattened.fieldErrors)) {
		for (const message of messages as string[]) {
			formErrors.push({ path: path as FormErrorPath<T>, message });
		}
	}

	for (const message of flattened.formErrors) {
		formErrors.push({ path: FORM_ERROR_PATH, message });
	}

	return formErrors;
}

async function zodFormValidation<T>(schema: ZodSchema<T>, data: T): Promise<ParseFormResult<T>> {
	const errors: FormError<T>[] = [];
	const result = await schema.safeParseAsync(data, { async: true });

	if (result.success) {
		return { success: true, data: result.data };
	}

	zodToFormError(result.error, errors);

	return { success: false, data: result.data, error: errors };
}

export function zodFormAdapter<T>(schema: ZodSchema<T>): ParseFn<T> {
	return async function (data: T) {
		return zodFormValidation(schema, data);
	};
}
