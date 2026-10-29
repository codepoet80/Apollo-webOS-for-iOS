var Track = Class.create({

    initialize: function(station, trackData) {
        this.station = station;
        this.trackData = trackData;
        this.playable = true;
        this.readyForRetry = false;
        this.started = false;
        this.userInterfaceNotified = false;
        this.loadStarted = false;
        this.readyForPreload = false;
        this.preloadInitiated = false;
        this.player = null;
        this.paused = false;
        this.readyToPlay = false;
        this.canPlay = false;
        this.audioUrlMap = null;
        this.qualityMap = null;
        this.progress = null;
        this.stalled = false;
        this.bytesPerSecondRatio = 0;
        this.originalDuration = null;
        this.originalCurrentTime = null;
        this.skipped = false;
        this.trackCounter = AppGlobals.trackCounter++;
        this.nearEnd = false;
        this.loaded = false;
        this.completed = false;
        this.contentLength = 0;
        this.bytesLoaded = 0;
        this.loadPercentage = 0;
        this.timeObject = new Object();
        this.haveData = false;
		this.timeOfLoad = null;
		

        // intialize callbacks
        this.callbackHandler = this.handleCallbacks.bind(this);
        this.progressMonitor = this.monitorProgress.bind(this);
        this.audioUrlValidator = this.validateAudioUrlCallback.bind(this);
    },

    // override
    preload: function() {
        this.load();
    },

    // override
    load: function() {
        this.doLoad();
    },

    getName: function() {
        return this.trackData.songName;
    },

   	handleCallbacks: function(event) {
        if (event.type == 'play') {
            this.onPlay(event);
        } else if (event.type == 'pause') {
            this.onPause(event);
        } else if (event.type == 'canplay') {
            this.onCanPlay(event);
        } else if (event.type == 'ended') {
            this.onCompleted(event);
        } else if (event.type == 'error') {
            this.onError(event);
        } else if (event.type == 'x-palm-disconnect') {
            this.onMediaserverDisconnect(event);
        } else if (event.type == 'x-palm-watchdog-triggered') {
            this.onMediaserverDisconnect(event);
        } else if (event.type == 'stalled') {
            this.stalled = true;
        } else if (event.type == 'progress') {
            this.onProgress(event);
        } else if (event.type == 'load') {
			this.log("loaded");
            this.loaded = true;
        }
    },

    doLoad: function() {
        if (AppConstants.runInEmulator) {
            AppGlobals.addHistory(this.station.getStationToken(), this.trackData.trackToken, this.trackData);
            MessageDispatcher.dispatchMessage(AppConstants.EVENT_ON_TOGGLE_SPINNER, false);
            MessageDispatcher.dispatchMessage(AppConstants.EVENT_ON_TRACK_CHANGE, this.trackData);
            this.log("emulator: overriding load command");
            return;
        }

        if (!this.loadStarted) {
            this.log("loading " + this.getName());
            this.loadStarted = true;

            MessageDispatcher.dispatchMessage(AppConstants.EVENT_ON_PRELOAD_ALBUM_ART, this.trackData);

            try {
                this.player = AudioPool.getInstance();

                this.audioUrlMap = this.trackData.audioUrlMap;
                this.player.autoplay = false;

                this.monitorId = setInterval(this.progressMonitor, 1000);
                
                this.player.addEventListener('x-palm-disconnect', this.callbackHandler, false);
                this.player.addEventListener('x-palm-watchdog-triggered', this.callbackHandler, false);
                this.player.addEventListener('canplay', this.callbackHandler, false);
                this.player.addEventListener('ended', this.callbackHandler, false);
                this.player.addEventListener('error', this.callbackHandler, false);
                this.player.addEventListener('play', this.callbackHandler, false);
                this.player.addEventListener('pause', this.callbackHandler, false);

                // loading related events
                this.player.addEventListener('stalled', this.callbackHandler, false);
                this.player.addEventListener('progress', this.callbackHandler, false);
                this.player.addEventListener('load', this.callbackHandler, false);

                this.determineAudioFormat();

                var audioUrl = null;
                if (this.trackData.currentAudioUrl != null) {
                    audioUrl = this.trackData.currentAudioUrl;
                }
				else {
                    audioUrl = this.qualityMap.audioUrl;
                }

                this.trackData.stationToken = this.station.getStationToken();
                this.trackData.currentAudioUrl = audioUrl;

                var offset = this.trackData.offset;
                if (offset != null && offset > 0) {
                    if (offset > 16) {
                        offset = Util.floor(Math.floor(offset), 16);
                    }
                    audioUrl = audioUrl += AppConstants.OFFSET_PARAM + offset;
                    this.originalDuration = this.trackData.duration;
                    this.originalCurrentTime = this.trackData.currentTime;
                    this.log("using offset: " + offset);
                }

                if (this.playable) {
                    Util.sendHeadRequest(audioUrl, this.audioUrlValidator);
                }

            } catch(e) {
                this.log("Error initializing player: " + e);
                this.stopAndPrepForRetry();
            }
        }
    },

    onMediaserverDisconnect: function(event) {
        this.log("mediaserver crash, restarting track");
        this.stopAndPrepForRetry();
    },

    determineAudioFormat: function() {
		switch( AppGlobals.audioQuality ) {
			case 1:
				this.qualityMap = this.audioUrlMap.lowQuality;
				this.log("Audio Quality: LOW");
				break;
			case 2:
				this.qualityMap = this.audioUrlMap.mediumQuality;
				this.log("Audio Quality: MEDIUM");
				break;
			case 3:
				this.qualityMap = this.audioUrlMap.highQuality;
				this.log("Audio Quality: HIGH");
				break;
			default:
				this.qualityMap = this.audioUrlMap.mediumQuality;
				break;
		}

        this.bytesPerSecondRatio = Track.BYTES_PER_SECOND_MAP[this.qualityMap.bitrate];
    },

    validateAudioUrlCallback: function(status, contentLength, audioUrl) {
        Util.log("audio url head status: " + status);
        this.contentLength = contentLength;

        if (status == 200 || status == 206) {

            if (this.trackData.songName != null) {
                audioUrl = audioUrl + AppConstants.appVersionParam;
            }

            try {
				this.log("Setting this.player.src to audioUrl in track...");
				this.player.src = audioUrl;
				this.timeOfLoad = new Date().getTime();
				this.player.load();
				this.player.autoplay = false;
            } catch(e) {
                this.log("Error setting player source " + e);
                this.stopAndPrepForRetry();
            }

        } else if (status == 0) {
            this.stopAndPrepForRetry();
        } else {
            Util.log("Missing audio track");
            AppGlobals.networkErrorCount++;
            this.stopAndPrepForNextTrack();
        }
    },

    play: function() {
        this.readyToPlay = true;
    },

    stop: function() {
        if (AppConstants.runInEmulator) {
            this.log("emulator: overriding stop command");
            return;
        }

        MessageDispatcher.dispatchMessage(AppConstants.EVENT_ON_DISABLE_CONTROLS, true);

        if (this.monitorId != null) {
            clearInterval(this.monitorId);
        }

        if (this.player != null) {
            try {
                if (this.canPlay || this.player.src) {
					this.log("STOPPING AUDIO PLAYER");
					MessageDispatcher.dispatchMessage(AppConstants.EVENT_ON_TOGGLE_PAUSE, true);
                    this.player.pause();
                }
            } catch(e) {
                this.log("Error stopping the audio player: " + e);
            }

            try {
                this.player.removeEventListener('canplay', this.callbackHandler, false);
                this.player.removeEventListener('ended', this.callbackHandler, false);
                this.player.removeEventListener('error', this.callbackHandler, false);
                this.player.removeEventListener('play', this.callbackHandler, false);
                this.player.removeEventListener('pause', this.callbackHandler, false);
                this.player.removeEventListener('stalled', this.callbackHandler, false);
                this.player.removeEventListener('progress', this.callbackHandler, false);
                this.player.removeEventListener('load', this.callbackHandler, false);
                this.player.removeEventListener('x-palm-disconnect', this.callbackHandler, false);
                this.player.removeEventListener('x-palm-watchdog-triggered', this.callbackHandler, false);
            } catch(e) {
                this.log("Error removing event listeners: " + e);
            }

            try {
                this.player.autoplay = false;
            } catch(e) {
                this.log("Error resetting autoplay: " + e);
            }

            try {
                AudioPool.releaseInstance(this.player);
            } catch(e) {
                this.log("Error releasing instance: " + e);
            }

            this.clearPlayProgress();
        }

        // store offset if we have one
        if (this.trackData.offset != null) {
            AppGlobals.updateHistory(this.station.getStationToken(), this.trackData.trackToken, this.trackData);
        }
    },

    clearPlayProgress: function() {
        this.timeObject.percentComplete = 0;
        this.timeObject.elapsedSeconds = 0;
        this.timeObject.remainingSeconds = 0;
        MessageDispatcher.dispatchMessage(AppConstants.EVENT_ON_PLAY_PROGRESS, this.timeObject);
    },

    pause: function() {
        if (!this.started) return;
        if (!this.isPlayable()) return;

        try {
            if (this.paused) {
                this.player.play();
                AppGlobals.musicPlaying = true;
            } else {
                this.player.pause();
                AppGlobals.musicPlaying = false;
            }
        } catch(e) {
            this.log("Error pausing the audio player: " + e);
            this.playable = false;
        }
    },

    pauseIfPlaying: function() {
        if (!this.started) return;
        if (!this.isPlayable()) return;

        try {
            if (!this.paused) {
                this.player.pause();
            }
        } catch(e) {
            this.log("Error pausing the audio player: " + e);
            this.playable = false;
        }
    },

    calculateVolume: function() {
        if (this.trackData.trackGain != null) {
            var gain = Number(this.trackData.trackGain);
            var adjustedVolume = Math.pow(10, gain / 20) * this.player.volume;
            if (adjustedVolume <= 1) {
                this.player.volume = adjustedVolume;
                this.log("adjusted volume: " + adjustedVolume);
            }
        }
    },

    monitorProgress: function() {
        if (AppConstants.runInEmulator) {
            return;
        }
		
		// Sometimes the app hangs during track loading, this should retry everything if we've been "loading" for 15 or more seconds
		if ( !this.canPlay && this.timeOfLoad != null && (new Date().getTime() - this.timeOfLoad) >= 15000 ) {
			this.log("Loading timeout.");
			this.timeOfLoad = null;
			this.paused = false;
			this.station.isPaused = false;
			AppGlobals.networkErrorCount++;
			this.stopAndPrepForNextTrack();
		}

        if (this.haveData) {
			
            var duration;
            var currentTime;

            if (this.originalDuration != null) {
                duration = this.originalDuration;
            } else {
                duration = this.contentLength / this.bytesPerSecondRatio;
            }

            if (this.originalCurrentTime != null) {
                currentTime = this.player.currentTime + this.originalCurrentTime;
            } else {
                currentTime = this.player.currentTime;
            }

            var remainingTime = duration - currentTime;

            if (remainingTime > 0 && this.started && !this.paused) {
                this.timeObject.elapsedSeconds = currentTime;
                this.timeObject.remainingSeconds = remainingTime;
				this.timeObject.percentComplete = currentTime / duration;
                MessageDispatcher.dispatchMessage(AppConstants.EVENT_ON_PLAY_PROGRESS, this.timeObject);

                //this.log("bytes per second: " + this.bytesPerSecondRatio);

                // only save offset if the song has more than a few seconds remaining
                if (remainingTime <= Track.END_OF_TRACK_THRESHOLD) {
	                this.trackData.offset = null;
                    this.trackData.duration = null;
                    this.trackData.currentTime = 0;
                    this.nearEnd = true;
                } else {
                    this.trackData.offset = currentTime * this.bytesPerSecondRatio;
                    this.trackData.duration = duration;
                    this.trackData.currentTime = currentTime;
                }
            }

            if (this.canPlay && this.readyToPlay && !this.started) {
                try {
                    this.started = true;
                    this.player.play();
                    if (this.station.isPaused) {
                        // hack, hack, hack - if the mediaserver crashes while we are paused, we need to get back
                        // into our original state by calling play on the player, however to avoid a sound blurb
                        // we set the volume to 0                 
                        this.player.volume = 0;
                    }

                    AppGlobals.musicPlaying = true;
//                  AppGlobals.andoService.start();
                } catch(e) {
                    this.log("Error starting the audio player: " + e);
                    AppGlobals.networkErrorCount++;
                    this.stopAndPrepForNextTrack();
                }
                return;
            }
/*
            if (this.started && remainingTime <= Track.PRELOAD_THRESHOLD && !this.preloadInitiated) {
                this.log("starting preload");
                this.preloadInitiated = true;
                this.station.preload();
            }
*/
        }

    },

    launchDashboard: function() {
		Application.showDashboard();
    },

    updateBanner: function() {
        if ( Application.isFocused() || Application.isDashboardActive() || Application.exhibition ) {
            return;
        }

        var bannerMessage = null;
        if (this.trackData.songName != null) {
            bannerMessage = Util.truncateText(this.trackData.songName, 25) + AppConstants.MSG_BANNER_BY + Util.truncateText(this.trackData.artistName, 25);
        } else {
            bannerMessage = Util.truncateText(this.trackData.companyName, 25) + AppConstants.MSG_BANNER_COMPANY + Util.truncateText(this.trackData.title, 25);
        }
        //Util.log("banner message: " + bannerMessage);
        Util.showBannerMessage(bannerMessage);
    },

    onProgress: function(event) {
        // this.log("on progress");
        this.stalled = false;
        this.haveData = true;
        if (this.trackData.offset == null) {
            // if we get an onProgress callback that means we should have loaded some data
            // we set the offset to one here to avoid duplicate DRM entries if we need to retry before we start playing
            this.trackData.offset = 16;
        }
    },

    onCanPlay: function(event) {
        this.log("canplay");
        this.canPlay = true;
		this.monitorProgress();
    },

    onCompleted: function(event) {
        this.log("completed normally");
        this.completed = true;
        this.stop();
        AppGlobals.networkErrorCount = 0;
        // reset the error count once we've played through a track
		this.station.playlistService.run();
    },

    onError: function(event) {
        AppGlobals.networkErrorCount++;
        this.log("Audio Error: " + event.error);
        this.player.broken = true;
        this.stopAndPrepForRetry();
    },

    onPlay: function(event) {
        this.paused = false;
        MessageDispatcher.dispatchMessage(AppConstants.EVENT_ON_TOGGLE_PAUSE, false);

        if (this.started && !this.userInterfaceNotified) {

            try {
                this.userInterfaceNotified = true;

                if (this.station.isPaused) {
                    this.log("pausing track. track was restarted during a pause state");
                    this.pause();
                    this.station.isPaused = false;
                }

                this.calculateVolume();

                // store history if we haven't already added it (retry or resume from station change)
                if (this.trackData.persisted == null) {
                    this.trackData.startDate = new Date().getTime();
                    this.trackData.persisted = true;
                    AppGlobals.addHistory(this.station.getStationToken(), this.trackData.trackToken, this.trackData);
                }

				this.timeObject.elapsedSeconds = 0;
				this.timeObject.remainingSeconds = this.contentLength / this.bytesPerSecondRatio;
				this.timeObject.percentComplete = 0;
				this.station.nowplayingActiveTrackData = this.trackData;
                MessageDispatcher.dispatchMessage(AppConstants.EVENT_ON_TRACK_CHANGE, this.trackData);
                MessageDispatcher.dispatchMessage(AppConstants.EVENT_ON_TOGGLE_PAUSE, false);
                MessageDispatcher.dispatchMessage(AppConstants.EVENT_ON_TRACK_CHANGE_FOR_DASHBOARD, this);

                this.updateBanner();

                if ( !Application.isFocused() ) {
                	Util.log("Launching dash from track");
                    this.launchDashboard();
                }

                MessageDispatcher.dispatchMessage(AppConstants.EVENT_ON_TOGGLE_SPINNER, false);

                AppGlobals.networkErrorCount = 0;
                // reset the error count once we successfully play audio


            } catch(e) {
                this.log("Error notifying ui on play: " + e);
                AppGlobals.networkErrorCount++;
                this.stopAndPrepForNextTrack();
            }
        }

    },

    onPause: function(event) {
        this.paused = true;
		MessageDispatcher.dispatchMessage(AppConstants.EVENT_ON_TOGGLE_PAUSE, true);
    },

    stopAndPrepForRetry: function() {
        this.log("stop and prep for retry");
        if (this.nearEnd) {
            this.stopAndPrepForNextTrack();
            return;
        }

        if (this.trackData.offset == null) {
            this.trackData.offset = 0;
        }

        // if we get a disconnect while we are paused, set a flag so we don't resume randomly
        // this was causing a spontaneous playback bug.
        if (this.paused) {
            this.log("paused during a disconnect, setting station pause flag so we don't restart");
            this.station.isPaused = true;
        }

        this.stop();
        this.readyForRetry = true;
		this.station.playlistService.run();
    },

    stopAndPrepForNextTrack: function() {
        this.log("stop and move on");
        this.stop();
        this.playable = false;
		this.station.playlistService.run();
		
    },

    hasCompleted: function() {
        return this.completed;
    },

    hasStarted: function() {
        return this.started;
    },

    isReadyToPlay: function() {
        return this.readyToPlay;
    },

    isReadyForRetry: function() {
        return this.readyForRetry;
    },

    isPlayable: function() {
        return this.playable;
    },

    isPaused: function() {
        return this.paused;
    },

    getTrackData: function() {
        return this.trackData;
    },

    setAdMetadata: function(adMetadata) {
        this.trackData = adMetadata;
    },

    log: function(message) {
        Util.log("Track: " + this.trackCounter + " " + this.getName() + " - " + message);
    }
});

