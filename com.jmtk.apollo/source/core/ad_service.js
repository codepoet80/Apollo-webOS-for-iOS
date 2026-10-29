var AdService = Class.create({

	initialize: function() {
		this.splashScreenCallback =  this.showSplashScreenCallback.bind(this);
	},

	showSplashScreenAd: function() {
		if (AppGlobals.splashScreenAdUrl != null) {
			var url = AppGlobals.splashScreenAdUrl;
			url = url.replace(AdService.CACHEBUST, new Date().getTime());
			var request = new Ajax.Request(url, {
				method: 'get',
				onSuccess: this.splashScreenCallback
			});
		}
	},

	showSplashScreenCallback: function(response) {
		var txt = response.responseText;
		Util.log("ad text: " + txt);
		var adData = this.parseAdJSON(txt);
        if (adData != null) {
		    if (!Util.isEmpty(adData.imageUrl)) {
			    MessageDispatcher.dispatchMessage(AppConstants.EVENT_ON_DISPLAY_SPLASHSCREEN_AD, adData);
		    } else if (!Util.isEmpty(adData.impressionUrl)) {
                // impression for avails
                Util.httpGet(adData.impressionUrl);
            }
        }
	},

	showNowPlayingAd: function(url) {
		url = url.replace(AdService.CACHEBUST, new Date().getTime());
		var request = new Ajax.Request(url, {
			method: 'get',
			onSuccess: this.nowPlayingCallback.bind(this)
		});
	},

	nowPlayingCallback: function(response) {
		var txt = response.responseText;
		Util.log("ad text: " + txt);
		var adData = this.parseAdJSON(txt);
        if (adData != null) {
		    if (!Util.isEmpty(adData.imageUrl)) {
			    MessageDispatcher.dispatchMessage(AppConstants.EVENT_ON_DISPLAY_NOW_PLAYING_AD, adData);
		    } else if (!Util.isEmpty(adData.impressionUrl)) {
                // impression for avails
                Util.httpGet(adData.impressionUrl);
            }
        }
	},
	
	parseAdJSON: function(rawJSON) {
		var startingIndex = rawJSON.indexOf("{");
		var endingIndex = rawJSON.lastIndexOf("}");
		if (startingIndex < 0 || endingIndex < 0) {
			return null;
		}

		rawJSON = rawJSON.substring(startingIndex, endingIndex + 1);
		return rawJSON.evalJSON();
	}

});

AdService.prototype.CACHEBUST = "__CACHEBUST__";
