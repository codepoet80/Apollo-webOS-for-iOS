var Station = Class.create({

	initialize: function(stationData) {
		// station state
		this.started = false;
		this.hasPlayed = false;
		this.playing = false;
        this.isPaused = false;

		this.stationData = stationData;
		this.playlist = new Array();
		this.currentTrack = null;
		this.stationToken = stationData.stationToken;
		this.skipLimitService = new SkipLimitService();
		this.nowplayingActiveTrackData = null;
		this.nowplayingSnapIndex = null;
		this.playCallback = this.play.bind(this);
		this.playlistService = new PlaylistService(this);
	},

	start: function() {
		this.started = true;

		this.playlistService.start();

		this.nowplayingActiveTrackData = null;
		this.nowplayingSnapIndex = null;
		
		// Restore history when station is selected instead of loading all history on app startup
		if ( !AppGlobals.history.get(this.stationToken) ) {
			AppGlobals.restoreStationHistory(this.stationToken);
		}

		MessageDispatcher.dispatchMessage( AppConstants.EVENT_ON_STATION_CHANGE, null );
		MessageDispatcher.dispatchMessage( AppConstants.EVENT_ON_TOGGLE_SPINNER, true );
		Util.log("Station.start: " + this.stationData.stationName);
	},

	play: function() {
		Util.log("Station: "+this.stationData.stationName+" is now playing.");
		if (this.hasPlayed) {
			Util.log("Station: trying to resume from history.");
			this.tryToResumeFromStationHistory();
		}

		this.hasPlayed = true;
		this.playing = true;
		this.isPaused = false;
		MessageDispatcher.dispatchMessage( AppConstants.EVENT_ON_STATION_CHANGE, null );
		this.next();
	},

	tryToResumeFromStationHistory: function() {
		var history = AppGlobals.history.get(this.stationToken);
		if (history != null && history.length > 0) {
			Util.log("have some history");
			var historyTrack = history[0];

			if (historyTrack == null || historyTrack.trackToken == null) {
				Util.log("last history track is missing");
				return;
			}
			
			Util.log("offset: " + historyTrack.offset);
			Util.log("duration: " + historyTrack.duration);
			Util.log("currentTime: " + historyTrack.currentTime);
			Util.log("map: " + historyTrack.audioUrlMap);
			Util.log("high quality map: " + historyTrack.audioUrlMap.highQuality);

			if (historyTrack.offset == null ||
				historyTrack.offset == 0 ||
				historyTrack.duration == null ||
				historyTrack.currentTime == null ||
				historyTrack.audioUrlMap == null ||
				historyTrack.audioUrlMap.highQuality == null) {
				Util.log("failed to meet offset criteria - " + historyTrack.songName);
				return;
			}

			Util.log("resuming from station history");
			this.addTrackToStartOfPlaylist(historyTrack);
		}
	},

	next: function() {
	
		MessageDispatcher.dispatchMessage( AppConstants.EVENT_ON_TOGGLE_SPINNER, true );
		if (this.currentTrack != null) {
			this.currentTrack = null;
		}

		Util.log("Station.next");
		this.currentTrack = this.playlist.shift();

		if (this.currentTrack == null) {
			Util.log("No tracks available, skipping Station.next");
			return;
		}

		if (!this.currentTrack.isPlayable()) {
			Util.log("Current track is not playable, skipping Station.next");
			this.currentTrack = null;
			return;
		}
		
		Util.log("Calling this.currentTrack.load()");
		this.currentTrack.load();
		Util.log("Playing currentTrack from station.next...");
		this.currentTrack.play();
	},

	preload: function() {
		var nextTrack = this.playlist[0];
		if (nextTrack != null) {
			nextTrack.preload();
		} else {
			Util.log("No tracks available, skipping Station.preload");
		}
	},

	retryPreload: function(track) {
		var nextTrack = this.playlist[0];
		if (nextTrack != null && nextTrack.getTrackData().trackToken == track.getTrackData().trackToken) {
			Util.log("retrying preload");
			this.playlist[0] = this.getTrack(track.getTrackData());
			this.preload();
		}
	},

	retryTrack: function(trackData) {
		this.currentTrack = new Track(this, trackData);
		this.currentTrack.load();
		this.currentTrack.play();
	},

	stop: function() {
		this.playlistService.stop();
		this.started = false;
		this.playing = false;
        AppGlobals.musicPlaying = false;

		if (this.currentTrack != null) {
			this.currentTrack.stop();
			this.currentTrack = null;
		}
		Util.log("Stopping station");
		MessageDispatcher.dispatchMessage( AppConstants.EVENT_ON_STATION_CHANGE, null );
		MessageDispatcher.dispatchMessage( AppConstants.EVENT_ON_TOGGLE_SPINNER, false );
	},
	
	// isPaused always mirrors the track's real state. The Track methods return
	// the resulting paused state, so we never blindly toggle the flag: a press
	// that lands while no track is playable (e.g. between songs) must not flip
	// it, or the next track would start paused.
	playIfPaused: function() {
		if ( this.currentTrack != null ) {
			this.isPaused = this.currentTrack.playIfPaused();
		}
	},

	pause: function() {
		if (this.currentTrack != null) {
			this.isPaused = this.currentTrack.pause();
		}
	},

	pauseIfPlaying: function() {
		if (this.currentTrack != null) {
			this.isPaused = this.currentTrack.pauseIfPlaying();
		}
	},

	throwOutTracks: function() {
		this.playlist.clear();
	},

	throwOutTracksAndSkip: function() {
		Util.log("Throwing out tracks and calling silentSkip()");
		this.playlist.clear();
		this.skip();
	},

	skip: function() {
        if (AppConstants.runInEmulator) {
            this.currentTrack.stopAndPrepForNextTrack();
            this.log("emulator: overriding skip command");
            return;
        }

		if (!AppGlobals.isInternetAvailable) {
			Util.showMessage(AppConstants.MSG_NETWORK_ERROR_TITLE, AppConstants.MSG_NETWORK_ERROR, "");
			return;
		}

		if (this.currentTrack == null) {
			Util.log("Current track is empty, not skipping");
			return;
		}

		if (this.currentTrack instanceof AudioAd) {
			Util.log("Current track is audio ad, can't skip");
			Util.showMessage(AppConstants.MSG_SKIP_ERROR_TITLE, AppConstants.MSG_AD_SKIP_ERROR, "");
			return;
		}

		if (this.skipLimitService.canSkip()) {
			this.currentTrack.stopAndPrepForNextTrack();
			this.skipLimitService.addTrack(this.currentTrack.getTrackData().songName);
			this.isPaused = false;
		} else {
			if ( Application.isFocused() ) {
				Util.showMessage(AppConstants.MSG_SKIP_ERROR_TITLE, AppConstants.MSG_SKIP_LIMIT_PREFIX + AppGlobals.skipLimit + AppConstants.MSG_SKIP_LIMIT_SUFFIX, "");
			}
			else {
				Util.showBannerMessage(AppConstants.MSG_SKIP_LIMIT_PREFIX + AppGlobals.skipLimit + AppConstants.MSG_SKIP_LIMIT_SUFFIX);
			}
		}

	},

	silentSkip: function() {
		if (this.skipLimitService.canSkip()) {
			this.currentTrack.stopAndPrepForNextTrack();
			this.skipLimitService.addTrack(this.currentTrack.getTrackData().songName);
			this.isPaused = false;
		}
	},

	thumbUp: function() {
		if (this.currentTrack == null) {
			return;
		}

		if (!this.currentTrack.getTrackData().allowFeedback) {
			Util.showMessage(AppConstants.MSG_FEEDBACK_ERROR_TITLE, AppConstants.MSG_SHARED_STATION_THUMB_UP_ERROR, "");
			return;
		}

		if (this.currentTrack instanceof AudioAd) {
			Util.showMessage(AppConstants.MSG_FEEDBACK_ERROR_TITLE, AppConstants.MSG_SHARED_STATION_THUMB_UP_AD_ERROR, "");
			return;
		}

		Api.addFeedback(this.currentTrack.getTrackData().trackToken, true, new AddFeedbackDelegate(true, this));
	},

	thumbDown: function() {
		if (this.currentTrack == null) {
			return;
		}

		if (!this.currentTrack.getTrackData().allowFeedback) {
			Util.showMessage(AppConstants.MSG_FEEDBACK_ERROR_TITLE, AppConstants.MSG_SHARED_STATION_THUMB_DOWN_ERROR, "");
			return;
		}

		if (this.currentTrack instanceof AudioAd) {
			Util.showMessage(AppConstants.MSG_FEEDBACK_ERROR_TITLE, AppConstants.MSG_SHARED_STATION_THUMB_DOWN_AD_ERROR, "");
			return;
		}
		this.isPaused = false;
		Api.addFeedback(this.currentTrack.getTrackData().trackToken, false, new AddFeedbackDelegate(false, this));
	},

	addTracks: function(tracks) {
		if (tracks != null && tracks.length > 0) {
			for (var i = 0; i < tracks.length; ++i) {
				var trackData = tracks[i];
				// Don't bother pushing audio ads right now...they are all empty
				if ( trackData.songName == null ) {
					continue;
				}
				this.playlist.push(this.getTrack(this, trackData));
			}
		}
	},

	getTrack: function(station, trackData) {
		if (trackData.songName != null) {
			Util.log("add: " + trackData.songName);
			return new Track(station, trackData);
		} else {
			Util.log("add: audioAd");
			return new AudioAd(station, trackData);
		}
	},

	addTrackToStartOfPlaylist: function(track) {
		if (track.songName != null) {
			Util.log("adding at start of playlist: " + track.songName);
			this.playlist.unshift(new Track(this, track));
		} else {
			this.playlist.unshift(new AudioAd(this, track));
		}
	},

	getStationData: function() {
		return this.stationData;
	},

	getStationToken: function() {
		return this.stationData.stationToken;
	},

	getStationName: function() {
		return this.stationData.stationName;
	},

	isShared: function() {
		return this.stationData.isShared;
	},

	getCurrentTrack: function() {
		return this.currentTrack;
	},

	hasStarted: function() {
		return this.started;
	}

});

Station.STATION_HISTORY_WINDOW = 60 * 1000 * 20;
