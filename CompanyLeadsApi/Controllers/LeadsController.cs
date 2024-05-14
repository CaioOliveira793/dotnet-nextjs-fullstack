using System;
using System.Threading.Tasks;
using System.Collections.Generic;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

using CompanyLeadsApi.Domain;
using CompanyLeadsApi.Resource;
using CompanyLeadsApi.Services;

namespace CompanyLeadsApi.Controllers;

[ApiController]
[Route("[controller]")]
public class LeadsController : ControllerBase
{
    public static readonly string SalesEmailAddress = "vendas@test.com";

    public LeadsController(ILeadRepository repository, IMailService mailService, ILogger<LeadsController> logger)
    {
        this.repository = repository;
        this.mailService = mailService;
        this.logger = logger;
    }


    [HttpGet("{id:guid}")]
    public async Task<ActionResult<LeadResource>> GetLead(Guid id)
    {
        Lead? lead = await repository.GetLead(id);
        if (lead is null)
        {
            logger.LogInformation("lead not found. ID = {}", id);
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
            bool created = await repository.CreateLead(lead);
            if (!created)
            {
                logger.LogError("could not create lead into repository due to database concurrency issue.");
                return Conflict();
            }
        }
        catch (Exception err)
        {
            logger.LogError("error inserting lead into repository. Exception = {}", err.ToString());
            // NOTE: Should return Service Unavailable since this is an intermittent error condition.
            // https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status/503
            return BadRequest();
        }

        return LeadResource.FromDomain(lead);
    }

    [HttpPut("{id:guid}/accept")]
    public async Task<ActionResult<LeadResource>> AcceptLead(Guid id, [FromBody] LeadContact contact)
    {
        Lead? lead = await repository.GetLead(id);
        if (lead is null)
        {
            logger.LogInformation("lead not found. ID = {}", id);
            return NotFound();
        }

        LeadOperationError? error = lead.Accept(contact);
        if (error is LeadOperationError)
        {
            logger.LogInformation("could not accept lead. lead.Status = {}", lead.Status);
            return UnprocessableEntity(new { message = Lead.InvalidLeadStatusMessage });
        }

        try
        {
            bool updated = await repository.UpdateLead(lead);
            if (!updated)
            {
                logger.LogError("could not update lead into repository due to database concurrency issue.");
                return Conflict();
            }
        }
        catch (Exception err)
        {
            logger.LogError("error updating lead into repository. Exception = {}", err.ToString());
            // NOTE: Should return Service Unavailable since this is an intermittent error condition.
            // https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status/503
            return BadRequest();
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
        catch (Exception err)
        {
            logger.LogError("error sending lead accepted email. Exception = {}", err.ToString());
        }

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
            logger.LogInformation("could not decline lead. lead.Status = {}", lead.Status);
            return UnprocessableEntity(new { message = Lead.InvalidLeadStatusMessage });
        }

        try
        {
            bool updated = await repository.UpdateLead(lead);
            if (!updated)
            {
                logger.LogError("could not update lead into repository due to database concurrency issue.");
                return Conflict();
            }
        }
        catch (Exception err)
        {
            logger.LogError("error updating lead into repository. Exception = {}", err.ToString());
            // NOTE: Should return Service Unavailable since this is an intermittent error condition.
            // https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status/503
            return BadRequest();
        }

        return LeadResource.FromDomain(lead);
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> DeleteLead(Guid id)
    {
        try
        {
            bool deleted = await repository.DeleteLeadByID(id);
            if (!deleted)
            {
                logger.LogInformation("lead not found. ID = {}", id);
                return NotFound();
            }
        }
        catch (Exception err)
        {
            logger.LogError("error deleting lead from repository. Exception = {}", err.ToString());
            // NOTE: Should return Service Unavailable since this is an intermittent error condition.
            // https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status/503
            return BadRequest();
        }

        logger.LogInformation("lead deleted. ID = {}", id);

        return NoContent();
    }

    private readonly ILeadRepository repository;
    private readonly IMailService mailService;
    private readonly ILogger<LeadsController> logger;
}
