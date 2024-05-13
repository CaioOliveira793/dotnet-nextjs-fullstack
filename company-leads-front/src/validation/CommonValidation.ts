export function isSome<T>(value: T | undefined | null): boolean {
	return value !== undefined && value !== null;
}
