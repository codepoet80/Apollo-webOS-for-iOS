var GetAdMetadataDelegate = Class.create(BaseDelegate, {

    initialize: function(track) {
        this.track = track;
    },

    onError: function(error) {
    },

    onSuccess: function(result) {
        if (result == null || result.companyName == null) {
            // empty adMetaData
            Util.log("Empty ad metadata");
            this.track.playable = false;
			this.track.station.playlistService.run();
        } else {
            this.track.setAdMetadata(result);
            this.track.doLoad();
        }
    }
});

