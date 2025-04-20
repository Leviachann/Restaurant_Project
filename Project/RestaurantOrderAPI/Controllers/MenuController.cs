using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using MongoDB.Bson;
using RestaurantOrderAPI.Models;

[ApiController]
[Route("api/[controller]")]
public class MenuController : ControllerBase
{
    private readonly IMongoCollection<Menu> _menuCollection;

    public MenuController(IMongoClient client)
    {
        var database = client.GetDatabase("sample_mflix");
        _menuCollection = database.GetCollection<Menu>("Menus");
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Menu>> GetMenuById(string id)
    {
        try
        {
            Menu menu;

            if (ObjectId.TryParse(id, out ObjectId objectId))
            {
                menu = await _menuCollection.Find(m => m.Id == objectId).FirstOrDefaultAsync();
            }
            else
            {
                menu = await _menuCollection.Find(m => m.MenuID == id).FirstOrDefaultAsync();
            }

            if (menu == null)
            {
                return NotFound("Menu not found.");
            }

            Console.WriteLine($"Fetched Menu: Name: {menu.Name}, Price: {menu.Price}, ImageSrc: {menu.ImageSrc}");
            if (menu.Options != null)
            {
                Console.WriteLine("Options:");
                foreach (var option in menu.Options)
                {
                    Console.WriteLine($"- {option}");
                }
            }

            return Ok(menu);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMenu(string id, [FromBody] Menu updatedMenu)
    {
        try
        {
            if (!ObjectId.TryParse(id, out ObjectId objectId))
            {
                return BadRequest("Invalid ID format.");
            }

            var existingMenu = await _menuCollection.Find(m => m.Id == objectId).FirstOrDefaultAsync();

            if (existingMenu == null)
            {
                return NotFound("Menu not found.");
            }

            updatedMenu.Id = existingMenu.Id; 

            var filter = Builders<Menu>.Filter.Eq(m => m.Id, objectId);
            var updateResult = await _menuCollection.ReplaceOneAsync(filter, updatedMenu);

            if (updateResult.MatchedCount == 0)
            {
                return NotFound("Menu not found.");
            }

            return Ok("Menu updated successfully.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Menu>>> GetMenu()
    {
        try
        {
            var menus = await _menuCollection.Find(_ => true).ToListAsync();

            Console.WriteLine("Fetched Menus:");
            foreach (var menu in menus)
            {
                Console.WriteLine($"Menu Name: {menu.Name}, Price: {menu.Price}, ImageSrc: {menu.ImageSrc}");
                if (menu.Options != null)
                {
                    Console.WriteLine("Options:");
                    foreach (var option in menu.Options)
                    {
                        Console.WriteLine($"- {option}");
                    }
                }
            }

            return Ok(menus);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpPost]
    public async Task<IActionResult> AddMenu([FromBody] Menu menu)
    {
        try
        {
            await _menuCollection.InsertOneAsync(menu);
            Console.WriteLine($"Added Menu: {menu.Name}, Price: {menu.Price}, ImageSrc: {menu.ImageSrc}");
            return CreatedAtAction(nameof(GetMenuById), new { id = menu.Id.ToString() }, menu);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}
