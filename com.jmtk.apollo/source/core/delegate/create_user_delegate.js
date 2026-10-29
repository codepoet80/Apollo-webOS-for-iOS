var CreateUserDelegate = Class.create(BaseDelegate, {

	initialize: function() {
	},

	onError: function(error) {
		if (error.code > ApiError.USER_ERROR_THRESHOLD) {
			Util.showError([error.message]);
			// MessageDispatcher.dispatchMessage(AppConstants.EVENT_ON_TOGGLE_SIGN_UP_BUTTON,null);
			Application.getView().$.registerButton.setActive(false);
		}
	},

	onSuccess: function(result) {
		Application.getView().$.registerButton.setActive(false);
		this.storeUserInfo(result);
		Api.associateDevice(new AssociateDeviceDelegate());
	}
});