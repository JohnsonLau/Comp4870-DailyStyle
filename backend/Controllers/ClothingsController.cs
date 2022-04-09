#nullable disable
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Collections.ObjectModel;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [EnableCors("CorsPolicy")]
    [Authorize]
    [ApiController]
    public class ClothingsController : ControllerBase
    {
        private readonly DailyStyleDBContext _context;


        public ClothingsController(DailyStyleDBContext context)
        {
            _context = context;
        }
        
        // PUT: api/Clothings/random
        [HttpPut("random")]
        public async Task<ActionResult<IEnumerable<Clothing>>> GetRandomClothings(Dictionary<String, String[]> requestBody)
        {
            requestBody.TryGetValue("Tags", out String[] sTags);
            Collection<Clothing> clothings = new Collection<Clothing>();
            foreach (String TagId in sTags)
            {
                try
                {
                    int Tagid = Int32.Parse(TagId);
                    Tag tag = await _context.Tags.Include(i => i.Clothings).Where(i => i.Id == Tagid).FirstAsync();
                    int randomIndex = new Random().Next(0, tag.Clothings.Count);
                    int currentIntex = 0;
                    foreach (Clothing clothing in tag.Clothings)
                    {
                        if (currentIntex == randomIndex)
                        {
                            clothings.Add(clothing);
                            break;
                        }
                        currentIntex++;
                    }
                }
                catch (FormatException)
                {
                    return BadRequest();
                }
            }

            return clothings;
        }

        // PUT: api/clothings/random/favourites
        [HttpPut("random/favourites")]
        public async Task<ActionResult<IEnumerable<Clothing>>> GetRandomFavouriteClothings(Dictionary<String, String[]> requestBody)
        {
            requestBody.TryGetValue("Tags", out String[] sTags);
            Collection<Clothing> clothings = new Collection<Clothing>();
            foreach (String TagId in sTags)
            {
                try
                {
                    int Tagid = Int32.Parse(TagId);
                    Tag tag = await _context.Tags.Include(i => i.Clothings
                        .Where(Clothings => Clothings.isFavorite == true)).Where(i => i.Id == Tagid).FirstAsync();
                    int randomIndex = new Random().Next(0, tag.Clothings.Count);
                    int currentIntex = 0;
                    foreach (Clothing clothing in tag.Clothings)
                    {
                        if (currentIntex == randomIndex)
                        {
                            clothings.Add(clothing);
                            break;
                        }
                        currentIntex++;
                    }
                }
                catch (FormatException)
                {
                    return BadRequest();
                }
            }

            return clothings;
        }


        // POST: api/Clothings
        [HttpPost]
        public async Task<ActionResult<Clothing>> PostClothing(Dictionary<String, String[]> requestBody)
        {
            requestBody.TryGetValue("Title", out String[] Title);
            requestBody.TryGetValue("Description", out String[] Description);
            requestBody.TryGetValue("ImageType", out String[] ImageType);
            requestBody.TryGetValue("Image", out String[] Image);
            requestBody.TryGetValue("Tags", out String[] sTags);


            Clothing clothing = new Clothing
            {
                Title = Title[0],
                Description = Description[0],
                Image = Convert.FromBase64String(Image[0]),
                ImageType = ImageType[0],
                UserId = this.User.FindFirst(ClaimTypes.NameIdentifier).Value
            };

            clothing.Tags = new Collection<Tag>();
            foreach (String TagId in sTags)
            {
                try
                {
                    int Tagid = Int32.Parse(TagId);
                    Tag tag = await _context.Tags.FindAsync(Tagid);
                    clothing.Tags.Add(tag);
                }
                catch (FormatException)
                {
                    return BadRequest();
                }
            }

            _context.Clothings.Add(clothing);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetClothing", new { id = clothing.Id }, clothing);
        }


        // GET: api/Clothings
        // This get route will get all clothings for A user
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Clothing>>> GetClothings()
        {
            return await _context.Clothings.Where(c => c.UserId == this.User.FindFirst(ClaimTypes.NameIdentifier).Value).Include(c=>c.Tags).ToListAsync();
        }

        // GET: api/Clothings/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Clothing>> GetClothing(int? id)
        {
            var clothing = await _context.Clothings.Where(c => c.Id == id).Include(c=>c.Tags).FirstAsync();

            //if this clothing does not belong to the user, return a 404
            if (clothing == null || clothing.UserId != this.User.FindFirst(ClaimTypes.NameIdentifier).Value)
            {
                return NotFound();
            }
            return clothing;
        }


        // PUT: api/Clothings/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutClothing(int? id, Dictionary<String, String[]> requestBody)
        {

            var oldClothing = await _context.Clothings.FindAsync(id);

            //if this clothing does not belong to the user, return a 404
            if (oldClothing == null || oldClothing.UserId != this.User.FindFirst(ClaimTypes.NameIdentifier).Value)
            {
                return NotFound();
            }

            requestBody.TryGetValue("Title", out String[] Title);
            requestBody.TryGetValue("Description", out String[] Description);
            requestBody.TryGetValue("ImageType", out String[] ImageType);
            requestBody.TryGetValue("Image", out String[] Image);
            requestBody.TryGetValue("Tags", out String[] sTags);

            _context.Remove(oldClothing);
            await _context.SaveChangesAsync();

            Clothing clothing = new Clothing
            {
                Title = Title[0],
                Description = Description[0],
                Image = Convert.FromBase64String(Image[0]),
                ImageType = ImageType[0],
                UserId = this.User.FindFirst(ClaimTypes.NameIdentifier).Value
            };

            clothing.Tags = new Collection<Tag>();
            foreach (String TagId in sTags)
            {
                try
                {
                    int Tagid = Int32.Parse(TagId);
                    Tag tag = await _context.Tags.FindAsync(Tagid);
                    clothing.Tags.Add(tag);
                }
                catch (FormatException)
                {
                    return BadRequest();
                }
            }

            try
            {
                _context.Clothings.Add(clothing);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClothingExists(id))
                {
                    Console.WriteLine("Clothing does not exist!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // GET: api/Clothings/fav
        [HttpGet("fav")]
        public async Task<ActionResult<IEnumerable<Clothing>>> GetFavClothings()
        {
            return await _context.Clothings.Where(c => c.UserId == this.User.FindFirst(ClaimTypes.NameIdentifier).Value && c.isFavorite == true).Include(c => c.Tags).ToListAsync();
        }

        // PUT: api/Clothings/fav/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("fav/{id}")]
        public async Task<IActionResult> PutClothing(int? id, Dictionary<String, bool> requestBody)
        {
            var oldClothing = await _context.Clothings.FindAsync(id);

            //if this clothing does not belong to the user, return a 404
            if (oldClothing == null || oldClothing.UserId != this.User.FindFirst(ClaimTypes.NameIdentifier).Value)
            {
                return NotFound();
            }

            requestBody.TryGetValue("isFavorite", out bool isFavorite);

            oldClothing.isFavorite = isFavorite;

            try
            {
                _context.Clothings.Update(oldClothing);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClothingExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();  
        }


        // DELETE: api/Clothings/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClothing(int? id)
        {
            var oldClothing = await _context.Clothings.FindAsync(id);

            //if this clothing does not belong to the user, return a 404
            if (oldClothing == null || oldClothing.UserId != this.User.FindFirst(ClaimTypes.NameIdentifier).Value)
            {
                return NotFound();
            }

            _context.Clothings.Remove(oldClothing);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ClothingExists(int? id)
        {
            return _context.Clothings.Any(e => e.Id == id);
        }
    }
}
