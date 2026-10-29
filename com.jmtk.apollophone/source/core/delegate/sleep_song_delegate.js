var SleepSongDelegate = Class.create(BaseDelegate, {

	initialize: function(songName) {
		this.songName = songName;
	},

	onError: function(error) {
	
	},

	onSuccess: function(result) {
		Util.showMessage("Pandora", "'" + this.songName + "' won't play for a month");
	}
});
