var CheckLicensingDelegate = Class.create(BaseDelegate, {

	initialize: function() {
	},

	onError: function(error) {
	},

	onSuccess: function(result) {
		if (result.hasOwnProperty('isAllowed') && result['isAllowed']) {
            AppGlobals.setLicensing(true);
			Api.partnerLogin(new PartnerLoginDelegate());
		} else {
			var message = ApiError.ERROR_MESSAGE_MAP[12];
			Util.showError([message]);
		}
	}
});
