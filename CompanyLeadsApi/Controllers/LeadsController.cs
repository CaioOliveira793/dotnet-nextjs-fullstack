using System;
using System.Threading.Tasks;
using System.Collections.Generic;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using CompanyLeadsApi.Domain;
using CompanyLeadsApi.Resource;
using CompanyLeadsApi.Services;

namespace CompanyLeadsApi.Controllers;

[ApiController]
[Route("[controller]")]
public class LeadsController : ControllerBase
{
    public static readonly string SalesEmailAddress = "vendas@test.com";

    public LeadsController(ILeadRepository repository, IMailService mailService)
    {
        this.repository = repository;
        this.mailService = mailService;
    }


    [HttpGet("{id:guid}")]
    public async Task<ActionResult<LeadResource>> GetLead(Guid id)
    {
        Lead? lead = await repository.GetLead(id);
        if (lead is null)
        {
            return NotFound();
        }

        return LeadResource.FromDomain(lead);
    }

    [HttpGet()]
    public async Task<ActionResult<IEnumerable<LeadResource>>> QueryLeads(
        [FromQuery] LeadStatus? status,
        [FromQuery] string? search,
        [FromQuery] uint? page,
        [FromQuery] uint? size
    )
    {
        PaginationMetadata pagination = new PaginationMetadata(page, size);
        LeadQuery query = new LeadQuery(status, search);

        IEnumerable<LeadResource> list = await repository.QueryLeads(query, pagination);

        return Ok(list);
    }

    [HttpPost()]
    public async Task<ActionResult<LeadResource>> CreateNewLead([FromBody] CreateLeadData data)
    {
        Lead lead = Lead.NewLead(data);

        try
        {
            await repository.CreateLead(lead);
        }
        catch (DbUpdateConcurrencyException)
        {
            return Conflict();
        }

        return LeadResource.FromDomain(lead);
    }

    [HttpPut("{id:guid}/accept")]
    public async Task<ActionResult<LeadResource>> AcceptLead(Guid id, [FromBody] LeadContact contact)
    {
        Lead? lead = await repository.GetLead(id);
        if (lead is null)
        {
            return NotFound();
        }

        LeadOperationError? error = lead.Accept(contact);
        if (error is LeadOperationError)
        {
            return UnprocessableEntity(new { message = Lead.InvalidLeadStatusMessage });
        }

        bool updated = await repository.UpdateLead(lead);
        if (!updated)
        {
            return Conflict();
        }

        try
        {
            await mailService.SendMail(new MailMessage
            {
                Address = SalesEmailAddress,
                Subject = "Lead Accepted",
                Content = $"A new lead with price {lead.Price} was accepted"
            });
        }
        catch { }

        return LeadResource.FromDomain(lead);
    }

    [HttpPut("{id:guid}/decline")]
    public async Task<ActionResult<LeadResource>> DeclineLead(Guid id)
    {
        Lead? lead = await repository.GetLead(id);
        if (lead is null)
        {
            return NotFound();
        }

        LeadOperationError? error = lead.Decline();
        if (error is LeadOperationError)
        {
            return UnprocessableEntity(new { message = Lead.InvalidLeadStatusMessage });
        }

        bool updated = await repository.UpdateLead(lead);
        if (!updated)
        {
            return Conflict();
        }

        return LeadResource.FromDomain(lead);
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> DeleteLead(Guid id)
    {
        bool deleted = await repository.DeleteLeadByID(id);
        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }

    private readonly ILeadRepository repository;
    private readonly IMailService mailService;
}
