import { ButtonHTMLAttributes } from 'react';

import { classes } from '@/util/StyleHelper';
import TabButtonStyle from '@/component/TabButton.module.css';

export interface TabButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	active?: boolean;
}

export function TabButton({ active, className, children, ...props }: TabButtonProps) {
	return (
		<button
			{...props}
			className={classes(className, TabButtonStyle.tab_button)}
			data-style-active={active ? '' : null}
		>
			{children}
		</button>
	);
}
