enyo.kind({
	name: "EnyoPandora",
	kind: "Pane",

	properties: {
		errCallback: ""
	},

	components: [
		{ name: "splash", kind: "EnyoPandoraSplash", lazy: true },
		{ name: "interface", kind: "EnyoPandoraInterface", lazy: true },
		{ name: "headsetStatus", kind: "PalmService", service: "palm://com.palm.keys/headset/", method: "status", onSuccess: "headsetSuccess", onFailure: "headsetFail", subscribe: true},
		{ name: "appEvents", kind: "ApplicationEvents", onWindowParamsChange:"winParamsChanged", onWindowActivated: "refocusApp", onload:"", onWindowDeactivated: "unfocusAppDelay", onUnload: "unloadApp", onLoad: "loadApp", onApplicationRelaunch: "onRelaunch"}
	],

	create: function() {
		this.inherited(arguments);
		enyo.windows.renameWindow( window, "MainWindow" );
		NowPlaying.start();
		this.exhibition = false;
		this.exhibitionLaunch = false;
		if ( enyo.windowParams.windowType == "dockModeWindow" && enyo.windowParams.dockMode ) {
			this.exhibitionLaunch = true;
			this.exhibition = true;
		}
		this.getHeadsetStatus();
		this.dashWindow = null;
		if ( DeviceService != undefined ) {
			DeviceService.startCalls();
		}

	},
	
	getHeadsetStatus: function() {
		this.$.headsetStatus.call({});
	},
	
	headsetSuccess: function(sender, response) {
		if (AppGlobals.station) {
			if (!AppGlobals.station.isPaused && response.state == "up" && response.key == "headset") {
				AppGlobals.station.pauseIfPlaying(); 
			}
			else if (AppGlobals.station.isPaused && response.state == "down" && response.key == "headset") {
				AppGlobals.station.playIfPaused();
			}
		}
	},
	
	headsetFail: function(sender, response) {
		enyo.error("HEADSET REQUEST FAILED!");
	},

	refocusApp: function() {
		// this.log();
		enyo.job.stop( "unfocus" );
		this.hideDashboard();
		if ( DeviceService ) {
			DeviceService.hijackVolumeControls();
		}
	},

	winParamsChanged: function() {
		if ( enyo.windowParams.windowType == "dockModeWindow" && enyo.windowParams.dockMode ) {
			this.exhibition = true;
		}
	},

	unfocusAppDelay: function() {
		if ( DeviceService ) {
			DeviceService.releaseVolumeControls();
		}
	//	this.log("Starting unfocusApp job");
		enyo.job( "unfocus", enyo.bind( this, "unfocusApp" ), 400 );
	},

	unfocusApp: function() {
		if ( !AppGlobals.displayOn && this.exhibition ) {
			return;
		}
		enyo.windowParams.windowType = "";
		enyo.windowParams.dockMode = false;
		if ( this.exhibitionLaunch ) {
			this.shutdown();
			return;
		}
		if (this.exhibition) {
			this.$.interface.updateView();
			this.exhibition = false;
		}
		this.showDashboard();
	},

	dashboardShowing: function() {
		return ( enyo.windows.fetchWindow("MyDashboard") );
	},

	showDashboard: function() {
		var dashboard = enyo.windows.fetchWindow("MyDashboard");
		if ( !this.dashboardShowing() &&
            AppGlobals.station != null &&
            AppGlobals.station.getCurrentTrack() != null &&
			AppGlobals.station.getCurrentTrack() != undefined &&
            AppGlobals.station.getCurrentTrack().getTrackData() != null &&
            !this.isFocused() &&
			!this.exhibition )
        {
			this.dashWindow = enyo.windows.openDashboard("dashboard.html", "MyDashboard", {util: Util, appGlobals: AppGlobals, appConstants: AppConstants, messageDispatcher: MessageDispatcher, api: Api}, {clickableWhenLocked:true});
		}
	},

	hideDashboard: function() {
		try {
			if ( this.dashWindow != null ) {
				this.dashWindow.close();
				this.dashWindow = null;
			}
		} catch(e) {
			this.log(e);
		}
	},

	isDashboardActive: function() {
		return ( this.dashboardShowing() == enyo.windows.getActiveWindow() );
	},

	isFocused: function() {
		return ( window == enyo.windows.getActiveWindow() );
	},

	unloadApp: function() {
		this.unloading = true;
		try {
			if ( this.dashWindow )
				this.dashWindow.close();
		} catch(e) {
			this.log(e);
		}
	},

	setView: function( viewName ) {
		this.selectViewByName( viewName, true );
		return this.getView();
	},

	onRelaunch: function(inSender) {
		this.log();
		var params = enyo.windowParams;
		if ( params.appTimeout === true ) {
			this.shutdown();
			return;
		}
		//Check for exhibition
		if ( params.windowType == "dockModeWindow" && params.dockMode ) {
			this.exhibition = true;
			this.hideDashboard();
			if ( !AppGlobals.username ) {
				this.setView("splash");
				Util.showMessageWithCallback("Attention","Please sign in using standard app mode before attempting to use exhibition mode.", this.shutdown.bind(this));
				return;
			}
			this.$.interface.updateView();
		}
		else if (this.exhibition) {
			this.$.interface.updateView();
			this.exhibition = false;
		}
	},

	shutdown: function() {
		this.hideDashboard();
		AppGlobals.shutdown();
		window.close();
	},

	blockScreenTimeout: function( boolBlock ) {
		enyo.windows.setWindowProperties(window, {blockScreenTimeout: boolBlock});
	},

	addSound: function( sound ) {
		this.$.interface.createComponent( sound, {owner: this} );
	},

	showError: function( dlgBox ) {
		if ( this.$.errorDlg != undefined ) {
			this.$.errorDlg.destroy();
		}
		this.getView().createComponent( dlgBox, {name: "errorDlg",  width: "100%", style: "position:fixed;", owner: this} ).open();
	},

	getOrientation: function() {
		var o = enyo.getWindowOrientation();
		if ( o == "up" || o == "down" ) {
			return "vertical";
		}
		else if ( o == "left" || o == "right" ) {
			return "horizontal";
		}
	},

	getHeight: function() {
		var height = enyo.getModalBounds().height;
		return height;
	},

	getWidth: function() {
		var width = enyo.getModalBounds().width;
		return width;
	},

	callback: function() {
		this.errCallback();
	}
});
