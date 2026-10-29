var GetStationListChecksumDelegate = Class.create(BaseDelegate, {

	initialize: function() {
	},

	onError: function(error) {
	},

	onSuccess: function(result) {
		Application.setView("interface");
		Util.log("GetStationListChecksum successful");
		if (result['checksum'] != AppGlobals.stationListChecksum) {
			Util.log("Checksum not recognized, storing in AppGlobals and getting stationList from server.");
			AppGlobals.setStationListChecksum(result['checksum']);
			Util.log("Calling Api.getStationList now");
			Api.getStationList(new GetStationListDelegate());
		}
		else {
			Util.log("Queried checksum is equal to one in storage, which means we have all the correct stations stored locally.");
			if (AppGlobals.stationList == null || AppGlobals.stationList.length == 0) {
				Util.log("Empty stationList, move to create station");
				// Mojo.Controller.stageController.swapScene(Util.getSceneParams(AppConstants.SCENE_CREATE_STATION, Mojo.Transition.crossFade, null));
			}
			else if (AppGlobals.createStationSeed != null) {
				Util.log("Creating station with seed: "+AppGlobals.createStationSeed);
				this.launchStation();
			}
			else if (AppGlobals.station != null && (AppGlobals.startupAutoPlay || Application.exhibition )) {
				Util.log("Starting station: "+AppGlobals.station);
				AppGlobals.station.start();
				// Mojo.Controller.stageController.swapScene(Util.getSceneParams(AppConstants.SCENE_NOWPLAYING, Mojo.Transition.crossFade, true));
			}
			else {
			//	AppGlobals.station = null;
				Util.log("Going to station list");
				// Mojo.Controller.stageController.swapScene(Util.getSceneParams(AppConstants.SCENE_STATIONLIST, Mojo.Transition.crossFade, null));
			}
			MessageDispatcher.dispatchMessage(AppConstants.EVENT_ON_FINISH_SIGN_IN, true);
		}
	}
});
