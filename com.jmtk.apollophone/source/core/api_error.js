var ApiError = Class.create({

	initialize: function(code) {
		this.code = code;
		this.message = "";
	}

});

ApiError.USER_ERROR_THRESHOLD = 1000;
ApiError.NETWORK_ERROR = -1;
ApiError.INTERNAL_ERROR = 0;
ApiError.PARAMETER_MISSING = 9;
ApiError.PARAMETER_VALUE_INVALID = 10;
ApiError.READ_ONLY_MODE = 1000;
ApiError.INVALID_AUTH_TOKEN = 1001;
ApiError.INVALID_PARTNER_LOGIN = 1002;
ApiError.LISTENER_NOT_AUTHORIZED = 1003;
ApiError.USER_NOT_AUTHORIZED = 1004
ApiError.STATION_DOES_NOT_EXIST = 1006;
ApiError.DEVICE_NOT_FOUND = 1009;

ApiError.ERROR_MESSAGE_MAP = new Object();
ApiError.ERROR_MESSAGE_MAP[-1] = "Unable to connect to Pandora.";
ApiError.ERROR_MESSAGE_MAP[0] = "Pandora is having unexpected technical difficulties.";
ApiError.ERROR_MESSAGE_MAP[1] = "Pandora is temporarily down for scheduled service improvements.";
ApiError.ERROR_MESSAGE_MAP[8] = "A piece of data from your submission is incorrectly formatted.  Please review your entry.";
ApiError.ERROR_MESSAGE_MAP[12] = "Sorry, Pandora is not available in this country.";
ApiError.ERROR_MESSAGE_MAP[1000] = "Pandora is conducting system maintenance. If you've visited Pandora before, you'll still be able to listen to your existing stations while we work on our systems, but you won't be able to create new stations or submit feedback until maintenance is complete. If this is your first visit to Pandora please come back and visit us again tomorrow. Thanks for your patience.";
ApiError.ERROR_MESSAGE_MAP[1002] = "The username and password you submitted were not recognized. Try again, or register for free if you don't have an account.";
ApiError.ERROR_MESSAGE_MAP[1003] = "Sorry, but this account has been suspended.\n\nPlease contact listener support for help at pandora-support@pandora.com";
ApiError.ERROR_MESSAGE_MAP[1004] = "Sorry, you are not authorized to perform this action";
ApiError.ERROR_MESSAGE_MAP[1005] = "Station limit reached. You'll have to delete stations to continue.";
ApiError.ERROR_MESSAGE_MAP[1006] = "Sorry, but this station no longer exists.";
ApiError.ERROR_MESSAGE_MAP[1011] = "The email you entered is not valid.";
ApiError.ERROR_MESSAGE_MAP[1012] = "Your password must be greater than 5 characters in length.";
ApiError.ERROR_MESSAGE_MAP[1013] = "The email you entered is already in use.";
ApiError.ERROR_MESSAGE_MAP[1016] = "The email you entered is not valid.";
ApiError.ERROR_MESSAGE_MAP[1024] = "The zip code is not valid.";
ApiError.ERROR_MESSAGE_MAP[1025] = "The birth year is not valid.";
ApiError.ERROR_MESSAGE_MAP[1026] = "You must be over 12 years old.";
ApiError.ERROR_MESSAGE_MAP[1027] = "Please select a gender.";
ApiError.ERROR_MESSAGE_MAP[1029] = "The email you submitted was not recognized.";

ApiError.PLAYLIST_END = "There has been some trouble finding the perfect song to play next.  If you run out of music on this station, try switching to one of your other stations.";


