var AddFeedbackDelegate = Class.create(BaseDelegate, {

	initialize: function(isPositive, station, ratingHistory) {
		this.isPositive = isPositive;
		this.station = station;
		this.ratingHistory = ratingHistory;
	},

	onError: function(error) {

	},

	onSuccess: function(result) {

		var songRating = 0;
		if (!this.isPositive) {
			if ( !this.ratingHistory ) {
				this.station.throwOutTracksAndSkip();
			}
			songRating = -1;
		}
		else {
			songRating = 1;
		}

		MessageDispatcher.dispatchMessage(AppConstants.EVENT_ON_TRACK_THUMBED, songRating);
	}
});
