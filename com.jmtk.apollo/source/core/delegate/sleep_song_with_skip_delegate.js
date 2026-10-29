var SleepSongWithSkipDelegate = Class.create(BaseDelegate, {

	initialize: function(songName) {
		this.songName = songName;
	},

	onError: function(error) {
	},

	onSuccess: function($super, result) {
		AppGlobals.station.silentSkip();
		Util.showBannerMessage("'" + this.songName + "' won't play for a month");
	}

});
