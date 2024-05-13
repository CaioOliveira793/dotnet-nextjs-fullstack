import { CreateLeadData } from '@/resource/Lead';
import zod, { ZodSchema } from 'zod';

export const CreateLeadSchema = zod.object({
	category: zod.string().min(2).max(64),
	description: zod
		.string()
		.min(2)
		.max(256)
		.transform(desc => {
			if (desc === null || desc === '' || desc === undefined) {
				return null;
			}
			return desc;
		})
		.nullable()
		.default(null),
	price: zod.number({ coerce: true }).min(0.01).max(1000.0),
	contact_first_name: zod.string().min(2).max(64),
	suburb: zod.string().min(2).max(128),
}) as ZodSchema<CreateLeadData>;

const PHONE_NUMBER_REGEX = /^\d+$/;

export const LeadContactSchema = zod.object({
	full_name: zod.string().min(2).max(128),
	email: zod.string().email(),
	phone_number: zod.string().min(5).max(11).regex(PHONE_NUMBER_REGEX),
});
