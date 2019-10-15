using Newtonsoft.Json;

namespace SpotifySync.Web.Models
{
    public class SessionKeys
    {
        [JsonProperty("sessionId")]
        public string SessionId { get; internal set; }

        [JsonProperty("hostKey")]
        public string HostKey { get; internal set; }
    }
}