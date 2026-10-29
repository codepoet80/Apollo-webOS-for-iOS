var DisassociateDeviceDelegate = Class.create(BaseDelegate, {

    initialize: function() {
    },

    onError: function(error) {
    },

    onSuccess: function(result) {
        if (AppGlobals.station != null) {
            AppGlobals.station.stop();
        }

        MessageDispatcher.dispatchMessage(AppConstants.EVENT_ON_SIGN_OUT, true);

		// Necessary for restarting interface
		AppGlobals.resetForSignOut();
		MessageDispatcher.initialize();

		// Only re-read persisted state once the store has actually been cleared;
		// the Depot is asynchronous, so restoring immediately could read stale values.
		AppGlobals.removeAll(function() {
			AppGlobals.restore();
		});
    }
});
