using StackExchange.Redis;
using System.Text.Json;
using RestaurantOrderAPI.Models; 

namespace RestaurantOrderAPI.Services.Redis
{
    public class RedisOrderQueueService
    {
        private readonly IDatabase _redisDb;

        public RedisOrderQueueService(IConnectionMultiplexer redis)
        {
            _redisDb = redis.GetDatabase();
        }
        public async Task AddToGettingReadyQueue(RestaurantOrderAPI.Models.Order order)
        {
            var orderJson = JsonSerializer.Serialize(order);
            await _redisDb.ListLeftPushAsync("getting_ready_queue", orderJson);
        }

        public async Task MoveToReadyQueue(string orderId)
        {
            var orderJson = await _redisDb.ListRightPopLeftPushAsync("getting_ready_queue", "ready_queue");
            if (orderJson.HasValue)
            {
                var order = JsonSerializer.Deserialize<RestaurantOrderAPI.Models.Order>(orderJson);
                if (order.OrderID == orderId)
                {
                    await _redisDb.ListLeftPushAsync("ready_queue", orderJson);
                }
            }
        }
        public async Task RemoveFromReadyQueue(string orderId)
        {
            var orderJson = await _redisDb.ListRightPopAsync("ready_queue");
            if (orderJson.HasValue)
            {
                var order = JsonSerializer.Deserialize<RestaurantOrderAPI.Models.Order>(orderJson);
                if (order.OrderID == orderId)
                {
                }
            }
        }
        public async Task<List<RestaurantOrderAPI.Models.Order>> GetGettingReadyOrders()
        {
            var orders = await _redisDb.ListRangeAsync("getting_ready_queue");
            return orders.Select(o => JsonSerializer.Deserialize<RestaurantOrderAPI.Models.Order>(o)).ToList();
        }
        public async Task<List<RestaurantOrderAPI.Models.Order>> GetReadyOrders()
        {
            var orders = await _redisDb.ListRangeAsync("ready_queue");
            return orders.Select(o => JsonSerializer.Deserialize<RestaurantOrderAPI.Models.Order>(o)).ToList();
        }
    }
}