var ExplainTrackDelegate = Class.create(BaseDelegate, {

	initialize: function(callback, trackData) {
		this.callback = callback;
		this.trackData = trackData;
	},

	onError: function(error) {
	},

	onSuccess: function(result) {
		Util.log("ExplainTrackDelegate successful...");
		var explanation = "We're playing this track because it features";
		var explanations = result.explanations;
		var cutoff = 6;
		if (explanations != null && explanations.length > 0) {
			for (var i = 0; i < explanations.length; ++i) {
				if (i >= cutoff) {
					//break;
				}

				var focusTrait = explanations[i].focusTraitName;
				if (i == 0) {
					explanation += " " + focusTrait;
				}
				else if ( i == (explanations.length-1) ) {
					explanation += ", and " + focusTrait +".";
				}
				else {
					explanation += ", " + focusTrait;
				}
			}

		}
		else {
			explanation = explanation + " specific musical qualities.";
		}

		var artUrl = this.trackData.albumArtUrl;
		if (artUrl == null || artUrl.length < 1) {
			artUrl = AppConstants.defaultAlbumArt;
		}

		var model = {
			explanation: explanation,
			artUrl: artUrl,
			artist: this.trackData.artistName,
			song: this.trackData.songName,
			album: this.trackData.albumName,
			noQualities: (explanations == null || explanations.length == 0)
		};

		this.callback(model);

	}
});
