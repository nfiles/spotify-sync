using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

using SpotifySync.Web.Models;
using SpotifySync.Web.Services;

namespace SpotifySync.Web.Hubs
{
    public class SyncHub : Hub
    {
        private readonly ISessionStore _sessionStore;

        public SyncHub(ISessionStore sessionStore)
        {
            _sessionStore = sessionStore;
        }

        public async Task Send(string sessionId, string hostKey, object data)
        {
            var session = _sessionStore.GetSession(sessionId);
            if (session == null)
            {
                throw new Exception("session does not exist");
            }

            if (!session.IsHost(hostKey))
            {
                throw new Exception("host key is incorrect");
            }

            var group = Clients.Group(sessionId);
            if (group == null)
            {
                throw new Exception("session group does not exist");
            }

            await group.SendAsync("send", data, Context.ConnectionAborted);
        }

        public SessionKeys StartSession()
        {
            var session = _sessionStore.StartSession();
            return new SessionKeys
            {
                SessionId = session.SessionId,
                HostKey = session.HostKey,
            };
        }

        public bool StopSession(string sessionId, string hostKey)
        {
            return _sessionStore.StopSession(sessionId, hostKey);
        }

        public async Task<bool> StartListening(string sessionId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, sessionId, Context.ConnectionAborted);

            // TODO: respond with history?
            return true;
        }

        public async Task<bool> StopListening(string sessionId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, sessionId, Context.ConnectionAborted);

            return true;
        }
    }
}