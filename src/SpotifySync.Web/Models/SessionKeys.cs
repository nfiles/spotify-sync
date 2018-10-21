using System;
using System.Collections.Generic;

namespace SpotifySync.Web.Models
{
    public class SessionInfo
    {
        public string Secret { get; set; }
        public HashSet<string> ConnectionIds { get; set; }
    }
}
