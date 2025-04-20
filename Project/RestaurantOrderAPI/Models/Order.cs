using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace RestaurantOrderAPI.Models
{
    public class Order
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId Id { get; set; } 
        public string? OrderID { get; set; }
        public string? UserID { get; set; }
        public List<OrderedFood>? FoodItems { get; set; }
        public decimal TotalPrice { get; set; }
        public string? Status { get; set; } 
    }

    public class OrderedFood
    {
        public string? FoodID { get; set; }
        public string? Name { get; set; }
        public List<string>? Options { get; set; } 
        public List<string>? Customizations { get; set; }
        public string? ImageSrc { get; set; }
    }

}
