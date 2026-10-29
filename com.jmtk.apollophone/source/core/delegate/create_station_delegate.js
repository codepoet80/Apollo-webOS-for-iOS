var CreateStationDelegate = Class.create(BaseDelegate, {

	initialize: function() {
	},

	onError: function(error) {

	},

	onSuccess: function(result) {
		if (AppGlobals.station != null && result.stationToken == AppGlobals.station.getStationToken() && AppGlobals.station.hasStarted()) {
			Util.log("already playing station: " + result.stationName);
			// we are already listening to this station, no need to update anything
		}
		else {
			Util.log("starting station: " + result.stationName);
			result.name = Util.truncateText(result.stationName, 25);
			Api.getStationList(new UpdateStationListDelegate());

			if (AppGlobals.station != null) {
				AppGlobals.station.stop();
			}
			AppGlobals.setStation(result);
			AppGlobals.station.start();
		}

	}
});
