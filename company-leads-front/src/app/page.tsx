'use client';

import { ChangeEvent, useEffect, useRef, useState } from 'react';

import { LeadDisplay } from '@/component/LeadDisplay';
import { AppHeader, Tab } from '@/component/AppHeader';
import { Button } from '@/component/Button';
import { TextInput } from '@/component/form/TextInput';
import { CreateLeadForm } from '@/component/lead/CreateLeadForm';
import { DialogHeader } from '@/component/surface/DialogHeader';
import { LeadResource } from '@/resource/Lead';

import ScreenStyle from '@/style/screen.module.css';
import { LeadQueryParams, listLeads } from '@/service/LeadService';

export default function Home() {
	const [tab, setTab] = useState<Tab>(Tab.Invited);
	const dialogRef = useRef<HTMLDialogElement>(null);

	const [leads, setLeads] = useState<LeadResource[]>([]);

	async function queryLeads(params: LeadQueryParams) {
		const result = await listLeads(params);
		if (result.type !== 'SUCCESS') {
			alert('An unexpected error occurred while querying the leads');
			setLeads([]);
			return;
		}

		setLeads(result.value);
	}

	async function handleSearchInput(event: ChangeEvent<HTMLInputElement>) {
		// TODO: add debouncer before search new leads
		event.target.value;
	}

	function handleLeadCreated() {
		alert('Lead created');
		dialogRef.current?.close();
		queryLeads({ status: tab });
	}

	useEffect(() => {
		queryLeads({ status: tab });
	}, [tab]);

	return (
		<div className={ScreenStyle.container}>
			<AppHeader
				tab={tab}
				onTabAccepted={() => setTab(Tab.Accepted)}
				onTabInvited={() => setTab(Tab.Invited)}
			/>

			<form className={ScreenStyle.search_form}>
				<TextInput label="Search" inputMode="search" fullwidth onChange={handleSearchInput} />
				<div className={ScreenStyle.search_footer}>
					<Button type="button" variant="primary" onClick={() => dialogRef.current?.showModal()}>
						Novo
					</Button>
				</div>
			</form>

			<dialog ref={dialogRef}>
				<DialogHeader title="New lead" onClose={() => dialogRef.current?.close()} />
				<CreateLeadForm onLeadCreated={handleLeadCreated} />
			</dialog>

			<main className={ScreenStyle.content_list}>
				{leads.map(lead => (
					<LeadDisplay
						key={lead.id}
						className={ScreenStyle.lead_item}
						lead={lead}
						onLeadAccepted={() => queryLeads({ status: tab })}
						onLeadDeclined={() => queryLeads({ status: tab })}
					/>
				))}
			</main>

			<div className="pagination_container">{/* TODO: add pagination */}</div>
		</div>
	);
}
