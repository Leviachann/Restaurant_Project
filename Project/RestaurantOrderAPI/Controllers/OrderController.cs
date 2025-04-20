using Microsoft.AspNetCore.Mvc;
using RestaurantOrderAPI.Models;
using MongoDB.Driver;
using MongoDB.Bson;
using RestaurantOrderAPI.Services.Redis;

[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase
{
    private readonly IMongoCollection<Order> _orderCollection;
    private readonly RedisOrderQueueService _redisQueueService;

    public OrderController(IMongoClient client, RedisOrderQueueService redisQueueService)
    {
        var database = client.GetDatabase("sample_mflix");
        _orderCollection = database.GetCollection<Order>("Orders");
        _redisQueueService = redisQueueService;
    }

    [HttpPost]
    public async Task<IActionResult> PlaceOrder([FromBody] Order order)
    {
        if (order == null || order.FoodItems == null || order.FoodItems.Count == 0)
        {
            return BadRequest(new { error = "Order or FoodItems cannot be null." });
        }

        try
        {
            // Generate OrderID
            order.OrderID = $"{DateTime.Now:yyyyMMddHHmmss}{new Random().Next(10, 99)}";
            order.UserID = "User" + new Random().Next(1, 100); 
            order.Status = "getting-ready"; 

            var pascalCaseOrder = new Order
            {
                OrderID = order.OrderID,
                UserID = order.UserID,
                FoodItems = order.FoodItems.Select(fi => new OrderedFood
                {
                    FoodID = fi.FoodID,
                    Name = fi.Name,
                    Options = fi.Options, 
                    Customizations = fi.Customizations,
                    ImageSrc = fi.ImageSrc
                }).ToList(),
                TotalPrice = order.TotalPrice,
                Status = order.Status 
            };

            await _orderCollection.InsertOneAsync(pascalCaseOrder);
            await _redisQueueService.AddToGettingReadyQueue(order);

            return Ok(new { OrderID = order.OrderID });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpPost("move-to-ready/{orderId}")]
    public async Task<IActionResult> MoveToReadyQueue(string orderId)
    {
        try
        {
            var order = await _orderCollection.Find(o => o.OrderID == orderId).FirstOrDefaultAsync();
            if (order == null)
            {
                return NotFound("Order not found.");
            }
            order.Status = "ready";
            await _orderCollection.ReplaceOneAsync(o => o.OrderID == orderId, order);
            await _redisQueueService.MoveToReadyQueue(orderId);

            return Ok();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpPost("remove-from-ready/{orderId}")]
    public async Task<IActionResult> RemoveFromReadyQueue(string orderId)
    {
        try
        {
            var order = await _orderCollection.Find(o => o.OrderID == orderId).FirstOrDefaultAsync();
            if (order == null)
            {
                return NotFound("Order not found.");
            }
            order.Status = "completed";
            await _orderCollection.ReplaceOneAsync(o => o.OrderID == orderId, order);
            await _redisQueueService.RemoveFromReadyQueue(orderId);

            return Ok();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet("getting-ready")]
    public async Task<IActionResult> GetGettingReadyOrders()
    {
        Console.WriteLine("GET /api/Order/getting-ready called");
        try
        {
            var orders = await _orderCollection.Find(o => o.Status == "getting-ready").ToListAsync();
            return Ok(orders);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet("ready")]
    public async Task<IActionResult> GetReadyOrders()
    {
        try
        {
            var orders = await _orderCollection.Find(o => o.Status == "ready").ToListAsync();
            return Ok(orders);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet("all")]
    public async Task<ActionResult<IEnumerable<Order>>> GetAllOrders()
    {
        try
        {
            var orders = await _orderCollection.Find(_ => true).ToListAsync();

            Console.WriteLine("Fetched All Orders:");
            foreach (var order in orders)
            {
                Console.WriteLine($"Order ID: {order.OrderID}, Status: {order.Status}, Total Price: {order.TotalPrice}");
                if (order.FoodItems != null)
                {
                    Console.WriteLine("Ordered Food Items:");
                    foreach (var foodItem in order.FoodItems)
                    {
                        Console.WriteLine($"- FoodID: {foodItem.FoodID}, ImageSrc: {foodItem.ImageSrc}");
                        if (foodItem.Options != null && foodItem.Options.Count > 0)
                        {
                            Console.WriteLine("  Options:");
                            foreach (var option in foodItem.Options)
                            {
                                Console.WriteLine($"  - {option}");
                            }
                        }
                        if (foodItem.Customizations != null && foodItem.Customizations.Count > 0)
                        {
                            Console.WriteLine("  Customizations:");
                            foreach (var customization in foodItem.Customizations)
                            {
                                Console.WriteLine($"  - {customization}");
                            }
                        }
                    }
                }
            }

            return Ok(orders);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Order>> GetOrder(string id)
    {
        try
        {
            Order order;

            if (ObjectId.TryParse(id, out ObjectId objectId))
            {
                order = await _orderCollection.Find(o => o.Id == objectId).FirstOrDefaultAsync();
            }
            else
            {
                order = await _orderCollection.Find(o => o.OrderID == id).FirstOrDefaultAsync();
            }

            if (order == null)
            {
                return NotFound("Order not found.");
            }

            Console.WriteLine($"Fetched Order: OrderID: {order.OrderID}, Status: {order.Status}, Total Price: {order.TotalPrice}");
            if (order.FoodItems != null)
            {
                Console.WriteLine("Ordered Food Items:");
                foreach (var foodItem in order.FoodItems)
                {
                    Console.WriteLine($"- FoodID: {foodItem.FoodID}, ImageSrc: {foodItem.ImageSrc}");
                    if (foodItem.Options != null && foodItem.Options.Count > 0)
                    {
                        Console.WriteLine("  Options:");
                        foreach (var option in foodItem.Options)
                        {
                            Console.WriteLine($"  - {option}");
                        }
                    }
                    if (foodItem.Customizations != null && foodItem.Customizations.Count > 0)
                    {
                        Console.WriteLine("  Customizations:");
                        foreach (var customization in foodItem.Customizations)
                        {
                            Console.WriteLine($"  - {customization}");
                        }
                    }
                }
            }

            return Ok(order);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}