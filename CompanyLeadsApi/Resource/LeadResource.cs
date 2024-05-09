using System;
using System.Text.Json.Serialization;

using CompanyLeadsApi.Domain;

namespace CompanyLeadsApi.Resource;

public record LeadResource
{
    [JsonPropertyName("id")]
    public required Guid ID { get; init; }

    [JsonPropertyName("created")]
    public required DateTime Created { get; init; }

    [JsonPropertyName("category")]
    public required string Category { get; init; }

    [JsonPropertyName("description")]
    public string? Description { get; init; }

    [JsonPropertyName("status")]
    public required LeadStatus Status { get; init; }

    [JsonPropertyName("price")]
    public required decimal Price { get; init; }

    [JsonPropertyName("contact_first_name")]
    public required string ContactFirstName { get; init; }

    [JsonPropertyName("suburb")]
    public required string Suburb { get; init; }

    [JsonPropertyName("contact")]
    public required LeadContact? Contact { get; init; }

    public static LeadResource FromDomain(Lead lead)
    {
        return new LeadResource
        {
            ID = lead.ID,
            Created = lead.Created,
            Category = lead.Category,
            Description = lead.Description,
            Status = lead.Status,
            Price = lead.Price,
            ContactFirstName = lead.ContactFirstName,
            Suburb = lead.Suburb,
            Contact = lead.Contact,
        };
    }
}
