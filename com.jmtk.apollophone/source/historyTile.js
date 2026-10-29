var historySongOptionsPopup = {
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

var toolbar = {
	kind:"Toolbar",
	name:"historyToolbar",
	style:"",
	fadeOnKeyboard:false,
	layoutKind: "HFlexLayout",
	className:"",
	components:[		
		historySongOptionsPopup,
		{icon:"images/dislike.png", name: "thumbDown", onclick: "doRateSong"},
		//{icon:"images/select.png", name:"selectPopupIcon", style:"-webkit-transform:rotate(-180deg);", onclick:"songOptionsPopup"},
		{icon:"images/like.png", name: "thumbUp", onclick: "doRateSong"},
	]
};


enyo.kind({
	name: "historyTile",
	kind: "Item",
	
	events: {
		"onRateSong":""
	},
	layoutKind:"VFlexLayout", className: "",
	style: "background-size: 100% 100%;",
	published: {
		trackData: "",
		opacity: 1,
		leftMargin: "7px",
		rightMargin: "12px",
		exhibition: false
	},
	components: [
		{name: "launchApplicationService", kind: enyo.PalmService, service: enyo.palmServices.application, method: "open"},
		{
			kind:"VFlexBox", flex:1, name: "infoArea", showing: false, style: "background-color: black; background-size: 200px 200px; opacity: 0.7; color: white;", 
			components:[
				{name:"historySongName", content: "", style:"font-size:16px; font-weight:bold; margin-left:2px;"},
				{name:"historyArtistName", content: "", style:"font-size:16px; margin-left:2px;"},
				{flex:5},
				{style:"font-size:16px; margin-left:2px;", content:"Tap + hold for more"},
				toolbar
			]
		}
	],
	
	create: function() {
		this.inherited(arguments);
		this.applyStyle( "background-image", "url('"+(this.trackData.albumArtUrl || AppConstants.defaultAlbumArt)+"')" );
		this.$.historyArtistName.setContent( Util.truncateText(this.trackData.artistName, 22));
		this.$.historySongName.setContent( Util.truncateText(this.trackData.songName, 22));
		this.applyStyle("opacity", this.opacity);
		this.applyStyle("margin-left", this.leftMargin);
		this.applyStyle("margin-right", this.rightMargin);
		if ( this.exhibition == true ) {
			this.$.selectPopupIcon.hide();
		}
		this.updateThumbControls(this.trackData.songRating);
	},
	
	toggleInfo: function() {
		if ( this.$.infoArea.showing == false ) {
			this.applyStyle("opacity", 1);
			this.$.infoArea.show();
			enyo.job( this.name, enyo.bind(this, "hideHistoryInfo"), 7000 );
		}
		else {
			this.hideHistoryInfo();
			enyo.job.stop( this.name );
		}
	},
	
	hideHistoryInfo: function() {
		this.$.infoArea.hide();
		this.applyStyle("opacity", this.opacity);
	},

	updateThumbControls: function(songRating) {
		//Util.log("Updating saved thumbs up/down");
		if (songRating == 1) {
			this.$.thumbUp.setIcon("images/likechecked.png");
			this.$.thumbDown.setIcon("images/dislike.png");
		}
		else if (songRating == -1) {
			this.$.thumbDown.setIcon("images/dislikechecked.png");
			this.$.thumbUp.setIcon("images/like.png");
		}
		else {
			this.$.thumbUp.setIcon("images/like.png");
			this.$.thumbDown.setIcon("images/dislike.png");
		}
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
			Api.musicSearch( this.trackData.songName, new MusicSearchDelegate() );
		}
		else if ( value == "Create station from artist") {
			Api.musicSearch( this.trackData.artistName, new MusicSearchDelegate() );
		}
	},
	
	invertButton: function(inSender) {
		this.hideHistoryInfo();
	},

	songOptionsPopup: function(inSender, inEvent) {
		this.$.songOptions.openAtEvent(inEvent);
		enyo.job.stop( this.name );
		return true;
	},
	buyDigital: function(url) {
		this.$.launchApplicationService.call({id: "com.palm.app.browser", params: {target:url}});
	},
});
