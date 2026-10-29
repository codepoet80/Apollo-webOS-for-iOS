var BaseDelegate = Class.create({

	initialize: function() {
		this.requestId = null;
	},

	setRequestId: function(requestId) {
		this.requestId = requestId;
	},

	doOnSuccess: function(transport) {
//        try {
//            var diff = new Date().getTime() - AppGlobals.startTime;
//            Util.log("STARTUPTIME: " + diff);
//            AppGlobals.startTime = new Date().getTime();
//        } catch(e) {
//        }

		Util.log("API Response: " + transport.responseText);
		Util.log("requestId: " + this.requestId);

		// there are some network conditions where we don't get an error response, but the response text is empty
		// saw this in airplane mode
		if (transport.responseText == "") {
			Util.log("Empty response");
			this.doOnError("null response");
			return;
		}

		var result = enyo.json.parse(transport.responseText);

		if (result.hasOwnProperty('stat')) {
			var status = result.stat;
			if (status == 'fail') {
				var apiError = new ApiError(result.code);
				this.checkGlobalError(apiError, this.requestId);
				return;
			}
			else {
				if (result.hasOwnProperty('result')) {
					try {
						Api.removeRequest(this.requestId);
						this.onSuccess(result.result);
					} catch(ex) {
						Util.log(ex);
					}
					return;
				}
			}
		}

		Api.removeRequest(this.requestId);
		this.onSuccess(new Object());
	},

	doOnError: function(error) {
		Util.log("Error: " + error.message);
		var apiError = new ApiError(-1);
		this.checkGlobalError(apiError);
	},

	checkGlobalError: function(apiError) {
		var errorCode = apiError.code;
		Util.log("Error Code: " + errorCode);

		var retainRequest = false;

		var message = this.getErrorMessage(apiError);
		apiError.message = message;

        if (errorCode == ApiError.READ_ONLY_MODE) {
            Util.showMessageWithCallback(AppConstants.MSG_ERROR_TITLE_SINGULAR, message, this.doOnReadOnlyError.bind(this));
        }
		else if (errorCode == ApiError.NETWORK_ERROR) {
			retainRequest = true;
			this.doOnNetworkError(message);
		}
		else if (errorCode == ApiError.INVALID_AUTH_TOKEN) {
			retainRequest = true;
			Api.partnerLogin(new ReAuthPartnerLoginDelegate(this.requestId));
		}
		else if (errorCode == ApiError.LISTENER_NOT_AUTHORIZED) {
			Util.showMessage(AppConstants.MSG_SIGN_IN_ERROR_TITLE, message);
			if (AppGlobals.station != null) {
				AppGlobals.station.stop();
			}
		}
		else if (errorCode == ApiError.USER_NOT_AUTHORIZED) {
			if (AppGlobals.station != null) {
				AppGlobals.station.stop();
			}
			Util.showMessage(AppConstants.MSG_ERROR_TITLE_SINGULAR, message);			
		}
		else if (errorCode == ApiError.STATION_DOES_NOT_EXIST) {
			if (AppGlobals.station.getStationToken() != null) {
				AppGlobals.station.stop();
				AppGlobals.deleteStation(AppGlobals.station.getStationToken());
			}

			Util.showMessage(AppConstants.MSG_ERROR_TITLE_SINGULAR, message);
		}
		else {
			if (message != null) {
				Util.showMessage(AppConstants.MSG_ERROR_TITLE_SINGULAR, message);
			}
		}

		if (!retainRequest) {
			Api.removeRequest(this.requestId);
		}

		this.onError(apiError);
	},

	toStationList: function() {
		Mojo.Controller.stageController.swapScene(AppConstants.SCENE_STATIONLIST);
	},

//override
	getErrorMessage: function(apiError) {
		return ApiError.ERROR_MESSAGE_MAP[apiError.code];
	},

//override
	doOnNetworkError: function(message) {
		Util.showRetryMessage(AppConstants.MSG_NETWORK_ERROR_TITLE, message, this.onRetry.bind(this));
	},

	onRetry: function() {
		Util.log("Retrying after network error...");
		Api.resendRequest(this.requestId);
	},

	storeUserInfo: function(result) {
		AppGlobals.setUsername(result.username);
		AppGlobals.userAuthToken = result.userAuthToken;
		AppGlobals.userId = result.userId;
		AppGlobals.hasAds = result.hasAudioAds;
		AppGlobals.canListen = result.canListen;
		AppGlobals.nowPlayingAdUrl = result.nowPlayingAdUrl;
		AppGlobals.splashScreenAdUrl = result.splashScreenAdUrl;
       // AppGlobals.andoService.resetListener();
	},

	storePartnerInfo: function(result) {
		AppGlobals.partnerAuthToken = result.partnerAuthToken;
		AppGlobals.partnerId = result.partnerId;
		AppGlobals.skipLimit = result.stationSkipLimit;
		AppGlobals.autoCompleteUrl = result.urls.autoComplete;
		AppGlobals.setClientStartTime();
		var serverSyncTime = Api.getServerSyncTime(result);
		AppGlobals.serverSyncTime = Number(serverSyncTime);
	},

	onError: function(error) {
	},

	onSuccess: function(transport) {
	},

    doOnReadOnlyError: function() {
    },

	launchStation: function() {
		Api.musicSearch(AppGlobals.createStationSeed, new MusicSearchDelegate());
		AppGlobals.createStationSeed = null;
	}

});
