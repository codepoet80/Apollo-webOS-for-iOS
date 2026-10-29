enyo.kind({
	name: "DeviceServiceKind",
	kind: "Control",
	
	components: [
		{
            name : "dispServ",
            kind : "PalmService",
            service : "palm://com.palm.display/",
            method : "status",
            onSuccess : "onDisplayEvent",
            onFailure : "callFailed",
			onResponse: "catchResponse",
            subscribe : true
        },
		{
            name : "networkServ",
            kind : "PalmService",
            service : "palm://com.palm.connectionmanager/",
            method : "getstatus",
            onSuccess : "onNetworkEvent",
            onFailure : "callFailed",
			onResponse: "catchResponse",
			subscribe: "true"
        },
		{
            name : "mediaServ",
            kind : "PalmService",
            service : "palm://com.palm.keys/media/",
            method : "status",
            onSuccess : "onMediaEvent",
            onFailure : "callFailed",
			onResponse: "catchResponse",
			subscribe: "true"
        },
		{
            name : "volServ",
            kind : "PalmService",
            service : "palm://com.palm.audio/",
            method : "media/lockVolumeKeys",
			subscribe: true
        },
		{
			name : "AVRCP",
			kind : "PalmService",
			service : "palm://com.palm.keys/",
			method : "media/status",
			onSuccess : "onMediaEvent",
			onFailure : "callFailed",
			onResponse: "catachResponse",
			subscribe: true,
		}
	],
	
	ready: function() {
		Util.log("DeviceService ready");
		this.$.volServ.active = false;
	},
	
	startCalls: function() {
		this.$.dispServ.call( {} );
		this.$.networkServ.call( {} );
		this.$.mediaServ.call( {} );
	},

	hijackVolumeControls: function() {
		if ( !this.$.volServ.active ) {
			enyo.log("Hijacking volume controls (DeviceService).");
			this.$.volServ.call( {} );
			this.$.volServ.active = true;
		}
	},

	releaseVolumeControls: function() {
		if (this.$.volServ.active) {
			enyo.log("Volume controls released (DeviceService)");
			this.$.volServ.cancel();
			this.$.volServ.active = false;
		}
	},

	onVolumeLock: function(inSender, inResponse) {
		enyo.log("Volume lock event");
		return true;
	},

	onDisplayEvent: function(inSender, inResponse) {
		//enyo.log("DISPLAY EVENT: "+inResponse.event);
		if (inResponse.event === "displayOff") {
			AppGlobals.displayOn = false;
			MessageDispatcher.dispatchMessage(AppConstants.EVENT_ON_DISPLAY, false);
		}
		else if (inResponse.event === "displayOn") {
			AppGlobals.displayOn = true;
			MessageDispatcher.dispatchMessage(AppConstants.EVENT_ON_DISPLAY, true);
		}
	},

	onNetworkEvent: function( inSender, inResponse ) {
		Util.log("Network response: " + enyo.json.stringify(inResponse));
		if (inResponse.wifi != null && inResponse.wifi.state == 'connected') {
			AppGlobals.networkType = AppGlobals.NETWORK_WIFI;
			Util.log("Network: WIFI");
		}
		else {
			AppGlobals.networkType = AppGlobals.NETWORK_CELL;
			Util.log("Network: CELL");
		}

		AppGlobals.isInternetAvailable = inResponse.isInternetConnectionAvailable;

		Util.log("Is internet available: " + inResponse.isInternetConnectionAvailable);

		if (AppGlobals.isInternetAvailable && AppGlobals.station != null) {
			AppGlobals.station.playlistService.networkAvailable();
		}
	},

	onMediaEvent: function(inSender, inResponse) {
		if (AppGlobals.station == null) {
			Util.log("Station not playing, skipping media inResponse");
		}
		else {
			enyo.error("ONMEDIAEVENT: "+inResponse.key+" "+inResponse.state);
				Util.log("Media inResponse fired");

				if (inResponse.key == "pause" && inResponse.state == "down") {
					AppGlobals.station.pause();
				}
				else if (inResponse.key == "play" && inResponse.state == "down") {
					AppGlobals.station.pause();
				}
				else if (inResponse.key == "next" && inResponse.state == "down") {
					AppGlobals.station.skip();
				}
				else if (inResponse.key == "togglePausePlay" && inResponse.state == "down") {
					AppGlobals.station.pause();
				}
				else if (inResponse.key == "stop" && inResponse.state == "down") {
					AppGlobals.station.pauseIfPlaying();
				}
		}
	},
	
	callFailed: function(inSender, inResponse) {
		Util.log("Service call failed for "+inSender.name+".");
		Util.log( enyo.json.stringify(inResponse) );
	},
	
	catchResponse: function(inSender, inResponse) {
		 Util.log("Response caught...");
		 Util.log(inSender.name);
		 Util.log(enyo.json.stringify(inResponse));
	},

	stop: function() {
		this.$.dispServ.cancel();
		this.$.mediaServ.cancel();
		this.$.volServ.cancel();
	}

});
