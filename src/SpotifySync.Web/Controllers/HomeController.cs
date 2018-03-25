using System.Diagnostics;
using System.Threading.Tasks;
using AspNet.Security.OAuth.Spotify;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SpotifySync.Web.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        private readonly IAuthenticationService _authService;

        public HomeController(IAuthenticationService authService)
        {
            _authService = authService;
        }

        public async Task<IActionResult> Index()
        {
            var token = await _authService.GetTokenAsync(
                HttpContext,
                SpotifyAuthenticationDefaults.AuthenticationScheme,
                "access_token");

            ViewData["access_token"] = token;

            return View();
        }

        [HttpGet("signin")]
        [AllowAnonymous]
        public IActionResult Login([FromQuery] string redirectUri)
        {
            if (string.IsNullOrWhiteSpace(redirectUri))
            {
                redirectUri = "/";
            }

            return Challenge(
                new AuthenticationProperties { RedirectUri = redirectUri },
                SpotifyAuthenticationDefaults.AuthenticationScheme
            );
        }

        [HttpGet("signout")]
        public IActionResult Logout()
        {
            return SignOut(
                new AuthenticationProperties { RedirectUri = "/" },
                CookieAuthenticationDefaults.AuthenticationScheme
            );
        }

        public IActionResult Error()
        {
            ViewData["RequestId"] = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
            return View();
        }
    }
}
