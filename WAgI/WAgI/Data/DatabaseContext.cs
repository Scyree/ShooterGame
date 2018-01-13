using Microsoft.EntityFrameworkCore;
using WAgI.Entities;

namespace WAgI.Data
{
    public sealed class DatabaseContext : DbContext, IDatabaseContext
    {
        public DatabaseContext(DbContextOptions options) : base(options)
        {
            Database.EnsureCreated();
        }

        public DbSet<Score> Scores { get; set; }
    }
}
