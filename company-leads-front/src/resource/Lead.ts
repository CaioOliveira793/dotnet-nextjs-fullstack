export type LeadStatus = 'New' | 'Accepted' | 'Declined';

export interface CreateLeadData {
	category: string;
	description: string | null;
	price: number;
	contact_first_name: string;
	suburb: string;
}

export interface LeadContact {
	readonly full_name: string;
	readonly email: string;
	readonly phone_number: string;
}

export interface LeadResource {
	readonly id: string;
	readonly created: Date;
	readonly category: string;
	readonly description: string | null;
	readonly status: LeadStatus;
	readonly price: number;
	readonly contact_first_name: string;
	readonly suburb: string;
	readonly contact: LeadContact | null;
}
