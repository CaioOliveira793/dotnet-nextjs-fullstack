import { FormHTMLAttributes } from 'react';

import { Form } from '@/component/form/Form';
import { TextInput } from '@/component/form/TextInput';
import { Button } from '@/component/Button';
import { FORM_ERROR_PATH, FormError, errorMessageInPath, useForm } from '@/hook/useForm';
import { LeadContact, LeadResource } from '@/resource/Lead';
import { zodFormAdapter } from '@/util/ZodHelper';
import { LeadContactSchema } from '@/validation/LeadSchema';
import { acceptLead } from '@/service/LeadService';
import { handleApiError } from '@/error/handler/ApiErrorHandler';

type FormProps = Omit<FormHTMLAttributes<HTMLFormElement>, 'children' | 'onSubmit' | 'action'>;

export interface AcceptLeadFormProps extends FormProps {
	lead: LeadResource;
	onLeadAccepted?(lead: LeadResource): void | Promise<void>;
}

export function AcceptLeadForm({ lead, onLeadAccepted, ...props }: AcceptLeadFormProps) {
	const { errors, handleSubmit, handleChange } = useForm<LeadContact>({
		onSubmit: handleAcceptLead,
		parser: zodFormAdapter(LeadContactSchema),
		initial: { full_name: lead.contact_first_name },
	});

	async function handleAcceptLead(
		data: LeadContact
	): Promise<Array<FormError<LeadContact>> | void> {
		const result = await acceptLead(lead.id, data);
		if (result.type !== 'SUCCESS') {
			return handleApiError(result);
		}

		onLeadAccepted?.(result.value);
	}

	return (
		<Form
			{...props}
			onSubmit={handleSubmit}
			errors={errorMessageInPath(errors, FORM_ERROR_PATH)}
			formAction={<Button type="submit">Accept</Button>}
		>
			<TextInput
				name="full_name"
				label="Contact full name"
				description={<p>Contact responsible for the lead.</p>}
				required
				inputMode="text"
				fullwidth
				errors={errorMessageInPath(errors, 'full_name')}
				onChange={handleChange}
			/>
			<TextInput
				name="email"
				label="Email"
				description={<p>Contact e-mail.</p>}
				required
				type="email"
				inputMode="email"
				fullwidth
				errors={errorMessageInPath(errors, 'email')}
				onChange={handleChange}
			/>
			<TextInput
				name="phone_number"
				label="Description"
				description={<p>Contact phone number.</p>}
				inputMode="tel"
				fullwidth
				errors={errorMessageInPath(errors, 'phone_number')}
				onChange={handleChange}
			/>
		</Form>
	);
}
