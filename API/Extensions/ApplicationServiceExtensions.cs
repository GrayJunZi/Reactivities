using Application.Activities;
using Application.Core;
using Application.Interfaces;
using Infrastructure.Email;
using Infrastructure.Photos;
using Infrastructure.Security;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<DataContext>(options =>
            {
                //options.UseSqlite(configuration.GetConnectionString("DefaultConnection"));
                options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"));
            });

            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy", policy =>
                {
                    policy.AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials()
                        .WithExposedHeaders("WWW-Authenticate", "Pagination")
                        .WithOrigins("http://localhost:3000");
                });
            });

            services.AddMediatR(cfg =>
                cfg.RegisterServicesFromAssembly(typeof(List).Assembly));

            services.AddAutoMapper(typeof(MappingProfiles).Assembly);

            services.AddScoped<EmailSender>();

            services.AddScoped<IUserAccessor, UserAccessor>();
            services.AddScoped<IPhotoAccessor, PhotoAccessor>();
            services.Configure<CloudinarySettings>(configuration.GetSection("Cloudinary"));
            services.AddSignalR();

            return services;
        }
    }
}
