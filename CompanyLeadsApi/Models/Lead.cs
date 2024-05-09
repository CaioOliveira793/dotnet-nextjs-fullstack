using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using Microsoft.EntityFrameworkCore;

using CompanyLeadsApi.Domain;
using CompanyLeadsApi.Resource;

namespace CompanyLeadsApi.Models;

[Table("Leads")]
[Index(nameof(Status))]
public class LeadModel
{
	[Key]
	[Required]
	public required Guid ID { get; init; }

	[Required]
	public required DateTime Created { get; init; }

	[Required]
	[Column(TypeName = "varchar(64)")]
	public required string Category { get; set; }

	[Column(TypeName = "varchar(256)")]
	public required string? Description { get; set; }

	[Required]
	public required LeadStatus Status { get; set; }

	[Required]
	[Precision(5, 2)]
	[Column(TypeName = "decimal(5, 2)")]
	public required decimal Price { get; set; }

	[Required]
	[Column(TypeName = "varchar(64)")]
	public required string ContactFirstName { get; set; }

	[Required]
	[Column(TypeName = "varchar(128)")]
	public required string Suburb { get; set; }

	[Column(TypeName = "varchar(128)")]
	public required string? ContactFullName { get; set; }

	public required string? ContactEmail { get; set; }

	public required string? ContactPhoneNumber { get; set; }


	public static LeadModel FromDomain(Lead lead)
	{
		return new LeadModel
		{
			ID = lead.ID,
			Created = lead.Created,
			Category = lead.Category,
			Description = lead.Description,
			Status = lead.Status,
			Price = lead.Price,
			ContactFirstName = lead.ContactFirstName,
			Suburb = lead.Suburb,
			ContactFullName = lead.Contact?.FullName,
			ContactEmail = lead.Contact?.Email,
			ContactPhoneNumber = lead.Contact?.PhoneNumber,
		};
	}

	public LeadResource ToResource()
	{
		return new LeadResource
		{
			ID = this.ID,
			Created = this.Created,
			Category = this.Category,
			Description = this.Description,
			Status = this.Status,
			Price = this.Price,
			ContactFirstName = this.ContactFirstName,
			Suburb = this.Suburb,
			Contact = this.ToLeadContact(),
		};
	}

	public void SyncFromDomain(Lead lead)
	{
		this.Category = lead.Category;
		this.Description = lead.Description;
		this.Status = lead.Status;
		this.Price = lead.Price;
		this.ContactFirstName = lead.ContactFirstName;
		this.Suburb = lead.Suburb;
		this.SyncLeadContact(lead.Contact);
	}

	public void SyncLeadContact(LeadContact? contact)
	{
		this.ContactFullName = contact?.FullName;
		this.ContactEmail = contact?.Email;
		this.ContactPhoneNumber = contact?.PhoneNumber;
	}

	public Lead ToDomain()
	{
		return new Lead
		{
			ID = this.ID,
			Created = this.Created,
			Category = this.Category,
			Description = this.Description,
			Status = this.Status,
			Price = this.Price,
			ContactFirstName = this.ContactFirstName,
			Suburb = this.Suburb,
			Contact = this.ToLeadContact()
		};
	}

	public LeadContact? ToLeadContact()
	{
		if (this.ContactFullName is null
			|| this.ContactEmail is null
			|| this.ContactPhoneNumber is null)
		{
			return null;
		}

		return new LeadContact
		{
			FullName = this.ContactFullName,
			Email = this.ContactEmail,
			PhoneNumber = this.ContactPhoneNumber,
		};
	}
}
