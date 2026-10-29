var DeleteBookmarkDelegate = Class.create(BaseDelegate, {

	initialize: function() {
	},

	onError: function(error) {
		Util.log("Could not delete bookmark...");
	},

	onSuccess: function(result) {
		Util.showBannerMessage("Bookmark deleted.");
		MessageDispatcher.dispatchMessage(AppConstants.EVENT_ON_BOOKMARK_DELETED, true);
	}
});
