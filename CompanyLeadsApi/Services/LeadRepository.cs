using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;

using CompanyLeadsApi.Domain;
using CompanyLeadsApi.Models;
using CompanyLeadsApi.Resource;

namespace CompanyLeadsApi.Services;

public class LeadRepository : ILeadRepository
{
    public LeadRepository(AppDbContext context)
    {
        _context = context;
    }


    public async Task<Lead?> GetLead(Guid id)
    {
        IQueryable<LeadModel> queryable = _context.Leads.AsQueryable();

        try
        {
            LeadModel? model = await queryable.AsNoTracking().FirstAsync(row => row.ID == id);
            return model?.ToDomain();
        }
        catch (InvalidOperationException)
        {
            return null;
        }
    }

    public async Task<IEnumerable<LeadResource>> QueryLeads(LeadQuery query, PaginationMetadata pagination)
    {
        IQueryable<LeadModel> queryable = _context.Leads.AsQueryable().AsNoTracking();

        if (query.Status is LeadStatus status)
        {
            queryable = queryable.Where(row => row.Status == status);
        }
        if (query.SearchTerm is string term)
        {
            queryable = queryable.Where(row => row.Category == term
                || row.Description != null && row.Description.Contains(term));
        }

        LeadModel[] models = await queryable
            .OrderBy(row => row.ID)
            .Skip((int)(pagination.Size * pagination.PageIndex))
            .Take((int)pagination.Size)
            .ToArrayAsync();

        return models.Select(model => model.ToResource());
    }

    public async Task<bool> CreateLead(Lead lead)
    {
        _context.Leads.Add(LeadModel.FromDomain(lead));

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            return false;
        }

        return true;
    }

    // NOTE: the in-memory database does not support "ExecuteUpdate"
    // public async Task<bool> UpdateLead(Lead lead)
    // {
    //     IQueryable<LeadModel> queryable = _context.Leads.AsQueryable();

    //     int rows = await queryable
    //         .Where(row => row.ID == lead.ID)
    //         .ExecuteUpdateAsync(setters => setters
    //             .SetProperty(row => row.Category, lead.Category)
    //             .SetProperty(row => row.Description, lead.Description)
    //             .SetProperty(row => row.Status, lead.Status)
    //             .SetProperty(row => row.Price, lead.Price)
    //             .SetProperty(row => row.ContactFirstName, lead.ContactFirstName)
    //             .SetProperty(row => row.Suburb, lead.Suburb)
    //             .SetProperty(row => row.ContactFullName, lead.Contact != null ? lead.Contact.FullName : null)
    //             .SetProperty(row => row.ContactEmail, lead.Contact != null ? lead.Contact.Email : null)
    //             .SetProperty(row => row.ContactPhoneNumber, lead.Contact != null ? lead.Contact.PhoneNumber : null)
    //         );

    //     return rows == 1;
    // }

    public async Task<bool> UpdateLead(Lead lead)
    {
        _context.Leads.Update(LeadModel.FromDomain(lead));

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            return false;
        }

        return true;
    }

    // NOTE: the in-memory database does not support "ExecuteDelete"
    // public async Task<bool> DeleteLeadByID(Guid id)
    // {
    //     IQueryable<LeadModel> queryable = _context.Leads.AsQueryable();

    //     int rows = await queryable.Where(row => row.ID == id).ExecuteDeleteAsync();

    //     return rows == 1;
    // }

    public async Task<bool> DeleteLeadByID(Guid id)
    {
        Lead? lead = await this.GetLead(id);
        if (lead is null)
        {
            return false;
        }

        _context.Leads.Remove(LeadModel.FromDomain(lead));

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            return false;
        }

        return true;
    }


    private readonly AppDbContext _context;
}
