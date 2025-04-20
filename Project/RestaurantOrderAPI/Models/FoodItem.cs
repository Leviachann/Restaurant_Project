using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RestaurantOrderAPI.Models
{
    public class FoodItem
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId Id { get; set; }

        public string? FoodID { get; set; }
        public string? Name { get; set; }
        public decimal Price { get; set; }
        public List<Ingredient>? Ingredients { get; set; }

        public string? ImageSrc { get; set; } 
    }
}
