import { isValid as isValidDate, parseISO as parseDateISO8601 } from 'date-fns';

/**
 * JSON parser reviver for deserializing ISO8601 datetime strings.
 */
export function jsonParseReviver(_key: string, value: unknown): unknown | Date {
	if (typeof value !== 'string') return value;
	const date = parseDateISO8601(value);
	if (!isValidDate(date)) return value;
	return date;
}

export function jsonDeserializer<T = unknown>(str: string): T {
	return JSON.parse(str, jsonParseReviver);
}

export function jsonSerializer<T = unknown>(obj: T): string {
	return JSON.stringify(obj);
}
