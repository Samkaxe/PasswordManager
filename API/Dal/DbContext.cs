using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Dal;

public class ApplicationDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Website> Websites { get; set; }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        
        modelBuilder.Entity<User>()
            .HasMany(u => u.Websites)
            .WithOne(w => w.User)
            .HasForeignKey(w => w.UserId);
    }
}