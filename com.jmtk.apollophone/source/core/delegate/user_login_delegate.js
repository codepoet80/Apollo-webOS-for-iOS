var UserLoginDelegate = Class.create(BaseDelegate, {

	initialize: function() {
	},

	onError: function(error) {
		if (error.code > ApiError.USER_ERROR_THRESHOLD) {
			Util.showError([error.message]);
			//Application.getView().$.signInButton.setActive(false);
			MessageDispatcher.dispatchMessage(AppConstants.EVENT_ON_FINISH_SIGN_IN, false);
		}
	},

	onSuccess: function(result) {
		this.storeUserInfo(result);
		//Application.setView("interface").updateView();
		// if (AppGlobals.splashScreenAdUrl != null && AppGlobals.splashScreenAdUrl.length > 1) {
			// AdService.showSplashScreenAd();
			// setTimeout(this.afterSplashScreenAd.bind(this), AppGlobals.SPLASHSCREEN_DELAY);
		// }
		// else {
			// this.afterSplashScreenAd();
		// }
		this.afterSplashScreenAd();
	},

	afterSplashScreenAd: function() {
		Util.log("ME: Attempting to associateDevice in UserLoginDelegate...");
		Api.associateDevice(new AssociateDeviceDelegate());
	}
});