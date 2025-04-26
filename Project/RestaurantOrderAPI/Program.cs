using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using MongoDB.Driver;
using StackExchange.Redis;
using RestaurantOrderAPI.Services.Redis;
using RestaurantOrderAPI.Services;

var builder = WebApplication.CreateBuilder(args);

var mongoConnection = builder.Configuration.GetConnectionString("MongoDbConnection");
var redisConnection = builder.Configuration.GetConnectionString("RedisConnection");

builder.Services.AddSingleton<IMongoClient>(_ =>
{
    Console.WriteLine($"Using MongoDB connection: {mongoConnection}");
    return new MongoClient(mongoConnection);
});

builder.Services.AddSingleton<IConnectionMultiplexer>(_ =>
{
    Console.WriteLine($"Using Redis connection: {redisConnection}");
    var redisOptions = ConfigurationOptions.Parse(redisConnection);
    return ConnectionMultiplexer.Connect(redisOptions);
});

builder.Services.AddScoped<RedisOrderQueueService>();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors("AllowAll");

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();
app.UseAuthorization();
app.MapControllers();

app.Run();