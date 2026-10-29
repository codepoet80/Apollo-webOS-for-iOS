var NoOpDelegate = Class.create(BaseDelegate, {

	initialize: function() {
	},

	onError: function(error) {
	},

	onSuccess: function(result) {
		Util.log("NoOp delegate success. Result: "+result);
	}
});
