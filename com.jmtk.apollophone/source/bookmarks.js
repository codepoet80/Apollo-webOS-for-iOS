var songOptionsPopup = {
	kind: enyo.PopupSelect, name:"songOptions", onSelect:"songOptionSelect",
	items: [
		"[Amazon] Buy MP3 Song",
		"Create station from song",
		"Create station from artist",
		"Delete"
	]
};
var artistOptionsPopup = {
	kind: enyo.PopupSelect, name:"artistOptions", onSelect:"songOptionSelect",
	items: [
		"[Amazon] Buy music",
		"Create station from artist",
		"Delete"
	]
};

enyo.kind({
	name:"bookmarks",
	kind:"VFlexBox", 
	style:"background-color:#081228;", flex:1,
	components:[
		{name: "launchApplicationService", kind: enyo.PalmService, service: enyo.palmServices.application, method: "open"},
		{kind:"Scroller", name:"songBookmarksScroller", flex:1,
			components:[
			{content:"You do not have any song bookmarks.", name:"noSongBookmarks", showing:false, style:"color:#FFFFFF; margin-left: 30px;"},
			{content:"Loading...", name:"loadingSongText", style:"color:#FFFFFF; margin-left: 30px;"},
			{	
				kind: "VirtualRepeater", name: "songBookmarksRepeater", onclick:"openPopupSong", onSetupRow: "setSongBookmarks", layoutKind:"VFlexLayout",
				components: [
					{
						kind: "Item", name:"songItem", bookmarksObj:"", align:"center",
						className:"settingsHelpFont", layoutKind: enyo.HFlexLayout, style:"color:#FFF",
						components: [
							{kind:"Image", name:"songBookmarkArt", width:"85px", height:"85px", style:"margin-top:4px;", src:AppConstants.defaultAlbumArt},
							{kind:"VFlexBox", style:"margin-left:5px; margin-bottom:4px;", components:[
								{content:"", style:"font-weight:bold;", name:"songBookmarkName"},
								{content:"", name:"songBookmarkArtist"},
								songOptionsPopup
							]
							},					
						]
					}
				]
			},
			]
		},
		{kind:"Scroller", name:"artistBookmarksScroller", showing:false, flex:1,
			components:[
			{content:"You do not have any artist bookmarks.", name:"noArtistBookmarks", showing:false, style:"color:#FFFFFF; margin-left: 30px;"},
			{content:"Loading...", name:"loadingArtistText", style:"color:#FFFFFF; margin-left: 30px;"},
			{	
				kind: "VirtualRepeater", name: "artistBookmarksRepeater", onclick:"openPopupArtist", onSetupRow: "setArtistBookmarks", layoutKind:"VFlexLayout", pack:"center",
				components: [
					{
						kind: "Item", name:"artistItem", bookmarksObj:"",
						style:"color:#FFFFFF;", className:"settingsHelpFont", align:"center", layoutKind: enyo.HFlexLayout,
						components: [
							{kind:"Image", name:"artistBookmarkArt", width:"85px", height:"85px", style:"margin-top:7px;", src:AppConstants.defaultAlbumArt},
							{content:"", style:"margin-left:5px;", name:"artistBookmarkName"},
							artistOptionsPopup
						]
					}
				]
			},
			]
		},
		{kind:"VFlexBox",
			components:[
				{
				kind:"RadioGroup", 
				name:"bookmarkType",
				style: "margin-left:auto; margin-right:auto;",
				components:[{caption:"Songs"}, {caption:"Artists"}], 
				width:"65%", onChange:"switchBookmarkType"
				}
			]
		},
	],

	ready: function() {
		// These will hold the lists we get from the BOOKMARKS_RETRIEVED event
		this.artistBookmarks = [];
		this.songBookmarks   = [];

		this.getBookmarksCallbackId = MessageDispatcher.subscribe( AppConstants.EVENT_ON_BOOKMARKS_RECEIVED, this.bookmarksRetrieved.bind(this) );
		this.bookmarkDeletedCallbackId = MessageDispatcher.subscribe( AppConstants.EVENT_ON_BOOKMARK_DELETED, this.refreshList.bind(this) );
		this.bookmarkCreatedCallbackId = MessageDispatcher.subscribe( AppConstants.EVENT_ON_BOOKMARK_CREATED, this.refreshList.bind(this) );
	},
	
	bookmarksRetrieved: function( bookmarksObj ) {
		// Check bookmarksObj.type to determine which UI list to update (call the VirtualRepeater's render function)
		// List of bookmarks is in bookmarksObj.list
		if ( !bookmarksObj.type ) {
			return;
		}
		
		if ( bookmarksObj.type == "song" ) {
			this.songBookmarks = bookmarksObj.list;
			this.$.songBookmarksRepeater.render();
			if ( this.songBookmarks.length != 0) {
				this.$.noSongBookmarks.hide();
				this.$.loadingSongText.hide();
			}
			else {
				this.$.loadingSongText.hide();
				this.$.noSongBookmarks.show();
			}
		}
		else {
			this.artistBookmarks = bookmarksObj.list;
			this.$.artistBookmarksRepeater.render();
			
			if ( this.artistBookmarks.length != 0) {
				this.$.loadingArtistText.hide();
				this.$.noArtistBookmarks.hide();
			}
			else {
				this.$.loadingArtistText.hide();
				this.$.noArtistBookmarks.show();
			}
		}
	},

	switchBookmarkType: function( inSender ) {
		if ( inSender.getValue() == 0 ) {
			this.$.artistBookmarksScroller.hide();
			this.$.songBookmarksScroller.show();
		}
		else {
			this.$.songBookmarksScroller.hide();
			this.$.artistBookmarksScroller.show();
		}
	},
	
	setSongBookmarks: function( inSender, inIndex ) {

		if ( inIndex < this.songBookmarks.length ) {
			this.$.songBookmarkName.setContent(this.songBookmarks[inIndex].songName);
			this.$.songBookmarkArtist.setContent("by "+this.songBookmarks[inIndex].artistName);
			var url = this.songBookmarks[inIndex].artUrl || AppConstants.defaultAlbumArt;
			this.$.songBookmarkArt.setSrc(url);
			this.$.songItem.bookmarkObj = this.songBookmarks[inIndex];
			if ( inIndex == 0 ) {
				this.$.songItem.applyStyle("border-top", "none");
			}
			if ( inIndex == (this.songBookmarks.length-1) ) {
				this.$.songItem.applyStyle("border-bottom", "none");
			}
			return true;
		}
	},
	
	setArtistBookmarks: function( inSender, inIndex ) {

		if ( inIndex < this.artistBookmarks.length ) {
			this.$.artistBookmarkName.setContent(this.artistBookmarks[inIndex].artistName);
			this.$.artistBookmarkArt.setSrc(this.artistBookmarks[inIndex].artUrl);
			this.$.artistItem.bookmarkObj = this.artistBookmarks[inIndex];
			if ( inIndex == 0 ) {
				this.$.artistItem.applyStyle("border-top", "none");
			}
			if ( inIndex == (this.artistBookmarks.length-1) ) {
				this.$.artistItem.applyStyle("border-bottom", "none");
			}
			return true;
		}
	},
	
	refreshList: function( arg ) {
		// this.log();
		Api.getSongBookmarks(new GetBookmarkDelegate());
		Api.getArtistBookmarks(new GetBookmarkDelegate());
	},
	
	songOptionSelect: function(inSender, inSelected) {
		var value = inSelected.getValue();

		var i = this.$.artistBookmarksRepeater.fetchRowIndex();
		if ( this.popupType == "song" ) {
			i = this.$.songBookmarksRepeater.fetchRowIndex();
		}

		if ( value == "[Amazon] Buy MP3 Song" ) {
			this.buyDigital("http://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Ddigital-music&field-keywords="+encodeURIComponent(this.songBookmarks[i].songName+" "+this.songBookmarks[i].artistName));
		}
		else if ( value == "Create station from song") {
			Api.musicSearch(this.songBookmarks[i].songName, new MusicSearchDelegate("S"));
		}
		else if ( value == "[Amazon] Buy music" ) {
			this.buyDigital("http://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Ddigital-music&field-keywords="+encodeURIComponent(this.artistBookmarks[i].artistName));
		}
		else if ( value == "Create station from artist") {
			if ( this.popupType == "artist" ) {
				Api.musicSearch(this.artistBookmarks[i].artistName, new MusicSearchDelegate("R"));
			}
			else {
				Api.musicSearch(this.songBookmarks[i].artistName, new MusicSearchDelegate("R"));
			}	
		}
		else if ( value == "Delete" ) {
			if ( this.popupType == "song") {
				Api.deleteSongBookmark(this.songBookmarks[i].bookmarkToken, new DeleteBookmarkDelegate());
			}
			else {
				Api.deleteArtistBookmark(this.artistBookmarks[i].bookmarkToken, new DeleteBookmarkDelegate());
			}
		}
	},
	
	buyDigital: function(url) {
		this.$.launchApplicationService.call({id: "com.palm.app.browser", params: {target:url}});
	},
	
	openPopupSong: function(inSender, inEvent) {
		this.$.songBookmarksRepeater.controlsToRow( inEvent.rowIndex );
		this.popupType = "song";
		this.$.songOptions.openAtEvent(inEvent);
	},
	openPopupArtist: function(inSender, inEvent) {
		this.$.artistBookmarksRepeater.controlsToRow( inEvent.rowIndex );
		this.popupType = "artist";
		this.$.artistOptions.openAtEvent(inEvent);
	}
}
);
