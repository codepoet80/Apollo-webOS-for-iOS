var AppGlobals = Class.create(Persistence, {

	initialize: function() {
		this.autoCompleteUrl = null;
		this.systemProperties = null;

		this.partnerAuthToken = null;
		this.partnerId = null;
		this.userAuthToken = null;
		this.userId = null;
		this.hasAds = false;
		this.canListen = false;
		this.nowPlayingAdUrl = null;
		this.splashScreenAdUrl = null;
		this.skipLimit = 0;
		this.networkErrorCount = 0;
		this.keyCombination = [];
		this.progressBottom = 53;

		this.clientStartTime = -1;
		this.serverSyncTime = -1;

		this.createStationSeed = null;
		this.mediaserverDisconnected = false;

		this.station = null;
		this.stations = new Hash();
		this.history = new Hash();

		this.dashboardLaunched = false;
		this.appHasFocus = true;
		this.displayOn = true;

		// Constants live on the prototype; the AppGlobals global is still the
		// constructor while this runs, so go through this.
		this.networkType = this.NETWORK_WIFI;
		this.isInternetAvailable = true;
		this.trackCounter = 1000;
		this.checkNetworkId = null;
        this.useProgressBar = true;
//		this.andoService = new AndoService();
        this.musicPlaying = false;

        // device id upgrade props
        this.isFirstLoginWithNewDeviceId = false;
        this.newDeviceId = null;

        // // mojo version
        // this.mojoVersion = null;
        // var mojoVersionStr = Mojo.Versions["1"];
        // if (mojoVersionStr != null) {
            // this.mojoVersion = parseFloat(mojoVersionStr);
        // }

        this.deviceModel = "pre";
        this.webOS1_1 = 175.7;
        this.webOS1_2 = 200.18;

		// persistent database properties
		this.username = null;
		this.stationListSort = null;
		this.stationListChecksum = null;
		this.stationList = null;
		this.audioQuality = null;
		this.debug = false;
        this.licensing = false;
        this.deviceId = null;
		
		// New stuff
		this.platform = enyo.g11n.getPlatform();
		this.backgroundUrl = "themes/1.png";
		this.textBacking = false;
		this.orientation = false;
		this.startupAutoPlay = true;
		this.dashProgress = true;
		this.deviceInfo = enyo.fetchDeviceInfo();
		this.controlsDisabled = true;
		this.simpleExhibition = true;

		Util.log("AppGlobals Initialized");
	},

	clean: function() {
		Util.log("Cleaning AppGlobals");
		AppGlobals.email = null;
		AppGlobals.stationListSort = null;
		AppGlobals.stationListChecksum = null;
		AppGlobals.stationList = null;
		AppGlobals.station = null;
		AppGlobals.audioQuality = null;
		AppGlobals.nowplayingScrollState = null;
        AppGlobals.licensing = null;
	},
	
	resetForSignOut: function() {
		this.username = null;
		this.userAuthToken = null;
		this.userId = null;
		AppGlobals.isFirstLoginWithNewDeviceId = true;
	},

	setClientStartTime: function() {
		this.clientStartTime = (new Date().getTime()) / 1000;
	},

	getSyncTime: function() {
		var currentClientTime = (new Date().getTime()) / 1000;
		return this.serverSyncTime + /*Math.round(*/currentClientTime - this.clientStartTime/*)*/;
	},
    
	getStation: function(stationData) {
		var stationToken = stationData.stationToken;
		var station = this.stations.get(stationToken);
		Util.log("stationToken: "+stationToken);
		if (station == null) {
			station = new Station(stationData);
			this.stations.set(stationToken, station);
		}
		return station;
	},
	
	sortAlpha: function(a,b){
		// QuickMix always sorts first; handle both sides so the comparator is consistent
		if (a.isQuickMix && b.isQuickMix) {
			return 0;
		}
		if (a.isQuickMix) {
			return -1;
		}
		if (b.isQuickMix) {
			return 1;
		}

		if (a.stationName.toLowerCase() > b.stationName.toLowerCase()) {
			return 1;
		}
		else if (a.stationName.toLowerCase() < b.stationName.toLowerCase()) {
			return -1;
		}
		else {
			return 0;
		}
	},
	
	sortDate: function(a,b){
		if (a.isQuickMix && b.isQuickMix) {
			return 0;
		}
		if (a.isQuickMix) {
			return -1;
		}
		if (b.isQuickMix) {
			return 1;
		}

		if (a.dateCreated.time < b.dateCreated.time) {
			return 1;
		}
		else if (a.dateCreated.time > b.dateCreated.time) {
			return -1;
		}
		else {
			return 0;
		}
	},

	deleteStation: function(stationToken) {
		if (this.stationList == null) return;

		for (var i = 0; i < this.stationList.length; ++i) {
			var station = this.stationList[i];
			if (station.stationToken == stationToken) {
				this.stationList.splice(i, 1);
			}
		}

		this.setStationList(this.stationList);
	},

	setDeviceId: function(value) {
		this.deviceId = value;
		this.persistValue(AppGlobals.DB_KEY_DEVICE_ID, value);
	},

	setUsername: function(value) {
		this.username = value;
		this.persistValue(AppGlobals.DB_KEY_USERNAME, value);
		
	},

	setStationListSort: function(value) {
		this.stationListSort = value;
		this.sortStationList();
		this.persistValue(AppGlobals.DB_KEY_STATION_LIST_SORT, value);
	},

	setStationListChecksum: function(value) {
		this.stationListChecksum = value;
		this.persistValue(AppGlobals.DB_KEY_STATION_LIST_CHECKSUM, value);
	},
	
	sortStationList: function() {
		if ( this.stationList == null ) {
			return;
		}
		
		if (this.stationListSort == AppGlobals.STATION_SORT_ALPHA) 
			this.stationList.sort(this.sortAlpha);
		else
			this.stationList.sort(this.sortDate);
	},

	setStationList: function(value) {
		this.stationList = value;
		this.sortStationList();
		this.persistValue(AppGlobals.DB_KEY_STATION_LIST, this.stationList);
		MessageDispatcher.dispatchMessage( AppConstants.EVENT_ON_STATION_LIST_CHANGE, null );
	},

	setStation: function(stationData) {
		// persist station data instead of station object
		this.station = this.getStation(stationData);
		this.persistValue(AppGlobals.DB_KEY_STATION, stationData);
	},

	clearStation: function() {
		this.station = null;
		this.persistValue(AppGlobals.DB_KEY_STATION, null);
		MessageDispatcher.dispatchMessage( AppConstants.EVENT_ON_STATION_CHANGE, null );
	},

	setAudioQuality: function(value) {
		this.audioQuality = value;
		this.persistValue(AppGlobals.DB_KEY_AUDIO_QUALITY, value);
	},
	
	setStartupAutoPlay: function(value) {
		this.startupAutoPlay = value;
		this.persistValue(AppGlobals.DB_KEY_AUTO_PLAY, value);
	},
	
	setDashProgress: function(value) {
		this.dashProgress = value;
		this.persistValue(AppGlobals.DB_KEY_DASH_PROGRESS, value);
	},
	
	setBackgroundUrl: function(value) {
		this.backgroundUrl = value;
		this.persistValue(AppGlobals.DB_KEY_BACKGROUND_URL, value);
	},
	
	setTextBacking: function(value) {
		this.textBacking = value;
		this.persistValue(AppGlobals.DB_KEY_TEXT_BACKING, value);
	},
	
	setOrientation: function(value) {
		if (value != "free") {
			this.orientation = true;
		}
		else {
			this.orientation = false;
		}
		enyo.setAllowedOrientation(value);
		this.persistValue(AppGlobals.DB_KEY_ORIENTATION, value);
	},
	
	setExhibitionType: function(value) {
		this.simpleExhibition = value;
		this.persistValue(AppGlobals.DB_KEY_EXHIBITION, value);
	},
	
    setLicensing: function(value) {
        this.licensing = value;
        this.persistValue(AppGlobals.DB_KEY_LICENSING, value);
    },

	setDebug: function(value) {
		if (value) {
			Mojo.Log.currentLogLevel = 99;
			Util.log("log level: " + Mojo.Log.currentLogLevel);
		} else {
			Mojo.Log.currentLogLevel = 0;
			Util.log("log level: " + Mojo.Log.currentLogLevel);
		}
		this.debug = value;
		this.persistValue(AppGlobals.DB_KEY_DEBUG, value);
	},

	shutdown: function() {
		if (this.station != null) {
			this.station.stop();
		}

		if (DeviceService) {
			DeviceService.stop();
		}
	}

});

