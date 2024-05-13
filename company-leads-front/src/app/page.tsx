'use client';

import { useRef, useState } from 'react';

import { LeadDisplay } from '@/component/LeadDisplay';
import { AppHeader, Tab } from '@/component/AppHeader';
import { Button } from '@/component/Button';
import { TextInput } from '@/component/form/TextInput';
import { CreateLeadForm } from '@/component/lead/CreateLeadForm';
import { DialogHeader } from '@/component/surface/DialogHeader';
import { LeadResource } from '@/resource/Lead';

import ScreenStyle from '@/style/screen.module.css';

const leads: LeadResource[] = [
	{
		id: '1',
		created: new Date(),
		category: 'Painter',
		description: 'Need to paint two aluminium window and a sliding glass door.',
		price: 89.5,
		status: 'New',
		contact_first_name: 'Yuri Lobachovisk',
		suburb: 'Yanderra 2574',
		contact: null,
	},
	{
		id: '2',
		created: new Date(),
		category: 'Painter',
		description: null,
		price: 89.5,
		status: 'Accepted',
		contact_first_name: 'Yuri Lobachovisk',
		suburb: 'Yanderra 2574',
		contact: {
			full_name: 'Yuri Lobachovisk',
			email: 'yuri.lobachovisk@email.com',
			phone_number: '0412345678',
		},
	},
	{
		id: '3',
		created: new Date(),
		category: 'Painter',
		description:
			'Plaster exposed brick walls (see photos), square off 2 archways (see photos), and expand pantry (see photos).',
		price: 89.5,
		status: 'Declined',
		contact_first_name: 'Yuri Lobachovisk',
		suburb: 'Yanderra 2574',
		contact: null,
	},
	{
		id: '4',
		created: new Date(),
		category: 'Painter',
		description:
			'Plaster exposed brick walls (see photos), square off 2 archways (see photos), and expand pantry (see photos).',
		price: 89.5,
		status: 'New',
		contact_first_name: 'Yuri Lobachovisk',
		suburb: 'Yanderra 2574',
		contact: {
			full_name: 'Yuri Lobachovisk',
			email: 'yuri.lobachovisk@email.com',
			phone_number: '0412345678',
		},
	},
];

// TODO: decline lead
// - [ ] decline lead endpoint
// TODO: accept lead
// - [ ] accept lead form
// - [ ] accept lead validation
// - [ ] accept lead endpoint
// TODO: query leads
// - [ ] query lead endpoint
// TODO: add pagination component
export default function Home() {
	const [tab, setTab] = useState<Tab>(Tab.Invited);
	const dialogRef = useRef<HTMLDialogElement>(null);

	return (
		<div className={ScreenStyle.container}>
			<AppHeader
				tab={tab}
				onTabAccepted={() => setTab(Tab.Accepted)}
				onTabInvited={() => setTab(Tab.Invited)}
			/>

			<form className={ScreenStyle.search_form}>
				<TextInput label="Search" inputMode="search" fullwidth />
				<div className={ScreenStyle.search_footer}>
					<Button type="button" variant="primary" onClick={() => dialogRef.current?.showModal()}>
						Novo
					</Button>
				</div>
			</form>

			<dialog ref={dialogRef}>
				<DialogHeader title="New lead" onClose={() => dialogRef.current?.close()} />
				<CreateLeadForm />
			</dialog>

			<main className={ScreenStyle.content_list}>
				{leads.map(lead => (
					<LeadDisplay key={lead.id} className={ScreenStyle.lead_item} lead={lead} />
				))}
			</main>

			<div className="pagination_container"></div>
		</div>
	);
}
