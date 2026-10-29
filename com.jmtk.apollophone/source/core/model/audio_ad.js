var AudioAd = Class.create(Track, {

	preload: function() {
		// preload is a no-op for audio ads
	},

	load: function() {
		var adToken = this.trackData.adToken;
		if (adToken != null) {
			Api.getAdMetadata(adToken, new GetAdMetadataDelegate(this));
		}
	},

	getName: function() {
		return this.trackData['companyName'];
	}
});