using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SpotifySync.Web.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class SpotifyController
    {

    }
}