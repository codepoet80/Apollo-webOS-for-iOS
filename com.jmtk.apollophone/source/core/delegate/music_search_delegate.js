var MusicSearchDelegate = Class.create(BaseDelegate, {

	initialize: function(type) {
		this.type = type;
		this.exactArtistMatches = [];
		this.exactSongMatches = [];
	},

	onError: function(error) {

	},

	onSuccess: function(result) {
		if (result != null) {
			this.getExactMatchCount(result.artists, this.exactArtistMatches);
			this.getExactMatchCount(result.songs, this.exactSongMatches);
			Util.log("artist matches: " + this.exactArtistMatches.length + " song matches: " + this.exactSongMatches.length);
			
			if ( this.type == "S" && this.exactSongMatches.length > 0 ) {
				Api.createStation(this.exactSongMatches[0].musicToken, new CreateStationDelegate());
				return;
			}
			else if ( this.type == "R" && this.exactArtistMatches.length > 0 ) {
				Api.createStation(this.exactArtistMatches[0].musicToken, new CreateStationDelegate());
				return;
			}
			else if (this.exactArtistMatches.length && this.exactSongMatches.length == 0 ) {
				Api.createStation(this.exactArtistMatches[0].musicToken, new CreateStationDelegate());
				return;
			}
			else if (this.exactSongMatches.length && this.exactArtistMatches.length == 0) {
				Api.createStation(this.exactSongMatches[0].musicToken, new CreateStationDelegate());
				return;
			}
			else {
				Util.showBannerMessage("Could not create station.");
			}
		}
	},

	getExactMatchCount: function(list, matches) {
		if (list == null || list.length == 0) return;
		
		for (var i = 0; i < list.length; ++i) {
			if (list[i].score == 100) {
				matches.push(list[i]);	// Changes the referenced array
			}
		}
		return;
	}

});
