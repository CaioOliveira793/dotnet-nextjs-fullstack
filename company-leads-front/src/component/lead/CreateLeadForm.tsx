import { FormHTMLAttributes } from 'react';

import { Form } from '@/component/form/Form';
import { TextInput } from '@/component/form/TextInput';
import { Button } from '@/component/Button';
import { FORM_ERROR_PATH, FormError, errorMessageInPath, useForm } from '@/hook/useForm';
import { CreateLeadData, LeadResource } from '@/resource/Lead';
import { zodFormAdapter } from '@/util/ZodHelper';
import { CreateLeadSchema } from '@/validation/LeadSchema';
import { createLead } from '@/service/LeadService';
import { handleApiError } from '@/error/handler/ApiErrorHandler';

type FormProps = Omit<FormHTMLAttributes<HTMLFormElement>, 'children' | 'onSubmit' | 'action'>;

export interface CreateLeadFormProps extends FormProps {
	onLeadCreated?(lead: LeadResource): void | Promise<void>;
}

export function CreateLeadForm({ onLeadCreated, ...props }: CreateLeadFormProps) {
	const loading = false;
	const { errors, handleSubmit, handleChange } = useForm<CreateLeadData>({
		onSubmit: handleCreateLead,
		parser: zodFormAdapter(CreateLeadSchema),
		initial: { description: null },
	});

	async function handleCreateLead(
		data: CreateLeadData
	): Promise<Array<FormError<CreateLeadData>> | void> {
		const result = await createLead(data);
		if (result.type !== 'SUCCESS') {
			return handleApiError(result);
		}

		onLeadCreated?.(result.value);
	}

	return (
		<Form
			{...props}
			onSubmit={handleSubmit}
			errors={errorMessageInPath(errors, FORM_ERROR_PATH)}
			formAction={
				<Button type="submit" loading={loading}>
					Create
				</Button>
			}
		>
			<TextInput
				name="category"
				label="Category"
				description={<p>Service category.</p>}
				required
				inputMode="text"
				fullwidth
				errors={errorMessageInPath(errors, 'category')}
				onChange={handleChange}
			/>
			<TextInput
				name="description"
				label="Description"
				description={<p>Short desciption of the lead.</p>}
				inputMode="text"
				fullwidth
				errors={errorMessageInPath(errors, 'description')}
				onChange={event => handleChange(event, desc => (desc ? desc : null))}
			/>
			<TextInput
				name="price"
				label="Price"
				description={<p>Expected lead price.</p>}
				required
				type="text"
				inputMode="decimal"
				fullwidth
				errors={errorMessageInPath(errors, 'price')}
				onChange={handleChange}
			/>
			<TextInput
				name="contact_first_name"
				label="Contact name"
				description={<p>Contact responsible for the lead.</p>}
				required
				inputMode="text"
				fullwidth
				errors={errorMessageInPath(errors, 'contact_first_name')}
				onChange={handleChange}
			/>
			<TextInput
				name="suburb"
				label="Suburb"
				required
				description={<p>Location where the service will be executed.</p>}
				inputMode="text"
				autoComplete="address-line3"
				fullwidth
				errors={errorMessageInPath(errors, 'suburb')}
				onChange={handleChange}
			/>
		</Form>
	);
}
