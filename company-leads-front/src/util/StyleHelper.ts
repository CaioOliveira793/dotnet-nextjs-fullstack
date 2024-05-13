export type ClassName = string | null | undefined;

export function classes(...classNames: ClassName[]): string {
	return classNames.filter(className => Boolean(className)).join(' ');
}
