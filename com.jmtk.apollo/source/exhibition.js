enyo.kind({
	name:"exhibition",
	kind:"VFlexBox", 
	style:"background-image:url('themes/1.png');", 
	align:"center",
	pack:"center",
	flex:1,
	components:[
		{ name: "appEvents", kind: "ApplicationEvents", onWindowActivated: "reactivate", onWindowDeactivated: "deactivate"},
		{
			kind: "Scrim", name:"contentScrim", showing: true,
			layoutKind: "VFlexLayout", align: "center", pack: "center", 
			components: [
				//{kind: "Image", src: "images/loading.gif", name:"contentSpinner", showing: false}
				{kind:"Canvas", name:"contentSpinner", showing:false}
			]
		},
		// Background container
		{
			kind:"VFlexBox", name: "backScreen", height: "100%", width: "100%", flex:1, 
			align:"center", pack: "center", 
			style:"font-size:24px; color: white; background-color: rgba(0,0,0,0.3); position: absolute; top: 0px; left: 0px; z-index: 3;",
			
			components: [
				{
					kind: "HFlexBox", name: "gridBox", width: "97%", style:"margin-left:5%;", flex:1, align:"start", pack:"center",
					ondragstart:"startDragGrid", ondragfinish:"finishDragGrid",
					components: [
						{
							kind: "historyGrid", showing:false, cellWidth:175, cellHeight:175, collapsed:true, flex:1,
							components: [
								{kind: "ApplicationEvents", onWindowRotated: "handleResize"},
								{kind:"Image", src:"images/return.png", style:"margin-left:8px; width:170px; height:170px;", onclick:"fadeBack"}
							]
						}
					]
				}
			]
		},
		// Marquee container
		{
			kind:"HFlexBox", name: "marqueeScreen", height: "100%",
			width: "99%", flex:1, align:"center", pack: "center", 
			style:"position: absolute; top: 0px; left: 0px; z-index: 0;",
			components:[
				{kind:"VFlexBox", flex:1, components:[{kind: "marqueeColumn", name: "marquee_0", layoutKind: "VFlexLayout",
				onSetupRow: "setupMarqueeTiles", flex: 1}]},
				{kind:"VFlexBox", flex:1, components:[{kind: "marqueeColumn", name: "marquee_1", layoutKind: "VFlexLayout",
				onSetupRow: "setupMarqueeTiles", flex: 1}]},			
				{kind:"VFlexBox", flex:1, components:[{kind: "marqueeColumn", name: "marquee_2", layoutKind: "VFlexLayout",
				onSetupRow: "setupMarqueeTiles", flex: 1}]},
				{kind:"VFlexBox", flex:1, components:[{kind: "marqueeColumn", name: "marquee_3", layoutKind: "VFlexLayout",
				onSetupRow: "setupMarqueeTiles", flex: 1}]},
				{kind:"VFlexBox", flex:1, components:[{kind: "marqueeColumn", name: "marquee_4", layoutKind: "VFlexLayout",
				onSetupRow: "setupMarqueeTiles", flex: 1}]},
				{kind:"VFlexBox", flex:1, components:[{kind: "marqueeColumn", name: "marquee_5", layoutKind: "VFlexLayout",
				onSetupRow: "setupMarqueeTiles", flex: 1 }]},
				{kind:"VFlexBox", flex:1, components:[{kind: "marqueeColumn", name: "marquee_6", layoutKind: "VFlexLayout",
				onSetupRow: "setupMarqueeTiles", flex: 1}]},
				{kind:"VFlexBox", flex:1, components:[{kind: "marqueeColumn", name: "marquee_7", layoutKind: "VFlexLayout",
				onSetupRow: "setupMarqueeTiles", flex: 1}]},
				{kind:"VFlexBox", flex:1, components:[{kind: "marqueeColumn", name: "marquee_8", layoutKind: "VFlexLayout",
				onSetupRow: "setupMarqueeTiles", flex: 1}]},
				{kind:"VFlexBox", flex:1, components:[{kind: "marqueeColumn", name: "marquee_9", layoutKind: "VFlexLayout",
				onSetupRow: "setupMarqueeTiles", flex: 1}]}
			]
		},
		// Foreground container
		
		{
			kind:"VFlexBox", name: "mainScreen", height: "100%", width: "100%", flex:1, align:"center", pack: "center", style:"font-size:24px; color: white; background-color: rgba(0,0,0,0.45); position: absolute; top: 0px; left: 0px; z-index: 5;",
			components:[
			//{flex:0.9},
				{
					kind:"VFlexBox", align:"center", pack: "center", style:"padding-bottom: 5px;",
					components: [
						{name: "currTrackName", content:"", style:"font-weight:bold;", showing: false},
						{kind:"HFlexBox", name: "currTrackArtistBox", pack:"center", style: "", showing: false,
							components:[ 
								{name: "byText", content:"by&nbsp;", style: ""},
								{name: "currTrackArtist", content:"", style: ""}
							]
						},
						{kind:"HFlexBox", name: "currTrackAlbumBox", pack:"center", showing: false,
							components:[
								{name:"onText", content:"on&nbsp;", style: ""}, 
								{name:"currTrackAlbum", content:"", style: "font-style:italic;"} 
							]
						}
					]
				},
				{kind:"SnapScroller", name: "snapScroller", index: 1,// onSnap: "handleSnap",
				 width:"570px", layoutKind: "HFlexLayout", vertical: false, horizontal: true, dragSnapWidth:120,
				 components:[
					{kind: "HFlexBox", components: [ {kind:"Image", src:"images/transparentimage.png"} ]},
					{kind:"HFlexBox", ondragstart:"startDrag", ondragfinish:"finishDrag",
						components:[
							{
								kind:"VFlexBox", name: "currentAlbumArtContainer", style:"width:500px; height:500px; margin-bottom: 6px; background-repeat: no-repeat; background-size: 100% 100%;", 
								onclick:"playPause",
								components:[
									{
										kind: "VFlexBox", name: "albumArtInner", flex: 1,
										components: [
											{kind:"Image", name:"pauseOverlay", src: "images/pauseexh.png", showing: false}
										]
									}
								]
							},
							{kind:"VFlexBox", style:"margin-left:5px", height:"500px", name:"likeDislikebox", showing:false, components:[
								{kind:"Image", style:"opacity:0.79;", name:"thumbUp", onclick:"rateSong", src:"images/exhlike.png"},
								{height:"14px"},
								{kind:"Image", style:"opacity:0.79;", name:"thumbDown", onclick:"rateSong", src:"images/exhdislike.png"}
								]
							},
						]
					},
					{kind: "HFlexBox", components: [ {kind:"Image", src:"images/transparentimage.png"} ]},
					]
				},
				{
					kind: "ProgressButton", showing: false, layoutKind:"HFlexLayout", width: "90%", name: "progressBar",
					style: "background-color: rgba(20,115,204,0.50); position: absolute; bottom: 2px; margin-left: 5%;", 
					cancelable: false, animatePosition: true, position: 0, minimum: 0, maximum: 10000, snap: 1, align:"center",
					components:[
						{kind:"Control", name: "elapsed", content:"0:00", style:"font-size:20.5px; color: white; opacity:0.9;"},
						{flex:1},
						{kind:"Control", name: "remaining", content:"-0:00", style:"font-size:20.5px; color: white; opacity:0.9;"},
					]
				},
				{ kind: "Image", width: "100px", name: "nextAlbumArt", showing: false, style: "" }
			]
		},
		
		{kind: "ApplicationEvents", onWindowRotated: "handleResize"}
	],
	
	ready: function() {
		// this.log();
		this.artistInfo = new ArtistInfo();
		this.songInfo = new SongInfo();
		this.contentShowing = false;
		this.firstAdjustmentMade = false;
		this.progressDurationUpdated = false;
		this.needsFocus = false;
		this.isTap = true;
		this.tileCount = 0;
		this.historyTiles = [];
		this.marqueeCount = 10;

		this.handleResize();
		
		this.subscribe();

        if ( AppGlobals.station && AppGlobals.station.nowplayingActiveTrackData ) {
        	this.onTrackChange( AppGlobals.station.nowplayingActiveTrackData );
        	this.scrimContent(false);
        }
        else if (AppGlobals.station && !AppGlobals.station.started) {
        	AppGlobals.station.start();
        }
        else if (AppGlobals.station && AppGlobals.station.started) {
			this.fillHistoryGrid(false);
			this.fillMarquees();
        }
		if ( AppGlobals.station ) {
			this.togglePlayPauseDisplay( !AppGlobals.musicPlaying );
		}
		enyo.job("firstSnap", enyo.bind(this, "snapArt"), 1000);
	},
	
	subscribe: function() {
		this.historyLoadCallbackId = MessageDispatcher.subscribe(AppConstants.EVENT_ON_HISTORY_LOAD, this.populate.bind(this));
		this.trackThumbedCallbackId = MessageDispatcher.subscribe(AppConstants.EVENT_ON_TRACK_THUMBED, this.updateThumbControls.bind(this));
        this.trackChangeCallbackId = MessageDispatcher.subscribe( AppConstants.EVENT_ON_TRACK_CHANGE, this.onTrackChange.bind(this) );
		this.stationChangeCallbackId = MessageDispatcher.subscribe( AppConstants.EVENT_ON_STATION_CHANGE, this.populate.bind(this) );
        // this.nowPlayingAdCallbackId = MessageDispatcher.subscribe(AppConstants.EVENT_ON_DISPLAY_NOW_PLAYING_AD, this.displayAdCallback);
        this.toggleSpinnerCallbackId = MessageDispatcher.subscribe( AppConstants.EVENT_ON_TOGGLE_SPINNER, this.setSpinnerState.bind(this) );
		this.disableControlsCallbackId = MessageDispatcher.subscribe( AppConstants.EVENT_ON_DISABLE_CONTROLS, this.scrimContent.bind(this) );
		this.preloadAlbumArtCallbackId = MessageDispatcher.subscribe( AppConstants.EVENT_ON_PRELOAD_ALBUM_ART, this.preloadAlbumArt.bind(this) );
		this.togglePauseCallbackId = MessageDispatcher.subscribe( AppConstants.EVENT_ON_TOGGLE_PAUSE, this.togglePlayPauseDisplay.bind(this) );
        this.progressCallbackId = MessageDispatcher.subscribe(AppConstants.EVENT_ON_PLAY_PROGRESS, this.moveProgress.bind(this));
        //this.displayCallbackId = MessageDispatcher.subscribe(AppConstants.EVENT_ON_DISPLAY, this.onDisplayCallback);
	},

	unsubscribe: function() {
		MessageDispatcher.unsubscribe(AppConstants.EVENT_ON_HISTORY_LOAD, this.historyLoadCallbackId);
		MessageDispatcher.unsubscribe(AppConstants.EVENT_ON_TRACK_THUMBED, this.trackThumbedCallbackId);
         MessageDispatcher.unsubscribe( AppConstants.EVENT_ON_TRACK_CHANGE, this.trackChangeCallbackId );
		 MessageDispatcher.unsubscribe( AppConstants.EVENT_ON_STATION_CHANGE, this.stationChangeCallbackId );
        //  MessageDispatcher.unsubscribe(AppConstants.EVENT_ON_DISPLAY_NOW_PLAYING_AD, this.nowPlayingAdCallbackId);
         MessageDispatcher.unsubscribe( AppConstants.EVENT_ON_TOGGLE_SPINNER, this.toggleSpinnerCallbackId );
		 MessageDispatcher.unsubscribe( AppConstants.EVENT_ON_DISABLE_CONTROLS, this.disableControlsCallbackId );
		 MessageDispatcher.unsubscribe( AppConstants.EVENT_ON_PRELOAD_ALBUM_ART, this.preloadAlbumArtCallbackId );
		 MessageDispatcher.unsubscribe( AppConstants.EVENT_ON_TOGGLE_PAUSE, this.togglePauseCallbackId );
         MessageDispatcher.unsubscribe(AppConstants.EVENT_ON_PLAY_PROGRESS, this.progressCallbackId);
        // MessageDispatcher.unsubscribe(AppConstants.EVENT_ON_DISPLAY, this.displayCallbackId);
	},

	populate: function( firstLoad ) {
		this.fillHistoryGrid( firstLoad );
		this.fillMarquees();
	},
	
	fillHistoryGrid: function( firstLoad ) {
//		this.log("Start");
		if ( AppGlobals.station == null || firstLoad == null ) {
			return false;
		}
		var history = AppGlobals.history.get( AppGlobals.station.stationToken );
		if ( !history ) {
			this.log("History doesn't exist");
			return false;
		}
//		this.$.historyGrid.destroyComponents();
//		this.$.historyGrid.createComponent( {kind: "ApplicationEvents", onWindowRotated: "handleResize"} );
		for ( var i = 0; i < this.historyTiles.length; i++ ) {
			this.historyTiles[i].destroy();
		}
		this.historyTiles = [];
		this.tileCount = 0;
		this.trackData = null;
		this.songInfo = new SongInfo();
		this.artistInfo = new ArtistInfo();
		for ( var i = 1; i < history.length; i++ ) {
			this.addHistoryTile( { kind: "historyTile", onclick: "historyClick", exhibition: true, width: "170px", height: "170px", trackData: history[i], name: "historyTile_"+history[i].trackToken, opacity: 1.0, onRateSong: "rateSong" } );
		}
		this.$.historyGrid.render();
	},

	handleSnap: function( inSender ) {
		this.log(inSender.getIndex());
		if ( inSender.getIndex() == 0 ) {
			this.toggleHistoryGrid();
		}
		else if ( inSender.getIndex() == 2 ) {
			this.skipTrack();
		}
	},
	
	handleResize: function() {
		if ( !this.$.gridBox ) {
			return;
		}
		if ( Application.getOrientation() == "vertical" ) {
			this.$.gridBox.applyStyle("margin-left", "6%");
			this.$.marqueeScreen.applyStyle("margin-left", "1.5%");
		}
		else {
			this.$.gridBox.applyStyle("margin-left", "4%");
			this.$.marqueeScreen.applyStyle("margin-left", "0%");
		}
	},

	snapArt: function() {
		this.$.snapScroller.snapTo(1);
	},
	
	playPause: function(inSender) {
		if ( !this.isTap ) {
			this.isTap = true;
			return;
		}
		// Toggles play/pause of track
		AppGlobals.station.pause();
	},
	
	togglePlayPauseDisplay: function( isPaused ) {
		if ( isPaused ) {
			this.$.pauseOverlay.show();
			this.stopMarquees();
			this.$.albumArtInner.applyStyle("background-color","rgba(0,0,0,0.75)");
		}
		else {
			this.$.pauseOverlay.hide();
			this.startMarquees();
			this.$.albumArtInner.applyStyle("background-color","");
		}
	},
	
	toggleHistoryGrid: function() {
		this.isTap = true;
		this.$.backScreen.applyStyle("z-index", "5");
		this.$.mainScreen.applyStyle("z-index", "3");
		this.$.historyGrid.show();
		enyo.job( "unCollapseGrid", enyo.bind( this.$.historyGrid, "setCollapsed",false), 120 );
	},
	
	startDrag: function(inSender, inEvent) {
		if (Math.abs(inEvent.dx) > Math.abs(inEvent.dy*2)) {
			this.startingX = inEvent.dx;
			this.startingY = null;
		}
		else {
			this.startingX = null;
		}
		
		if (Math.abs(inEvent.dy) > Math.abs(inEvent.dx*2)) {
			this.startingY = inEvent.dy;
		}
		else {
			this.startingY = null;
		}
		this.isTap = false;
	},
	
	finishDrag: function(inSender, inEvent) {
		if ( this.startingY != null ) {
			if ( (this.startingY - inEvent.dy) > 110 ) {
				this.rateSong(null, {dispatchTarget:{name:"thumbUp", owner:this}});
			} 
			else if ( (inEvent.dy - this.startingY) > 110 ) {
				this.rateSong(null, {dispatchTarget:{name:"thumbDown", owner:this}});
			}
		}
		if ( this.startingX != null) {
		
			if ( (this.startingX - inEvent.dx) > 110 ) {
				this.skipTrack();
			} 
			else if ( (inEvent.dx - this.startingX) > 110 ) {
				//Go to history
				this.toggleHistoryGrid();
			}
		}
	},
	
	startDragGrid: function(inSender, inEvent) {
		if (Math.abs(inEvent.dy) > Math.abs(inEvent.dx*2)) {
			this.startingYGrid = inEvent.dy;
		}
		else {
			this.startingYGrid = null;
		}
	},

	finishDragGrid: function(inSender, inEvent) {
		if ( this.startingYGrid != null ) {
			if ( (this.startingYGrid - inEvent.dy) > 120 ) {
				this.fadeBack();
			} 
		}
	},
	
	setupMarqueeTiles: function(inSender, inIndex) {
		if ( AppGlobals.station == null ) {
			return false;
		}
		
		var history = AppGlobals.history.get( AppGlobals.station.stationToken );
		inIndex++;
		if ( history && inIndex < AppGlobals.MAX_STATION_HISTORY_LENGTH ) {
			var rand = Math.floor((Math.random()*history.length));
			var historyTrack = history[rand];
			var i = inIndex - 1;
			var url = historyTrack.albumArtUrl || AppConstants.defaultAlbumArt;
			var pixel = Math.floor((Math.random()*200)+100);
			return { kind: "Image", src: url, width:"80px", height:"80px", style:"padding-top:"+pixel+"px; opacity:0.8;", name: inSender.name+"_image_"+i };
		}
	},
	
	fadeBack: function(inSender) {
		this.$.backScreen.applyStyle("z-index", "3");
		this.$.mainScreen.applyStyle("z-index", "5");
		this.$.historyGrid.setCollapsed(true);
		enyo.job( "hideGrid", enyo.bind( this.$.historyGrid, "hide"), 350 );
		this.snapArt();
	},
	
	scrimContent: function( scrimState ) {
	
		AppGlobals.controlsDisabled = scrimState;
		
		if ( scrimState == true && !this.$.contentScrim.showing ) {
			this.toggleContentsDisplay( false );
			this.$.contentScrim.show();
			this.$.contentSpinner.hide();
		}
		else if ( scrimState == false ){
			this.$.contentScrim.hide();
			this.toggleContentsDisplay( true );
		}
	},

	toggleContentsDisplay: function( boolShow ) {
		if ( boolShow && !this.contentShowing ) {

			// Left box with image and current track info
			this.$.currentAlbumArtContainer.show();
			this.$.likeDislikebox.show();
			this.$.currTrackName.show();
			this.$.currTrackAlbumBox.show();
			this.$.currTrackArtistBox.show();
			this.$.progressBar.show();
		}
		else if ( !boolShow && this.contentShowing ) {
			
			// Left box with image and current track info
			this.$.currentAlbumArtContainer.hide();
			this.$.likeDislikebox.hide();
			this.$.currTrackName.hide();
			this.$.currTrackAlbumBox.hide();
			this.$.currTrackArtistBox.hide();
			this.$.progressBar.hide();
		}
		
		this.contentShowing = boolShow;
	},
	
	setSpinnerState: function( spinnerState ) {

		if ( spinnerState == true ) {
			if ( !AppGlobals.station || !AppGlobals.station.started ) {
				this.toggleContentsDisplay( false );
			}
			this.$.contentScrim.show();
			this.$.contentSpinner.show();
		}
		else {
			if ( !AppGlobals.station || !AppGlobals.station.started ) {
				this.toggleContentsDisplay( false );
			}
			this.$.contentSpinner.hide();
		}
	},
	
	moveProgress: function( timeObj ) {
		if ( !this.progressDurationUpdated ) {
			this.$.progressBar.setMaximum(timeObj.elapsedSeconds + timeObj.remainingSeconds);
			this.progressDurationUpdated = true;
		}
		this.$.elapsed.setContent( Util.secondsToTimeString(timeObj.elapsedSeconds) );
		this.$.remaining.setContent( "-" + Util.secondsToTimeString(timeObj.remainingSeconds) );
		this.$.progressBar.setPosition( timeObj.elapsedSeconds );
	},
	
	skipTrack: function(inSender) {
		this.isTap = true;
		AppGlobals.station.skip();
		//enyo.job("snap", enyo.bind( this.$.snapScroller, "snapTo", 1 ), 5000);
		if ( !this.$.contentScrim.showing ) {
			this.snapArt();
		}
	},

	formatTrackData: function(trackData) {
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
    },
	
	getArtUrlFromTrack: function(trackData) {
		var url = AppConstants.defaultAlbumArt;
		if ( trackData.songName != null && trackData.albumArtUrl != null && trackData.albumArtUrl != undefined && trackData.albumArtUrl.length > 0 ) {
			url = trackData.albumArtUrl;
		}
		else if ( trackData.imageUrl != null && trackData.imageUrl != undefined && trackData.imageUrl.length > 0 ) {
			url = trackData.imageUrl;
		}

		return url; 
	},
	
	preloadAlbumArt: function(trackData) {
		this.log();
		this.$.nextAlbumArt.setSrc( Track.getArtUrlFromTrack(trackData) );
    },
	
	historyClick: function( inSender, inEvent ) {
		this.log(inSender.name);
		inSender.toggleInfo();
	},
	
	addHistoryTile: function( c ) {
		this.historyTiles.push(this.$.historyGrid.createComponent( c, {owner: this} ));
	},

	fillMarquees: function() {
		for ( var i = 0; i < this.marqueeCount; i++ ) {
			this.$["marquee_"+i].render();
		}
	},

	stopMarquees: function() {
		if (!this.hasNode()) {
			return;
		}
		var arr = this.hasNode().select("marquee");
		for ( var i = 0; i < arr.length; i++ ) {
			arr[i].stop();
		}
	},

	startMarquees: function() {
		if (!this.hasNode()) {
			return;
		}
		var arr = this.hasNode().select("marquee");
		for ( var i = 0; i < arr.length; i++ ) {
			arr[i].start();
		}
	},

	deactivate: function() {
		this.stopMarquees();
		this.unsubscribe();
	},

	reactivate: function() {
		if ( AppGlobals.musicPlaying ) {
			this.startMarquees();
		}
		this.subscribe();
		if ( !AppGlobals.station ) {
			return;
		}
		this.togglePlayPauseDisplay( !AppGlobals.musicPlaying );
		if ( AppGlobals.station.nowplayingActiveTrackData && this.trackData != AppGlobals.station.nowplayingActiveTrackData ) {
			this.error("Refreshing manually");
			this.onTrackChange( AppGlobals.station.nowplayingActiveTrackData );
			return;
		}
		this.snapArt();
	},
	
	onTrackChange: function (trackData) {
	//	enyo.job.stop("snap");
		this.fillHistoryGrid( false );
		this.fillMarquees();
        this.trackData = trackData;
		
		this.progressDurationUpdated = false;

		this.updateThumbControls(this.trackData.songRating);

        // this.setUpNowplayingAd(trackData);
		
		/** Current track info **/


		this.songInfo = Track.formatTrackData( trackData );
		this.$.currTrackName.setContent( Util.truncateText(this.songInfo.song, 60) );
		this.$.currTrackArtist.setContent( Util.truncateText(this.songInfo.artist, 65) );
		this.$.currTrackAlbum.setContent( Util.truncateText(this.songInfo.album, 60) );
		
		/** Current album art **/
		this.$.currentAlbumArtContainer.applyStyle("background-image", "url('"+this.songInfo.artUrl+"');");
	
		this.scrimContent( false );

		this.snapArt();	
    },
    
  	rateSong: function( inSender, inEvent ) {
		var eventSource = inEvent.dispatchTarget;
		var owner = eventSource.owner;
		var ratingHistory = (inSender && inSender.name.split("_")[0] == "historyTile");
		
		var name = (ratingHistory ? owner.name : eventSource.name);
		
		if ( ratingHistory ) {
			owner = inSender;
		}
		
		if ( name == "thumbUp" && owner.trackData.songRating != 1 ) {
			if (!owner.trackData.allowFeedback) {
				Util.showMessage(AppConstants.MSG_FEEDBACK_ERROR_TITLE, AppConstants.MSG_SHARED_STATION_THUMB_UP_ERROR, "");
				return;
			}
			owner.trackData.songRating = 1
			Api.addFeedback(owner.trackData.trackToken, true, new AddFeedbackDelegate( true, AppGlobals.station, ratingHistory ));
			AppGlobals.updateHistory(AppGlobals.station.getStationToken(), owner.trackData.trackToken, owner.trackData);
		}
		else if ( name == "thumbDown" && owner.trackData.songRating != -1 ) {
			if (!owner.trackData.allowFeedback) {
				Util.showMessage(AppConstants.MSG_FEEDBACK_ERROR_TITLE, AppConstants.MSG_SHARED_STATION_THUMB_DOWN_ERROR, "");
				return;
			}
			owner.trackData.songRating = -1
			Api.addFeedback(owner.trackData.trackToken, false, new AddFeedbackDelegate( false, AppGlobals.station, ratingHistory ));
			AppGlobals.updateHistory(AppGlobals.station.getStationToken(), owner.trackData.trackToken, owner.trackData);
		}
		
		this.thumbOwner = owner;
		
		// this.updateThumbControls( owner.trackData.songRating, owner );
		
		return true;
	},
	
	updateThumbControls: function(songRating) {
		if ( !this.thumbOwner ) {
			this.thumbOwner = this;
		}
		
		if ( this.thumbOwner.name.split("_")[0] == "historyTile" ) {
			this.thumbOwner.updateThumbControls(songRating);
			this.thumbOwner = undefined;
			return;
		}
		if (songRating == 1) {
			this.thumbOwner.$.thumbUp.setSrc("images/exhlikechecked.png");
			this.thumbOwner.$.thumbDown.setSrc("images/exhdislike.png");
		}
		else if (songRating == -1) {
			this.thumbOwner.$.thumbDown.setSrc("images/exhdislikechecked.png");
			this.thumbOwner.$.thumbUp.setSrc("images/exhlike.png");
		}
		else {
			this.thumbOwner.$.thumbUp.setSrc("images/exhlike.png");
			this.thumbOwner.$.thumbDown.setSrc("images/exhdislike.png");
		}
		
		this.thumbOwner = undefined;
		
	},
	
}
);
