using Microsoft.EntityFrameworkCore;
using WAgI.Entities;

namespace WAgI.Data
{
    public interface IDatabaseContext
    {
        DbSet<Score> Scores { get; set; }

        int SaveChanges();
    }
}
