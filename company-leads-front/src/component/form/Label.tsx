import { LabelHTMLAttributes } from 'react';

import { classes } from '@/util/StyleHelper';
import TypographyStyle from '@/style/typography.module.css';
import InputStyle from '@/style/form/input.module.css';

export interface LabelStrictProps {
	asterisk?: boolean;
	label?: string;
}

export interface LabelProps
	extends LabelStrictProps,
		Omit<LabelHTMLAttributes<HTMLLabelElement>, 'children'> {}

export function Label({ asterisk = false, label = '', className, ...props }: LabelProps) {
	return (
		<label className={classes(className, TypographyStyle.body2)} {...props}>
			{asterisk ? label + ' ' : label}
			{asterisk ? <span className={InputStyle.asterisk}>*</span> : null}
		</label>
	);
}
