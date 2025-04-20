FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["RestaurantOrderAPI.csproj", "."]
RUN dotnet restore "RestaurantOrderAPI.csproj"
COPY . .
RUN dotnet build "RestaurantOrderAPI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "RestaurantOrderAPI.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80
ENTRYPOINT ["dotnet", "RestaurantOrderAPI.dll"]