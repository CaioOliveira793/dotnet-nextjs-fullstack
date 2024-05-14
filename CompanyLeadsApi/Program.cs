using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Cors.Infrastructure;

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

        builder.Services.AddCors(options =>
        {
            ConfigureCorsOptions(options, builder.Environment);
        });

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

        app.UseCors();
        app.UseRouting();
        app.UseAuthorization();
        app.MapDefaultControllerRoute();
        app.MapControllers();
    }

    private static void ConfigureCorsOptions(CorsOptions options, IWebHostEnvironment environment)
    {
        CorsPolicyBuilder builder = new();
        CorsPolicy policy;

        if (environment.IsDevelopment())
        {
            policy = builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader().Build();
        }
        else
        {
            policy = builder.WithOrigins("http://mycompanyleads.com", "http://www.mycompanyleads.com").Build();
        }

        options.AddDefaultPolicy(policy);
    }
}
