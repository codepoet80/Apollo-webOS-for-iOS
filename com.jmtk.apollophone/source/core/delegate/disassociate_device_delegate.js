var DisassociateDeviceDelegate = Class.create(BaseDelegate, {

    initialize: function() {
    },

    onError: function(error) {
    },

    onSuccess: function(result) {
        if (AppGlobals.station != null) {
            AppGlobals.station.stop();
        }
		
		AppGlobals.removeAll();
		
        MessageDispatcher.dispatchMessage(AppConstants.EVENT_ON_SIGN_OUT, true);
		
		// Necessary for restarting interface
		AppGlobals.resetForSignOut();
		AppGlobals.restore();
		MessageDispatcher.initialize();
    }
});
