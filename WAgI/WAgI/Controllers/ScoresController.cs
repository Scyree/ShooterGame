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

        // GET: Scores
        public async Task<IActionResult> Index()
        {
            return View(await _context.Scores.OrderBy(score => score.Value).ToListAsync());
        }

        public IActionResult StackOverflowApi()
        {
            return View();
        }

        // POST: Scores/Create
        //[HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(string nickname, int value)
        {
            _context.Add(Score.CreateScore(nickname, value));

            await _context.SaveChangesAsync();

            return RedirectToAction("Index", "Home");
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
