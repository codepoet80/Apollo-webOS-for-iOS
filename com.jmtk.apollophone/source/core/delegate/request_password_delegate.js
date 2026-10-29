var RequestPasswordDelegate = Class.create(BaseDelegate, {

	initialize: function() {
	},

	onError: function(error) {
		Application.getView().$.requestPassButton.setActive(false);
	},

	onSuccess: function(result) {
		Application.getView().$.requestPassButton.setActive(false);
		Util.showMessage(AppConstants.MSG_PASSWORD_RESET_TITLE, AppConstants.MSG_PASSWORD_RESET_ERROR);
	},

	onDismiss: function(event) {
		// Mojo.Controller.stageController.swapScene(AppConstants.SCENE_WELCOME);
	}
});