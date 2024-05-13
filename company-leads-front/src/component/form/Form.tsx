import { ReactNode, FormHTMLAttributes } from 'react';
import { ErrorList } from '@/component/form/ErrorList';
import FormStyle from '@/style/form/form.module.css';
import { classes } from '@/util/StyleHelper';

export interface FormStrictProps {
	errors?: string[];
	header?: ReactNode;
	footer?: ReactNode;
	formAction?: ReactNode;
}

export interface FormProps extends FormStrictProps, FormHTMLAttributes<HTMLFormElement> {}

export interface BaseFormProps extends Omit<FormHTMLAttributes<HTMLFormElement>, 'children'> {
	header?: ReactNode;
	footer?: ReactNode;
}

export function Form({
	errors = [],
	header,
	footer,
	formAction,
	className,
	children,
	...props
}: FormProps) {
	return (
		<form className={classes(FormStyle.form, className)} {...props}>
			{header ? <div className={FormStyle.form_header}>{header}</div> : null}
			{children}
			{errors?.length !== 0 ? <ErrorList errors={errors} /> : null}
			<div className={FormStyle.form_footer}>
				{footer}
				<div className={FormStyle.form_action}>{formAction}</div>
			</div>
		</form>
	);
}
