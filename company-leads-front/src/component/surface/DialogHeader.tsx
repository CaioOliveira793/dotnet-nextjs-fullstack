import { HTMLAttributes } from 'react';
import { FaXmark } from 'react-icons/fa6';

import { classes } from '@/util/StyleHelper';
import DialogStyle from '@/style/surface/dialog.module.css';
import TypographyStyle from '@/style/typography.module.css';

export interface DialogHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	title?: string;
	onClose?(): void;
}

export function DialogHeader({ title, className, onClose, ...props }: DialogHeaderProps) {
	return (
		<div className={classes(DialogStyle.dialog_header, className)} {...props}>
			<strong className={TypographyStyle.heading6}>{title}</strong>
			<button className={DialogStyle.close_button} onClick={onClose}>
				<FaXmark />
			</button>
		</div>
	);
}
