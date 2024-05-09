using Microsoft.EntityFrameworkCore;

namespace CompanyLeadsApi.Models;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
    {
    }

    public DbSet<LeadModel> Leads { get; set; }
}
