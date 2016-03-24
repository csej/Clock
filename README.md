**Talking Clock Project**
===================

Live demo [here](http://boost-hit.com:5000/).

Goal
---
Our goal is to build a **talking clock** with the following specifications :

- Clients sole responsability is to retrieve and play audio files
- A server acts as the time reference, build on-the-fly audio files and triggers 'play events'
- Use of an external text2speech solution is disallowed (otherwise [eSpeak](http://espeak.sourceforge.net/) will kindly do the job)
- Homemade talks are composed thanks to the minimum set of personal audio patterns



Design choices
----------------
- **HTML5 Audio tag** for broad client support
- Default use of **.ogg** audio file (fallback to .mp3 if client requires)
- **Node.js, socket.io and node-schedule** for sync management from server side



Preliminary treatments
----------------------
1. We record a minimum list of elementary voice patterns "0, 1, et 1, 2:16, 20, 30, 40, 50, heure, minute, seconde" using an iPhone voice recorder
2. [Audacity](http://www.audacityteam.org/) "Sound Finder" & "Export Multiple” functions are then used to isolate and split patterns from previous record
3. Finally, a Python script uses [Sox](http://sox.sourceforge.net/) to recompose an exhaustive list of spoken numbers ranging from 0 to 59



Workflow
--------
1. The server emits regularly a 'play event' with respect to a 5 seconds node-schedule
2. Clients retrieve the current audio file and start playing
3. During that time, the server prepares the next file to play : Sox composes on-the-fly audio sentences (join & merge elementary audio patterns) and persists corresponding ogg and mp3 files



Concluding remarks
--------

- An other tempting approach is to run a streaming server as [IceCast](http://icecast.org/) feeded by [ezStream](http://icecast.org/ezstream/) it-self plugged on a dynamically generated list of audio files. This approach is misleading : managing time sync on server side (both at inception and periodic resets) is tricky in this framework
- Finally, a valid (but cumbersome) way is to use a [WebRTC](https://webrtc.org/) framework. It's over optimized for our needs and we haven't tested it
- Last word : our solution doesn't take into account client internet bandwidth. UX will be poor if it's too low !
