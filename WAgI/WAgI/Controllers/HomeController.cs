using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WAgI.Data;
using WAgI.Entities;

namespace WAgI.Controllers
{
    public class HomeController : Controller
    {
        private readonly DatabaseContext _context;

        public HomeController(DatabaseContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult About()
        {
            return View();
        }

        public IActionResult HowToPlay()
        {
            return View();
        }

        public IActionResult Intro()
        {
            return View();
        }

        public IActionResult Intro2()
        {
            return View();
        }

        public IActionResult Play()
        {
            return View();
        }

        public IActionResult StackOverflowApi()
        {
            return View();
        }

        public async Task<IActionResult> SearchScoresByNickname(string nickname)
        {
            var scores = new List<Score>();

            if (!string.IsNullOrEmpty(nickname))
            {
                scores = await _context.Scores
                    .Where(score => score.Nickname.ToLower().Contains(nickname.ToLower()))
                    .OrderBy(score => score.Value)
                    .ToListAsync();
            }

            return View(scores);
        }

        // GET: Home
        [Route("Home/Highscore/{pageNumber}")]
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
                .OrderByDescending(score => score.Value)
                .Skip((pageNumber - 1) * 10)
                .Take(10)
                .ToListAsync()
            );
        }

        // POST: Home/Create
        public async Task<IActionResult> Create(string nickname, int value)
        {
            _context.Add(Score.CreateScore(nickname, value));

            await _context.SaveChangesAsync();

            return View("Index");
        }

        // POST: Home/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task DeleteConfirmed(Guid id)
        {
            var score = await _context.Scores.SingleOrDefaultAsync(m => m.Id == id);

            _context.Scores.Remove(score);

            await _context.SaveChangesAsync();
        }
    }
}
