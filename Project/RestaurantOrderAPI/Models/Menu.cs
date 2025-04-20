using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace RestaurantOrderAPI.Models
{
    public class Menu
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId Id { get; set; }
        public string? MenuID { get; set; }
        public string? Name { get; set; }
        public decimal? Price { get; set; }
        public List<string>? Options { get; set; }
        public List<Customization>? Customizations { get; set; }
        public string? ImageSrc { get; set; } 
    }

    public class Customization
    {
        public string? IngredientID { get; set; }
        public double PriceAdjustment { get; set; }
    }
}
