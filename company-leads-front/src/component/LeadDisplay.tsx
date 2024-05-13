'use client';

import { HTMLAttributes, useRef } from 'react';
import { FaCircleUser } from 'react-icons/fa6';
import { FaLocationDot } from 'react-icons/fa6';
import { FaSuitcase } from 'react-icons/fa6';
import { FaPhone } from 'react-icons/fa6';
import { FaEnvelope } from 'react-icons/fa6';

import { LeadResource } from '@/resource/Lead';
import { Button } from '@/component/Button';
import { DialogHeader } from '@/component/surface/DialogHeader';
import { AcceptLeadForm } from '@/component/lead/AcceptLeadForm';
import { classes } from '@/util/StyleHelper';

import {
	formatLeadCreated,
	formatLeadPrice,
	formatPhoneLink,
	formatEmailLink,
} from '@/formatter/LeadFormatter';

import TypographyStyle from '@/style/typography.module.css';
import Style from '@/component/LeadDisplay.module.css';
import { declineLead } from '@/service/LeadService';

export interface LeadDisplayProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	lead: LeadResource;
	onLeadAccepted?(lead: LeadResource): void;
	onLeadDeclined?(lead: LeadResource): void;
}

export function LeadDisplay({
	lead,
	onLeadAccepted,
	onLeadDeclined,
	className,
	...props
}: LeadDisplayProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);

	async function handleDeclineLead() {
		const result = await declineLead(lead.id);
		if (result.type !== 'SUCCESS') {
			alert('An unexpected error occurred while declining the lead');
			return;
		}

		onLeadDeclined?.(lead);
	}

	function handleLeadAccepted(lead: LeadResource) {
		alert('Lead accepted');
		dialogRef.current?.close();
		onLeadAccepted?.(lead);
	}

	const name = lead.contact?.full_name ?? lead.contact_first_name;
	const showMoreInfo = Boolean(lead.description) || lead.contact !== null;
	const showActions = lead.status === 'New';
	const isAccepted = lead.status === 'Accepted';

	return (
		<div className={classes(className, Style.container)} {...props}>
			<div className={Style.line_container}>
				<FaCircleUser className={Style.user_icon} />
				<div>
					<p className={Style.strong_text}>{name}</p>
					<p className={TypographyStyle.caption}>{formatLeadCreated(lead.created)}</p>
				</div>
			</div>
			<hr />

			<div className={Style.info_line}>
				<p className={Style.text_line_container}>
					<FaLocationDot /> {lead.suburb}
				</p>
				<strong className={classes(Style.normal_text, Style.text_line_container)}>
					<FaSuitcase /> {lead.category}
				</strong>
				<p>{'Job ID: ' + lead.id}</p>
				{isAccepted && <p>{formatLeadPrice(lead.price) + ' Lead Invitation'}</p>}
			</div>
			<hr />

			{showMoreInfo && (
				<div className={Style.more_info_container}>
					{lead.contact && (
						<p className={Style.spaced_line}>
							<span className={Style.text_line_container}>
								<FaPhone />
								<a href={formatPhoneLink(lead.contact.phone_number)}>
									{lead.contact?.phone_number}
								</a>
							</span>
							<span className={Style.text_line_container}>
								<FaEnvelope />
								<a href={formatEmailLink(lead.contact.email)}>{lead.contact?.email}</a>
							</span>
						</p>
					)}
					{lead.description && <p className={TypographyStyle.caption}>{lead.description}</p>}
				</div>
			)}
			{showMoreInfo && <hr />}

			{showActions && (
				<div className={Style.line_container}>
					<div className={Style.action_container}>
						<Button variant="primary" onClick={() => dialogRef.current?.showModal()}>
							Accept
						</Button>
						<Button variant="secondary" onClick={handleDeclineLead}>
							Decline
						</Button>
					</div>
					<p>
						<strong className={Style.strong_text}>{formatLeadPrice(lead.price)}</strong> Lead
						Invitation
					</p>
				</div>
			)}

			<dialog ref={dialogRef}>
				<DialogHeader title="Accept lead" onClose={() => dialogRef.current?.close()} />
				<AcceptLeadForm lead={lead} onLeadAccepted={handleLeadAccepted} />
			</dialog>
		</div>
	);
}
