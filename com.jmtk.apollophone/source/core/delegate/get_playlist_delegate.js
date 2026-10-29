var GetPlaylistDelegate = Class.create(BaseDelegate, {

    // "callback" must be called on all success or error conditions to release the playlist lock, otherwise
    // no further playlist calls can be made
	initialize: function(station, callback) {
		this.station = station;
		this.callback = callback;
	},

	onError: function(error) {
		Util.log("on playlist error");
		this.callback(null);
	},

	onSuccess: function(result) {
		this.callback(result['items']);
	},

	getErrorMessage: function($super, apiError) {
		if (apiError.code == 0) {
			return ApiError.PLAYLIST_END;
		} else {
			return $super(apiError);
		}
	},

	doOnNetworkError: function(message) {
        Util.log("network error on playlist, will try again");
        this.callback(null);
		// ignore network errors, playlist service will handle silent retries
	}

});
