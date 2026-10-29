var DeleteStationDelegate = Class.create(BaseDelegate, {

    initialize: function(stationToken, stationListAssistant) {
        this.stationToken = stationToken;
        this.stationListAssistant = stationListAssistant;

        this.refreshUndoCallback = this.refreshStationList.bind(this);
    },

    onError: function(error) {
        if (error.code >= 1004) {
            Util.showMessage(AppConstants.MSG_STATION_ERROR_TITLE, AppConstants.MSG_STATION_DELETE_ERROR);
        } 
    },

    onSuccess: function(result) {
        if (AppGlobals.station != null && AppGlobals.station.getStationToken() == this.stationToken) {
			Util.showBannerMessage(AppGlobals.station.stationData.stationName+" deleted.");
            AppGlobals.station.stop();
            AppGlobals.clearStation();
        }
        AppGlobals.deleteStation(this.stationToken);
        Api.getStationList(new UpdateStationListDelegate());
    },

    refreshStationList: function() {
        MessageDispatcher.dispatchMessage(AppConstants.EVENT_ON_UNDO_DELETE, null);
    },

    doOnReadOnlyError: function() {
        this.refreshStationList();
    }
});