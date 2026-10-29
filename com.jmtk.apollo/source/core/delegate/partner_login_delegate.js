var PartnerLoginDelegate = Class.create(BaseDelegate, {

	initialize: function() {
	},

	onError: function(error) {
	},

	onSuccess: function(result) {
		Util.log("PartnerLoginDelegate success");
		this.storePartnerInfo(result);
		Util.log("Calling Api.userLoginByDeviceId...");
		Api.userLoginByDeviceId(new UserLoginWithDeviceDelegate());
	}
});

