var ReAuthDeviceLoginDelegate = Class.create(BaseDelegate, {

	initialize: function(failedRequestId) {
		this.failedRequestId = failedRequestId;
	},

	onError: function(error) {
		if (result['code'] == ApiError.DEVICE_NOT_FOUND) {
			Mojo.Controller.stageController.swapScene(AppConstants.SCENE_WELCOME);
		}
	},

	onSuccess: function(result) {
		this.storeUserInfo(result);
		Util.log("retrying request: " + this.failedRequestId);
		Api.resendRequest(this.failedRequestId);
	}
});

