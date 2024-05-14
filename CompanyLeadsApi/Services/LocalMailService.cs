using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace CompanyLeadsApi.Services;

public class LocalMailService : IMailService
{
    public LocalMailService(ILogger<LocalMailService> logger)
    {
        this.logger = logger;
    }

    public Task SendMail(MailMessage message)
    {
        Console.WriteLine(
            $"Mail from {FromAddress} to {message.Address}.\n\n" +
            $"Subject: {message.Subject}.\n" +
            $"Message: {message.Content}.\n");

        logger.LogInformation("email message send. Address = {}", message.Address);

        return Task.CompletedTask;
    }

    public readonly string FromAddress = "local.system@email.com";

    private readonly ILogger<LocalMailService> logger;
}
