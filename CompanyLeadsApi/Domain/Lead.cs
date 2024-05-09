using System;
using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;

using Bogus;

namespace CompanyLeadsApi.Domain;

public record CreateLeadData
{
	[Required]
	[MinLength(2)]
	[MaxLength(64)]
	[JsonPropertyName("category")]
	public required string Category { get; init; }

	[MinLength(2)]
	[MaxLength(256)]
	[JsonPropertyName("description")]
	public string? Description { get; init; }

	[Required]
	[Range(0.01, 1000.0)]
	[JsonPropertyName("price")]
	public required decimal Price { get; init; }

	[Required]
	[MinLength(2)]
	[MaxLength(64)]
	[JsonPropertyName("contact_first_name")]
	public required string ContactFirstName { get; init; }

	[Required]
	[MinLength(2)]
	[MaxLength(128)]
	[JsonPropertyName("suburb")]
	public required string Suburb { get; init; }
}

public record LeadContact
{
	[Required]
	[MinLength(2)]
	[MaxLength(128)]
	[JsonPropertyName("full_name")]
	public required string FullName { get; init; }

	[Required]
	[EmailAddress]
	[JsonPropertyName("email")]
	public required string Email { get; init; }

	[Required]
	[Phone]
	[JsonPropertyName("phone_number")]
	public required string PhoneNumber { get; init; }
}

[JsonConverter(typeof(JsonStringEnumConverter<LeadStatus>))]
public enum LeadStatus
{
	New,
	Accepted,
	Declined,
}

public enum LeadOperationError
{
	InvalidLeadStatus,
}

public class Lead
{
	public required Guid ID { get; init; }
	public required DateTime Created { get; init; }

	public required string Category { get; set; }
	public required string? Description { get; set; }
	public required LeadStatus Status { get; set; }
	public required decimal Price { get; set; }
	public required string ContactFirstName { get; set; }
	public required string Suburb { get; set; }
	public required LeadContact? Contact { get; set; }


	public static readonly string InvalidLeadStatusMessage = "Cannot operate on a lead that is not new";

	public static Lead NewLead(CreateLeadData data)
	{
		return new Lead
		{
			ID = Guid.NewGuid(),
			Created = DateTime.Now,
			Category = data.Category,
			Description = data.Description,
			Status = LeadStatus.New,
			Price = data.Price,
			ContactFirstName = data.ContactFirstName,
			Suburb = data.Suburb,
			Contact = null,
		};
	}


	public bool CanUpdateStatus()
	{
		return this.Status is LeadStatus.New;
	}

	public LeadOperationError? Accept(LeadContact contact)
	{
		if (!this.CanUpdateStatus())
		{
			return LeadOperationError.InvalidLeadStatus;
		}

		this.Contact = contact;
		this.Status = LeadStatus.Accepted;

		if (this.IsPriceTargetedForDiscount())
		{
			this.Price = this.GetDiscountedPrice();
		}

		return null;
	}

	public LeadOperationError? Decline()
	{
		if (!this.CanUpdateStatus())
		{
			return LeadOperationError.InvalidLeadStatus;
		}

		this.Status = LeadStatus.Declined;

		return null;
	}


	private static readonly float Discount = 0.10f;
	private static readonly float PriceTargetForDiscount = 500.0f;

	private bool IsPriceTargetedForDiscount()
	{
		return this.Price > (decimal)PriceTargetForDiscount;
	}

	private decimal GetDiscountedPrice()
	{
		return this.Price - (this.Price * (decimal)Discount);
	}
}

public static class FakeLead
{
	public static DateTime GetFakeCreated()
	{
		return faker.Date.Recent();
	}

	public static string GetFakeCategory()
	{
		return faker.PickRandom(FakeCategories);
	}

	public static string GetFakeDescription()
	{
		return faker.Lorem.Sentence();
	}

	public static LeadStatus GetFakeStatus()
	{
		return faker.Random.Enum([LeadStatus.New, LeadStatus.Accepted, LeadStatus.Declined]);
	}

	public static decimal GetFakePrice()
	{
		return faker.Random.Decimal(0.01M, 1000.0M);
	}

	public static string GetFakeContactFirstName()
	{
		return faker.Name.FirstName();
	}

	public static string GetFakeSuburb()
	{
		return faker.Address.StreetAddress() + " " + faker.Address.BuildingNumber();
	}

	public static LeadContact GetFakeContact(string? firstName)
	{
		string first = firstName ?? faker.Name.FirstName();
		return new LeadContact
		{
			Email = faker.Internet.Email(first),
			FullName = first + " " + faker.Name.LastName(),
			PhoneNumber = faker.Phone.PhoneNumber(),
		};
	}

	public static Lead GetFakeLead()
	{
		string firstName = GetFakeContactFirstName();
		LeadStatus status = GetFakeStatus();

		return new Lead
		{
			ID = Guid.NewGuid(),
			Created = GetFakeCreated(),
			Category = GetFakeCategory(),
			Description = GetFakeDescription(),
			Status = status,
			Price = GetFakePrice(),
			ContactFirstName = firstName,
			Suburb = GetFakeSuburb(),
			Contact = status is LeadStatus.Accepted ? GetFakeContact(firstName) : null,
		};
	}


	private static readonly Faker faker = new Faker("en");

	private static readonly string[] FakeCategories =
	[
		"Painter", "Interior Painter", "Carpenter", "Plumber", "Electrician",
		"Engineer", "Architect", "Roofer", "Flooring installer", "Safety Manager",
		"Welder", "Drywall installer"
	];
}
