import { ButtonHTMLAttributes, ReactNode } from 'react';

import Ring180 from '@/component/spinner/Ring180';
import { classes } from '@/util/StyleHelper';
import ButtonStyle from '@/component/Button.module.css';

export type ButtonVariant = 'primary' | 'secondary';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	loading?: boolean;

	startIcon?: ReactNode | null;
	endIcon?: ReactNode | null;
}

export function Button({
	variant = 'primary',
	loading,
	startIcon,
	endIcon,
	className,
	children,
	...props
}: ButtonProps) {
	return (
		<button
			{...props}
			className={classes(ButtonStyle.button, className)}
			data-style-variant={variant}
		>
			{loading ? <Ring180 /> : startIcon}
			{children}
			{endIcon}
		</button>
	);
}
