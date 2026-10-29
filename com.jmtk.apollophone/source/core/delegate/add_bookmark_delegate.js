var AddBookmarkDelegate = Class.create(BaseDelegate, {

	initialize: function() {
	},

	onError: function(error) {

	},

	onSuccess: function(result) {
		var msg = "'"+result.artistName+"'";
		if ( result.hasOwnProperty("songName") ) {
			msg = "\""+result.songName+"\"";
		}
		Util.showBannerMessage(msg+" bookmarked");
		
		MessageDispatcher.dispatchMessage( AppConstants.EVENT_ON_BOOKMARK_CREATED, true );
	}
});
