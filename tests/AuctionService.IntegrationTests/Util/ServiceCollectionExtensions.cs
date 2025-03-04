using AuctionService.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace AuctionService.IntegrationTests.Util
{
    public static class ServiceCollectionExtensions
    {
        public static void RemoveDbContext<T>(this IServiceCollection services) where T : AuctionDbContext
        {
            var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<T>));

            if (descriptor != null) services.Remove(descriptor);
        }

        public static void EnsureCreated<T>(this IServiceCollection services) where T : AuctionDbContext
        {
            var sp = services.BuildServiceProvider();

            using var scope = sp.CreateScope();
            var scopedServices = scope.ServiceProvider;
            var db = scopedServices.GetRequiredService<T>();

            db.Database.Migrate();
            DbHelper.InitDbForTests(db);
        }
    }
}
