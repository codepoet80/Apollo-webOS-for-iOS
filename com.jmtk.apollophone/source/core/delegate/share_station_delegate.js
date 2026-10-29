var ShareStationDelegate = Class.create(BaseDelegate, {

	initialize: function(firstName) {
		this.firstName = firstName;
	},

	onError: function(error) {
		if (error.code == ApiError.PARAMETER_VALUE_INVALID ||
			error.code == ApiError.PARAMETER_MISSING) {
			Util.showMessage(AppConstants.MSG_STATION_SHARING_ERROR_TITLE, AppConstants.MSG_STATION_SHARING_ERROR);
		}
	},

	onSuccess: function(result) {
		var firstName = this.firstName;
		var message = "";

		if (firstName == null || firstName.length < 1) {
			message = AppConstants.MSG_STATION_SHARED_PREFIX;
		} else {
			message = AppConstants.MSG_STATION_SHARED_PREFIX + AppConstants.MSG_WITH + firstName;
		}

		Util.showBannerMessage(message);
		Mojo.Controller.stageController.swapScene(Util.getSceneParams(AppConstants.SCENE_NOWPLAYING, null, true));
	}
});