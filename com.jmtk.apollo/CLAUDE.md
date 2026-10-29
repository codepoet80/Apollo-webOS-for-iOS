# Apollo (com.jmtk.apollo)

Third-party Pandora client for the HP TouchPad, written in 2012 on **Enyo 1** (webOS 3.x). It is a port of Palm's original Mojo Pandora app: `source/core/` is the Palm playback/API engine largely untouched, `source/*.js` is the Enyo UI layered on top. 1.2.8 was released to App Museum II (webOS Archive) on 2026-09-17; 1.2.9 (splash, now-playing info, skip-while-loading fix) is not released yet.

Lives in the Apollo-iOS git repository beside the phone app (`../com.jmtk.apollophone`) and the iOS app that hosts both; see `../README.md`. `CODE_REVIEW.md` holds the open review findings; its "Bugs" section is done, the platform and maintainability sections are still open.

## Platform constraints

- 2009-era WebKit: `var` only, no `let`/`const`, arrow functions, template literals, Promises. Prototype 1.7 is bundled (`Hash`, `Class.create`, `Ajax.Request`, `bind`, `curry`).
- Enyo 1, not Enyo 2. Kinds are declared with `enyo.kind({name: ...})` and become globals by name. `this.$` is only valid after `create()`. Always call `this.inherited(arguments)` in lifecycle methods.
- Every JS/CSS file must be listed in `depends.js` or it silently does not load. Enyo auto-loads `depends.js`, so `dashboard.html` gets the whole app too.
- A `webos-mcp` MCP server is available with platform knowledge (`webos://knowledge/*`); read `gotchas`, `enyo`, `application-events`, `exhibition`, `alarms` before touching related code.

## Build, install, test

```
palm-package -o <outdir> .          # produces com.jmtk.apollo_<ver>_all.ipk
palm-install <outdir>/com.jmtk.apollo_<ver>_all.ipk
```

- **Bump `version` in `appinfo.json` before every install.** palm-install silently refuses a same-or-lower version. Keep the `#.#.#` format (App Museum II requires it) and add an entry to the changelog block in `index.html`.
- After installing, close the Apollo card completely and relaunch; webOS caches Enyo apps. If behaviour still looks stale, a Luna restart clears it.
- Only one novacom session can exist at a time. Kill any `palm-log` before `palm-install` (`pkill -f palm-log`).
- Syntax check with `node --check <file>` before packaging; there are no tests.

## Reading device logs

`palm-log -f com.jmtk.apollo` connects but stalls after a minute or two on this setup and leaves java processes holding novacom. Use the syslog directly:

```
novacom run file:///bin/grep -- -E 'completed.normally|Station.next|canplay' /var/log/messages
```

novacom splits arguments on spaces, so use `.` for spaces in the pattern. App log lines appear as `com.jmtk.apollo: PANDORA> ...`. Logging is on because `index.html` forces `AppGlobals.debug = true`. For live watching, poll that grep every ~20 s and emit only new lines.

## Architecture

- `index.html` creates the singletons `AppGlobals`, `Api`, `MessageDispatcher`, `DeviceService` (device only), then renders `EnyoPandora` (a `Pane` with `splash` and `interface` views). `dashboard.html` is the notification-area window and receives those singletons through `enyo.windowParams`.
- **MessageDispatcher** is the app-wide pub/sub; event names are `AppConstants.EVENT_*` in `source/core/api.js`. UI kinds subscribe in `ready()`/`create()` and must unsubscribe on teardown.
- **Persistence** (`source/core/persistence.js`) wraps `Mojo.Depot` (`lib/depot.js`). `AppGlobals` extends it; `restore()` reads all keys asynchronously and calls back into the splash `initializePandora` once the station list arrives. Depot calls are async: never read right after a remove without waiting for the callback.
- **Api** (`source/core/api.js`) speaks Pandora JSON API v5 with Blowfish-encrypted bodies. Every call takes a delegate from `source/core/delegate/` whose `onSuccess`/`onError` run after `BaseDelegate` has handled global errors and re-auth.
- **Playback**: `Station` owns a `PlaylistService` (500 ms `setInterval` loop in `source/core/playlist_service.js`) that pulls playlists, calls `station.next()`, and retries. `Track` wraps a recycled `<audio>` element from `AudioPool` and drives `EVENT_ON_TRACK_CHANGE`, `EVENT_ON_PLAY_PROGRESS`, `EVENT_ON_TOGGLE_PAUSE`. `AudioAd` extends `Track`.
- **`Station.isPaused` must mirror reality.** `Track.pause()/pauseIfPlaying()/playIfPaused()` return the resulting paused state and `Station` assigns it; never toggle the flag. A desync here caused the "pauses at the start of every other song" bug fixed in 1.2.8.
- **Network outages**: `PlaylistService.run()` only counts missing internet toward `NETWORK_ERROR_THRESHOLD` when it actually needs the network, and `DeviceService.onNetworkEvent` calls `playlistService.networkAvailable()` to restart it. Before 1.2.8 a 6-second Wi-Fi blip stopped playback at the end of the song.
- **Exhibition (Touchstone dock) mode** is detected via `enyo.windowParams.windowType == "dockModeWindow" && dockMode`. `source/exhibition.js` is the dock UI; `EnyoPandora.unfocusApp` closes the app when a dock-launched window is deactivated.
- **App Timeout** uses `palm://com.palm.power/timeout` with key `settings.ALARM_KEY`; the relaunch arrives in `EnyoPandora.onRelaunch` with `params.appTimeout`.

## Known leftovers

See `CODE_REVIEW.md`. Notable: Mojo dead code in several delegates, three copies of `formatTrackData`/`rateSong`, `api.js` sends `av=1.1.0`, auth tokens go over plain HTTP by design of the Palm client. The `user_id` API parameter was corrected to `userId` in 1.2.8 and the sign-out flow was reworked; both were verified live on the TouchPad (sign-out/sign-in tested 2026-09-17).
