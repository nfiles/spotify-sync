using System;
using System.Collections.Concurrent;
using SpotifySync.Web.Models;

namespace SpotifySync.Web.Services
{
    public interface ISessionStore
    {
        SessionInfo StartSession();
        bool StopSession(string sessionId, string hostKey);
        SessionInfo GetSession(string sessionId);
    }

    public class SessionStore : ISessionStore
    {
        private readonly object _lock = new object();

        /// <summary>
        /// Map of session id -> session info
        /// </summary>
        /// <typeparam name="string">session info (public)</typeparam>
        /// <typeparam name="SessionInfo">session info</typeparam>
        private readonly ConcurrentDictionary<string, SessionInfo> _sessions
            = new ConcurrentDictionary<string, SessionInfo>(StringComparer.InvariantCultureIgnoreCase);

        public SessionInfo StartSession()
        {
            lock (_lock)
            {
                /**
                 new listeners need the public key
                 host needs to delete the session via the private key
                 sending an update needs to look up the private key to map to the listeners
                 */
                var session = new SessionInfo(
                    Guid.NewGuid().ToString().Replace("-", "").Substring(0, 8),
                    Guid.NewGuid().ToString().Replace("-", "").Substring(0, 8));

                if (!_sessions.TryAdd(session.SessionId, session))
                {
                    throw new Exception("failed to create session");
                }

                // respond with session info
                return session;
            }
        }

        public bool StopSession(string sessionId, string hostKey)
        {
            lock (_lock)
            {
                var authorized = GetSession(sessionId)?.IsHost(hostKey) ?? false;
                if (!authorized)
                {
                    return false;
                }

                if (!_sessions.TryRemove(hostKey, out SessionInfo session))
                {
                    throw new Exception("Failed to remove session");
                }

                return true;
            }
        }

        public SessionInfo GetSession(string sessionId)
        {
            if (!_sessions.TryGetValue(sessionId, out SessionInfo session))
            {
                return null;
            }

            return session;
        }
    }
}
