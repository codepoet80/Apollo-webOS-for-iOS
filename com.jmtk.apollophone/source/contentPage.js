var songOptionsPopup = {
	kind: enyo.PopupSelect, name:"songOptions", onClose:"invertButton", onSelect:"songOptionSelect",
	items: [
		"Bookmark this song",
		"Bookmark this artist",
		"[Amazon] Buy MP3 Album",
		"[Amazon] Buy MP3 Song",
		"Don't play song for one month",
		"Create station from song",
		"Create station from artist"
	]
};


enyo.kind({
	name: "contentPage",
	kind: "SlidingView",
	minHistoryOpacity: 0.3,
	thumbOwner: "",
	components:[
		{name: "launchApplicationService", kind: enyo.PalmService, service: enyo.palmServices.application, method: "open"},
		{
			kind:"VFlexBox", name:"contentFlex", flex:1, pack: "center",
			style:"background-color:#000000; background-repeat:no-repeat; background-position:center; background-image:url('themes/1.png'); background-size: cover;",
			components:[
				{flex:.03},
				{
					kind: "Scrim", name:"contentScrim", showing: true,
					layoutKind: "VFlexLayout", align: "center", pack: "center", 
					components: [
						{name:"welcome", kind:"HtmlContent", width:"87%", srcId:"welcomeinfo", style: "color: white;", showing:false},
						{kind:"Button", className:"enyo-button-blue", content:"Dismiss welcome banner", showing:false, onclick:"dismissWelcomeContent", name:"dismissbutton"},
						{name:"scrimMessage", style:"font-size:23px; color: white; opacity: 1;", content:"Please select a radio"},
						//{kind: "SpinnerLarge", name:"contentSpinner", showing:false}
						//{kind: "Image", src: "images/loading.gif", name:"contentSpinner", showing: false}
						{kind:"Canvas", name:"contentSpinner", showing:false}
					]
				},
				{
					kind: "BasicScroller", name: "historyScroller",
					vertical: false, horizontal: true, showing: false,
					//Repeater for history album art 
					components: [
						{
							kind: "Repeater", layoutKind: "HFlexLayout", name: "historyRepeater",
							height:"200px", shouldDecorateRows: true,
							onSetupRow: "setupHistoryTiles", 
						}
					]
				},
				{flex:0.03},
				// This is the current track information
				{kind:"HFlexBox", name: "currentTrackArea", pack:"center", style:"margin-bottom: 15px; color: white; background-color: rgba(0,0,0,.6);", flex:1.5, showing: false,
					components:[
						{
							kind:"VFlexBox", width: "300px", align:"center", pack: "start", style:"font-size:17px; margin: 15px;",
							components:[
								{kind:"Image", name: "currentAlbumArt", src:"", style:"width:300px; height:300px;", showing:false},
								{
									kind:"VFlexBox", width: "300px", align:"center", pack: "center",
									components: [
										{name: "currTrackName", content:"", style:"font-weight:bold;", showing: false},
										{kind:"HFlexBox", name: "currTrackArtistBox", width: "300px", pack:"center", style: "", showing: false,
											components:[ 
												{name: "byText", content:"by&nbsp;", style: ""},
												{name: "currTrackArtist", content:"", style: ""}
											]
										},
										{kind:"HFlexBox", name: "currTrackAlbumBox", width: "300px", pack:"center", showing: false,
											components:[ 
												{name:"onText", content:"on&nbsp;", style: ""}, 
												{name:"currTrackAlbum", content:"", style: "font-style:italic;"} 
											]
										}
									]
								}
							]
						},
						//This is the About Artist & the Track Explanation
						{
							kind:"VFlexBox", name: "textInfoArea", flex:1, style:"font-size:15.5px; margin-right: 15px;",
							components:[
								{content:"About artist", name:"artistBioHeader", style:"font-size:18px; font-weight:bold; margin-bottom: -20px;", showing:false},
								
								{name: "bioScrollUpIndicator", onclick: "bioScroll", allowHtml: true, content: "&nbsp;", showing: false,  style: "text-align:center; font-size:22px; position: top; font-weight:bold; margin-bottom: 2px;"},
								{kind:"Scroller", onScrollStop: "scrollStopped", name: "artistBioScroller", height:"145px",
									components: [ {name: "artistBio", content:"", showing: false} ]
								},
								{name: "bioScrollDownIndicator", onclick: "bioScroll", allowHtml: true, content: "&nbsp;", showing: false,  style: "text-align:center; font-size:22px; font-weight:bold; margin-top: -10px;"},
								
								{content:"Why this track?", name:"trackExplanationHeader", style:"font-size:18px; font-weight:bold; margin-bottom: -20px;", showing:false},
								
								{name: "explainScrollUpIndicator", onclick: "explanationScroll", allowHtml: true, content: "&nbsp;", showing: false,  style: "text-align:center; font-size:22px; font-weight:bold; margin-bottom: 2px;"},
								{
									kind:"Scroller", onScrollStop: "scrollStopped", name: "trackExplanationScroller",
									height:"100px",components:[ {name: "trackExplanation", content:"", showing: false} ]
								},
								{name: "explainScrollDownIndicator", onclick: "explanationScroll", allowHtml: true, content: "&nbsp;", showing: false,  style: "text-align:center; font-size:22px; font-weight:bold; margin-top: -10px;"},
							]
							
						},
					]
				},
				{flex:0.017},
				{
					kind:"Toolbar",
					name:"toolbar",
					style:"background-color:#061023; ",
					fadeOnKeyboard:false,
					layoutKind: "HFlexLayout",
					components:[
						{kind:"GrabButton", style:"background-image: url('images/grabbutton.png');", align:"left"},
						{width:"65px"},
						
						songOptionsPopup,
						
						{icon:"images/dislike.png", name: "thumbDown", style:"-webkit-transition-duration:2s;", onclick: "rateSong"},
						{icon:"images/select.png", name:"selectPopupIcon", style:"-webkit-transition-duration:1s;", onclick:"songOptionsPopup"},
						{icon:"images/like.png", name: "thumbUp", style:"-webkit-transition: icon 1s ease", onclick: "rateSong"},
						
						{flex:.3},
						
						{kind:"Control", name: "elapsed", content:"0:00", style:"font-size:14px; color: white;"},
						{kind: "ProgressBar", name: "progressBar", flex: 5.5, style: " margin:0.5em;", animatePosition: true, position: 0, minimum: 0, maximum: 10000, snap: 1},
						{kind:"Control", name: "remaining", content:"-0:00", style:"font-size:14px; color: white;"},
						
						{flex:.3},
						
						{icon:"images/play.png", name:"playPauseButton", onclick:"playPause"},
						{icon:"images/skip.png", onclick: "skipTrack"},
						{width:"30px"},
					]
				},
				{ kind: "Image", name: "nextAlbumArt", showing: false }
			]
		},
		{kind: "ApplicationEvents", onWindowActivated: "appRefocused"}
	],
	
	ready: function() {
		// this.log();
		this.artistInfo = new ArtistInfo();
		this.songInfo = new SongInfo();
		this.contentShowing = false;
		this.firstAdjustmentMade = false;
		this.progressDurationUpdated = false;
		this.needsFocus = false;
		
		// enyo.log("Setting background to "+AppGlobals.backgroundUrl);
		this.$.contentFlex.applyStyle('background-image', "url('"+AppGlobals.backgroundUrl+"')");
		this.setTextBacking( AppGlobals.textBacking );
		
		this.subscribe();
		
	},
	
	subscribe: function() {
		this.historyLoadCallbackId = MessageDispatcher.subscribe(AppConstants.EVENT_ON_HISTORY_LOAD, this.$.historyRepeater.render.bind(this.$.historyRepeater));
		this.trackThumbedCallbackId = MessageDispatcher.subscribe(AppConstants.EVENT_ON_TRACK_THUMBED, this.updateThumbControls.bind(this));
        this.trackChangeCallbackId = MessageDispatcher.subscribe( AppConstants.EVENT_ON_TRACK_CHANGE, this.onTrackChange.bind(this) );
		this.stationChangeCallbackId = MessageDispatcher.subscribe( AppConstants.EVENT_ON_STATION_CHANGE, this.onStationChange.bind(this) );
        // this.nowPlayingAdCallbackId = MessageDispatcher.subscribe(AppConstants.EVENT_ON_DISPLAY_NOW_PLAYING_AD, this.displayAdCallback);
        this.toggleSpinnerCallbackId = MessageDispatcher.subscribe( AppConstants.EVENT_ON_TOGGLE_SPINNER, this.setSpinnerState.bind(this) );
		this.disableControlsCallbackId = MessageDispatcher.subscribe( AppConstants.EVENT_ON_DISABLE_CONTROLS, this.scrimContent.bind(this) );
		this.preloadAlbumArtCallbackId = MessageDispatcher.subscribe( AppConstants.EVENT_ON_PRELOAD_ALBUM_ART, this.preloadAlbumArt.bind(this) );
		this.togglePauseCallbackId = MessageDispatcher.subscribe( AppConstants.EVENT_ON_TOGGLE_PAUSE, this.togglePlayPauseDisplay.bind(this) );
        this.progressCallbackId = MessageDispatcher.subscribe(AppConstants.EVENT_ON_PLAY_PROGRESS, this.moveProgress.bind(this));
		this.textBackingCallbackId = MessageDispatcher.subscribe(AppConstants.EVENT_SET_TEXT_BACKING, this.setTextBacking.bind(this));
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
		 MessageDispatcher.unsubscribe(AppConstants.EVENT_SET_TEXT_BACKING, this.textBackingCallbackId);
        // MessageDispatcher.unsubscribe(AppConstants.EVENT_ON_DISPLAY, this.displayCallbackId);
	},

	appRefocused: function() {
		if ( !this.trackData ) {
			return;
		}
		this.thumbOwner = this;
		this.updateThumbControls(this.trackData.songRating);
	},
	
	updateView: function() {
		// this.log();
		if ( !this.getShowing() ) {
			this.show();
		}		
		this.render();
	},
	
	showWelcomeMessage: function() {
		this.$.scrimMessage.hide();
		this.$.dismissbutton.show();
		this.$.welcome.show();
	},
	
	dismissWelcomeContent: function(inSender, inEvent) {
		this.$.scrimMessage.show();
		this.$.dismissbutton.hide();
		this.$.welcome.hide();
	},
	
	toggleContentsDisplay: function( boolShow ) {
		if ( boolShow && !this.contentShowing ) {
			this.$.currentTrackArea.show();
			// Text info on right
			this.$.artistBioHeader.show();
			this.$.bioScrollUpIndicator.show();
			this.$.artistBio.show();
			this.$.bioScrollDownIndicator.show();
			this.$.trackExplanationHeader.show();
			this.$.explainScrollUpIndicator.show();
			this.$.trackExplanation.show();
			this.$.explainScrollDownIndicator.show();
			
			// Left box with image and current track info
			this.$.currentAlbumArt.show();
			this.$.currTrackName.show();
			this.$.currTrackAlbumBox.show();
			this.$.currTrackArtistBox.show();
			
			// Top history scroller
			this.$.historyScroller.show();
		}
		else if ( !boolShow && this.contentShowing ) {
			this.$.currentTrackArea.hide();
			// Text info on right
			this.$.artistBioHeader.hide();
			this.$.bioScrollUpIndicator.hide();
			this.$.artistBio.hide();
			this.$.bioScrollDownIndicator.hide();
			this.$.trackExplanationHeader.hide();
			this.$.explainScrollUpIndicator.hide();
			this.$.trackExplanation.hide();
			this.$.explainScrollDownIndicator.hide();
			
			// Left box with image and current track info
			this.$.currentAlbumArt.hide();
			this.$.currTrackName.hide();
			this.$.currTrackAlbumBox.hide();
			this.$.currTrackArtistBox.hide();
			
			// Top history scroller
			this.$.historyScroller.hide();
		}
		
		this.contentShowing = boolShow;
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
	
	scrimContent: function( scrimState ) {
	
		AppGlobals.controlsDisabled = scrimState;
		if ( scrimState == true && !this.$.contentScrim.showing ) {
			if ( !AppGlobals.station || !AppGlobals.station.started ) {
				if ( !Application.isFocused() ) {
					this.toggleContentsDisplay( false );
				}
				
				this.$.scrimMessage.show();
			}
			this.$.contentScrim.show();
			this.$.contentSpinner.hide();
		}
		else if ( scrimState == false ){
			this.$.contentScrim.hide();
			this.toggleContentsDisplay( true );
		}
	},
	
	setTextBacking: function( value ) {
		if ( value == true ) {
			this.$.currentTrackArea.applyStyle("background-color", "rgba(0,0,0,.6)");
		}
		else {
			this.$.currentTrackArea.applyStyle("background-color", "none");
		}
	},
	
	bioScroll: function( inSender ) {
		if ( inSender.content != "&nbsp;" ) {
			var dist = 85;
			if ( inSender.name == "bioScrollUpIndicator" ) {
				dist = -dist;
			}
			this.$.artistBioScroller.scrollTo( this.$.artistBioScroller.scrollTop + dist, 0 );
		}
	},
	
	explanationScroll: function( inSender ) {
		if ( inSender.content != "&nbsp;" ) {
			var dist = 85;
			if ( inSender.name == "explainScrollUpIndicator" ) {
				dist = -dist;
			}
			this.$.trackExplanationScroller.scrollTo( this.$.trackExplanationScroller.scrollTop + dist, 0 );
		}
	},
	
	scrollStopped: function( inSender ) {
		var prefix = "bio";
		if ( inSender.name == "trackExplanationScroller" ) {
			prefix = "explain";
		}
		var top = inSender.scrollTop;
		var bounds = inSender.getBoundaries();
	//	// this.log("Bounds: "+enyo.json.stringify(bounds));
	//	// this.log("Top: "+top);
	//	// this.log("Type: "+prefix);
		if ( top == 0 ) {
			this.$[prefix+"ScrollUpIndicator"].setContent("&nbsp;");
		}
		else {
			this.$[prefix+"ScrollUpIndicator"].setContent(". . .");
		}
		
		if ( top == bounds.bottom ) {
			this.$[prefix+"ScrollDownIndicator"].setContent("&nbsp;");
		}
		else {
			this.$[prefix+"ScrollDownIndicator"].setContent(". . .");
		}
	},
	
	setSpinnerState: function( spinnerState ) {
		if ( spinnerState == true ) {
			if ( !AppGlobals.station || !AppGlobals.station.started ) {
				this.toggleContentsDisplay( false );
			}
			if ( this.$.scrimMessage.showing ) {
				this.$.scrimMessage.hide();
			}
			this.$.contentScrim.show();
			this.$.contentSpinner.show();
		}
		else {
			if ( !AppGlobals.station || !AppGlobals.station.started ) {
				this.toggleContentsDisplay( false );
				this.$.scrimMessage.show();
			}
			this.$.contentSpinner.hide();
		}
	},
	
	onStationChange: function( stationStarting ) {
		if ( this.$.welcome.showing ) {
			this.dismissWelcomeContent(null);
		}
		
		
		if ( AppGlobals.station != null && AppGlobals.station.playing ) {
			this.needsFocus = true;
			//enyo.job( "contentSelect", enyo.bind( this, "select" ), 400 );
		}
		else {
			enyo.job( "contentSelect", enyo.bind( this, "selectPrevious" ), 500 );
		}
	},
	
	invertButton: function(inSender) {
		this.$.selectPopupIcon.applyStyle("-webkit-transform","rotate(0deg)");
	},
	
	songOptionsPopup: function(inSender, inEvent) {
		this.$.songOptions.openAtControl(inSender, { top: -30, left: -20 });
		this.$.selectPopupIcon.applyStyle("-webkit-transform","rotate(-180deg)");
	},
	
	closePopup: function(inSender) {
		var container = inSender.container;
		
		while(container.kind != "Popup") {
			container = container.container;
		}
		container.close();
		
	},
	
	historyClick: function( inSender ) {
		inSender.toggleInfo();
	},
	
	setupHistoryTiles: function(inSender, inIndex) {
		if ( AppGlobals.station == null ) {
			return false;
		}
		
		var history = AppGlobals.history.get( AppGlobals.station.stationToken );
		
		inIndex++;
		if ( history && inIndex < history.length ) {
			var historyTrack = history[inIndex];
			var i = inIndex - 1;
			var url = historyTrack.albumArtUrl || AppConstants.defaultAlbumArt;
			var opac = Math.max( 1 - i*0.25, this.minHistoryOpacity );
			var marginLeft = "0px";
			var marginRight = "12px";
			if ( i == 0 ) {
				marginLeft = "65px";
			}
			if ( i == (history.length-1) ) {
				marginRight = "65px";
			}
			return { kind: "historyTile", trackData: historyTrack, width:"200px", height:"200px", name: "historyItem_"+i, opacity: opac, leftMargin: marginLeft, rightMargin: marginRight, onclick: "historyClick", onRateSong: "rateSong" };
		}
	},
	
	itemClick: function(inSender, inEvent) {

		inSender.container.selectedRow = inEvent.rowIndex;
		inSender.container.render();
		this.closePopup(inSender);
		
	},
	
	getPlayButtonState: function() {
		if (AppGlobals.station.getCurrentTrack() != null && AppGlobals.station.getCurrentTrack().isPaused()) {
			return AppConstants.IMG_PLAY;
		} else {
			return AppConstants.IMG_PAUSE;
		}
	},
	
	togglePlayPauseDisplay: function( isPaused ) {
		if ( isPaused ) {
			this.$.playPauseButton.setIcon(AppConstants.IMG_PLAY);
		}
		else {
			this.$.playPauseButton.setIcon(AppConstants.IMG_PAUSE);
		}
	},
	
	skipTrack: function(inSender) {
		AppGlobals.station.skip();
	},
	
	playPause: function(inSender) {
		// Toggles play/pause of track
		AppGlobals.station.pause();
	},
	
	adjustForResizing: function() {
		if ( this.$.currentTrackArea.hasNode() && this.$.toolbar.hasNode() ) {
		//	// this.log();
			var areaHeight = this.$.currentTrackArea.node.clientHeight - this.$.toolbar.node.clientHeight;
		//	// this.log("Artist bounds: " + enyo.json.stringify(this.$.artistBioScroller.getBoundaries()));
		//	// this.log("Explain bounds: " + enyo.json.stringify(this.$.trackExplanationScroller.getBoundaries()));
			// // this.log("Area height: "+areaHeight);
			var noArtistInfo = this.artistInfo && this.artistInfo.bio == AppConstants.MSG_NO_ARTIST_INFO;
			var noExplanation = this.songInfo && this.songInfo.noQualities;
			var noBioHeight = 40;
			var noExplainHeight = 50;
			
			var bioRatio = .53;
			var explainRatio = .35;
			var bioHeight = areaHeight*bioRatio;
			var explainHeight = areaHeight*explainRatio;
			
			if ( noArtistInfo ) {
				explainHeight += ( bioHeight - noBioHeight );
				bioHeight = noBioHeight;
			}
			if ( noExplanation ) {
				bioHeight = ( explainHeight - noExplainHeight );
				explainHeight = noExplainHeight;
			}
			this.$.artistBioScroller.applyStyle("height", bioHeight + "px");
			this.$.trackExplanationScroller.applyStyle("height", explainHeight + "px");
		}
		var f = function() {
			this.scrollStopped( this.$.artistBioScroller );
			this.scrollStopped( this.$.trackExplanationScroller );
		};
		setTimeout( f.bind(this), 10 );
			
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

		return url; },
	
	preloadAlbumArt: function(trackData) {
		this.$.nextAlbumArt.setSrc( Track.getArtUrlFromTrack(trackData) );
    },
	
	onTrackChange: function (trackData) {
		
		// this.log();

        this.trackData = trackData;
		AppGlobals.station.nowplayingActiveTrackData = trackData;
		
		this.progressDurationUpdated = false;

		this.thumbOwner = this;
		this.updateThumbControls(this.trackData.songRating);

        // this.setUpNowplayingAd(trackData);
		
		/** Current track info **/
		this.songInfo = Track.formatTrackData( trackData );
		
		this.$.currTrackName.setContent( Util.truncateText(this.songInfo.song, 35) );
		this.$.currTrackArtist.setContent( Util.truncateText(this.songInfo.artist, 45) );
		this.$.currTrackAlbum.setContent( Util.truncateText(this.songInfo.album, 35) );
		
		/** Current album art **/
		this.$.currentAlbumArt.setSrc( this.songInfo.artUrl );
		
		/** Artist Bio **/
		this.$.artistBioScroller.scrollIntoView(0,0);
		this.$.artistBio.setContent("Loading...");
		var url = this.trackData.artistExplorerUrl;
			url = url.replace(/\/xml\//, "/json/");
			url = url.replace(/beta.savagebeast.com:7001/, AppConstants.PANDORA_URL);
			var request = new Ajax.Request(url, {
				method: AppGlobals.HTTP_GET_METHOD,
				onSuccess: this.onArtistData.bind(this)
			});
		
		/** Track explanation **/
		this.$.trackExplanationScroller.scrollIntoView(0,0);
		this.$.trackExplanation.setContent("Loading...");
		Api.explainTrack(this.trackData.trackToken, new ExplainTrackDelegate(this.updateTrackExplanation.bind(this), this.trackData));
		
		//// this.log("Unscrimming content");
		this.scrimContent( false );

		this.$.historyRepeater.render();

		this.adjustForResizing();
		
		// If the station has just been selected, slide the contentPage over radioList when the music starts playing
		if ( this.needsFocus ) {
			this.needsFocus = false;
			var f = function() {
				this.select();
				this.$.historyScroller.scrollIntoView( 0, 1200 );
				this.$.historyScroller.scrollTo(0,-500);
			}
			
			enyo.job( "contentSelect", enyo.bind( this, f ), 400 );
		}
		else {
			if ( Application.isFocused() ) {
				this.$.historyScroller.scrollIntoView( 0, 1200 );
				this.$.historyScroller.scrollTo(0,-500);
			}
		}
    },
	
	onArtistData: function(result) {
		this.artistJSON = result.responseJSON;

		if (this.artistJSON != null) {
			if (this.artistJSON.artistExplorer != null) {
				this.artistInfo.bio = this.artistJSON.artistExplorer.bio;
				this.artistInfo.artUrl = this.artistJSON.artistExplorer[AppConstants.ART_URL];
			}
			else if (this.artistJSON.composerExplorer != null) {
				this.artistInfo.bio = this.artistJSON.composerExplorer.bio;
				this.artistInfo.artUrl = this.artistJSON.composerExplorer[AppConstants.ART_URL];
			}
		}

		if (this.artistInfo.artUrl == null) {
			this.artistInfo.artUrl = AppConstants.defaultAlbumArt;
		}

		if (this.artistInfo.bio == null) {
			this.artistInfo.bio = AppConstants.MSG_NO_ARTIST_INFO;
		}

		this.artistInfo.name = this.trackData.artistName
		this.artistInfo.trackToken = this.trackData.trackToken;
		
		/** Set information in contentPage here **/
		this.$.artistBio.setContent(this.artistInfo.bio);
		
	//	this.$.artistBioScroller.scrollTo(0,0);
		this.adjustForResizing();
	},
	
	updateTrackExplanation: function(model) {
		this.songInfo.explanation = model.explanation;
		this.$.trackExplanation.setContent(model.explanation);
		
	//	this.$.trackExplanationScroller.scrollTo(0,0);
		this.adjustForResizing();
	},
	
	rateSong: function( inSender, inEvent ) {
		var eventSource = inEvent.dispatchTarget.container;
		var owner = eventSource.owner;
		var ratingHistory = this != owner;
		
		if ( eventSource.name == "thumbUp" && owner.trackData.songRating != 1 ) {
			if (!owner.trackData.allowFeedback) {
				Util.showMessage(AppConstants.MSG_FEEDBACK_ERROR_TITLE, AppConstants.MSG_SHARED_STATION_THUMB_UP_ERROR, "");
				return;
			}
			owner.trackData.songRating = 1
			Api.addFeedback(owner.trackData.trackToken, true, new AddFeedbackDelegate( true, AppGlobals.station, ratingHistory ));
			AppGlobals.updateHistory(AppGlobals.station.getStationToken(), owner.trackData.trackToken, owner.trackData);
		}
		else if ( eventSource.name == "thumbDown" && owner.trackData.songRating != -1 ) {
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
			return;
		}
		
		if (songRating == 1) {
		//	this.thumbOwner.$.thumbUp.applyStyle("background", "rgba(100, 125, 175, 1)");
			this.thumbOwner.$.thumbUp.setIcon("images/likechecked.png");
			this.thumbOwner.$.thumbDown.setIcon("images/dislike.png");
		}
		else if (songRating == -1) {
			this.thumbOwner.$.thumbDown.setIcon("images/dislikechecked.png");
			this.thumbOwner.$.thumbUp.setIcon("images/like.png");
		}
		else {
			this.thumbOwner.$.thumbUp.setIcon("images/like.png");
			this.thumbOwner.$.thumbDown.setIcon("images/dislike.png");
		}
		
		this.thumbOwner = undefined;
	},
	
	songOptionSelect: function(inSender, inSelected) {
		var value = inSelected.getValue();
		
		if ( value == "Bookmark this song" ) {
			if ( this.trackData && this.trackData.trackToken ) {
				Api.addSongBookmark(this.trackData.trackToken, new AddBookmarkDelegate());
			}
		}
		else if ( value == "Bookmark this artist" ) {
			if ( this.trackData && this.trackData.trackToken ) {
				Api.addArtistBookmark(this.trackData.trackToken, new AddBookmarkDelegate());
			}
		}
		else if ( value == "[Amazon] Buy MP3 Album" ) {
				if ( !this.trackData.amazonAlbumDigitalAsin ) {
					Util.showMessage("Amazon", "Album is not available for download.");
					return;
				}
			this.buyDigital("http://www.amazon.com/dp/"+this.trackData.amazonAlbumDigitalAsin);
		}
		else if ( value == "[Amazon] Buy MP3 Song" ) {
			if ( !this.trackData.amazonSongDigitalAsin ) {
				Util.showMessage("Amazon", "Song is not available for download.");
				return;
			}
			this.buyDigital("http://www.amazon.com/dp/"+this.trackData.amazonSongDigitalAsin);
		}
		else if ( value == "Don't play song for one month" ) {
			if ( this.trackData && this.trackData.trackToken && this.trackData.songName ) {
				Api.sleepSong(this.trackData.trackToken, new SleepSongDelegate(this.trackData.songName));
			}
		}
		else if ( value == "Create station from song") {
			Api.musicSearch(this.trackData.songName, new MusicSearchDelegate());
		}
		else if ( value == "Create station from artist") {
			Api.musicSearch(this.trackData.artistName, new MusicSearchDelegate());
		}
	},
	
	buyDigital: function(url) {
		this.$.launchApplicationService.call({id: "com.palm.app.browser", params: {target:url}});
	}
	
});
