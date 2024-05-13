import { useState, ChangeEvent, FormEvent } from 'react';

export const FORM_ERROR_PATH = '@form-error';

export type FormErrorPath<T> = keyof T | typeof FORM_ERROR_PATH;

export interface FormError<T> {
	path: FormErrorPath<T>;
	message: string;
}

export interface ParseFormSuccess<T> {
	success: true;
	data: T;
	error?: never;
}

export interface ParseFormError<T> {
	success: false;
	error: Array<FormError<T>>;
	data?: never;
}

export type ParseFormResult<T> = ParseFormSuccess<T> | ParseFormError<T>;

export type OnSubmit<T> = (data: T) => Promise<Array<FormError<T>> | null | void>;
export type OnChange<T> = (data: T, errors: Array<FormError<T>>) => void;
export type ParseFn<T> = (data: T) => Promise<ParseFormResult<T>>;

export interface UseFormInput<T extends object> {
	initial?: Partial<T>;
	onSubmit?: OnSubmit<T>;
	onChange?: OnChange<T>;
	parser?: ParseFn<T>;
}

export type FieldTransform = (value: string) => unknown;

export type ChangeHandler = (
	event: ChangeEvent<HTMLInputElement>,
	transform?: FieldTransform
) => Promise<void>;
export type SubmitHandler = (event: FormEvent<HTMLFormElement>) => Promise<void>;

export interface UseFormReturn<T extends object> {
	data: T;
	errors: Array<FormError<T>>;
	handleChange: ChangeHandler;
	handleSubmit: SubmitHandler;
}

async function defaultParserFn<T>(data: T): Promise<ParseFormResult<T>> {
	return { success: true, data };
}

export function useForm<T extends object>({
	initial = {},
	onSubmit,
	onChange,
	parser = defaultParserFn,
}: UseFormInput<T>): UseFormReturn<T> {
	const [data, setData] = useState<T>(initial as T);
	const [errors, setErrors] = useState<Array<FormError<T>>>([]);

	async function handleChange(event: ChangeEvent<HTMLInputElement>, transform?: FieldTransform) {
		const { name, value } = event.target;
		const newData = { ...data, [name]: transform ? transform(value) : value };
		const result = await parser(newData);

		if (!result.success) {
			onChange?.(newData, result.error);

			setErrors(result.error);
			setData(newData);
			return;
		}

		onChange?.(result.data, []);

		setErrors([]);
		setData(result.data);
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const errors = (await onSubmit?.(data)) ?? [];
		setErrors(errors);
	}

	return { data, errors, handleChange, handleSubmit };
}

export function errorMessageInPath<T>(
	errors: Array<FormError<T>>,
	path: FormErrorPath<T>
): string[] {
	return errors.filter(err => err.path === path).map(err => err.message);
}
