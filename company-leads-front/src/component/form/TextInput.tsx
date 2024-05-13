'use client';

import { HTMLAttributes, ReactNode } from 'react';
import { nanoid } from 'nanoid';

import { Label, LabelStrictProps } from '@/component/form/Label';
import { ErrorList } from '@/component/form/ErrorList';
import { Input, InputProps } from '@/component/form/Input';
import { classes } from '@/util/StyleHelper';
import TypographyStyle from '@/style/typography.module.css';
import InputStyle from '@/style/form/input.module.css';

export interface TextInputProps extends LabelStrictProps, InputProps {
	errors?: string[];

	description?: ReactNode;
	helperText?: ReactNode;

	wrapperProps?: HTMLAttributes<HTMLDivElement>;
	inputWrapperProps?: HTMLAttributes<HTMLDivElement>;
}

export function TextInput({
	asterisk,
	label,
	id,
	required,
	errors = [],
	fullwidth,
	description,
	helperText,
	wrapperProps,
	inputWrapperProps,
	...inputProps
}: TextInputProps) {
	const theID = id ?? nanoid();
	return (
		<div
			data-style-fullwidth={fullwidth ? '' : null}
			{...wrapperProps}
			className={classes(InputStyle.input_wrapper, wrapperProps?.className)}
		>
			{label ? <Label htmlFor={theID} label={label} asterisk={asterisk || required} /> : null}
			{description ? <span className={TypographyStyle.helper_text}>{description}</span> : null}
			<Input
				id={theID}
				required={required}
				fullwidth={fullwidth}
				wrapperProps={inputWrapperProps}
				{...inputProps}
			/>
			{helperText ? <span className={TypographyStyle.helper_text}>{helperText}</span> : null}
			{errors.length != 0 ? (
				<ErrorList errors={errors} role="alert" className={TypographyStyle.error_message} />
			) : null}
		</div>
	);
}