Track.formatTrackData = function( trackData ) {	
	var data = {};
	data.trackToken = trackData.trackToken;
	if (trackData.songName != null) {
		// track
		data.artist = trackData.artistName;
		data.song  = trackData.songName;
		data.album = trackData.albumName;
	}
	else {
		// audio ad
		data.artist = trackData.companyName;
		data.song = trackData.title;
		data.album = ""
	}

	data.artUrl = Track.getArtUrlFromTrack(trackData);
	return data;
};
	
Track.getArtUrlFromTrack = function(trackData) {
	var url = AppConstants.defaultAlbumArt;
	if ( trackData.songName != null && trackData.albumArtUrl != null && trackData.albumArtUrl != undefined && trackData.albumArtUrl.length > 0 ) {
		url = trackData.albumArtUrl;
	}
	else if ( trackData.imageUrl != null && trackData.imageUrl != undefined && trackData.imageUrl.length > 0 ) {
		url = trackData.imageUrl;
	}
	return url;
};
Track.MONITOR_INTERVAL = 1000;
Track.END_OF_TRACK_THRESHOLD = 0;
Track.PRELOAD_THRESHOLD = 6000;
Track.BYTES_PER_SECOND_MAP = {'24': 2800, '32': 3900, '40':4950, '64':7820, '128': 16000};
