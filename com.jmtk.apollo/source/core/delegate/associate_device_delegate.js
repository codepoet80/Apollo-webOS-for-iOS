var AssociateDeviceDelegate = Class.create(BaseDelegate, {

	initialize: function() {
	},

	onError: function(error) {
		
	},

	onSuccess: function(result) {
		Util.log("ME: AssociateDeviceDelegate successful");
		Api.getStationList(new GetStationListDelegate());
	}
});
