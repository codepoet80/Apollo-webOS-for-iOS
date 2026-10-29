var GetBookmarkDelegate = Class.create(BaseDelegate, {

	initialize: function() {
	},

	onError: function(error) {
		Util.log("Could not retrieve bookmarks...");
	},

	onSuccess: function(result) {
//		Util.showBannerMessage("Retrieved bookmarks successfully.");
		var bookmarks = {};
		if ( result.hasOwnProperty("artists") ) {
			bookmarks.list = result.artists;
			bookmarks.type = "artist";
		}
		else if ( result.hasOwnProperty("songs") ) {
			bookmarks.list = result.songs;
			bookmarks.type = "song";
		}

		MessageDispatcher.dispatchMessage( AppConstants.EVENT_ON_BOOKMARKS_RECEIVED, bookmarks );
	}
});
