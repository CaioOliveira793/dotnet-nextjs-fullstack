import { HTMLAttributes } from 'react';

import { TabButton } from '@/component/TabButton';

import Style from '@/component/AppHeader.module.css';

export enum Tab {
	Invited,
	Accepted,
}

export interface AppHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
	tab: Tab;
	onTabInvited?(): void | Promise<void>;
	onTabAccepted?(): void | Promise<void>;
}

export function AppHeader({ tab, onTabInvited, onTabAccepted }: AppHeaderProps) {
	return (
		<header className={Style.container}>
			<nav className={Style.tab_container}>
				<TabButton className={Style.tab_button} active={tab === Tab.Invited} onClick={onTabInvited}>
					Invited
				</TabButton>
				<TabButton
					className={Style.tab_button}
					active={tab === Tab.Accepted}
					onClick={onTabAccepted}
				>
					Accepted
				</TabButton>
			</nav>
		</header>
	);
}
