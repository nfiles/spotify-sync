using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SpotifySync.Web.Hubs;
using SpotifySync.Web.Models;
using SpotifySync.Web.Services;

namespace SpotifySync.Web
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<SpotifyConfig>(config =>
            {
                config.ClientId = Configuration.GetValue<string>("ClientId");
                config.ClientSecret = Configuration.GetValue<string>("ClientSecret");
            });

            // services
            //     .AddAuthentication(options =>
            //     {
            //         options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            //     })
            //     .AddCookie(options =>
            //     {
            //         options.LoginPath = "/signin";
            //         options.LogoutPath = "/signout";
            //     })
            //     .AddSpotify(config =>
            //     {
            //         config.ClientId = Configuration.GetValue<string>("ClientId");
            //         config.ClientSecret = Configuration.GetValue<string>("ClientSecret");

            //         config.Scope.Add("user-read-currently-playing");
            //         config.Scope.Add("user-modify-playback-state");
            //         config.Scope.Add("user-read-playback-state");

            //         config.SaveTokens = true;

            //         config.Validate();
            //     });

            services.AddMvc();

            services.AddSignalR();

            services.AddSingleton<ISessionStore, SessionStore>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacement = true
                });
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();

            app.UseAuthentication();

            app.UseSignalR(routes =>
            {
                routes.MapHub<SyncHub>("/hub/sync");
            });

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");

                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "Home", action = "Index" });
            });
        }
    }
}
