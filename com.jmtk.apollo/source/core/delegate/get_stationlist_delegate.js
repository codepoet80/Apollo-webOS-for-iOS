var GetStationListDelegate = Class.create(BaseDelegate, {

    initialize: function() {
    },

    onError: function(error) {
    },

    onSuccess: function(result) {
		Util.log("GetStationListDelegate successful");
        AppGlobals.setStationListChecksum(result['checksum']);
        if (result['stations'] == null || result['stations'].length == 0) {
			Util.log("Empty stationList, move to create station");
            AppGlobals.setStationList([]);
            // Mojo.Controller.stageController.swapScene(Util.getSceneParams(AppConstants.SCENE_CREATE_STATION, Mojo.Transition.crossFade, null));
        }
		else {
            AppGlobals.setStationList(result['stations']);

            if (AppGlobals.createStationSeed != null) {
                Util.log("Creating station with seed: "+AppGlobals.createStationSeed);
                this.launchStation();
            }
			else if (AppGlobals.station == null) {
                Util.log("Going to station list");
				// Just load the interface with no station playing, station list is always displayed in left sliding pane
				// Mojo.Controller.stageController.swapScene(Util.getSceneParams(AppConstants.SCENE_STATIONLIST, Mojo.Transition.crossFade, null));
				
            }
			else if ( AppGlobals.startupAutoPlay || Application.exhibition ) {
                Util.log("Starting station: "+AppGlobals.station);
                AppGlobals.station.start();
               // Mojo.Controller.stageController.swapScene(Util.getSceneParams(AppConstants.SCENE_NOWPLAYING, Mojo.Transition.crossFade, true));
            }
			else {
				//AppGlobals.station = null;
			}
        }

        MessageDispatcher.dispatchMessage(AppConstants.EVENT_ON_FINISH_SIGN_IN, true);
    }
});
