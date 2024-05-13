import { PriceFormatter } from '@/formatter/NumberFormatter';

const CreatedDateFormatter = new Intl.DateTimeFormat('en', {
	month: 'long',
	day: 'numeric',
});

export const CreatedTimeFormatter = new Intl.DateTimeFormat('en', {
	hour: 'numeric',
	minute: '2-digit',
	hour12: true,
});

export function formatLeadCreated(created: Date): string {
	return CreatedDateFormatter.format(created) + ' @ ' + CreatedTimeFormatter.format(created);
}

export function formatLeadPrice(price: number): string {
	return PriceFormatter.format(price);
}

export function formatPhoneLink(phone: string): string {
	return 'tel:+' + phone;
}

export function formatEmailLink(email: string): string {
	return 'mailto:' + email;
}
