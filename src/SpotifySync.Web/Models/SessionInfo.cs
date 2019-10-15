using System;

namespace SpotifySync.Web.Models
{
    /// <summary>
    /// Information about a single session
    /// </summary>
    public class SessionInfo
    {
        /// <summary>
        /// public identifier of the session
        /// </summary>
        public string SessionId { get; }

        /// <summary>
        /// host secret of the session
        /// </summary>
        public string HostKey { get; }

        public SessionInfo(string id, string secret)
        {
            SessionId = id;
            HostKey = secret;
        }

        public bool IsHost(string hostKey)
        {
            return string.Equals(
                HostKey,
                hostKey,
                StringComparison.InvariantCultureIgnoreCase);
        }
    }
}
