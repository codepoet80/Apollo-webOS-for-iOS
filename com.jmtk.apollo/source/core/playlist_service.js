var PlaylistService = Class.create({

    initialize: function(station) {
        this.station = station;
        this.addTracksCallback = this.addTracksToStation.bind(this);
        this.resetPlaylistStatusCallback = this.resetPlaylistRequestStatus.bind(this);
        this.retryCallback = this.retry.bind(this);
        this.playlistStatusTimerId = null;

        // state
        this.running = false;
        this.playlistRequested = false;
        this.stoppedForNetwork = false;
    },

    start: function() {
        if (this.running) {
            return;
        }
        this.stoppedForNetwork = false;
        this.serviceId = setInterval(this.run.bind(this), PlaylistService.INTERVAL);
        this.running = true;
    },

    // Called by DeviceService when the connection manager reports the internet
    // is back. If we gave up because of a network outage, pick up where we left off.
    networkAvailable: function() {
        if (this.stoppedForNetwork && !this.running && this.station.started) {
            this.log("network is back, restarting playlist service");
            AppGlobals.networkErrorCount = 0;
            Application.dismissError();
            this.start();
        }
    },

    stop: function() {
        this.log("stopping playlist service");
        clearInterval(this.serviceId);
        this.running = false;
    },

    run: function() {

        try {
			if ( !this.running ) {
				clearInterval(this.serviceId);
				return;
			}

            if (AppGlobals.networkErrorCount >= AppGlobals.NETWORK_ERROR_THRESHOLD) {
                this.log("too many errors, stopping playlist service");
                Util.showRetryMessage(AppConstants.MSG_NETWORK_ERROR_TITLE, AppConstants.MSG_NETWORK_ERROR, this.retryCallback);
                this.stop();
                this.stoppedForNetwork = true;
                return;
            }

            if (!AppGlobals.isInternetAvailable) {
                // Only count an outage toward the error threshold when we actually
                // need the network right now. A brief blip while a buffered track is
                // still playing is harmless; counting it used to shut the service down
                // within six seconds and leave nothing to advance the queue.
                var current = this.station.getCurrentTrack();
                var needsNetwork = this.station.playlist.length == 0 ||
                                   current == null ||
                                   current.hasCompleted() ||
                                   !current.isPlayable();
                if (needsNetwork) {
                    AppGlobals.networkErrorCount += .5;
                }
                this.log("waiting on network");
                return;
            }

            if (this.station.playlist.length == 0 && !this.playlistRequested) {
                this.playlistRequested = true;
                this.log("playlist load");
                this.playlistStatusTimerId = setTimeout(this.resetPlaylistStatusCallback, PlaylistService.GET_PLAYLIST_TIMEOUT_INTERVAL);
                Api.getPlaylist(this.station.stationToken, new GetPlaylistDelegate(this.station, this.addTracksCallback));
                return;
            }

            if (!this.station.playing && this.station.getCurrentTrack() == null && this.station.playlist.length > 0) {
                this.log("initial station play");
                this.station.play();
                return;
            }

            if (this.station.playing && this.station.getCurrentTrack() == null && this.station.playlist.length > 0) {
                this.log("station needs a new track, calling next");
                this.log("playlist depth: " + this.station.playlist.length);
                this.log("playlist request status: " + this.playlistRequested);
                this.station.next();
                return;
            }

            if (this.station.playing &&
                this.station.getCurrentTrack() != null &&
                this.station.getCurrentTrack().hasCompleted() &&
                this.station.playlist.length > 0)
            {
                this.log("current track completed, calling next");
                this.log("playlist depth: " + this.station.playlist.length);
                this.log("playlist request status: " + this.playlistRequested);
                this.station.next();
                return;
            }

            if (this.station.playing &&
                this.station.getCurrentTrack() != null &&
                !this.station.getCurrentTrack().isPlayable() &&
                this.station.getCurrentTrack().isReadyToPlay() &&
                this.station.playlist.length > 0)
            {
                this.log("current track is not playable, calling next");
                this.log("playlist depth: " + this.station.playlist.length);
                this.log("playlist request status: " + this.playlistRequested);
                this.station.next();
                return;
            }

            if (this.station.playing &&
                this.station.getCurrentTrack() != null &&
                this.station.getCurrentTrack().isReadyForRetry() &&
                this.station.getCurrentTrack().isReadyToPlay() &&
                this.station.playlist.length > 0)
            {
                this.log("retry current track with offest: " + this.station.getCurrentTrack().trackData.offset);
                this.station.retryTrack(this.station.getCurrentTrack().trackData);
                return;
            }

        } catch (e) {
            this.log("error in playlist loop: " + e);
        }

    },

    resetPlaylistRequestStatus: function() {
        if (this.playlistRequested) {
            this.log("Playlist timer expired before playlist call returned : 1 minute, resetting playlist request flag");
            this.playlistRequested = false;
        }
    },

    addTracksToStation: function(items) {
        if (items != null) {
            this.station.addTracks(items);
        }
        this.log("decrement playlist count");

        this.playlistRequested = false;

        if (this.playlistStatusTimerId != null) {
            clearTimeout(this.playlistStatusTimerId);
        }
		this.run();
    },

    retry: function(value) {
        // if (value == AppConstants.RETRY) {
			this.log("Retrying");
            AppGlobals.networkErrorCount = 0;
            this.start();
        // } else {
            // AppGlobals.station = null;
            // MessageDispatcher.dispatchMessage( AppConstants.EVENT_ON_STATION_CHANGE, null );
        // }
    },

    log: function(message) {
        Util.log("playlist service: " + message);
    }

});

PlaylistService.INTERVAL = 500;
PlaylistService.GET_PLAYLIST_TIMEOUT_INTERVAL = 1000 * 60;
