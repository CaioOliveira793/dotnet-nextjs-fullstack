import { HTMLAttributes, HTMLInputTypeAttribute, InputHTMLAttributes, ReactNode } from 'react';

import Ring180 from '@/component/spinner/Ring180';
import { classes } from '@/util/StyleHelper';
import InputStyle from '@/style/form/input.module.css';

export interface InputStrictProps {
	type?: HTMLInputTypeAttribute;
	invalid?: boolean;
	focused?: boolean;
	disabled?: boolean;
	loading?: boolean;
	fullwidth?: boolean;

	startAdornment?: ReactNode;
	endAdornment?: ReactNode;

	wrapperProps?: HTMLAttributes<HTMLDivElement>;
}

export interface InputProps
	extends InputStrictProps,
		Omit<InputHTMLAttributes<HTMLInputElement>, 'color' | 'size' | 'children'> {}

export function Input({
	type = 'text',
	invalid,
	focused,
	disabled,
	loading,
	fullwidth,
	startAdornment,
	endAdornment,
	wrapperProps,
	...props
}: InputProps) {
	return (
		<div
			data-style-invalid={invalid ? '' : null}
			data-style-disabled={disabled ? '' : null}
			data-style-focused={focused ? '' : null}
			data-style-fullwidth={fullwidth ? '' : null}
			{...wrapperProps}
			className={classes(
				InputStyle.input,
				InputStyle.medium,
				InputStyle.contained,
				wrapperProps?.className
			)}
		>
			{loading ? <Ring180 /> : startAdornment}
			<input type={type} disabled={disabled} {...props} />
			{endAdornment}
		</div>
	);
}
