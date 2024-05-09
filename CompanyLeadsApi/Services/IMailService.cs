using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;

namespace CompanyLeadsApi.Services;

public readonly struct MailMessage
{
    [EmailAddress]
    public required readonly string Address { get; init; }

    public required readonly string Subject { get; init; }

    public required readonly string Content { get; init; }
}

public interface IMailService
{
    Task SendMail(MailMessage message);
}
