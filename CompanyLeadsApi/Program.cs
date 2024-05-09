using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Builder;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;

using CompanyLeadsApi.Models;
using CompanyLeadsApi.Services;

namespace CompanyLeadsApi;

internal class CompanyLeadsApplication
{
    public static void Main(string[] args)
    {
        WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

        builder.Services.AddDbContext<AppDbContext>(options =>
        {
            options.UseInMemoryDatabase("LeadsDB");
        });
        builder.Services.AddScoped<IMailService, LocalMailService>();
        builder.Services.AddScoped<ILeadRepository, LeadRepository>();
        builder.Services.AddControllers();

        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        WebApplication app = builder.Build();
        ConfigureWebApp(app);
        app.Run();
    }

    private static void ConfigureWebApp(WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        if (app.Environment.IsProduction())
        {
            app.UseHttpsRedirection();
        }

        app.UseRouting();
        app.UseAuthorization();
        app.MapDefaultControllerRoute();
        app.MapControllers();
    }
}
