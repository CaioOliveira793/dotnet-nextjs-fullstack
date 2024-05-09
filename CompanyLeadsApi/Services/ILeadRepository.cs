using System;
using System.Collections.Generic;
using System.Threading.Tasks;

using CompanyLeadsApi.Domain;
using CompanyLeadsApi.Resource;

namespace CompanyLeadsApi.Services;

public readonly struct LeadQuery
{
    public readonly LeadStatus? Status { get; init; }

    public readonly string? SearchTerm { get; init; }

    public LeadQuery(LeadStatus? status, string? searchTerm)
    {
        this.Status = status;
        this.SearchTerm = SanitizeSearchTerm(searchTerm);
    }

    public static string? SanitizeSearchTerm(string? searchTerm)
    {
        string? term = searchTerm?.Trim();
        return term?.Substring(0, Math.Min(term.Length, (int)MAX_SEARCH_TERM_LENGTH));
    }

    public const uint MAX_SEARCH_TERM_LENGTH = 32;
}

public readonly struct PaginationMetadata
{
    public readonly uint PageIndex { get; init; }

    public readonly uint Size { get; init; }

    public PaginationMetadata(uint? pageIndex, uint? size = DEFAULT_PAGE_SIZE)
    {
        this.PageIndex = pageIndex ?? 0;
        this.Size = size is 0 or null ? DEFAULT_PAGE_SIZE : (uint)size;
    }

    public PaginationMetadata() : this(0, 0)
    { }

    public const uint DEFAULT_PAGE_SIZE = 30;
}

public interface ILeadRepository
{
    Task<Lead?> GetLead(Guid id);

    Task<IEnumerable<LeadResource>> QueryLeads(LeadQuery query, PaginationMetadata pagination);

    Task<bool> CreateLead(Lead lead);

    Task<bool> UpdateLead(Lead lead);

    Task<bool> DeleteLeadByID(Guid id);
}
