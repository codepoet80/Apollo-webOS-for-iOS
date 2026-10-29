enyo.kind({
	name:"MyDashboard",
	kind: "Control", 
	style:"background-image:url('images/dashbg.png'); background-position:center bottom; background-repeat:repeat-x; background-color:#0a4681",
	components: [
		{
			kind:"ProgressButton", name: "progressButton", layoutKind:"HFlexLayout", cancelable: false, animatePosition: true, minimum: 0, maximum: 100, position: 0, align: "center", className:"",
			components:[
				{kind:"Scrim", showing: true},
				{kind:"Image", src:"images/no-art-available.png", name:"currentAlbumArt", onclick:"openApp", style: "margin-top: 8px;", height:"36px", width:"36px"},
				{kind:"VFlexBox", pack:"center", style:"font-size:14px; margin-left:3px; color:#EFEFEF;", onclick: "openApp", 
					components:[{content:"", name:"currTrackName", style:"font-weight:bold;"}, {content:"", name:"currArtistName"}]
				},
				{flex:1},
				{kind:"HFlexBox", align:"center", pack:"center", name:"likeDislikeDash", 
					components:[
						{kind:"Image", onclick: "rateSong", name: "thumbDown", style:"margin-top:20px; width:24px; height:30px;", src:"images/dislikedash.png"},
						{content:"\\", style:"font-size:38px; font-weight:600; color:#BBBBBB;"},
						{kind:"Image", onclick: "rateSong", name: "thumbUp", style:"margin-bottom:12px; width:24px; height:30px;", src:"images/likedash.png"}
					]
				},
				{flex:0.6},
				{kind:"Image", style:"margin-right:5px; ",  src:"images/playdash.png", name:"playPauseButton", onclick:"playPause"},
				
				{kind:"Image", style:"margin-right:5px;", src:"images/skipdash.png", onclick:"skipTrack"},
				{kind:"ApplicationEvents", onWindowActivated: "dashActivated", onWindowDeactivated: "dashDeactivated", onUnload: "unload"}
			]
		},
	],
	
	create: function() {
		// this.log();
		enyo.windows.renameWindow( window, "MyDashboard" );
		this.justCreated = true;
		
		this.togglePauseCallbackId 		= MessageDispatcher.subscribe( AppConstants.EVENT_ON_TOGGLE_PAUSE, this.togglePlayPauseDisplay.bind(this) );
		this.trackChangeCallbackId 		= MessageDispatcher.subscribe( AppConstants.EVENT_ON_TRACK_CHANGE, this.onTrackChange.bind(this) );
		this.disableControlsCallbackId 	= MessageDispatcher.subscribe( AppConstants.EVENT_ON_DISABLE_CONTROLS, this.scrimContent.bind(this) );
		// this.progressCallbackId 		= MessageDispatcher.subscribe( AppConstants.EVENT_ON_PLAY_PROGRESS, this.onProgress.bind(this) );
		this.trackThumbedCallbackId 	= MessageDispatcher.subscribe(AppConstants.EVENT_ON_TRACK_THUMBED, this.updateThumbControls.bind(this));
		this.inherited(arguments);
	},
	
	unload: function() {
		// this.log();
		MessageDispatcher.unsubscribe( AppConstants.EVENT_ON_TOGGLE_PAUSE, this.togglePauseCallbackId );
		MessageDispatcher.unsubscribe( AppConstants.EVENT_ON_TRACK_CHANGE, this.trackChangeCallbackId );
		MessageDispatcher.unsubscribe( AppConstants.EVENT_ON_DISABLE_CONTROLS, this.disableControlsCallbackId );
		MessageDispatcher.unsubscribe( AppConstants.EVENT_ON_PLAY_PROGRESS, this.progressCallbackId );
		MessageDispatcher.unsubscribe( AppConstants.EVENT_ON_TRACK_THUMBED, this.trackThumbedCallbackId );
	},
	
	ready: function() {
	},
	
	dashActivated: function() {
		// this.log();
		// Update images etc
		if ( AppGlobals.dashProgress ) {
			this.justCreated = false;
			this.updateProgressInformation();
		}
		if ( AppGlobals.dashProgress ) {
			this.intervalID = setInterval( this.moveProgress.bind(this), 1000 );
		}
		if ( AppGlobals.station ) {
			this.updateTrackInfo( AppGlobals.station.nowplayingActiveTrackData );
		}
	},

	dashDeactivated: function() {
		// this.log();
		// Update images etc
		if ( AppGlobals.station ) {
			this.updateTrackInfo( AppGlobals.station.nowplayingActiveTrackData );
		}
		if ( this.intervalID != null ) {
			clearInterval(this.intervalID);
			this.intervalID = null;
			this.progressDuration = null;
		}
	},
	
	scrimContent: function( state ) {
		if ( state && !this.$.scrim.showing ) {
			this.$.scrim.show();
		}
		else if ( !state && this.$.scrim.showing ) {
			this.$.scrim.hide();
		}
	},
	
	onProgress: function( timeObj ) {
		// Updates periodically with track's actual time
		if ( AppGlobals.dashProgress && AppGlobals.displayOn ) {
			this.justCreated = false;
			this.updateProgressInformation();
			this.$.progressButton.setPosition( timeObj.elapsedSeconds );
		}
	},

	moveProgress: function() {
		if ( AppGlobals.dashProgress && AppGlobals.displayOn && AppGlobals.musicPlaying ) {
			this.$.progressButton.setPosition( this.$.progressButton.position+1 );
		}
	},
	
	/** This function simply sets the proper information for the maximum bounds of the animator and progressButton **/
	updateProgressInformation: function() {
		if ( AppGlobals.station != null && AppGlobals.station.getCurrentTrack() != null && !this.progressDuration ) {
			var timeObj = AppGlobals.station.getCurrentTrack().timeObject;
			this.progressDuration = timeObj.elapsedSeconds + timeObj.remainingSeconds;
			this.$.progressButton.setMaximum( this.progressDuration );
			this.$.progressButton.setPosition( timeObj.elapsedSeconds );
		}
	},

	getPlayButtonState: function() {
		if (AppGlobals.station.getCurrentTrack() != null && AppGlobals.station.getCurrentTrack().isPaused()) {
			return AppConstants.IMG_PLAY_DASH;
		}
		else {
			return AppConstants.IMG_PAUSE_DASH;
		}
	},

	shutdown: function() {
		window.close();
	},
	
	openApp: function() {
		enyo.windows.activate(undefined, "MainWindow", {});
	},
	
	onTrackChange: function( trackData ) {
		this.updateTrackInfo( trackData );
		if ( AppGlobals.dashProgress ) {
			this.progressDuration = null;
			this.updateProgressInformation();
		}
	},
	
	updateTrackInfo: function( trackData ) {
		if ( trackData != null ) {
			this.$.playPauseButton.setSrc(this.getPlayButtonState());
			this.songInfo = Track.formatTrackData( trackData );
			
			this.$.currTrackName.setContent( Util.truncateText(this.songInfo.song, 19) );
			this.$.currArtistName.setContent( Util.truncateText(this.songInfo.artist, 20) );
			this.$.currentAlbumArt.setSrc( this.songInfo.artUrl );
			
			this.updateThumbControls( trackData.songRating );
		}
		this.scrimContent( AppGlobals.controlsDisabled );
	},

	togglePlayPauseDisplay: function( isPaused ) {
		if ( isPaused ) {
			this.$.playPauseButton.setSrc(AppConstants.IMG_PLAY_DASH);
			clearInterval(this.intervalID);
			this.intervalID = null;
		}
		else {
			this.$.playPauseButton.setSrc(AppConstants.IMG_PAUSE_DASH);
			if ( AppGlobals.dashProgress && !this.intervalID ) {
				this.intervalID = setInterval( this.moveProgress.bind(this), 1000 );
			}
		}
	},
	
	skipTrack: function(inSender) {
		AppGlobals.station.skip();
	},
	
	playPause: function(inSender) {
		// Toggles play/pause of track
		AppGlobals.station.pause();
	},
	
	rateSong: function( inSender, inEvent ) {
		var ratingHistory = false;

		if ( inSender.name == "thumbUp" && AppGlobals.station.getCurrentTrack().trackData.songRating != 1 ) {
			if (!AppGlobals.station.getCurrentTrack().trackData.allowFeedback) {
				Util.showMessage(AppConstants.MSG_FEEDBACK_ERROR_TITLE, AppConstants.MSG_SHARED_STATION_THUMB_UP_ERROR, "");
				return;
			}
			AppGlobals.station.getCurrentTrack().trackData.songRating = 1
			Api.addFeedback(AppGlobals.station.getCurrentTrack().trackData.trackToken, true, new AddFeedbackDelegate( true, AppGlobals.station, ratingHistory ));
			AppGlobals.updateHistory(AppGlobals.station.getStationToken(), AppGlobals.station.getCurrentTrack().trackData.trackToken, AppGlobals.station.getCurrentTrack().trackData);
		}
		else if ( inSender.name == "thumbDown" && AppGlobals.station.getCurrentTrack().trackData.songRating != -1 ) {
			if (!AppGlobals.station.getCurrentTrack().trackData.allowFeedback) {
				Util.showMessage(AppConstants.MSG_FEEDBACK_ERROR_TITLE, AppConstants.MSG_SHARED_STATION_THUMB_DOWN_ERROR, "");
				return;
			}
			AppGlobals.station.getCurrentTrack().trackData.songRating = -1
			Api.addFeedback(AppGlobals.station.getCurrentTrack().trackData.trackToken, false, new AddFeedbackDelegate( false, AppGlobals.station, ratingHistory ));
			AppGlobals.updateHistory(AppGlobals.station.getStationToken(), AppGlobals.station.getCurrentTrack().trackData.trackToken, AppGlobals.station.getCurrentTrack().trackData);
		}
		
		
		// this.updateThumbControls( owner.trackData.songRating, owner );
		
		return true;
	},
	
	updateThumbControls: function(songRating) {
		
		if (songRating == 1) {
			this.$.thumbUp.setSrc("images/likecheckeddash.png");
			this.$.thumbDown.setSrc("images/dislikedash.png");
		}
		else if (songRating == -1) {
			this.$.thumbDown.setSrc("images/dislikecheckeddash.png");
			this.$.thumbUp.setSrc("images/likedash.png");
		}
		else {
			this.$.thumbUp.setSrc("images/likedash.png");
			this.$.thumbDown.setSrc("images/dislikedash.png");
		}
		
	}
}
)
