import { HTMLAttributes } from 'react';

import { classes } from '@/util/StyleHelper';
import InputStyle from '@/style/form/input.module.css';
import TypographyStyle from '@/style/typography.module.css';

export interface ErrorListProps extends Omit<HTMLAttributes<HTMLUListElement>, 'children'> {
	errors?: string[];
}

export function ErrorList({ errors, ...props }: ErrorListProps) {
	return (
		<ul {...props}>
			{errors?.map(error => (
				<li
					key={error}
					className={classes(InputStyle.error_message, TypographyStyle.error_message)}
				>
					{error}
				</li>
			))}
		</ul>
	);
}
