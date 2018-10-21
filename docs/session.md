# how does the sync part work?

host: sends updates

listeners:

- poll for updates? (simpler)
- real-time updates with SignalR? (yes)

Session
---
host id *\
host secret\
timestamp\
track id\
position

what if the host pauses her track?


workflow
---

the host starts a session
- send "start session" request to server
- server responds with session host public and private key.

listeners enter the public key to start listening to the stream of updates
- send "listen to session" request to server through signalr
- server notes that signalr connection id and adds it to the "listeners" for the session

the host periodically sends updates about current playback position
- send "progress" signalr message to server with the params
  - session host key
  - track id
  - track position
  - track playback speed?
  - some timestamp? from spotify
- NEXT: if the track is nearing the end and the user has another track queued up, notify listeners of the upcoming track

listeners listen to the stream of updates
- keep track of playback position in current track, and update if it is too out-of-sync. Probably don't query this, it will be an extra communication leg. We aren't concerned with perfect real-time syncing
- if track id changes, start playing new track at the given position
