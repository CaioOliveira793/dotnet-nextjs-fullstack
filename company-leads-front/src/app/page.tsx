'use client';

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';

import { LeadDisplay } from '@/component/LeadDisplay';
import { AppHeader, Tab } from '@/component/AppHeader';
import { Button } from '@/component/Button';
import { TextInput } from '@/component/form/TextInput';
import { CreateLeadForm } from '@/component/lead/CreateLeadForm';
import { DialogHeader } from '@/component/surface/DialogHeader';
import { LeadResource } from '@/resource/Lead';
import { LeadQueryParams, listLeads } from '@/service/LeadService';
import { Debouncer } from '@/util/Debouncer';
import Style from '@/style/screen.module.css';

export default function Home() {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const debounceRef = useRef(new Debouncer(queryLeads, 1200));

	const [tab, setTab] = useState<Tab>(Tab.Invited);
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

	function handleSearchInput(event: ChangeEvent<HTMLInputElement>) {
		const term = event.target.value || undefined;
		debounceRef.current.execSafeAbort({ status: tab, search: term });
	}

	function handleSearchForm(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		debounceRef.current.abort();
		const data = new FormData(event.target as HTMLFormElement);
		const term = (data.get('search') as string) || undefined;
		queryLeads({ status: tab, search: term });
	}

	function handleLeadCreated() {
		alert('Lead created');
		dialogRef.current?.close();
		debounceRef.current.abort();
		queryLeads({ status: tab });
	}

	useEffect(() => {
		queryLeads({ status: tab });
	}, [tab]);

	return (
		<div className={Style.container}>
			<AppHeader
				tab={tab}
				onTabAccepted={() => setTab(Tab.Accepted)}
				onTabInvited={() => setTab(Tab.Invited)}
			/>

			<form className={Style.search_form} onSubmit={handleSearchForm}>
				<TextInput
					name="search"
					label="Search"
					inputMode="search"
					fullwidth
					onChange={handleSearchInput}
				/>
				<div className={Style.search_footer}>
					<Button type="button" variant="primary" onClick={() => dialogRef.current?.showModal()}>
						Novo
					</Button>
				</div>
			</form>

			<dialog ref={dialogRef}>
				<DialogHeader title="New lead" onClose={() => dialogRef.current?.close()} />
				<CreateLeadForm onLeadCreated={handleLeadCreated} />
			</dialog>

			<main className={Style.content_list}>
				{leads.map(lead => (
					<LeadDisplay
						key={lead.id}
						className={Style.lead_item}
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
