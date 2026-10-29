var SystemPropertiesDelegate = Class.create({

	initialize: function() {
	},

	onError: function(error) {
		//todo - failed to connect to hardware to get system props
	},

	onSuccess: function(result) {
		AppGlobals.systemProperties = result;
		Api.checkLicensing(new CheckLicensingDelegate());
	}
});
