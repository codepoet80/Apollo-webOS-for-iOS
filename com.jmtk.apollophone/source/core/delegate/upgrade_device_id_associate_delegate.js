var UpgradeDeviceIdAssociateDelegate = Class.create(BaseDelegate, {

	initialize: function() {
	},

	onError: function(error) {
	},

	onSuccess: function(result) {
        Util.log("in upgrade device association delegate");
        AppGlobals.isFirstLoginWithNewDeviceId = false;

        // regular login
        Api.userLoginByDeviceId(new UserLoginWithDeviceDelegate());

        // disassociate old deviceid, since we no longer need it
        var deviceId = AppGlobals.systemProperties['com.palm.properties.nduid'];
        Api.updateDeviceDisassociateDevice(deviceId, new NoOpDelegate());    
    }

});

