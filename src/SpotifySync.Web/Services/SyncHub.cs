using System;
using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using SpotifySync.Web.Models;

namespace SpotifySync.Web.Services
{
    public class SyncHub : Hub
    {
        private readonly ConcurrentDictionary<string, SessionInfo> _sessions
            = new ConcurrentDictionary<string, SessionInfo>(StringComparer.InvariantCultureIgnoreCase);

        /// <summary>
        /// Map of session host key -> signalR group name of listening sessions
        /// </summary>
        /// <typeparam name="string">session host key (private)</typeparam>
        /// <typeparam name="string">signalR group name (public)</typeparam>
        private readonly ConcurrentDictionary<string, string> _sessions2
            = new ConcurrentDictionary<string, string>(StringComparer.InvariantCultureIgnoreCase);

        public async Task Send(string data)
        {
            await Clients.All.SendAsync("send", data);
        }

        public SessionKeys StartSession()
        {
            var keys = new SessionKeys
            {
                Public = Guid.NewGuid().ToString().Replace("-", "").Substring(0, 8),
                Private = Guid.NewGuid().ToString().Replace("-", "").Substring(0, 8),
            };
            if (!_sessions2.TryAdd(keys.Private, keys.Public))
            {
                throw new Exception("Failed to create the new session");
            }

            // respond with host and public keys for the session
            return keys;
        }

        public bool StopSession(string sessionSecret)
        {
            lock(_sessions2){
                
            }
            if (!_sessions2.TryGetValue(sessionSecret, out info))
            {
                throw new Exception($"Session not found: {sessionId}");
            }

            if (!string.Equals(sessionSecret, info.Secret, StringComparison.InvariantCultureIgnoreCase))
            {
                throw new Exception("Session secret key does not match");
            }

            if (!_sessions.TryRemove(sessionId, out info))
            {
                throw new Exception("Failed to remove session");
            }

            return true;
        }

        public bool StartListening(string sessionId)
        {
            SessionInfo info;
            if (!_sessions.TryGetValue(sessionId, out info))
            {
                throw new Exception("session not found");
            }

            info.ConnectionIds.Add(Context.ConnectionId);

            // respond with history?
            return true;
        }

        public Task StopListening(string sessionId)
        {
            SessionInfo info;
            if (!_sessions.TryGetValue(sessionId, out info))
            {
                throw new Exception("session not found");
            }

            info.ConnectionIds.Remove(Context.ConnectionId);
        }

        public Task Update(string sessionPrivate)
        {
            throw new NotImplementedException();
        }
    }
}
