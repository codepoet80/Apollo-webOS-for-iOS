enyo.kind({
	name: "radioList",
	kind: "SlidingView",
	layoutKind: "VFlexLayout",
	stationLetter:"",
	components:[
		{
			kind: "Popup",
			lazy: false,
			onClose: "searchPopupClosed",
			name: "searchPopup",
			style:"font-size: 12px; bottom: 44px; min-width: 280px;",
			width: "280px",
			layoutKind: "VFlexLayout",
			components: [
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
									kind: enyo.Item, name: "resultRow", style: "font-size: 13px;", layoutKind: enyo.VFlexLayout,
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
				{name: "popupNote", style:"font-size:13px;", content: "Enter an artist, song or composer. We'll create a radio station featuring that music and more like it.", showing: false},
				{name: "resultsNote", content: "No results found.", showing: false}
			]
		},
		{
			kind: "FadeScroller",
			name: "stationListScroller",
			horizontal: false,
			flex: 1, 
			style: "background-color:#8d8d8d; background-image:url('images/radiobg.png'); background-repeat:no-repeat; background-position:center top;",
			components: [
				{	
					kind: "VirtualRepeater", name: "stationList", onSetupRow: "populateStations", layoutKind:"VFlexLayout", pack:"center",
					components: [
						{kind:"EnyoPandoraAlphaDiv", name:"alphaDiv", showing:false},
						{
							kind: "SwipeableItem", onConfirm: "deleteStation", name:"radioItem", align:"center", onclick: "stationSelect",
							style:"color:#061023; font-size:13px;", layoutKind: enyo.HFlexLayout,
							components: [
								{ name: "radioName", flex:1, content: "", style: "padding-right: 5px" },
								{ kind: "Image", name: "speakerIcon", style:"padding-right:6px;", src: "images/nowplayingspeaker.png", showing: false },
//								{ kind:"GrabButton", name: "radioGrab",  style:"margin-top:-14px", showing:false}
							]
						}
					]
				}
			]
		},
		{kind:"VFlexBox", style:"background-color:#8d8d8d;",
			components:[
				{
				kind:"RadioGroup", 
				name:"sortButton",
				style: "margin-left:auto; margin-right:auto;",
				width:"80%", components:[{caption:"Date"}, {caption:"Alpha"}], 
				onChange:"sortStations"
				}
			]
		},
		{
			kind:"Toolbar",
			fadeOnKeyboard: false,
			
			style:"background-color:#061023;",
			components:[
				{
					kind:"customSearchInput", name: "stationSearch", flex:1, hint:"Find station", autocorrect: false, autoCapitalize: "lowercase", spellcheck: false, autoWordComplete: false,
					oninput: "search", onfocus: "showSearchPopup", onblur: "delayHideSearchPopup", onCancel:"hideSearchPopup"
				}
			]
		}
	],
	
	ready: function() {
		this.pendingSimpleExhibition = false;
		var params = enyo.windowParams;
		if ( params.windowType == "dockModeWindow" && params.dockMode && AppGlobals.simpleExhibition && AppGlobals.stationList.length == 0 ) {
			this.pendingSimpleExhibition = true;
		}
		
		this.stationChangeCallbackId 	 = MessageDispatcher.subscribe( AppConstants.EVENT_ON_STATION_CHANGE, this.onStationChange.bind(this) );					// Made
		this.stationListChangeCallbackId = MessageDispatcher.subscribe( AppConstants.EVENT_ON_STATION_LIST_CHANGE, this.onStationChange.bind(this) );				// Made
		
	},
	
	resizeHandler: function() {
		if ( this.$.searchPopup.showing ) {
			this.$.searchPopup.applyStyle("bottom","44px");
			this.$.searchPopup.applyStyle("max-height", (Application.getHeight()-74)+"px");
		}
	},
	
	updateView: function() {
		// this.log();
		this.resultList = [];
		this.renderStations();
		if ( !this.showing ) {
			this.show();
		}
		var value = 0;
		if (AppGlobals.stationListSort == AppGlobals.STATION_SORT_ALPHA) {
			value = 1;
		}
		this.$.sortButton.setValue(value);
	},
	
	onStationChange: function( station ) {
		if ( this.pendingSimpleExhibition == true ) {
			this.pendingSimpleExhibition = false;
			Application.getView("interface").updateView();
		}
		this.renderStations();
	},
	
	stationSelect: function(inSender, inEvent) {
		if ( inSender.name != "radioItem" ) {
			return;
		}

		var stationData = AppGlobals.stationList[inEvent.rowIndex];
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
	
	renderStations: function() {
		this.$.stationList.render();
	},

	populateStations: function(inSender, inIndex) {
		var stations = AppGlobals.stationList;
		if ( stations == null ) {
			return false;
		}

		var noTop = false;
		var noBottom = false;

		if ( AppGlobals.stationList && inIndex < AppGlobals.stationList.length ) {
			if ( inIndex == 0 ) {
				this.stationLetter = "";
			}
			this.$.radioName.setContent(AppGlobals.stationList[inIndex].stationName);
			var rowStation = stations[inIndex];
			var playingStation = AppGlobals.station;
			var thisLetter = rowStation.stationName.toLowerCase().charAt(0);
			if ( !isNaN(thisLetter) ) {
				thisLetter = '#';
			}
			if ( thisLetter != this.stationLetter && AppGlobals.STATION_SORT_ALPHA == AppGlobals.stationListSort && !rowStation.isQuickMix) {
				this.$.alphaDiv.show();
				this.$.alphaDiv.setCaption(thisLetter.toUpperCase());
				this.stationLetter = thisLetter;
			}
			else {
				this.$.alphaDiv.hide();
			}
			// Highlight item if it represents currently playing station
			if ( stations != null && rowStation != null && playingStation != null && rowStation.stationToken == playingStation.getStationToken() && playingStation.started ) {
//				this.$.radioGrab.hide();
				this.$.speakerIcon.show();
				this.$.radioItem.applyStyle("background-color", "#083c6e");
				this.$.radioItem.applyStyle("color", "#dddddd");
				this.$.radioItem.applyStyle("font-weight", "800");
			}
			else {
				this.$.radioItem.applyStyle("background-color", null);
				this.$.radioItem.applyStyle("color", "#060123");
			}

			if ( inIndex == 0 ) {
				noTop = true;
			}
			if ( this.$.alphaDiv.showing ) {
				noTop = true;
			}
			if ( inIndex == (stations.length-1) ) {
				noBottom = true;
			}
			else if ( stations[inIndex+1] ) {
				var nextLetter = stations[inIndex+1].stationName.charAt(0);
				if ( thisLetter != nextLetter ) {
					noBottom = true;
				}
			}
			
			if ( noTop ) {
				this.$.radioItem.domStyles["border-top"] = "none";
			}
			if ( noBottom ) {
				this.$.radioItem.domStyles["border-bottom"] = "none";
			}

			return true;
		}		
	},
	
	deleteStation: function(inSender, inEvent) {
		var stationToken = AppGlobals.stationList[inEvent].stationToken;
		Api.deleteStation(stationToken, new DeleteStationDelegate(stationToken, this));
	},
	
	searchResultClicked: function( inSender, inEvent ) {
		Api.createStation(this.resultList[inEvent.rowIndex].musicToken, new CreateStationDelegate());
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
	
	sortStations: function( inSender ) {
//		// enyo.log(inSender.getValue());
		var type=AppGlobals.STATION_SORT_DATE;
		if (inSender.getValue() == 1) {
			type=AppGlobals.STATION_SORT_ALPHA;
		}
		
		AppGlobals.setStationListSort( type );
		this.renderStations();
		this.$.stationListScroller.scrollTo(0,0);
	},
	
	showSearchPopup: function( inSender, inEvent ) {

		// if ( inEvent != undefined && AppGlobals.platform == "device" ) {
			// setTimeout( this.showSearchPopup.bind(this, inSender), 200 );
			// return;
		// }
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

		this.$.searchPopup.openAt( {left: 0, bottom: 0} );
		this.$.searchPopup.applyStyle("bottom", "44px");
		this.$.searchPopup.applyStyle("max-height", (Application.getHeight()-74)+"px");
	},
	
	searchPopupClosed: function( inSender ) {
		if ( this.$.stationSearch.hasFocus() ) {
			this.showSearchPopup(this.$.stationSearch);
		}
	},
	
	delayHideSearchPopup: function( inSender, inEvent ) {
		enyo.nextTick( this.hideSearchPopup.bind(this) );
		// setTimeout( this.hideSearchPopup.bind(this), 110 );
	},
	
	hideSearchPopup: function(inSender) {
		this.resultList = [];
		this.renderResults();
		this.$.stationSearch.setValue("");
		this.$.searchPopup.close();
	},
	
	stopSearch: function() {
		this.$.stationSearch.forceBlur();
	},
	
	search: function() {

		if (Util.trim(this.$.stationSearch.getValue()).length == 0) {
			this.updateList([]);
			this.$.stationSearch.toggleSpinner(false);
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
		this.resultList = newList;
		
		this.renderResults();
		
		this.$.searchPopup.close();
	}
});
