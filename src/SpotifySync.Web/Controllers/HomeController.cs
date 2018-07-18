using System;
using System.Diagnostics;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using SpotifySync.Web.Models;

namespace SpotifySync.Web.Controllers
{
    public class HomeController : Controller
    {
        private readonly IAuthenticationService _authService;
        private readonly SpotifyConfig _spotifyConfig;

        public HomeController(
            IAuthenticationService authService,
            IOptions<SpotifyConfig> spotifyConfig)
        {
            _authService = authService;
            this._spotifyConfig = spotifyConfig?.Value
                ?? throw new ArgumentNullException(nameof(spotifyConfig));
        }

        public IActionResult Index()
        {
            return View();
        }
        public IActionResult Error()
        {
            ViewData["RequestId"] = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
            return View();
        }
    }
}
