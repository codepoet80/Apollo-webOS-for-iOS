var Persistence = Class.create({

    initialize: function() {
        this.initDBCallback = null;
		Util.log("ME: Persistence Initialized");
    },

    initDB: function(initCallback) {
		Util.log("At top of Persistence.initDB");
        this.initDBCallback = initCallback;

        var options = {
            name: "PandoraPersistence",
            version: 1,
            replace: false
        };

        this.depot = new Mojo.Depot(options, this.restore.bind(this), this.onError);
    },

    restore: function() {
		Util.log("Restoring Persistence...");
        this.depot.get(AppGlobals.DB_KEY_USERNAME, this.onGetUsername, this.onError);
        this.depot.get(AppGlobals.DB_KEY_STATION_LIST_CHECKSUM, this.onGetStationListChecksum, this.onError);
				
        this.depot.get(AppGlobals.DB_KEY_AUDIO_QUALITY, this.onGetAudioQuality.bind(this), this.onError);
		this.depot.get(AppGlobals.DB_KEY_BACKGROUND_URL, this.onGetBackgroundUrl.bind(this), this.onError);
		this.depot.get(AppGlobals.DB_KEY_TEXT_BACKING, this.onGetTextBacking.bind(this), this.onError);		
		this.depot.get(AppGlobals.DB_KEY_ORIENTATION, this.onGetOrientation.bind(this), this.onError);
		this.depot.get(AppGlobals.DB_KEY_EXHIBITION, this.onGetExhibition.bind(this), this.onError);
		this.depot.get(AppGlobals.DB_KEY_AUTO_PLAY, this.onGetStartupAutoPlay.bind(this), this.onError);
		
		this.depot.get(AppGlobals.DB_KEY_DASH_PROGRESS, this.onGetDashProgress.bind(this), this.onError);
		this.depot.get(AppGlobals.DB_KEY_STATION_LIST_SORT, this.onGetStationListSort.bind(this), this.onError);
        this.depot.get(AppGlobals.DB_KEY_DEBUG, this.onGetDebug.bind(this), this.onError);
        this.depot.get(AppGlobals.DB_KEY_DEVICE_ID, this.onGetDeviceId, this.onError);
        this.depot.get(AppGlobals.DB_KEY_LICENSING, this.onGetLicensing.bind(this), this.onError);
        this.depot.get(AppGlobals.DB_KEY_STATION, this.onGetStation, this.onError);

        // get station list should be last call
		Util.log("Getting stationList from DB is last thing before initializePandora.");
        this.depot.get(AppGlobals.DB_KEY_STATION_LIST, this.onGetStationList.bind(this), this.onError);

    },
	
	restoreStationHistory: function( stationToken ) {
		this.depot.getMultiple(stationToken, [], null, null, this.onGetHistory.bind(this), this.onError);
	},
	

    addHistory: function(stationToken, trackToken, trackData) {
        trackData.stationToken = stationToken;

        // update local
        var stationHistory = AppGlobals.history.get(stationToken);
        if (stationHistory == null) {
            stationHistory = [];
        }

        stationHistory.push(trackData);
        stationHistory.sort(this.sortHistory);

        Util.log("History length: " + stationHistory.length);
        while (stationHistory.length > AppGlobals.MAX_STATION_HISTORY_LENGTH) {
            var oldTrack = stationHistory.pop();
            Util.log("Removing track: " + oldTrack.songName);
            this.depot.remove(stationToken, oldTrack.trackToken, this.onSuccess, this.onError);
        }
        AppGlobals.history.set(stationToken, stationHistory);
        this.persistHistory(stationToken, trackToken, trackData);
    },

    getLastTrackFromHistory: function(stationToken) {
        var stationHistory = AppGlobals.history.get(stationToken);
        if (stationHistory == null) {
            return null;
        }

        return stationHistory[stationHistory.length - 1];
    },

    updateHistory: function(stationToken, trackToken, trackData) {
        var stationHistory = AppGlobals.history.get(stationToken);
        if (stationHistory != null) {
            for (var i = 0; i < stationHistory.length; ++i) {
                var oldTrackData = stationHistory[i];
                if (oldTrackData.trackToken == trackToken) {
                    stationHistory[i] = trackData;
                    AppGlobals.history.set(stationToken, stationHistory);
                }
            }
            this.persistHistory(stationToken, trackToken, trackData);
        }
    },

    persistHistory: function(stationToken, trackToken, trackData) {
        // remove sensitive data
        var persistentTrackData = new Object();
        persistentTrackData = Object.extend(persistentTrackData, trackData);
        persistentTrackData.audioUrl = "";
        persistentTrackData.audioUrlMap = "";
        persistentTrackData.currentAudioUrl = "";

        // persist
        Util.log("Persisting history: " + persistentTrackData.songName);
        this.depot.addSingle(stationToken, trackToken, persistentTrackData, [], this.onSuccess, this.onError);
    },

    persistValue: function(key, value) {
		Util.log("Persisting value");
		Util.log("Persisting --> {"+key+": "+value+"}");
        this.depot.add(key, value, this.onSuccess, this.onError);
    },

    onSuccess: function(result) {
        Util.log("DB success");
    },

    onError: function(transaction, result) {
        Util.log("DB Error");

        if (result != null) {
            Util.log("Error: " + result.code + ":" + result.message);
        }

        if (transaction != null) {
            Util.log("Transaction Error: " + transaction);
        }
    },

    // Clears the persisted store. The Depot is asynchronous, so callers that
    // need to read from it afterwards must wait for onComplete.
    removeAll: function(onComplete) {
		Util.log("Starting to remove all from DB");
        // if (this.mojoVersion <= AppGlobals.webOS1_1) {
            // // remove got a name change in version 1.1 of WebOS
            // this.depot.remove = this.depot.remove;
        // }

        this.depot.remove(AppGlobals.DEFAULT_BUCKET,AppGlobals.DB_KEY_USERNAME , this.onSuccess, this.onError);
        this.depot.remove(AppGlobals.DEFAULT_BUCKET,AppGlobals.DB_KEY_STATION_LIST_SORT , this.onSuccess, this.onError);
        this.depot.remove(AppGlobals.DEFAULT_BUCKET,AppGlobals.DB_KEY_STATION_LIST_CHECKSUM , this.onSuccess, this.onError);
        this.depot.remove(AppGlobals.DEFAULT_BUCKET,AppGlobals.DB_KEY_AUDIO_QUALITY , this.onSuccess, this.onError);
		this.depot.remove(AppGlobals.DEFAULT_BUCKET,AppGlobals.DB_KEY_BACKGROUND_URL , this.onSuccess, this.onError);
		this.depot.remove(AppGlobals.DEFAULT_BUCKET,AppGlobals.DB_KEY_ORIENTATION , this.onSuccess, this.onError);
		this.depot.remove(AppGlobals.DEFAULT_BUCKET,AppGlobals.DB_KEY_EXHIBITION, this.onSuccess, this.onError);
		this.depot.remove(AppGlobals.DEFAULT_BUCKET,AppGlobals.DB_KEY_AUTO_PLAY , this.onSuccess, this.onError);
        this.depot.remove(AppGlobals.DEFAULT_BUCKET,AppGlobals.DB_KEY_LICENSING , this.onSuccess, this.onError);
        this.depot.remove(AppGlobals.DEFAULT_BUCKET,AppGlobals.DB_KEY_STATION, this.onSuccess, this.onError);
		var done = function(result) {
			this.onSuccess(result);
			Util.log("done with remove all");
			if (onComplete) {
				onComplete();
			}
		}.bind(this);
		var failed = function(transaction, result) {
			this.onError(transaction, result);
			if (onComplete) {
				onComplete();
			}
		}.bind(this);
		this.depot.removeAll( done, failed );
    },

    onGetDeviceId: function(result) {
		Util.log("Getting persisted device id: " + result);
		if (result == null) {
			var nuid;
			if ( AppGlobals.platform == "device" ) {
				nuid = AppGlobals.systemProperties['com.palm.properties.nduid'];
			}
			else {
				Util.log("Auto-generating hash id for browser use...");
				nuid = Sha1.hash( Math.random()*Number.MAX_VALUE/new Date().getTime()+"" );
			}
			var aDeviceId = nuid + "_" + String(new Date().getTime());
			AppGlobals.setDeviceId(aDeviceId);
			AppGlobals.isFirstLoginWithNewDeviceId = true;
		}
		else {
			AppGlobals.deviceId = result;
		}
    },

    onGetUsername: function(result) {
		Util.log("Getting persisted username: " + result);
        AppGlobals.username = result;
    },

    onGetStationListSort: function(result) {
		Util.log("Getting persisted stationListSort: "+result);
		if (result == null) {
			AppGlobals.setStationListSort(AppGlobals.STATION_SORT_DATE);
		}
		else {
			AppGlobals.stationListSort = result;
		}
        
    },

    onGetStationListChecksum: function(result) {
		Util.log("Getting persisted stationListChecksum: "+result);
        AppGlobals.stationListChecksum = result;
    },

    onGetStationList: function(result) {
		Util.log("Getting persisted stationList: "+result);
        AppGlobals.setStationList(result);
        // call initDBCallback after all the getHistory calls have completed
        // var syncObject = new Mojo.Function.Synchronize({syncCallback : this.initDBCallback});

		// result = null;
        // // load up station history
        // if (result != null && result.length > 0) {
            // for (var i = 0; i < result.length; ++i) {
                // var station = result[i];
                // this.depot.getMultiple(station.stationToken, [], null, null, syncObject.wrap(this.onGetHistory.bind(this).bind(this)), this.onError);
            // }
        // }
		// else {
		Util.log("Calling initDBCallback (initializePandora in splashscreen-assistant)");
		this.initDBCallback();
        // }
    },

    onGetAudioQuality: function(result) {
		Util.log("Getting persisted audioQuality: "+result);
        if (result == null) {
            // default to low quality
            AppGlobals.setAudioQuality(1);
        }
		else {
            AppGlobals.audioQuality = result;
        }

    },
	
	onGetBackgroundUrl: function(result) {
		Util.log("Getting persisted backgroundUrl: "+result);
		if (result != null) {
			AppGlobals.backgroundUrl = result;
		}
		else {
			AppGlobals.setBackgroundUrl("themes/1.png");
		}
	},
	
	onGetOrientation: function(result) {
		Util.log("Getting persisted orientation: " + result);
		if (result != null) {
			AppGlobals.setOrientation(result);
		}
		else {
			AppGlobals.setOrientation("free");
		}
	},
	
	onGetExhibition: function(result) {
		Util.log("Getting persisted exhibition: " + result);
		if (result != null) {
			AppGlobals.setExhibitionType(result);
		}
		else {
			AppGlobals.setExhibitionType(true);
		}

	},
	
	onGetStartupAutoPlay: function(result) {
		Util.log("Getting persisted autoplay: " + result);
		if ( result != null ) {
			AppGlobals.startupAutoPlay = result;
		}
		else {
			AppGlobals.setStartupAutoPlay(true);
		}
	},
	
	onGetTextBacking: function(result) {
		Util.log("Getting persisted text-backing: " + result);
		if ( result != null ) {
			AppGlobals.textBacking = result;
		}
		else {
			AppGlobals.setTextBacking(false);
		}

	},
	
	onGetDashProgress: function(result) {
		Util.log("Getting persisted dashProgress: " + result);
		if ( result != null ) {
			AppGlobals.dashProgress = result;
		}
		else {
			AppGlobals.setDashProgress(true);
		}
	},

    onGetDebug: function(result) {
        if (result != null) {
            AppGlobals.debug = result;
        }
    },

    onGetLicensing: function(result) {
		Util.log("Getting persisted licensing: "+result);
        if (result != null) {
            AppGlobals.licensing = result;
        }
    },

    onGetStation: function(result) {
		Util.log("Getting persisted station: "+result);
        if (result == null) {
            AppGlobals.station = null;
        } else {
            AppGlobals.station = AppGlobals.getStation(result);
        }
    },

    onGetHistory: function(result) {
		Util.log("Getting persisted history: "+enyo.json.stringify(result));
        var now = new Date().getTime();
        var history = [];
        var stationToken = null;
        if (result != null && result.length > 0) {
            for (var i = 0; i < result.length; ++i) {
                var track = result[i];

                if (track == null || track.trackToken == null || track.startDate == null) {
                    Util.log("invalid track, skipping");
                    continue;
                }

                if (stationToken == null) {
                    stationToken = track.stationToken;
                }
                
                Util.log("Adding track to known history: " + track.songName);
                history.push(track);
            }
        }

        if (stationToken != null && history.length > 0) {
            history.sort(this.sortHistory);
			Util.log("History stored for station - "+stationToken);
            AppGlobals.history.set(stationToken, history);
        }
		// MessageDispatcher.dispatchMessage( AppConstants.EVENT_ON_HISTORY_LOAD, true );
    },

    sortHistory: function(a, b) {
        var aTime = a.startDate;
        var bTime = b.startDate;

        if (aTime < bTime) {
            return 1;
        }
        if (aTime > bTime) {
            return -1;
        }
        if (aTime == bTime) {
            return 0;
        }
    }

});

