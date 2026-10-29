var UpgradeDeviceIdLoginDelegate = Class.create(BaseDelegate, {

	initialize: function() {
	},

	onError: function(error) {
		if (error['code'] == ApiError.DEVICE_NOT_FOUND) {
            AppGlobals.mojoStageController.swapScene(Util.getSceneParams(AppConstants.SCENE_WELCOME, Mojo.Transition.crossFade, null));
		}
	},

	onSuccess: function(result) {
        Util.log("in upgrade device login delegate");
        this.storeUserInfo(result);

        AppGlobals.deviceId = AppGlobals.newDeviceId;
        Api.associateDevice(new UpgradeDeviceIdAssociateDelegate());

	}
});

