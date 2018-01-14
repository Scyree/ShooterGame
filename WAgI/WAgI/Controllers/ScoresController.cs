using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WAgI.Data;
using WAgI.Entities;

namespace WAgI.Controllers
{
    public class ScoresController : Controller
    {
        private readonly DatabaseContext _context;

        public ScoresController(DatabaseContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            return View();
        }

        // GET: Scores
        [Route("Scores/Highscore/{pageNumber}")]
        public async Task<IActionResult> Highscore(int pageNumber)
        {
            TempData["pageIndex"] = pageNumber;
            var scoresCount = _context.Scores.Count();

            if (pageNumber < 1 || (pageNumber - 1) * 10 > scoresCount)
            {
                return Redirect("1");
            }

            if (scoresCount % 10 == 0)
            {
                TempData["lastPageNumber"] = scoresCount / 10;
            }
            else
            {
                TempData["lastPageNumber"] = scoresCount / 10 + 1;
            }
            
            return View(await _context.Scores
                .OrderBy(score => score.Value)
                .Skip((pageNumber - 1) * 10)
                .Take(10)
                .ToListAsync()
            );
        }

        // POST: Scores/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task Create(string nickname, int value)
        {
            _context.Add(Score.CreateScore(nickname, value));

            await _context.SaveChangesAsync();
        }

        // POST: Scores/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task DeleteConfirmed(Guid id)
        {
            var score = await _context.Scores.SingleOrDefaultAsync(m => m.Id == id);

            _context.Scores.Remove(score);

            await _context.SaveChangesAsync();
        }

        //private bool ScoreExists(Guid id)
        //{
        //    return _context.Scores.Any(e => e.Id == id);
        //}
    }
}
