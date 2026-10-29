var SkipLimitService = Class.create({

	initialize: function() {
		this.skippedTracks = new Array();
	},

	addTrack: function(trackName) {
		this.updateSkipQueue();
		var skipLimitObject = new Object();
		skipLimitObject['name'] = trackName;
		skipLimitObject['time'] = new Date().getTime();
		this.skippedTracks.push(skipLimitObject);
	},

	canSkip: function() {
		this.updateSkipQueue();
		if (this.skippedTracks.length >= AppGlobals.skipLimit) {
			Util.log("no skips remaining");
			return false;

		} else {
			Util.log("can skip");
			return true;
		}
	},

	updateSkipQueue: function() {
		var timeThreshold = new Date().getTime() - SkipLimitService.STATION_SKIP_WINDOW;
		// iterate backwards so splicing doesn't skip the following entry
		for (var i = this.skippedTracks.length - 1; i >= 0; --i) {
			var skipLimitObject = this.skippedTracks[i];
			if (skipLimitObject['time'] <= timeThreshold) {
				Util.log("aging out old track: " + skipLimitObject['name'] + " listened at: " + skipLimitObject['time']);
				this.skippedTracks.splice(i, 1);
			}
		}
	}

});

SkipLimitService.STATION_SKIP_WINDOW = 60 * 60 * 1000;
// 60 minutes