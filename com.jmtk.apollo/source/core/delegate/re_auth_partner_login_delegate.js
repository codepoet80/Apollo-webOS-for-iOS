var ReAuthPartnerLoginDelegate = Class.create(BaseDelegate, {

	initialize: function(failedRequestId) {
		this.failedRequestId = failedRequestId;
	},

	onError: function(error) {
	},

	onSuccess: function(result) {
		this.storePartnerInfo(result);
		Api.userLoginByDeviceId(new ReAuthDeviceLoginDelegate(this.failedRequestId));
	}
});

