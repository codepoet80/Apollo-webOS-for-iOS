// Now Playing: tells the system what is playing - song, artist, album and album art - where
// the platform has the Media Session API: a phone's lock screen, Control Center, a car's
// Bluetooth display, Android's media notification. webOS's own WebKit hasn't got the API,
// so on a TouchPad or a Pre3 this does nothing.
var NowPlaying = {
	callbackId: null,

	// Called once, by the main window (EnyoPandora); the dashboard shares its dispatcher.
	start: function() {
		if (NowPlaying.callbackId != null || !window.navigator || !navigator.mediaSession || !window.MediaMetadata) {
			return;
		}
		NowPlaying.callbackId = MessageDispatcher.subscribe(AppConstants.EVENT_ON_TRACK_CHANGE, NowPlaying.onTrackChange);
	},

	onTrackChange: function(trackData) {
		if (!trackData) {
			return;
		}
		var data = Track.formatTrackData(trackData);
		try {
			navigator.mediaSession.metadata = new MediaMetadata({
				title: data.song || "",
				artist: data.artist || "",
				album: data.album || "",
				artwork: data.artUrl ? [{ src: data.artUrl }] : []
			});
		} catch (e) {
			Util.log("NowPlaying: " + e);
		}
	}
};
