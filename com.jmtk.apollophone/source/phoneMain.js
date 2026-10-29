enyo.kind({
	name:"phoneMain",
	kind:"VFlexBox", 
	style:"background-image:url('themes/1.png'); background-color:#081228; background-size:800px 800px", 
	align:"center",
	pack:"center", 
	flex:1,
	components:[
		{
			kind: "Popup",
			lazy: false,
			scrim: true,
			onClose: "searchPopupClosed",
			name: "searchPopup",
			style:"font-size: 22px;",
			width: "400px",
			layoutKind: "VFlexLayout",
			components: [
				{
					kind:"customSearchInput", name: "stationSearch", oninput: "search", hint:"Find station", autocorrect: false,
					autoCapitalize: "lowercase", spellcheck: false, autoWordComplete: false, onCancel:"hideSearchPopup",
				},
				{
					kind: "BasicScroller", name: "resultScroller",
					components: [
						{
							kind: "VirtualRepeater",
							name: "searchResultsRepeater",
							flex: 1,
							onSetupRow: "displaySearchResults",
							onclick: "searchResultClicked",
							components: [
								{
									kind: enyo.Item, name: "resultRow", style: "font-size: 22px;", layoutKind: enyo.VFlexLayout,
									tapHighlight: true,
									components: [
										{
											kind: "VFlexBox",
											components: [
												{ name: "resultRowTrack", content: "", style: "font-style:italic;" },
												{ name: "resultRowArtist", content: ""}
											]
										}
									]
								}
							]
						}
					]
				},
				{name: "popupNote", style:"font-size:22px;", content: "Enter an artist, song or composer. We'll create a radio station featuring that music and more like it.", showing: false},
				{name: "resultsNote", content: "No results found.", showing: false}
			]
		},
		{name: "launchApplicationService", kind: enyo.PalmService, service: enyo.palmServices.application, method: "open"},
		{ name: "appEvents", kind: "ApplicationEvents", onWindowActivated: "reactivate", onWindowDeactivated: "deactivate"},
		{
			kind: "Scrim", name:"contentScrim", showing: true,
			layoutKind: "VFlexLayout", align: "center", pack: "center", 
			components: [
				{kind: "ListSelector", name:"radioName", hideArrow:false, disabled:false, showing: false,
					 style: "font-size: 20px; margin-top: 0px; margin-right:12px; color:#FFF", value: 0, onSelect: "setStation", popupAlign: "right",
					 items: AppGlobals.stationList
				},
				{name:"welcome", kind:"HtmlContent", width:"98%", srcId:"welcomeinfo", style: "color: white;", showing:false},
				{kind:"Button", className:"enyo-button-blue", content:"Dismiss welcome banner", showing:false, onclick:"dismissWelcomeContent", name:"dismissbutton"},
				{kind:"SpinnerLarge", name:"contentSpinner", showing:false}
			]
		},
		// Background container
		{
			kind:"VFlexBox", name: "backScreen", height: "100%", width: "100%", flex:1, 
			align:"center", pack: "center", 
			style:"font-size:24px; color: white; background-color: rgba(0,0,0,0.3); position: absolute; top: 0px; left: 0px; z-index: 3;",
			
			components: [
			{kind:"Scroller", name: "historyScroller", width:"100%", height:"100%", horizontal:false, autoHorizontal: false, components:[
				{
					kind: "HFlexBox", name: "gridBox", width: "97%", style:"margin-left:5%;", flex:1, align:"start", pack:"center",
					//ondragstart:"startDragGrid", ondragfinish:"finishDragGrid",
					components: [
						{
							kind: "historyGrid", showing:false, cellWidth:185, cellHeight:185, collapsed:true, flex:1,
							components: [
								{kind: "ApplicationEvents", onWindowRotated: "handleResize"},
								{kind:"Image", src:"images/return.png", style:"margin-left:8px; width:174px; height:174px;", onclick:"fadeBack"}
							]
						}
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
				{kind:"VFlexBox", name:"box_0",  flex:1, components:[{kind: "marqueeColumn", name: "marquee_0", layoutKind: "VFlexLayout",
				onSetupRow: "setupMarqueeTiles", flex: 1}]},
				{kind:"VFlexBox", name:"box_1", flex:1, components:[{kind: "marqueeColumn", name: "marquee_1", layoutKind: "VFlexLayout",
				onSetupRow: "setupMarqueeTiles", flex: 1}]},			
				{kind:"VFlexBox",name:"box_2",  flex:1, components:[{kind: "marqueeColumn", name: "marquee_2", layoutKind: "VFlexLayout",
				onSetupRow: "setupMarqueeTiles", flex: 1}]},
				{kind:"VFlexBox",name:"box_3",  flex:1, components:[{kind: "marqueeColumn", name: "marquee_3", layoutKind: "VFlexLayout",
				onSetupRow: "setupMarqueeTiles", flex: 1}]},
				{kind:"VFlexBox",name:"box_4",  flex:1, components:[{kind: "marqueeColumn", name: "marquee_4", layoutKind: "VFlexLayout",
				onSetupRow: "setupMarqueeTiles", flex: 1}]},
				{kind:"VFlexBox",name:"box_5",  flex:1, components:[{kind: "marqueeColumn", name: "marquee_5", layoutKind: "VFlexLayout",
				onSetupRow: "setupMarqueeTiles", flex: 1 }]},
				{kind:"VFlexBox",name:"box_6",  flex:1, components:[{kind: "marqueeColumn", name: "marquee_6", layoutKind: "VFlexLayout",
				onSetupRow: "setupMarqueeTiles", flex: 1}]},
				{kind:"VFlexBox",name:"box_7",  flex:1, components:[{kind: "marqueeColumn", name: "marquee_7", layoutKind: "VFlexLayout",
				onSetupRow: "setupMarqueeTiles", flex: 1}]},
				{kind:"VFlexBox",name:"box_8",  flex:1, components:[{kind: "marqueeColumn", name: "marquee_8", layoutKind: "VFlexLayout",
				onSetupRow: "setupMarqueeTiles", flex: 1}]},
				{kind:"VFlexBox",name:"box_9",  flex:1, components:[{kind: "marqueeColumn", name: "marquee_9", layoutKind: "VFlexLayout",
				onSetupRow: "setupMarqueeTiles", flex: 1}]}
			]
		},
		// Foreground container
		
		{
			kind:"VFlexBox", name: "mainScreen", height: "100%", width: "100%", flex:1, align:"center", pack: "center", style:"font-size:24px; color: white; background-color: rgba(0,0,0,0.45); position: absolute; top: 0px; left: 0px; z-index: 5;",
			components:[
				{kind: "VFlexBox", flex:1, name:"aboutArtist", showing:false, 
					components:[
						{height:"30px"},
						{content:"About artist", name:"aboutArtistName", style:"font-size:25px; font-weight:bold; margin-bottom: -10px;"},
									
						{name: "bioScrollUpIndicator", onclick: "bioScroll", allowHtml: true, content: "&nbsp;", showing:false, style: "text-align:center; font-size:28px; position: top; font-weight:bold; margin-bottom: 2px;"},
						{kind:"Scroller", onScrollStop: "scrollStopped", name: "artistBioScroller", style:"margin-top:10px;", height:"480px", width:"430px", horizontal:false, autoVertical:false,
							components: [ {name: "artistBio",  style:"font-size:22px",  content:""} ]
						},
						{name: "bioScrollDownIndicator", onclick: "bioScroll", allowHtml: true, content: "&nbsp;", showing: false,  style: "text-align:center; font-size:28px; font-weight:bold; margin-top: -5px;"},
					]
				},
				{kind: "VFlexBox", flex:1, name:"whyArtist", showing:false, 
					components:[
						{height:"30px"},
						{content:"Why this track?", name:"trackExplanationHeader", style:"font-size:25px; font-weight:bold; margin-bottom: -20px;"},
								
						{name: "explainScrollUpIndicator", onclick: "explanationScroll", allowHtml: true, content: "&nbsp;", showing: false,  style: "text-align:center; font-size:28px; font-weight:bold; margin-bottom: 2px;"},
						{
							kind:"Scroller", onScrollStop: "scrollStopped", name: "trackExplanationScroller", style:"margin-top:10px;", horizontal:false, autoVertical:false,
							height:"480px", width:"430px", components:[ {name: "trackExplanation", style:"font-size:22px", content:""} ]
						},
						{name: "explainScrollDownIndicator", onclick: "explanationScroll", allowHtml: true, content: "&nbsp;", showing: false,  style: "text-align:center; font-size:28px; font-weight:bold; margin-top: -5px;"},
					]
				},
				{
					kind:"VFlexBox", align:"center", pack: "center", style:"padding-bottom: 5px;",
					name:"songInfo",
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
				{kind:"SnapScroller", name: "snapScroller", index: 1, onSnap: "handleSnap",
				 width:"340px", layoutKind: "HFlexLayout", vertical: false, horizontal: true, dragSnapWidth:200,
				 components:[
					{kind: "HFlexBox", components: [ {kind:"Image", style:"width:300px; height:300px;", src:"images/transparentimage.png"} ]},
					{kind:"HFlexBox", ondragstart:"startDrag", ondragfinish:"finishDrag",
						components:[
							{
									kind:"VFlexBox", onmousehold: "showSongOptions", name: "currentAlbumArtContainer", style:"width:300px; height:300px; margin-bottom: 6px; background-repeat: no-repeat; background-size: 100% 100%;", showing: false,
								onclick:"playPause",
								components:[
									{
										kind: "VFlexBox", name: "albumArtInner", flex: 1,
										components: [
											{kind:"Image", name:"pauseOverlay", style:"width:300px; height:300px;", src: "images/pauseexh.png", showing: false}
										]
									}
								]
							},
							{kind:"VFlexBox", style:"margin-left:5px", height:"300px", name:"likeDislikebox", showing:false, components:[
								{kind:"Image", style:"opacity:0.79; width:35px; height:140px;", name:"thumbUp", onclick:"rateSong", src:"images/exhlike.png"},
								{height:"13px"},
								{kind:"Image", style:"opacity:0.79; width:35px; height:140px;", name:"thumbDown", onclick:"rateSong", src:"images/exhdislike.png"}
								]
							},
						]
					},
					{kind: "HFlexBox", components: [ {kind:"Image", style:"width:300px; height:300px;", src:"images/transparentimage.png"} ]},
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
				{
					kind: enyo.PopupSelect, name:"songOptions", onSelect:"songOptionSelect",
					items: [
						"Bookmark this song",
						"Bookmark this artist",
						"[Amazon] Buy MP3 Album",
						"[Amazon] Buy MP3 Song",
						"Don't play song for one month",
						"Create station from song",
						"Create station from artist"
					]
				},
				{ kind: "Image", width: "100px", name: "nextAlbumArt", showing: false, style: "" }
			]
		},
		{kind: "ApplicationEvents", onWindowRotated: "handleResize"}
	],
	
	ready: function() {
		if ( !AppGlobals.username ) {
			this.stopMarquees();
			this.$.marqueeScreen.hide();
			this.toggleContentsDisplay(false);
			return;
		}
		this.artistInfo = new ArtistInfo();
		this.songInfo = new SongInfo();
		this.contentShowing = false;
		this.firstAdjustmentMade = false;
		this.progressDurationUpdated = false;
		this.needsFocus = false;
		this.isTap = true;
		this.searching = false;
		this.tileCount = 0;
		this.historyTiles = [];
		this.resultList = [];
		this.marqueeCount = 10;

		this.handleResize();
		if (AppGlobals.isFirstLoginWithNewDeviceId || !AppGlobals.startupAutoPlay) {
			this.setRadioList();
			this.setRadioName();
		}
		this.subscribe();
		this.applyStyle('background-image', "url('"+AppGlobals.backgroundUrl+"')");
        if ( AppGlobals.station && AppGlobals.station.nowplayingActiveTrackData ) {
        	this.onTrackChange( AppGlobals.station.nowplayingActiveTrackData );
        	this.scrimContent(false);
        }
        else if (AppGlobals.station && !AppGlobals.station.started) {
        	//AppGlobals.station.start();
        }
        else if (AppGlobals.station && AppGlobals.station.started) {
			this.fillHistoryGrid(false);
        }
		if ( AppGlobals.station ) {
			this.togglePlayPauseDisplay( !AppGlobals.musicPlaying );
		}
		enyo.job("firstSnap", enyo.bind(this, "snapArt"), 1000);
	},
	
	searchResultClicked: function( inSender, inEvent ) {
		Api.createStation(this.resultList[inEvent.rowIndex].musicToken, new CreateStationDelegate());
		enyo.job("hideSearch", enyo.bind( this, "hideSearchPopup" ), 700);
	},

	renderResults: function() {
		this.$.searchResultsRepeater.render();
	},

	displaySearchResults: function(inSender, inIndex) {
		var max = 8;
		if ( inIndex < max && inIndex < this.resultList.length ) {
			if ( this.$.popupNote.showing ) {
				// // this.log("hiding note");
				this.$.popupNote.hide();
			}
			// if ( inIndex == 0 ) {
				// this.$.resultRowDivider.setCaption("Top Hit");
				// this.$.resultRowDivider.show();
			// }
			var artist = this.resultList[inIndex].artist;
			var song = this.resultList[inIndex].song;
			if ( song != null ) {
				this.$.resultRowTrack.setContent( song );
				this.$.resultRowArtist.setContent( "by "+artist );
			}
			else {
				this.$.resultRowArtist.setContent( artist );
			}

			if ( inIndex == 0 ) {
				this.$.resultRow.domStyles["border-top"] = "none";
			}
			else if ( inIndex == (max-1) || inIndex == (this.resultList.length-1) ) {
				this.$.resultRow.domStyles["border-bottom"] = "none";
			}

			return true;
		}
	},
	
	hideSearchPopup: function(inSender, inEvent) {
		this.$.stationSearch.setValue("");
		this.$.searchPopup.hide();
	},
	
	showSearchPopup: function( inSender, inEvent ) {
		if ( !this.$.popupNote.showing && this.resultList.length == 0 ) {
			this.$.popupNote.show();
		}
		
		if ( this.resultList.length == 0 && !this.$.stationSearch.isEmpty() ) {
			this.$.popupNote.hide();
			this.$.resultsNote.show();
		}
		else {
			this.$.resultsNote.hide();
		}

		this.$.searchPopup.openAtCenter();
		this.$.stationSearch.forceFocus();
		// this.$.searchPopup.applyStyle("bottom", "100px");
		// this.$.searchPopup.applyStyle("max-height", (Application.getHeight()-74)+"px");
	},
	
	searchPopupClosed: function( inSender ) {
		if ( this.$.stationSearch.hasFocus() ) {
			this.showSearchPopup(this.$.stationSearch);
		}
		else {
			this.$.stationSearch.setValue("");
			this.searching = false;
		}
	},
	
	delayHideSearchPopup: function( inSender, inEvent ) {
		enyo.nextTick( this.hideSearchPopup.bind(this) );
	},
	
	hideSearchPopup: function(inSender) {
		this.resultList = [];
		this.renderResults();
		this.$.searchPopup.close();
	},
	
	stopSearch: function() {
		this.$.stationSearch.forceBlur();
	},
	
	search: function() {

		if (Util.trim(this.$.stationSearch.getValue()).length == 0) {
			this.updateList([]);
			this.$.stationSearch.toggleSpinner(false);
			this.$.stationSearch.setValue("");
			return;
		}

		var params = new Hash();
		params.set("query", this.$.stationSearch.getValue());
		params.set("authToken", AppGlobals.partnerAuthToken);
		var url = AppGlobals.autoCompleteUrl + "?" + params.toQueryString();

		var request = new Ajax.Request(url, {
			method: 'get',
			onSuccess: this.autocompleteCallback.bind(this)
		});
		this.$.stationSearch.toggleSpinner(true);
	},
	
	autocompleteCallback: function( transport ) {
		var results = [];
		var result = transport.responseText;
		// Util.log("Search results for: " + result);
		if (result != null) {
			var lines = result.split('\n');
			if (lines != null && lines.length > 0) {
				if ( lines[0] != this.$.stationSearch.getValue() ) {
					return;
				}
				for (var i = 0; i < lines.length; ++i) {
					var line = lines[i];
					if (line != null) {
						var parts = line.split('\t');
						if (parts != null && parts.length >= 2) {
							var musicToken = parts[0];
							if (musicToken != null) {
								var firstChar = musicToken.charAt(0);
								var artist = null;
								var song = null;
								if (firstChar == 'R' || firstChar == 'C') {
									artist = parts[1];
								}
								else if (firstChar == 'S') {
									artist = parts[1];
									song = parts[2];
								}

								if (artist != null) {
									var truncatedName = Util.truncateText(name, 32);
									var resultAsJSON = {'artist': artist, 'song': song, 'musicToken': musicToken};
									// enyo.log("THIS IS RESULT AS JSON: "+enyo.json.stringify(resultAsJSON));
									results.push(resultAsJSON);
								}
							}
						}
					}
				}
			}
		}
		
		var resultSort = function( a, b ) {
			var fChar = a.musicToken.charAt(0);
			return ( fChar != 'R' && fChar != 'C' ? 1 : -1 );
		};

		var sortedEnd = results.splice(1, results.length).sort(resultSort);
		results = results.concat(sortedEnd);
		this.$.stationSearch.toggleSpinner(false);
		this.updateList( results );
	},
	
	updateList: function( newList ) {
		if (this.searchText != null && this.searchText.length > 0) {
			results.push({'name':'extended search >', 'musicToken': "extended-search-token"});
		}
		
		this.resultList = newList;
		
		this.renderResults();
		
		this.$.searchPopup.close();
	},
	
	subscribe: function() {
	
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

	populate: function() {
		this.fillHistoryGrid();
		this.fillMarquees();
	},
	
	fillHistoryGrid: function() {
		var history = AppGlobals.history.get( AppGlobals.station.stationToken );
		if ( !history ) {
			return false;
		}
		for ( var i = 0; i < this.historyTiles.length; i++ ) {
			this.historyTiles[i].destroy();
		}
		this.historyTiles = [];
		this.tileCount = 0;
		this.trackData = null;
		this.songInfo = new SongInfo();
		this.artistInfo = new ArtistInfo();
		for ( var i = 1; i < history.length; i++ ) {
			this.addHistoryTile( { kind: "historyTile", onmousehold:"showSongOptionsPopup", onclick: "historyClick", width: "174px", height: "174px", trackData: history[i], name: "historyTile_"+history[i].trackToken, opacity: 1.0, onRateSong: "rateSong" } );
		}
		this.$.historyGrid.render();
	},
	showSongOptionsPopup: function(inSender, inEvent) {
		inSender.songOptionsPopup(inSender, inEvent);
	},
	
	handleSnap: function( inSender ) {
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
		if ( Application.getOrientation() == "vertical" || AppGlobals.orientation) {
			this.$.mainScreen.applyStyle("-webkit-box-pack","center");
			this.$.gridBox.applyStyle("margin-left", "12%");
			this.$.marqueeScreen.applyStyle("margin-left", "1.5%");
			this.$.box_1.hide();
			this.$.box_3.hide();
			this.$.box_5.hide();
			this.$.box_7.hide();
			this.$.box_9.hide();
			this.$.songInfo.applyStyle("font-size", "24px");
			this.$.artistBioScroller.applyStyle("height","480px");
			this.$.artistBioScroller.applyStyle("width","430px");
			this.$.trackExplanationScroller.applyStyle("height","480px");
			this.$.trackExplanationScroller.applyStyle("width","430px");
		}
		else {
				this.$.mainScreen.applyStyle("-webkit-box-pack","start");
				this.$.gridBox.applyStyle("margin-left", "3%");
				this.$.marqueeScreen.applyStyle("margin-left", "0%");
				this.$.box_1.show();
				this.$.box_3.show();
				this.$.box_5.show();
				this.$.box_7.show();
				this.$.box_9.show();
				this.$.songInfo.applyStyle("font-size", "18px");
				this.$.artistBioScroller.applyStyle("width","480px");
				this.$.artistBioScroller.applyStyle("height","250px");
				this.$.trackExplanationScroller.applyStyle("width","480px");
				this.$.trackExplanationScroller.applyStyle("height","250px");
			if ( !AppGlobals.musicPlaying || !Application.isFocused() ) {
				enyo.job("marqueeStop", enyo.bind(this, "stopMarquees"), 500);
			}
		}
		this.$.historyScroller.scrollTo(0,0);
	},
	
	showWelcomeMessage: function() {
		this.$.radioName.hide();
		this.$.dismissbutton.show();
		this.$.welcome.show();
	},
	
	dismissWelcomeContent: function(inSender, inEvent) {
		this.$.radioName.show();
		this.$.dismissbutton.hide();
		this.$.welcome.hide();
	},
	
	setRadioList: function() {
		if ( !AppGlobals.stationList ) {
			return;
		}
		var items = AppGlobals.stationList.slice(0).sort(AppGlobals.sortAlpha);
		
		if ( !items.length && !AppGlobals.isFirstLoginWithNewDevice ) {
			this.showWelcomeMessage();
			this.updateList([]);
			this.showSearchPopup(null, null);
			return;
		}

		if (!AppGlobals.startupAutoPlay) {
			AppGlobals.station = null;
		}
		
		
		for (var i=0; i < items.length; i++) {
			items[i].caption = Util.truncateText(items[i].stationName, 23);
			items[i].value = i;			
		}
		items.unshift({caption:"Please select a radio", value:-1});
		this.$.radioName.setItems( items );
		this.$.radioName.render();
		this.setRadioName();
	},
	
	setRadioName: function() {
		if ( !AppGlobals.station || !AppGlobals.station.started ) {
			if ( !this.$.radioName.showing ) {
				this.$.radioName.show();
			}
		}
		if ( AppGlobals.station && AppGlobals.station.started ) {			
			for ( var i = 0; i < this.$.radioName.items.length; i++ ) {
				if ( this.$.radioName.items[i] && this.$.radioName.items[i].stationToken == AppGlobals.station.stationToken ) {
					this.$.radioName.setValue( i );
				}
			}
		}
		if ( !AppGlobals.station ) {
			this.$.radioName.setValue( -1 );
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
	
	backToMain: function() {
		this.$.whyArtist.hide();
		this.$.aboutArtist.hide();
		this.$.songInfo.show();
		this.$.snapScroller.show();
		this.$.bioScrollUpIndicator.hide();
		this.$.bioScrollDownIndicator.hide();
		this.$.explainScrollUpIndicator.hide();
		this.$.explainScrollDownIndicator.hide();
		if ( !AppGlobals.musicPlaying ) {
			enyo.job("stopMarquees", enyo.bind(this, "stopMarquees"), 200);
		}
		this.snapArt();
	},
	
	showExplanation: function() {
		this.$.songInfo.hide();
		this.$.snapScroller.hide();
		this.$.whyArtist.show();
		this.$.explainScrollUpIndicator.show();
		this.$.explainScrollDownIndicator.show();
		this.$.trackExplanationScroller.scrollIntoView(0,0);
	},
	
	showBio: function() {
		this.$.songInfo.hide();
		this.$.snapScroller.hide();
		this.$.aboutArtist.show();
		this.$.bioScrollUpIndicator.show();
		this.$.bioScrollDownIndicator.show();
		this.$.artistBioScroller.scrollIntoView(0,0);
	},

	snapArt: function() {
		this.$.snapScroller.snapTo(1);
	},
	
	showSongOptions: function(inSender, inEvent) {
		this.$.songOptions.openAtControl(inSender, { top: -30, left: -20 });
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
			this.stopMarquees();
			this.$.pauseOverlay.show();
			this.$.albumArtInner.applyStyle("background-color","rgba(0,0,0,0.75)");
		}
		else {
			this.startMarquees();
			this.$.pauseOverlay.hide();
			this.$.albumArtInner.applyStyle("background-color","");
		}
	},
	
	toggleHistoryGrid: function() {
		this.isTap = true;
		if ( this.togglingHistory == true ) {
			return;
		}
		this.togglingHistory = true;
		this.$.backScreen.applyStyle("z-index", "5");
		this.$.mainScreen.applyStyle("z-index", "3");
		this.$.historyGrid.show();
		enyo.job( "unCollapseGrid", enyo.bind( this.$.historyGrid, "setCollapsed",false), 120 );
		enyo.job( "checkToggling", enyo.bind( this, function() { this.togglingHistory = false; } ), 150 );
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
			if ( (this.startingY - inEvent.dy) > 100 ) {
				this.rateSong(null, {dispatchTarget:{name:"thumbUp", owner:this}});
			} 
			else if ( (inEvent.dy - this.startingY) > 100 ) {
				this.rateSong(null, {dispatchTarget:{name:"thumbDown", owner:this}});
			}
		}
		if ( this.startingX != null) {
		
			if ( (this.startingX - inEvent.dx) > 100 ) {
				this.skipTrack();
			} 
			else if ( (inEvent.dx - this.startingX) > 100 ) {
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
			return { kind: "Image", src: url, width:"70px", height:"70px", style:"padding-top:"+pixel+"px; opacity:0.8;", name: inSender.name+"_image_"+i };
		}
	},
	
	fadeBack: function(inSender) {
		this.$.backScreen.applyStyle("z-index", "3");
		this.$.mainScreen.applyStyle("z-index", "5");
		this.$.historyGrid.setCollapsed(true);
		enyo.job( "hideGrid", enyo.bind( this.$.historyGrid, "hide"), 350 );
		this.snapArt();
	},
	
	scrollStopped: function( inSender ) {
		var prefix = "bio";
		if ( inSender.name == "trackExplanationScroller" ) {
			prefix = "explain";
		}
		var top = inSender.scrollTop;
		var bounds = inSender.getBoundaries();
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
	
	scrimContent: function( scrimState ) {
	
		AppGlobals.controlsDisabled = scrimState;
		
		if ( scrimState && !this.$.contentScrim.showing ) {
			this.toggleContentsDisplay( false );
			this.$.contentScrim.show();
			this.$.contentSpinner.hide();
				if ( !AppGlobals.station || !AppGlobals.station.started ) {
				//this.$.scrimMessage.show();
				this.$.radioName.show();
			}
		}
		else if ( !scrimState ){
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
			if (this.$.songInfo.showing) {
						Application.$.interface.$.whyThisArtistButton.show();
				Application.$.interface.$.aboutArtistButton.show();
			}
		}
		else if ( !boolShow && this.contentShowing ) {
			
			// Left box with image and current track info
			this.$.currentAlbumArtContainer.hide();
			this.$.likeDislikebox.hide();
			this.$.currTrackName.hide();
			this.$.currTrackAlbumBox.hide();
			this.$.currTrackArtistBox.hide();
			this.$.progressBar.hide();
			Application.$.interface.$.whyThisArtistButton.hide();
			Application.$.interface.$.aboutArtistButton.hide();
		}
		
		this.contentShowing = boolShow;
	},
	
	setSpinnerState: function( spinnerState ) {

		if ( spinnerState == true ) {
			if ( !AppGlobals.station || !AppGlobals.station.started ) {
				this.toggleContentsDisplay( false );
			}
			if ( this.$.radioName.showing ) {
				//this.$.scrimMessage.hide();
				this.$.radioName.hide();
			}
			this.$.contentScrim.show();
			this.$.contentSpinner.show();
		}
		else {
			if ( !AppGlobals.station || !AppGlobals.station.started ) {
				this.toggleContentsDisplay( false );
				//this.$.scrimMessage.show();
				this.$.radioName.show();
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
		if ( this.skipping == true ) {
			return;
		}
		this.skipping = true;
		this.isTap = true;
		AppGlobals.station.skip();
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
	
	setStation: function( inSender, inValue ) {
		var item = this.$.radioName.getItems()[inValue];
		var value = item.value;
		if ( value == -1 ) {
			return;
		}
		var stationData = item;
		if ( stationData ) {
			var stationToken = stationData['stationToken'];

			if (AppGlobals.station != null && AppGlobals.station.getStationToken() == stationToken) {
				// same station, don't restart
			}
			else {
				if (AppGlobals.station != null) {
					AppGlobals.station.stop();
				}
				AppGlobals.setStation(stationData);
				AppGlobals.station.start();
			}
		}
	},
	
	getArtUrlFromTrack: function(trackData) {
		var url = AppConstants.defaultAlbumArt;
		if ( trackData.songName != null && trackData.albumArtUrl != null && trackData.albumArtUrl != undefined && trackData.albumArtUrl.length > 0 ) {
			url = trackData.albumArtUr
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
		inSender.toggleInfo();
	},
	
	addHistoryTile: function( c ) {
		this.historyTiles.push(this.$.historyGrid.createComponent( c, {owner: this} ));
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
		if ( AppGlobals.station ) {
			this.togglePlayPauseDisplay( !AppGlobals.musicPlaying );
		}
		if ( this.trackData ) {
			this.$.currentAlbumArtContainer.applyStyle("background-image", "url('"+this.songInfo.artUrl+"');");
		}
		if ( AppGlobals.station && this.trackData != AppGlobals.station.nowplayingActiveTrackData ) {
			this.onTrackChange( AppGlobals.station.nowplayingActiveTrackData );
			return;
		}
		this.snapArt();
	},

	fillMarquees: function() {
		if ( !this.$.marqueeScreen.showing ) {
			this.$.marqueeScreen.show();
		}
		for ( var i = 0; i < this.marqueeCount; i++ ) {
			this.$["marquee_"+i].render();
		}
	},
	
	onTrackChange: function (trackData) {
		this.dismissWelcomeContent(null, null);
		if ( this.$.radioName.showing ) {
			this.$.radioName.hide();
		}
		this.fillHistoryGrid( false );
		this.fillMarquees();
		if ( !Application.isFocused() ) {
			this.stopMarquees();
		}
        this.trackData = trackData;
		
		this.progressDurationUpdated = false;

		this.updateThumbControls(this.trackData.songRating);

        // this.setUpNowplayingAd(trackData);
		
		/** Current track info **/
		 

		this.songInfo = Track.formatTrackData( trackData );
		this.$.currTrackName.setContent( Util.truncateText(this.songInfo.song, 33) );
		this.$.currTrackArtist.setContent( Util.truncateText(this.songInfo.artist, 34) );
		this.$.currTrackAlbum.setContent( Util.truncateText(this.songInfo.album, 33) );
		
		/** Current album art **/
		this.$.currentAlbumArtContainer.applyStyle("background-image", "url('"+this.songInfo.artUrl+"');");
	
		/** Artist Bio **/
		var url = this.trackData.artistExplorerUrl;
		if ( url ) {
			this.$.artistBio.setContent("Loading...");
			url = url.replace(/\/xml\//, "/json/");
			url = url.replace(/beta.savagebeast.com:7001/, AppConstants.PANDORA_URL);
			var request = new Ajax.Request(url, {
				method: AppGlobals.HTTP_GET_METHOD,
				onSuccess: this.onArtistData.bind(this),
				onFailure: this.onArtistData.bind(this)
			});
		}
		else {
			// no explorer URL for this track (audio ad, or API change); don't let
			// a TypeError here abort the rest of the track-change handling
			this.artistInfo.bio = AppConstants.MSG_NO_ARTIST_INFO;
			this.artistInfo.artUrl = AppConstants.defaultAlbumArt;
			this.$.artistBio.setContent(AppConstants.MSG_NO_ARTIST_INFO);
		}
		
		/** Track explanation **/
		this.$.trackExplanation.setContent("Loading...");
		Api.explainTrack(this.trackData.trackToken, new ExplainTrackDelegate(this.updateTrackExplanation.bind(this), this.trackData));
		
	
	
		this.scrimContent( false );

		this.snapArt();
		this.skipping = false;
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
		this.$.aboutArtistName.setContent("About Artist - "+Util.truncateText(this.songInfo.artist, 24));
		this.$.trackExplanationHeader.setContent("Why this track? - "+Util.truncateText(this.songInfo.song, 21));
	//	this.$.artistBioScroller.scrollTo(0,0);
		 
	},
	
	updateTrackExplanation: function(model) {
		this.songInfo.explanation = model.explanation;
		this.$.trackExplanation.setContent(model.explanation);
		
	//	this.$.trackExplanationScroller.scrollTo(0,0);
		 
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
