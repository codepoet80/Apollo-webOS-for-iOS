# Apollo Code Review

Static review of the Enyo 1 / webOS codebase (v1.2.6), performed 2026-09-17. Not yet verified on a device or emulator. These items are worth looking into but are not the current priority.

**Before investing in fixes:** confirm the backend still answers. `tuner.pandora.com/services/json` with the embedded `palm` partner credentials is unlikely to work in 2026, and both it and `api.villo.me` require modern TLS. A stock TouchPad only gets TLS 1.2/1.3 via the Preware "TLS 1.3 Updates" package (modernize feed).

## Bugs

**All items in this section were fixed on 2026-09-17 (v1.2.8).** Sign-out/sign-in and the `user_id` change in `api.js` were both verified live on the TouchPad the same day.

Also fixed the same day, found from device logs rather than the review: a brief Wi-Fi internet-availability blip while a song was playing caused `PlaylistService.run()` to hit its error threshold within six seconds and stop itself, so nothing advanced the queue when the song ended. The service now only counts an outage when it actually needs the network, and `DeviceService` restarts it when the connection manager reports the internet is back.

- **App Timeout "Off" never cancels the alarm.** `source/settings.js:256` returns early on value 0 without calling the `clear` method on `palm://com.palm.power/timeout/`, so a previously set timer still fires and `source/EnyoPandora.js:143` closes the app. That handler also keeps running after `shutdown()`; add a `return`.
- **Track-change shutdown path is dead.** `source/settings.js:331` dispatches `EVENT_ON_SHUTDOWN` but nothing subscribes to it. `timeOfClick`/`millis` are never reset after a timeout fires.
- **Unguarded `artistExplorerUrl` can freeze the now-playing view.** `source/contentPage.js:561` calls `.replace` on a field that may be absent. The dispatcher swallows the TypeError, but the rest of `onTrackChange` (unscrim, explanation, history) never runs.
- **MessageDispatcher stops delivering on a missing handler.** `source/core/message_dispatcher.js:36` uses `break` where `continue` is meant, so one unsubscribe during dispatch silences every later listener for that event.
- **Sign-out races the database.** `source/core/delegate/disassociate_device_delegate.js:14-20` calls `removeAll()` then immediately `restore()`; Depot is async, so restore can read values that are about to be deleted. The loop at `source/EnyoPandoraInterface.js:433` calls `c.destroy()` on string keys (no-op).
- **Null station crashes in secondary views.** `source/MyDashboard.js:66,72` and `source/exhibition.js:531` dereference `AppGlobals.station` after `clearStation()` may have nulled it (e.g. station deleted while the dashboard is open).
- **Wrong `user_id` on every authenticated call.** `source/core/api.js:403` sends `partnerId` as `user_id`; Pandora's v5 API expects the user id returned by login.
- **Prototype-chain constants read too early.** `source/core/app_globals.js:34` reads `AppGlobals.NETWORK_WIFI` while `AppGlobals` is still the constructor (constants live on `.prototype`), so `networkType` starts undefined. The sort comparators at `source/core/app_globals.js:123-153` only special-case `a.isQuickMix`, making them asymmetric.
- **Splice while iterating** in `source/core/skip_limit_service.js:29-34` skips the entry after each expired one.
- **Smaller items:**
  - `source/radioList.js` defines `hideSearchPopup` twice (lines 288 and 326); line 386 references an undefined `name`; `updateList` references an undefined `results` in a dead branch.
  - `source/core/persistence.js:23,32` fetches `DB_KEY_STATISTICS` twice.
  - `source/settings.js:316` leaks an implicit global (`timeLeftUntilClose`).
  - `source/pullout.js:138` fetches a dead Clemson URL over HTTP with no failure handler; `enyo.json.parse` throws on the error page.
  - `source/EnyoPandora.js:56,65` and `source/core/app_globals.js:284` call `DeviceService` unguarded, which crashes the browser build.
  - `source/core/audio_pool.js:19-21` is unreachable; audio elements marked `broken` are never reclaimed or removed.

## webOS platform notes

- ~~**Villo loads and runs remote code on every launch.**~~ **Done 2026-09-17:** Villo library, settings UI, persisted preference, and analytics call removed entirely.
- ~~**Privacy notice is inaccurate.**~~ **Done 2026-09-17:** removed along with Villo.
- **Auth tokens travel over HTTP.** `source/core/api.js:379` builds most calls on `httpUrl` with `auth_token` in the query string. Inherited from Palm's client.
- **Exhibition launch exits on deactivation.** `source/EnyoPandora.js:76-79` closes the whole app when a dock-launched window loses focus. webOS normally leaves the app as a background card; here any deactivation, including a notification, ends playback.
- **Subscriptions:** the alarm `set` call at `source/settings.js:20` is subscribed for no reason; the headset subscription at `source/EnyoPandora.js:12` is never cancelled by `DeviceService.stop()`.
- **Mojo dead paths would throw in Enyo:** `source/core/delegate/base_delegate.js:116`, `source/core/delegate/re_auth_device_login_delegate.js:9` (also references an undefined `result`), `source/core/delegate/upgrade_device_id_login_delegate.js:8`, `source/core/delegate/share_station_delegate.js:25`, and `setDebug` at `source/core/app_globals.js:268`.
- **Embedded credentials:** partner password and Blowfish keys in `source/core/api.js` (`AppConstants.b/s/r`). Inherent to the Pandora partner API design; nothing to do, just be aware.

## Maintainability

- `formatTrackData` and `getArtUrlFromTrack` exist three times (`source/contentPage.js:499-528`, `source/exhibition.js:446-476`, `source/core/model/track.js:588-617`); only the `Track` statics are used.
- `rateSong` and thumb-control logic are copied into `contentPage`, `exhibition`, and `MyDashboard`.
- `source/EnyoPandoraInterface.js:133-153` declares two identical app menus (`_appMenu` and `appMenu`).
- Version strings disagree: `appinfo.json` says 1.2.7; `source/core/api.js:1014` sends 1.1.0 as the `av` parameter.
- `index.html:16` forces `AppGlobals.debug = true`, so verbose logging ships on.
- `source/core/util.js:15` `Util.isValidZip` always returns true.
- Large amounts of commented-out Mojo code remain throughout `source/core/delegate/`.
- Prototype 1.7 is bundled alongside Enyo (`lib/prototype.js`); it extends `Array.prototype` with enumerable methods, so any `for…in` over arrays is unsafe.