AppGlobals.prototype.NETWORK_ERROR_THRESHOLD = 6;

AppGlobals.prototype.NETWORK_WIFI = 'wifi';
AppGlobals.prototype.NETWORK_CELL = 'cell';

AppGlobals.prototype.STATION_HISTORY_WINDOW = 60 * 1000 * 60;
AppGlobals.prototype.RESUME_WINDOW = 60 * 1000 * 20;
AppGlobals.prototype.SPLASHSCREEN_DELAY = 3 * 1000;
AppGlobals.prototype.NETWORK_CHECK_INTERVAL = 10 * 1000;

AppGlobals.prototype.DEFAULT_BACKGROUND = "themes/1.png";

AppGlobals.prototype.STATION_SORT_ALPHA = "alphaSort";
AppGlobals.prototype.STATION_SORT_DATE = "dateSort";


// don't change keys
AppGlobals.prototype.DB_KEY_DEVICE_ID = "deviceId";
AppGlobals.prototype.DB_KEY_USERNAME = "username";
AppGlobals.prototype.DB_KEY_STATION_LIST_SORT = "station-list-sort";
AppGlobals.prototype.DB_KEY_STATION_LIST_CHECKSUM = "station-list-checksum";
AppGlobals.prototype.DB_KEY_STATION_LIST = "station-list";
AppGlobals.prototype.DB_KEY_STATION = "station-data";
AppGlobals.prototype.DB_KEY_AUDIO_QUALITY = "audio-quality";
AppGlobals.prototype.DB_KEY_BACKGROUND_URL = "background-url";
AppGlobals.prototype.DB_KEY_TEXT_BACKING = "text-backing";
AppGlobals.prototype.DB_KEY_ORIENTATION = "orientation";
AppGlobals.prototype.DB_KEY_EXHIBITION = "exhibition";
AppGlobals.prototype.DB_KEY_AUTO_PLAY = "autoPlay";
AppGlobals.prototype.DB_KEY_DASH_PROGRESS = "dashProgress";
AppGlobals.prototype.DB_KEY_DEBUG = "debug";
AppGlobals.prototype.DB_KEY_LICENSING = "licensing";

AppGlobals.prototype.MAX_STATION_HISTORY_LENGTH = 20;

AppGlobals.prototype.COOKIE_KEY_OFFSET = "offset";
AppGlobals.prototype.HTTP_GET_METHOD = "get";

AppGlobals.prototype.DEFAULT_BUCKET = "_defaultBucketName";
