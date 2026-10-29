var UserLoginWithDeviceDelegate = Class.create(BaseDelegate, {

	initialize: function() {
	},

	onError: function(error) {
		// Util.log("UserLogin onError");
		if (error['code'] == ApiError.DEVICE_NOT_FOUND) {
            // likely an upgrade from 0.9.11 -> 0.9.12 with new device id scheme
            if (AppGlobals.isFirstLoginWithNewDeviceId  && AppGlobals.stationListChecksum != null) {
                Util.log("likely upgrade, try logging in with old device id and see if we can auto-associate the new device id");
                AppGlobals.newDeviceId = AppGlobals.deviceId;
				if ( AppGlobals.platform == "device" ) {
					AppGlobals.deviceId = AppGlobals.systemProperties['com.palm.properties.nduid'];
				}
                Api.userLoginByDeviceId(new UpgradeDeviceIdLoginDelegate());
            }
			else {
				Util.log("Could not automatically sign in with device id. Moving to interface as new device.");
				AppGlobals.isFirstLoginWithNewDeviceId = true;
				// if ( AppGlobals.platform == "browser" ) {
					// AppGlobals.onGetDeviceId(null);
				// }
				if ( Application.exhibition ) {
					Util.showMessage("Apollo Error","Please sign in using standard app mode before attempting to use exhibition mode.");
				}
			    Application.setView("interface");
            }
		}
	},

	onSuccess: function(result) {
		this.storeUserInfo(result);
		// if (AppGlobals.splashScreenAdUrl != null && AppGlobals.splashScreenAdUrl.length > 1) {
			// Util.log("ME: Calling AdService.showSplashScreenAd after successful UserLoginWithDevice");
			// AdService.showSplashScreenAd();
			// setTimeout(this.afterSplashScreenAd.bind(this), AppGlobals.SPLASHSCREEN_DELAY);
		// }
		// else {
			// this.afterSplashScreenAd();
		// }
		this.afterSplashScreenAd();
	},

	afterSplashScreenAd: function() {
		Util.log("ME: Executing afterSplashScreenAd() in UserLoginWithDeviceDelegate");
        Api.getStationListChecksum(new GetStationListChecksumDelegate());
	}
});

