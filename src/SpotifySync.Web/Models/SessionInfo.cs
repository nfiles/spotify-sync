using System;

namespace SpotifySync.Web.Models
{
    public class SessionKeys
    {
        /// <summary>
        /// Public name that is shared to the listeners
        /// </summary>
        public string Public { get; set; }

        /// <summary>
        /// Private key that is used to identify the host
        /// </summary>
        public string Private { get; set; }
    }
}
