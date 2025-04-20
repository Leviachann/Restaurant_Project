using Microsoft.AspNetCore.Mvc;
using RestaurantOrderAPI.Models;
using MongoDB.Driver;
using MongoDB.Bson;

[ApiController]
[Route("api/[controller]")]
public class FoodController : ControllerBase
{
    private readonly IMongoCollection<FoodItem> _foodCollection;

    public FoodController(IMongoClient client)
    {
        var database = client.GetDatabase("sample_mflix");
        _foodCollection = database.GetCollection<FoodItem>("FoodItems");
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<FoodItem>> GetFood(string id)
    {
        try
        {
            FoodItem foodItem;

            if (ObjectId.TryParse(id, out ObjectId objectId))
            {
                foodItem = await _foodCollection.Find(f => f.Id == objectId).FirstOrDefaultAsync();
            }
            else
            {
                foodItem = await _foodCollection.Find(f => f.FoodID == id).FirstOrDefaultAsync();
            }

            if (foodItem == null)
            {
                return NotFound("Food item not found.");
            }

            return Ok(foodItem);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<FoodItem>>> GetAllFoodItems()
    {
        try
        {
            var foodItems = await _foodCollection.Find(_ => true).ToListAsync();

            Console.WriteLine("Fetched Food Items:");
            foreach (var foodItem in foodItems)
            {
                Console.WriteLine($"Food Name: {foodItem.Name}, Price: {foodItem.Price}, ImageSrc: {foodItem.ImageSrc}");
                if (foodItem.Ingredients != null)
                {
                    foreach (var ingredient in foodItem.Ingredients)
                    {
                        Console.WriteLine($"- {ingredient.Name}");
                    }
                }
            }

            return Ok(foodItems);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpPost]
    public async Task<IActionResult> AddFoodItem([FromBody] FoodItem foodItem)
    {
        try
        {
            await _foodCollection.InsertOneAsync(foodItem);
            Console.WriteLine($"Added Food Item: {foodItem.Name}, Price: {foodItem.Price}, ImageSrc: {foodItem.ImageSrc}");
            return CreatedAtAction(nameof(GetFood), new { id = foodItem.Id.ToString() }, foodItem);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}
