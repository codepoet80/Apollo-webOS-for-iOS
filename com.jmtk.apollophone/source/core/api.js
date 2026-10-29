function Api() {
    this.apiRequestId = 0;
    this.apiRequests = new Hash();
    this.sb = Blowfish.createFromKey(AppConstants.s);
    this.rb = Blowfish.createFromKey(AppConstants.r)
};

Api.prototype.checkLicensing = function (_1) {
    var _2 = new Hash();
    var _3 = this.getPartnerUrlParameters("test.checkLicensing");
    this.sendRequest(_2, _3, _1)
};

Api.prototype.partnerLogin = function (_4) {
    var _5 = new Hash();
    _5.set("username", AppConstants.a);
    _5.set("password", AppConstants.b);
    _5.set("version", "5");
    _5.set("deviceModel", AppGlobals.deviceModel);
    _5.set("includeUrls", true);
    var _6 = this.getPartnerUrlParameters("auth.partnerLogin");
    this.sendSecureRequest(_5, _6, _4)
};

Api.prototype.userLoginByDeviceId = function (_7) {
    var _8 = new Hash();
    _8.set("loginType", "deviceId");
    _8.set("deviceId", AppGlobals.deviceId);
    _8.set("partnerAuthToken", AppGlobals.partnerAuthToken);
    _8.set("syncTime", AppGlobals.getSyncTime());
    Util.log("device id: " + AppGlobals.deviceId);
    var _9 = this.getUserUrlParameters("auth.userLogin");
    this.sendSecureEncryptedRequest(_8, _9, _7)
};

Api.prototype.userLogin = function (_a, _b, _c) {
    var _d = new Hash();
    _d.set("loginType", "user");
    _d.set("username", _a);
    _d.set("password", _b);
    _d.set("partnerAuthToken", AppGlobals.partnerAuthToken);
    _d.set("syncTime", AppGlobals.getSyncTime());
    AppGlobals.clean();
    var _e = this.getUserUrlParameters("auth.userLogin");
    this.sendSecureEncryptedRequest(_d, _e, _c)
};

Api.prototype.createUser = function (_f, _10, _11, _12, _13, _14, _15) {
    var _16 = new Hash();
    _16.set("accountType", "registered");
    _16.set("countryCode", "US");
    _16.set("registeredType", "user");
    _16.set("username", _f);
    _16.set("password", _10);
    _16.set("birthYear", _11);
    _16.set("zipCode", _12);
    _16.set("gender", _13);
    _16.set("emailOptIn", _14);
    _16.set("partnerAuthToken", AppGlobals.partnerAuthToken);
    _16.set("syncTime", AppGlobals.getSyncTime());
    AppGlobals.clean();
    var _17 = this.getUserUrlParameters("user.createUser");
    this.sendSecureEncryptedRequest(_16, _17, _15)
};

Api.prototype.emailPassword = function (_18, _19) {
    var _1a = new Hash();
    _1a.set("username", _18);
    _1a.set("partnerAuthToken", AppGlobals.partnerAuthToken);
    _1a.set("syncTime", AppGlobals.getSyncTime());
    AppGlobals.clean();
    var _1b = this.getUserUrlParameters("user.emailPassword");
    this.sendSecureEncryptedRequest(_1a, _1b, _19)
};

Api.prototype.associateDevice = function (_1c) {
    var _1d = new Hash();
    _1d.set("deviceId", AppGlobals.deviceId);
    _1d.set("userAuthToken", AppGlobals.userAuthToken);
    _1d.set("syncTime", AppGlobals.getSyncTime());
    Util.log("device id: " + AppGlobals.deviceId);
    var _1e = this.getUrlParameters("user.associateDevice");
    this.sendSecureEncryptedRequest(_1d, _1e, _1c)
};

Api.prototype.disassociateDevice = function (_1f) {
	this.apiRequests = new Hash();
    var _20 = new Hash();
    _20.set("deviceId", AppGlobals.deviceId);
    _20.set("userAuthToken", AppGlobals.userAuthToken);
    _20.set("partnerAuthToken", AppGlobals.partnerAuthToken);
    _20.set("syncTime", AppGlobals.getSyncTime());
    var _21 = this.getUrlParameters("device.disassociateDevice");
    this.sendSecureEncryptedRequest(_20, _21, _1f)
};

Api.prototype.getStationListChecksum = function (_22) {
    var _23 = new Hash();
    _23.set("userAuthToken", AppGlobals.userAuthToken);
    _23.set("syncTime", AppGlobals.getSyncTime());
    var _24 = this.getUrlParameters("user.getStationListChecksum");
    this.sendEncryptedRequest(_23, _24, _22)
};

Api.prototype.getStationList = function (_25) {
    var _26 = new Hash();
    _26.set("userAuthToken", AppGlobals.userAuthToken);
    _26.set("syncTime", AppGlobals.getSyncTime());
    var _27 = this.getUrlParameters("user.getStationList");
    this.sendEncryptedRequest(_26, _27, _25)
};

Api.prototype.getPlaylist = function (_28, _29) {
    var _2a = new Hash();
    _2a.set("stationToken", _28);
    _2a.set("userAuthToken", AppGlobals.userAuthToken);
    _2a.set("syncTime", AppGlobals.getSyncTime());
    var _2b = this.getUrlParameters("station.getPlaylist");
    this.sendSecureEncryptedRequest(_2a, _2b, _29)
};

Api.prototype.getAdMetadata = function (_2c, _2d) {
    var _2e = new Hash();
    _2e.set("adToken", _2c);
    _2e.set("userAuthToken", AppGlobals.userAuthToken);
    _2e.set("syncTime", AppGlobals.getSyncTime());
    var _2f = this.getUrlParameters("ad.getAdMetadata");
    this.sendEncryptedRequest(_2e, _2f, _2d)
};

Api.prototype.addFeedback = function (_30, _31, _32) {
    var _33 = new Hash();
    _33.set("trackToken", _30);
    _33.set("isPositive", _31);
    _33.set("userAuthToken", AppGlobals.userAuthToken);
    _33.set("syncTime", AppGlobals.getSyncTime());
    var _34 = this.getUrlParameters("station.addFeedback");
    this.sendEncryptedRequest(_33, _34, _32)
};

Api.prototype.addArtistBookmark = function (_35, _36) {
    var _37 = new Hash();
    _37.set("trackToken", _35);
    _37.set("userAuthToken", AppGlobals.userAuthToken);
    _37.set("syncTime", AppGlobals.getSyncTime());
    var _38 = this.getUrlParameters("bookmark.addArtistBookmark");
    this.sendEncryptedRequest(_37, _38, _36)
};

Api.prototype.addSongBookmark = function (_39, _3a) {
    var _3b = new Hash();
    _3b.set("trackToken", _39);
    _3b.set("userAuthToken", AppGlobals.userAuthToken);
    _3b.set("syncTime", AppGlobals.getSyncTime());
    var _3c = this.getUrlParameters("bookmark.addSongBookmark");
    this.sendEncryptedRequest(_3b, _3c, _3a)
};

/***************
 * New methods *
 ***************/
Api.prototype.getSongBookmarks = function( delegate ) {
	var data = new Hash();
	data.set("userAuthToken", AppGlobals.userAuthToken);
	data.set("syncTime", AppGlobals.getSyncTime());
	var params = this.getUrlParameters("user.getSongBookmarks");
	this.sendEncryptedRequest( data, params, delegate );
};

Api.prototype.getArtistBookmarks = function( delegate ) {
	var data = new Hash();
	data.set("userAuthToken", AppGlobals.userAuthToken);
	data.set("syncTime", AppGlobals.getSyncTime());
	var params = this.getUrlParameters("user.getArtistBookmarks");
	this.sendEncryptedRequest( data, params, delegate );
};

Api.prototype.deleteSongBookmark = function( bookmarkToken, delegate ) {
	var data = new Hash();
	data.set("bookmarkToken", bookmarkToken);
	data.set("userAuthToken", AppGlobals.userAuthToken);
	data.set("syncTime", AppGlobals.getSyncTime());
	var params = this.getUrlParameters("bookmark.deleteSongBookmark");
	this.sendEncryptedRequest( data, params, delegate );
};

Api.prototype.deleteArtistBookmark = function( bookmarkToken, delegate ) {
	var data = new Hash();
	data.set("bookmarkToken", bookmarkToken);
	data.set("userAuthToken", AppGlobals.userAuthToken);
	data.set("syncTime", AppGlobals.getSyncTime());
	var params = this.getUrlParameters("bookmark.deleteArtistBookmark");
	this.sendEncryptedRequest( data, params, delegate );
};

// Broken
Api.prototype.renameStation = function( stationToken, name, delegate ) {
	var data = new Hash();
	data.set("stationToken", stationToken);
	data.set("stationName", name);
	data.set("userAuthToken", AppGlobals.userAuthToken);
	data.set("syncTime", AppGlobals.getSyncTime());
	var params = this.getUrlParameters("station.setStationName");
	this.sendEncryptedRequest( data, params, new BaseDelegate() );
};

// Broken
Api.prototype.addSeed = function( stationId, musicToken, delegate ) {
	var data = new Hash();
	data.set("stationID", stationId);
	data.set("userAuthToken", AppGlobals.userAuthToken);
	data.set("syncTime", AppGlobals.getSyncTime());
	var params = this.getUrlParameters("station.addSeed");
	this.sendEncryptedRequest( data, params, delegate );
};

// Broken
Api.prototype.getSeedSuggestions = function( stationToken, delegate ) {
	var data = new Hash();
	data.set("stationToken", stationToken);
	data.set("userAuthToken", AppGlobals.userAuthToken);
	data.set("syncTime", AppGlobals.getSyncTime());
	var params = this.getUrlParameters("music.getSeedSuggestions");
	this.sendEncryptedRequest( data, params, new BaseDelegate() );
};

// end new methods
Api.prototype.musicSearch = function (_3d, _3e) {
    var _3f = new Hash();
    _3f.set("searchText", _3d);
    _3f.set("userAuthToken", AppGlobals.userAuthToken);
    _3f.set("syncTime", AppGlobals.getSyncTime());
    var _40 = this.getUrlParameters("music.search");
    this.sendEncryptedRequest(_3f, _40, _3e)
};

Api.prototype.createStation = function (_41, _42) {
    var _43 = new Hash();
    _43.set("musicToken", _41);
    _43.set("userAuthToken", AppGlobals.userAuthToken);
    _43.set("syncTime", AppGlobals.getSyncTime());
    var _44 = this.getUrlParameters("station.createStation");
    this.sendEncryptedRequest(_43, _44, _42)
};

Api.prototype.deleteStation = function (_45, _46) {
    var _47 = new Hash();
    _47.set("stationToken", _45);
    _47.set("userAuthToken", AppGlobals.userAuthToken);
    _47.set("syncTime", AppGlobals.getSyncTime());
    var _48 = this.getUrlParameters("station.deleteStation");
    this.sendEncryptedRequest(_47, _48, _46)
};

Api.prototype.sleepSong = function (_49, _4a) {
    var _4b = new Hash();
    _4b.set("trackToken", _49);
    _4b.set("userAuthToken", AppGlobals.userAuthToken);
    _4b.set("syncTime", AppGlobals.getSyncTime());
    var _4c = this.getUrlParameters("user.sleepSong");
    this.sendEncryptedRequest(_4b, _4c, _4a)
};

Api.prototype.explainTrack = function (_4d, _4e) {
    var _4f = new Hash();
    _4f.set("trackToken", _4d);
    _4f.set("userAuthToken", AppGlobals.userAuthToken);
    _4f.set("syncTime", AppGlobals.getSyncTime());
    var _50 = this.getUrlParameters("track.explainTrack");
    this.sendEncryptedRequest(_4f, _50, _4e)
};

Api.prototype.shareStation = function (_51, _52, _53) {
    var _54 = new Hash();
    _54.set("stationId", _51);
    _54.set("stationToken", _51);
    _54.set("emails", [_52]);
    _54.set("userAuthToken", AppGlobals.userAuthToken);
    _54.set("syncTime", AppGlobals.getSyncTime());
    var _55 = this.getUrlParameters("station.shareStation");
    this.sendEncryptedRequest(_54, _55, _53)
};

Api.prototype.addRequest = function (_56, _57) {
    this.apiRequests.set(_56, _57)
};

Api.prototype.removeRequest = function (_58) {
    this.apiRequests.unset(_58)
};

Api.prototype.getRequest = function (_59) {
    return this.apiRequests.get(_59)
};

Api.prototype.sendRequest = function (_5a, _5b, _5c) {
    this.storeAndForwardRequest(false, false, _5a, _5b, _5c)
};

Api.prototype.sendEncryptedRequest = function (_5d, _5e, _5f) {
    this.storeAndForwardRequest(false, true, _5d, _5e, _5f)
};

Api.prototype.sendSecureRequest = function (_60, _61, _62) {
    this.storeAndForwardRequest(true, false, _60, _61, _62)
};

Api.prototype.sendSecureEncryptedRequest = function (_63, _64, _65) {
    this.storeAndForwardRequest(true, true, _63, _64, _65)
};

Api.prototype.resendRequest = function (_66) {
    var _67 = this.getRequest(_66);
    Util.log(_67);
    if (_67 != null) {
        var _68 = _67.get("urlParams");
        if (_68.get("method") == "auth.userLogin") {
            _68.set("auth_token", AppGlobals.partnerAuthToken)
        } else {
            if (_68.get("auth_token") != null) {
                _68.set("auth_token", AppGlobals.userAuthToken)
            }
        }
        var _69 = _67.get("params");
        if (_69.get("partnerAuthToken") != null) {
            _69.set("partnerAuthToken", AppGlobals.partnerAuthToken)
        }
        if (_69.get("userAuthToken") != null) {
            _69.set("userAuthToken", AppGlobals.userAuthToken)
        }
        this.privateSendRequest(_67)
    }
};

Api.prototype.storeAndForwardRequest = function (_6a, _6b, _6c, _6d, _6e) {
    var _6f = new Hash();
    var _70 = this.apiRequestId++;
    _6f.set("isSecure", _6a);
    _6f.set("isEncrypted", _6b);
    _6f.set("params", _6c);
    _6f.set("urlParams", _6d);
    _6f.set("onSuccessDelegate", _6e.doOnSuccess.bind(_6e));
    _6f.set("onErrorDelegate", _6e.doOnError.bind(_6e));
    _6e.setRequestId(_70);
    this.addRequest(_70, _6f);
    this.privateSendRequest(_6f)
};

Api.prototype.privateSendRequest = function (_71) {
    var _72 = _71.get("isSecure");
    var _73 = _71.get("isEncrypted");
    var _74 = _71.get("params");
    var _75 = _71.get("urlParams");
    var _76 = _71.get("onSuccessDelegate");
    var _77 = _71.get("onErrorDelegate");
    var url = _72 ? this.buildUrl(true, _75) : this.buildUrl(false, _75);
    var _78 = Object.toJSON(_74);
    if (_73) {
        _78 = this.rb.encrypt(_78)
    }
    this.doAjaxRequest(url, _78, _76, _77);
    Util.log("api: " + _75.get("method"))
};

Api.prototype.getServerSyncTime = function (_79) {
    return this.sb.decryptSyncTime(_79.syncTime)
};

Api.prototype.doAjaxRequest = function (url, _7a, _7b, _7c) {
    var _7d = new Ajax.Request(url, {
        method: "post",
        contentType: "text/plain",
        postBody: _7a,
        onSuccess: _7b,
        onError: _7c
    })
};

Api.prototype.buildUrl = function (_7e, _7f) {
    var url = _7e ? AppConstants.httpsUrl : AppConstants.httpUrl;
    url += "?";
    url += _7f.toQueryString();
    return url
};

Api.prototype.getPartnerUrlParameters = function (_80) {
    var _81 = new Hash();
    _81.set("method", _80);
    return _81
};

Api.prototype.getUserUrlParameters = function (_82) {
    var _83 = this.getPartnerUrlParameters(_82);
    _83.set("auth_token", AppGlobals.partnerAuthToken);
    _83.set("partner_id", AppGlobals.partnerId);
    return _83
};

Api.prototype.getUrlParameters = function (_84) {
    var _85 = this.getPartnerUrlParameters(_84);
    _85.set("auth_token", AppGlobals.userAuthToken);
    _85.set("partner_id", AppGlobals.partnerId);
    _85.set("user_id", AppGlobals.partnerId);
    return _85
};

Api.prototype.updateDeviceDisassociateDevice = function (_86, _87) {
    var _88 = new Hash();
    _88.set("deviceId", _86);
    _88.set("userAuthToken", AppGlobals.userAuthToken);
    _88.set("partnerAuthToken", AppGlobals.partnerAuthToken);
    _88.set("syncTime", AppGlobals.getSyncTime());
    Util.log("dissassociated device id: " + _86);
    var _89 = this.getUrlParameters("device.disassociateDevice");
    this.sendSecureEncryptedRequest(_88, _89, _87)
};

var UNI_REPLACEMENT_CHAR = 65533;
var UNI_MAX_BMP = 65535;
var UNI_MAX_UTF16 = 1114111;
var UNI_MAX_UTF32 = 2147483647;
var UNI_MAX_LEGAL_UTF32 = 1114111;
var halfShift = 10;
var halfBase = 65536;
var halfMask = 1023;
var UNI_SUR_HIGH_START = 55296;
var UNI_SUR_HIGH_END = 56319;
var UNI_SUR_LOW_START = 56320;
var UNI_SUR_LOW_END = 57343;
var firstByteMark = [0, 0, 192, 224, 240, 248, 252];
var trailingBytesForUTF8 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5];
var offsetsFromUTF8 = [0, 12416, 925824, 63447168, 4194836608, 2181570688];

function Blowfish(_1) {
    if (_1 != null) {
        this.P = _1[0];
        this.S0 = _1[1];
        this.S1 = _1[2];
        this.S2 = _1[3];
        this.S3 = _1[4]
    }
    this.N = 16
};

Blowfish.createFromKey = function (_2) {
    var _3 = new Blowfish();
    _3.P = new Array(608135816, 2242054355, 320440878, 57701188, 2752067618, 698298832, 137296536, 3964562569, 1160258022, 953160567, 3193202383, 887688300, 3232508343, 3380367581, 1065670069, 3041331479, 2450970073, 2306472731);
    _3.S0 = new Array(3509652390, 2564797868, 805139163, 3491422135, 3101798381, 1780907670, 3128725573, 4046225305, 614570311, 3012652279, 134345442, 2240740374, 1667834072, 1901547113, 2757295779, 4103290238, 227898511, 1921955416, 1904987480, 2182433518, 2069144605, 3260701109, 2620446009, 720527379, 3318853667, 677414384, 3393288472, 3101374703, 2390351024, 1614419982, 1822297739, 2954791486, 3608508353, 3174124327, 2024746970, 1432378464, 3864339955, 2857741204, 1464375394, 1676153920, 1439316330, 715854006, 3033291828, 289532110, 2706671279, 2087905683, 3018724369, 1668267050, 732546397, 1947742710, 3462151702, 2609353502, 2950085171, 1814351708, 2050118529, 680887927, 999245976, 1800124847, 3300911131, 1713906067, 1641548236, 4213287313, 1216130144, 1575780402, 4018429277, 3917837745, 3693486850, 3949271944, 596196993, 3549867205, 258830323, 2213823033, 772490370, 2760122372, 1774776394, 2652871518, 566650946, 4142492826, 1728879713, 2882767088, 1783734482, 3629395816, 2517608232, 2874225571, 1861159788, 326777828, 3124490320, 2130389656, 2716951837, 967770486, 1724537150, 2185432712, 2364442137, 1164943284, 2105845187, 998989502, 3765401048, 2244026483, 1075463327, 1455516326, 1322494562, 910128902, 469688178, 1117454909, 936433444, 3490320968, 3675253459, 1240580251, 122909385, 2157517691, 634681816, 4142456567, 3825094682, 3061402683, 2540495037, 79693498, 3249098678, 1084186820, 1583128258, 426386531, 1761308591, 1047286709, 322548459, 995290223, 1845252383, 2603652396, 3431023940, 2942221577, 3202600964, 3727903485, 1712269319, 422464435, 3234572375, 1170764815, 3523960633, 3117677531, 1434042557, 442511882, 3600875718, 1076654713, 1738483198, 4213154764, 2393238008, 3677496056, 1014306527, 4251020053, 793779912, 2902807211, 842905082, 4246964064, 1395751752, 1040244610, 2656851899, 3396308128, 445077038, 3742853595, 3577915638, 679411651, 2892444358, 2354009459, 1767581616, 3150600392, 3791627101, 3102740896, 284835224, 4246832056, 1258075500, 768725851, 2589189241, 3069724005, 3532540348, 1274779536, 3789419226, 2764799539, 1660621633, 3471099624, 4011903706, 913787905, 3497959166, 737222580, 2514213453, 2928710040, 3937242737, 1804850592, 3499020752, 2949064160, 2386320175, 2390070455, 2415321851, 4061277028, 2290661394, 2416832540, 1336762016, 1754252060, 3520065937, 3014181293, 791618072, 3188594551, 3933548030, 2332172193, 3852520463, 3043980520, 413987798, 3465142937, 3030929376, 4245938359, 2093235073, 3534596313, 375366246, 2157278981, 2479649556, 555357303, 3870105701, 2008414854, 3344188149, 4221384143, 3956125452, 2067696032, 3594591187, 2921233993, 2428461, 544322398, 577241275, 1471733935, 610547355, 4027169054, 1432588573, 1507829418, 2025931657, 3646575487, 545086370, 48609733, 2200306550, 1653985193, 298326376, 1316178497, 3007786442, 2064951626, 458293330, 2589141269, 3591329599, 3164325604, 727753846, 2179363840, 146436021, 1461446943, 4069977195, 705550613, 3059967265, 3887724982, 4281599278, 3313849956, 1404054877, 2845806497, 146425753, 1854211946);
    _3.S1 = new Array(1266315497, 3048417604, 3681880366, 3289982499, 2909710000, 1235738493, 2632868024, 2414719590, 3970600049, 1771706367, 1449415276, 3266420449, 422970021, 1963543593, 2690192192, 3826793022, 1062508698, 1531092325, 1804592342, 2583117782, 2714934279, 4024971509, 1294809318, 4028980673, 1289560198, 2221992742, 1669523910, 35572830, 157838143, 1052438473, 1016535060, 1802137761, 1753167236, 1386275462, 3080475397, 2857371447, 1040679964, 2145300060, 2390574316, 1461121720, 2956646967, 4031777805, 4028374788, 33600511, 2920084762, 1018524850, 629373528, 3691585981, 3515945977, 2091462646, 2486323059, 586499841, 988145025, 935516892, 3367335476, 2599673255, 2839830854, 265290510, 3972581182, 2759138881, 3795373465, 1005194799, 847297441, 406762289, 1314163512, 1332590856, 1866599683, 4127851711, 750260880, 613907577, 1450815602, 3165620655, 3734664991, 3650291728, 3012275730, 3704569646, 1427272223, 778793252, 1343938022, 2676280711, 2052605720, 1946737175, 3164576444, 3914038668, 3967478842, 3682934266, 1661551462, 3294938066, 4011595847, 840292616, 3712170807, 616741398, 312560963, 711312465, 1351876610, 322626781, 1910503582, 271666773, 2175563734, 1594956187, 70604529, 3617834859, 1007753275, 1495573769, 4069517037, 2549218298, 2663038764, 504708206, 2263041392, 3941167025, 2249088522, 1514023603, 1998579484, 1312622330, 694541497, 2582060303, 2151582166, 1382467621, 776784248, 2618340202, 3323268794, 2497899128, 2784771155, 503983604, 4076293799, 907881277, 423175695, 432175456, 1378068232, 4145222326, 3954048622, 3938656102, 3820766613, 2793130115, 2977904593, 26017576, 3274890735, 3194772133, 1700274565, 1756076034, 4006520079, 3677328699, 720338349, 1533947780, 354530856, 688349552, 3973924725, 1637815568, 332179504, 3949051286, 53804574, 2852348879, 3044236432, 1282449977, 3583942155, 3416972820, 4006381244, 1617046695, 2628476075, 3002303598, 1686838959, 431878346, 2686675385, 1700445008, 1080580658, 1009431731, 832498133, 3223435511, 2605976345, 2271191193, 2516031870, 1648197032, 4164389018, 2548247927, 300782431, 375919233, 238389289, 3353747414, 2531188641, 2019080857, 1475708069, 455242339, 2609103871, 448939670, 3451063019, 1395535956, 2413381860, 1841049896, 1491858159, 885456874, 4264095073, 4001119347, 1565136089, 3898914787, 1108368660, 540939232, 1173283510, 2745871338, 3681308437, 4207628240, 3343053890, 4016749493, 1699691293, 1103962373, 3625875870, 2256883143, 3830138730, 1031889488, 3479347698, 1535977030, 4236805024, 3251091107, 2132092099, 1774941330, 1199868427, 1452454533, 157007616, 2904115357, 342012276, 595725824, 1480756522, 206960106, 497939518, 591360097, 863170706, 2375253569, 3596610801, 1814182875, 2094937945, 3421402208, 1082520231, 3463918190, 2785509508, 435703966, 3908032597, 1641649973, 2842273706, 3305899714, 1510255612, 2148256476, 2655287854, 3276092548, 4258621189, 236887753, 3681803219, 274041037, 1734335097, 3815195456, 3317970021, 1899903192, 1026095262, 4050517792, 356393447, 2410691914, 3873677099, 3682840055);
    _3.S2 = new Array(3913112168, 2491498743, 4132185628, 2489919796, 1091903735, 1979897079, 3170134830, 3567386728, 3557303409, 857797738, 1136121015, 1342202287, 507115054, 2535736646, 337727348, 3213592640, 1301675037, 2528481711, 1895095763, 1721773893, 3216771564, 62756741, 2142006736, 835421444, 2531993523, 1442658625, 3659876326, 2882144922, 676362277, 1392781812, 170690266, 3921047035, 1759253602, 3611846912, 1745797284, 664899054, 1329594018, 3901205900, 3045908486, 2062866102, 2865634940, 3543621612, 3464012697, 1080764994, 553557557, 3656615353, 3996768171, 991055499, 499776247, 1265440854, 648242737, 3940784050, 980351604, 3713745714, 1749149687, 3396870395, 4211799374, 3640570775, 1161844396, 3125318951, 1431517754, 545492359, 4268468663, 3499529547, 1437099964, 2702547544, 3433638243, 2581715763, 2787789398, 1060185593, 1593081372, 2418618748, 4260947970, 69676912, 2159744348, 86519011, 2512459080, 3838209314, 1220612927, 3339683548, 133810670, 1090789135, 1078426020, 1569222167, 845107691, 3583754449, 4072456591, 1091646820, 628848692, 1613405280, 3757631651, 526609435, 236106946, 48312990, 2942717905, 3402727701, 1797494240, 859738849, 992217954, 4005476642, 2243076622, 3870952857, 3732016268, 765654824, 3490871365, 2511836413, 1685915746, 3888969200, 1414112111, 2273134842, 3281911079, 4080962846, 172450625, 2569994100, 980381355, 4109958455, 2819808352, 2716589560, 2568741196, 3681446669, 3329971472, 1835478071, 660984891, 3704678404, 4045999559, 3422617507, 3040415634, 1762651403, 1719377915, 3470491036, 2693910283, 3642056355, 3138596744, 1364962596, 2073328063, 1983633131, 926494387, 3423689081, 2150032023, 4096667949, 1749200295, 3328846651, 309677260, 2016342300, 1779581495, 3079819751, 111262694, 1274766160, 443224088, 298511866, 1025883608, 3806446537, 1145181785, 168956806, 3641502830, 3584813610, 1689216846, 3666258015, 3200248200, 1692713982, 2646376535, 4042768518, 1618508792, 1610833997, 3523052358, 4130873264, 2001055236, 3610705100, 2202168115, 4028541809, 2961195399, 1006657119, 2006996926, 3186142756, 1430667929, 3210227297, 1314452623, 4074634658, 4101304120, 2273951170, 1399257539, 3367210612, 3027628629, 1190975929, 2062231137, 2333990788, 2221543033, 2438960610, 1181637006, 548689776, 2362791313, 3372408396, 3104550113, 3145860560, 296247880, 1970579870, 3078560182, 3769228297, 1714227617, 3291629107, 3898220290, 166772364, 1251581989, 493813264, 448347421, 195405023, 2709975567, 677966185, 3703036547, 1463355134, 2715995803, 1338867538, 1343315457, 2802222074, 2684532164, 233230375, 2599980071, 2000651841, 3277868038, 1638401717, 4028070440, 3237316320, 6314154, 819756386, 300326615, 590932579, 1405279636, 3267499572, 3150704214, 2428286686, 3959192993, 3461946742, 1862657033, 1266418056, 963775037, 2089974820, 2263052895, 1917689273, 448879540, 3550394620, 3981727096, 150775221, 3627908307, 1303187396, 508620638, 2975983352, 2726630617, 1817252668, 1876281319, 1457606340, 908771278, 3720792119, 3617206836, 2455994898, 1729034894, 1080033504);
    _3.S3 = new Array(976866871, 3556439503, 2881648439, 1522871579, 1555064734, 1336096578, 3548522304, 2579274686, 3574697629, 3205460757, 3593280638, 3338716283, 3079412587, 564236357, 2993598910, 1781952180, 1464380207, 3163844217, 3332601554, 1699332808, 1393555694, 1183702653, 3581086237, 1288719814, 691649499, 2847557200, 2895455976, 3193889540, 2717570544, 1781354906, 1676643554, 2592534050, 3230253752, 1126444790, 2770207658, 2633158820, 2210423226, 2615765581, 2414155088, 3127139286, 673620729, 2805611233, 1269405062, 4015350505, 3341807571, 4149409754, 1057255273, 2012875353, 2162469141, 2276492801, 2601117357, 993977747, 3918593370, 2654263191, 753973209, 36408145, 2530585658, 25011837, 3520020182, 2088578344, 530523599, 2918365339, 1524020338, 1518925132, 3760827505, 3759777254, 1202760957, 3985898139, 3906192525, 674977740, 4174734889, 2031300136, 2019492241, 3983892565, 4153806404, 3822280332, 352677332, 2297720250, 60907813, 90501309, 3286998549, 1016092578, 2535922412, 2839152426, 457141659, 509813237, 4120667899, 652014361, 1966332200, 2975202805, 55981186, 2327461051, 676427537, 3255491064, 2882294119, 3433927263, 1307055953, 942726286, 933058658, 2468411793, 3933900994, 4215176142, 1361170020, 2001714738, 2830558078, 3274259782, 1222529897, 1679025792, 2729314320, 3714953764, 1770335741, 151462246, 3013232138, 1682292957, 1483529935, 471910574, 1539241949, 458788160, 3436315007, 1807016891, 3718408830, 978976581, 1043663428, 3165965781, 1927990952, 4200891579, 2372276910, 3208408903, 3533431907, 1412390302, 2931980059, 4132332400, 1947078029, 3881505623, 4168226417, 2941484381, 1077988104, 1320477388, 886195818, 18198404, 3786409000, 2509781533, 112762804, 3463356488, 1866414978, 891333506, 18488651, 661792760, 1628790961, 3885187036, 3141171499, 876946877, 2693282273, 1372485963, 791857591, 2686433993, 3759982718, 3167212022, 3472953795, 2716379847, 445679433, 3561995674, 3504004811, 3574258232, 54117162, 3331405415, 2381918588, 3769707343, 4154350007, 1140177722, 4074052095, 668550556, 3214352940, 367459370, 261225585, 2610173221, 4209349473, 3468074219, 3265815641, 314222801, 3066103646, 3808782860, 282218597, 3406013506, 3773591054, 379116347, 1285071038, 846784868, 2669647154, 3771962079, 3550491691, 2305946142, 453669953, 1268987020, 3317592352, 3279303384, 3744833421, 2610507566, 3859509063, 266596637, 3847019092, 517658769, 3462560207, 3443424879, 370717030, 4247526661, 2224018117, 4143653529, 4112773975, 2788324899, 2477274417, 1456262402, 2901442914, 1517677493, 1846949527, 2295493580, 3734397586, 2176403920, 1280348187, 1908823572, 3871786941, 846861322, 1172426758, 3287448474, 3383383037, 1655181056, 3139813346, 901632758, 1897031941, 2986607138, 3066810236, 3447102507, 1393639104, 373351379, 950779232, 625454576, 3124240540, 4148612726, 2007998917, 544563296, 2244738638, 2330496472, 2058025392, 1291430526, 424198748, 50039436, 29584100, 3605783033, 2429876329, 2791104160, 1057563949, 3255363231, 3075367218, 3463963227, 1469046755, 985887462);
    var i = 0;
    var j = 0;
    var _4 = 0;
    var _5 = "";
    var _6 = _3.codes2bytes(_3.str2codes(_2));
    var j = 0;
    for (var i = 0; i < _3.N + 2; ++i) {
        var _4 = 0;
        for (var k = 0; k < 4; ++k) {
            _4 = (_4 << 8) | _6[j];
            j = j + 1;
            if (j >= _6.length) {
                j = 0
            }
        }
        _3.P[i] ^= _4
    }
    var _7 = [0, 0];
    for (var i = 0; i < _3.N + 2; i += 2) {
        _3.encipher(_7, 0);
        _3.P[i] = _7[0];
        _3.P[i + 1] = _7[1]
    }
    for (var i = 0; i < 4; i++) {
        var S = _3["S" + i];
        for (j = 0; j < 256; j += 2) {
            _3.encipher(_7, 0);
            S[j] = _7[0];
            S[j + 1] = _7[1]
        }
    }
    return _3
};

Blowfish.prototype.keysToString = function () {
    var a = [this.P.join(), this.S0.join(), this.S1.join(), this.S2.join(), this.S3.join()];
    return "[[" + a.join("],[") + "]]"
};

Blowfish.prototype.encrypt = function (_8) {
    var _9 = this.str2codes(_8);
    var _a = this.codes2bytes(_9);
    return this.encryptBytes(_a)
};

Blowfish.prototype.encryptBytes = function (_b) {
    var _c = this.bytes2ints(_b);
    for (var i = 0; i < _c.length; i += 2) {
        this.encipher(_c, i)
    }
    var _b = this.ints2bytes(_c);
    var _d = this.bytes2hex(_b);
    return _d
};

Blowfish.prototype.decryptSyncTime = function (_e) {
    var _f = this.decryptBytes(_e);
    _f = _f.slice(4, _f.length);
    var _10 = this.bytes2codes(_f);
    var str = this.codes2str(_10);
    return str
};

Blowfish.prototype.decrypt = function (_11) {
    var _12 = this.decryptBytes(_11);
    var _13 = this.bytes2codes(_12);
    var str = this.codes2str(_13);
    return str
};

Blowfish.prototype.decryptBytes = function (_14) {
    var _15 = this.hex2bytes(_14);
    var _16 = this.bytes2ints(_15);
    for (var i = 0; i < _16.length; i += 2) {
        this.decipher(_16, i)
    }
    return this.ints2bytes(_16)
};

Blowfish.prototype.encipher = function (_17, _18) {
    var Xl = _17[_18];
    var Xr = _17[_18 + 1];
    var _19;
    var i;
    for (i = 0; i < this.N; ++i) {
        Xl = Xl ^ this.P[i];
        var x = Xl;
        var a, b, c, d;
        var y;
        d = x & 255;
        x >>= 8;
        c = x & 255;
        x >>= 8;
        b = x & 255;
        x >>= 8;
        a = x & 255;
        y = this.S0[a] + this.S1[b];
        y = y ^ this.S2[c];
        y = y + this.S3[d];
        Xr ^= y;
        _19 = Xl;
        Xl = Xr;
        Xr = _19
    }
    _19 = Xl;
    Xl = Xr;
    Xr = _19;
    Xr = Xr ^ this.P[this.N];
    Xl = Xl ^ this.P[this.N + 1];
    _17[_18] = Xl;
    _17[_18 + 1] = Xr
};

Blowfish.prototype.decipher = function (_1a, _1b) {
    var Xl = _1a[_1b];
    var Xr = _1a[_1b + 1];
    var _1c;
    var i;
    for (i = this.N + 1; i > 1; --i) {
        Xl = Xl ^ this.P[i];
        var x = Xl;
        var a, b, c, d;
        var y;
        d = x & 255;
        x >>= 8;
        c = x & 255;
        x >>= 8;
        b = x & 255;
        x >>= 8;
        a = x & 255;
        y = this.S0[a] + this.S1[b];
        y = y ^ this.S2[c];
        y = y + this.S3[d];
        Xr ^= y;
        _1c = Xl;
        Xl = Xr;
        Xr = _1c
    }
    _1c = Xl;
    Xl = Xr;
    Xr = _1c;
    Xr = Xr ^ this.P[1];
    Xl = Xl ^ this.P[0];
    _1a[_1b] = Xl;
    _1a[_1b + 1] = Xr
};

Blowfish.prototype.str2codes = function (str) {
    var _1d = [];
    for (var i = 0; i < str.length; i++) {
        _1d.push(str.charCodeAt(i))
    }
    return _1d
};

Blowfish.prototype.codes2str = function (_1e) {
    var _1f = [];
    for (var i = 0; i < _1e.length; i++) {
        _1f.push(String.fromCharCode(_1e[i]))
    }
    return _1f.join("")
};

Blowfish.prototype.codes2bytes = function (_20) {
    var _21 = [];
    byteMask = 191;
    byteMark = 128;
    var i = 0;
    while (i < _20.length) {
        var ch = _20[i];
        i++;
        if (ch >= UNI_SUR_HIGH_START && ch <= UNI_SUR_HIGH_END) {
            if (i == _20.length) {
                return _21
            }
            var ch2 = _20[i];
            if (ch2 < UNI_SUR_LOW_START || ch > UNI_SUR_LOW_END) {
                ch = ((ch - UNI_SUR_HIGH_START) << halfShift) + (ch2 - UNI_SUR_LOW_START) + halfBase
            }
            i++
        } else {
            if (ch >= UNI_SUR_LOW_START && ch <= UNI_SUR_LOW_END) {}
        }
        var _22 = 0;
        if (ch < 128) {
            _22 = 1
        } else {
            if (ch < 2048) {
                _22 = 2
            } else {
                if (ch < 65536) {
                    _22 = 3
                } else {
                    if (ch < 1114112) {
                        _22 = 4
                    } else {
                        _22 = 3;
                        ch = UNI_REPLACEMENT_CHAR
                    }
                }
            }
        }
        if (firstByteMark[_22] == null) {
            return _21
        }
        var _23 = _21.length;
        switch (_22) {
        case 4:
            _21[_23 + 3] = ((ch | byteMark) & byteMask);
            ch >>= 6;
        case 3:
            _21[_23 + 2] = ((ch | byteMark) & byteMask);
            ch >>= 6;
        case 2:
            _21[_23 + 1] = ((ch | byteMark) & byteMask);
            ch >>= 6;
        case 1:
            _21[_23] = (ch | firstByteMark[_22])
        }
    }
    return _21
};

Blowfish.prototype.bytes2codes = function (_24) {
    var _25 = [];
    var i = 0;
    while (i < _24.length) {
        var ch = 0;
        var _26 = trailingBytesForUTF8[_24[i]];
        if (i + _26 > _24.length) {
            return _25
        }
        if (!this.isLegalUTF8(_24.slice(i, i + _26 + 1))) {
            return _25
        }
        switch (_26) {
        case 5:
            ch += _24[i];
            i++;
            ch <<= 6;
        case 4:
            ch += _24[i];
            i++;
            ch <<= 6;
        case 3:
            ch += _24[i];
            i++;
            ch <<= 6;
        case 2:
            ch += _24[i];
            i++;
            ch <<= 6;
        case 1:
            ch += _24[i];
            i++;
            ch <<= 6;
        case 0:
            ch += _24[i];
            i++
        }
        ch -= offsetsFromUTF8[_26];
        if (ch <= UNI_MAX_BMP) {
            if (ch >= UNI_SUR_HIGH_START && ch <= UNI_SUR_LOW_END) {
                _25.push(UNI_REPLACEMENT_CHAR)
            } else {
                _25.push(ch)
            }
        } else {
            if (ch > UNI_MAX_UTF16) {
                _25.push(UNI_REPLACEMENT_CHAR)
            } else {
                ch -= halfBase;
                _25.push(((ch >> halfShift) + UNI_SUR_HIGH_START));
                _25.push(((ch & halfMask) + UNI_SUR_LOW_START))
            }
        }
    }
    while (_25[_25.length - 1] <= 8) {
        _25.pop()
    }
    return _25
};

Blowfish.prototype.isLegalUTF8 = function (_27) {
    var a;
    switch (_27.length) {
    default:
        return false;
    case 4:
        if ((a = _27[3]) < 128 || a > 191) {
            return false
        }
    case 3:
        if ((a = _27[2]) < 128 || a > 191) {
            return false
        }
    case 2:
        if ((a = _27[1]) > 191) {
            return false
        }
        switch (_27[0]) {
        case 224:
            if (a < 160) {
                return false
            }
            break;
        case 237:
            if (a > 159) {
                return false
            }
            break;
        case 240:
            if (a < 144) {
                return false
            }
            break;
        case 244:
            if (a > 143) {
                return false
            }
            break;
        default:
            if (a < 128) {
                return false
            }
        }
    case 1:
        if (_27[0] >= 128 && _27[0] < 194) {
            return false
        }
    }
    if (_27[0] > 244) {
        return false
    }
    return true
};

Blowfish.prototype.bytes2ints = function (_28) {
    var _29 = [];
    var _2a = _28.length;
    var _2b = _2a % 4 == 0 ? _2a : _2a - (_2a % 4);
    var i;
    for (i = 0; i < _2b; i += 4) {
        _29[_29.length] = (_28[i] << 24) | (_28[i + 1] << 16) | (_28[i + 2] << 8) | (_28[i + 3])
    }
    if (i < _2a) {
        var num = 0;
        for (var j = 0; j < 4; j++) {
            if (i + j < _2a) {
                num |= _28[i + j] << ((3 - j) * 8)
            }
        }
        _29[_29.length] = num
    }
    return _29
};

Blowfish.prototype.ints2bytes = function (_2c) {
    var _2d = [];
    var _2e = 0;
    for (var i = 0; i < _2c.length; i++) {
        var num = _2c[i];
        _2d[_2e] = (num >> 24) & 255;
        _2e++;
        _2d[_2e] = (num >> 16) & 255;
        _2e++;
        _2d[_2e] = (num >> 8) & 255;
        _2e++;
        _2d[_2e] = (num) & 255;
        _2e++
    }
    return _2d
};

Blowfish.prototype.bytes2hex = function (_2f) {
    var str = "";
    for (var i = 0; i < _2f.length; i++) {
        var hex = _2f[i].toString(16);
        if (hex.length == 1) {
            str += "0" + hex
        } else {
            str += hex
        }
    }
    return str
};

Blowfish.prototype.hex2bytes = function (hex) {
    var _30 = [];
    for (var i = 0; i < hex.length; i += 2) {
        _30.push(parseInt(hex.substr(i, 2), 16))
    }
    return _30
};

Blowfish.prototype.str2hexDebug = function (str) {
    var _31 = "";
    for (var i = 0; i < str.length; i++) {
        _31 += str.charCodeAt(i).toString(16) + " "
    }
    return _31
};

Blowfish.prototype.str2bytes = function (str) {
    return this.codes2bytes(this.str2codes(str))
};

Blowfish.prototype.bytes2str = function (_32) {
    return this.codes2str(this.bytes2codes(_32))
};

var AppConstants = {};

AppConstants.MSG_NO_ARTIST_INFO = "No artist detail information is available.";
AppConstants.MSG_BANNER_BY = "   By: ";
AppConstants.MSG_BANNER_COMPANY = " - ";
AppConstants.MSG_NETWORK_ERROR_TITLE = "Network Error";
AppConstants.MSG_NETWORK_ERROR = "A network connection is not available";
AppConstants.MSG_BOOKMARK_TITLE = "Bookmark Error";
AppConstants.MSG_BOOKMARK_AD = "An advertisement cannot be bookmarked";
AppConstants.MSG_SLEEP_TITLE = "Sleep Error";
AppConstants.MSG_PURCHASE_TITLE = "Purchase Error";
AppConstants.MSG_PURCHASE = "An advertisement cannot be purchased";
AppConstants.MSG_SLEEP = "Cannot sleep an advertisement";
AppConstants.MSG_BOOKMARK = "Bookmark";
AppConstants.MSG_BOOKMARK_SONG = "Bookmark this song";
AppConstants.MSG_BOOKMARK_ARTIST = "Bookmark this artist";
AppConstants.MSG_BUY = "Buy";
AppConstants.MSG_BUY_TRACK = "Buy this song";
AppConstants.MSG_BUY_ALBUM = "Buy this album";
AppConstants.MSG_SHARE = "Email this station";
AppConstants.MSG_SLEEP_SONG = "Don't play song for one month";
AppConstants.MSG_STATION_SHARED_PREFIX = "Station shared";
AppConstants.MSG_WITH = " with ";
AppConstants.MSG_STATION_SHARING_ERROR_TITLE = "Station Sharing Error";
AppConstants.MSG_STATION_SHARING_ERROR = "Invalid email address";
AppConstants.MSG_ERROR_TITLE_PLURAL = "There are problems with your request";
AppConstants.MSG_ERROR_TITLE_SINGULAR = "There is a problem with your request";
AppConstants.MSG_STATION_ERROR_TITLE = "Station Error";
AppConstants.MSG_STATION_DELETE_ERROR = "This station cannot be deleted";
AppConstants.MSG_NETWORK_ERROR_TITLE = "Network Error";
AppConstants.MSG_SKIP_ERROR_TITLE = "Skip Error";
AppConstants.MSG_FEEDBACK_ERROR_TITLE = "Feedback Error";
AppConstants.MSG_NETWORK_ERROR = "A network connection is not available";
AppConstants.MSG_AD_SKIP_ERROR = "An advertisement cannot be skipped";
AppConstants.MSG_SKIP_LIMIT_PREFIX = "No skips remaining.  You may skip ";
AppConstants.MSG_SKIP_LIMIT_SUFFIX = " times per hour on each station.";
AppConstants.MSG_SHARED_STATION_THUMB_UP_ERROR = "A shared station cannot be thumbed up";
AppConstants.MSG_SHARED_STATION_THUMB_UP_AD_ERROR = "An advertisement cannot be thumbed up";
AppConstants.MSG_SHARED_STATION_THUMB_DOWN_ERROR = "A shared station cannot be thumbed down";
AppConstants.MSG_SHARED_STATION_THUMB_DOWN_AD_ERROR = "An advertisement cannot be thumbed down";
AppConstants.MSG_SIGN_IN_ERROR_TITLE = "Sign In Error";
AppConstants.MSG_PASSWORD_RESET_TITLE = "Password Reset";
AppConstants.MSG_PASSWORD_RESET_ERROR = "Your password has been sent to you via email.  It should arrive soon.";
AppConstants.MSG_OK = "OK";
AppConstants.MSG_DISMISS = "Dismiss";
AppConstants.MSG_RETRY = "Retry";
AppConstants.MSG_CANCEL = "Cancel";
AppConstants.MSG_EMAIL_SUPPORT = "Send Logs To Pandora";
AppConstants.MSG_JUST_STOP_DEBUGGING = "Just Disable Logging";
AppConstants.MSG_BY_DATE = "By Date";
AppConstants.MSG_BY_AZ = "&nbsp; A - Z &nbsp;&nbsp;";
AppConstants.MSG_PREFERENCES = "Preferences";
AppConstants.MSG_HELP = "Help";
AppConstants.MSG_PASSWORD = "password";
AppConstants.MSG_SIGN_IN = "Sign In";
AppConstants.MSG_SIGN_UP = "Sign Up";
AppConstants.MSG_EMAIL_ERROR = "Email is required";
AppConstants.MSG_FEMALE = "Female";
AppConstants.MSG_MALE = "Male";
AppConstants.MSG_EMAIL = "email";
AppConstants.MSG_BIRTH_YEAR = "birth year";
AppConstants.MSG_ZIP = "zip code";
AppConstants.MSG_PASSWORD_ERROR = "Password is required";
AppConstants.MSG_GENDER_ERROR = "Gender is required";
AppConstants.MSG_ZIP_ERROR = "ZipCode is not valid";
AppConstants.MSG_BIRTH_YEAR_ERROR = "Birth year is not valid";
AppConstants.MSG_TERMS_ERROR = "Please read and agree to the Terms of Use";
AppConstants.MSG_DIAGNOSTIC_SUBJECT = "Palm Pre diagnostic logs";
AppConstants.MSG_DIAGNOSTIC_TITLE = "Diagnostic Message";
AppConstants.MSG_DIAGNOSTIC_ENABLE_MESSAGE = "Logging is disabled.";
AppConstants.MSG_DIAGNOSTIC_DISABLE_MESSAGE = "Logging is enabled.";
AppConstants.SCENE_NOWPLAYING = "nowplaying";
AppConstants.SCENE_DASHBOARD = "basic-dashboard";
AppConstants.SCENE_STATIONLIST = "stationlist";
AppConstants.SCENE_EMAIL = "email";
AppConstants.SCENE_PREFERENCES = "preferences";
AppConstants.SCENE_EMAIL_DISAMBIGUATION = "email-disambiguation";
AppConstants.SCENE_CREATE_STATION = "create-station";
AppConstants.SCENE_NOWPLAYING_INFO = "nowplaying-info";
AppConstants.SCENE_WELCOME = "welcome";
AppConstants.SCENE_REQUEST_PASSWORD = "request-password";
AppConstants.SCENE_SPLASHSCREEN = "splashscreen";
AppConstants.SCENE_CREATE_STATION = "create-station";
AppConstants.SCENE_SIGN_IN = "sign-in";
AppConstants.SCENE_SIGN_UP = "sign-up";
AppConstants.SCENE_MUSIC_SEARCH = "music-search";
AppConstants.SCENE_WAITING = "waiting";
AppConstants.SCENE_SUPPORT = "support";
AppConstants.EVENT_ON_TRACK_CHANGE = "onTrackChange";
AppConstants.EVENT_ON_TOGGLE_PAUSE = "onTogglePause";
AppConstants.EVENT_ON_TRACK_CHANGE_FOR_DASHBOARD = "onTrackChangeForDashboard";
AppConstants.EVENT_ON_TOGGLE_SPINNER = "onToggleSpinner";
AppConstants.EVENT_ON_PRELOAD_ALBUM_ART = "onPreloadAlbumArt";
AppConstants.EVENT_ON_DISABLE_CONTROLS = "onDisableControls";
AppConstants.EVENT_ON_DISPLAY_NOW_PLAYING_AD = "onDisplayNowPlayingAd";
AppConstants.EVENT_ON_PLAY_PROGRESS = "onPlayProgress";
AppConstants.EVENT_ON_STATION_CHANGE = "onStationChange";
AppConstants.EVENT_ON_STATION_LIST_CHANGE = "onStationListChange";
AppConstants.EVENT_ON_HISTORY_LOAD = "onHistoryLoad";
AppConstants.EVENT_ON_TRACK_THUMBED = "onTrackThumbed";
AppConstants.EVENT_ON_PRELOAD_ALBUM_ART = "onPreloadAlbumArt";
AppConstants.EVENT_ON_TOGGLE_SIGN_UP_BUTTON = "onToggleSignUpButton";
AppConstants.EVENT_ON_TOGGLE_REQUEST_PASSWORD_BUTTON = "onToggleRequestPasswordButton";
AppConstants.EVENT_ON_TOGGLE_SIGN_IN_BUTTON = "onToggleSignInButton";
AppConstants.EVENT_ON_FINISH_SIGN_IN = "onFinishSignIn"; 	//New
AppConstants.EVENT_ON_DISPLAY_SPLASHSCREEN_AD = "onDisplaySplashScreenAd";
AppConstants.EVENT_ON_SIGN_OUT = "onSignOut";				//New
AppConstants.EVENT_ON_UNDO_DELETE = "onUndoDelete";
AppConstants.EVENT_ON_DISPLAY = "onDisplay";
AppConstants.EVENT_ON_STATION_ACTIVITY = "onStationActivity";	//New
AppConstants.EVENT_ON_BOOKMARKS_RECEIVED = "onBookmarksReceived";  //New
AppConstants.EVENT_ON_BOOKMARK_DELETED = "onDeleteBookmark"; // New
AppConstants.EVENT_ON_BOOKMARK_CREATED = "onCreateBookmark"; // New
AppConstants.EVENT_ON_SHUTDOWN = "onShutdown"; // New
AppConstants.EVENT_SET_TEXT_BACKING = "setTextBacking";	// New
AppConstants.IMG_THUMB_UP = "images/menu-icon-pandora-up.png";
AppConstants.IMG_THUMB_UP_CHECKED = "images/menu-icon-pandora-up-checked.png";
AppConstants.IMG_THUMB_DOWN = "images/menu-icon-pandora-down.png";
AppConstants.IMG_THUMB_DOWN_CHECKED = "images/menu-icon-pandora-down-checked.png";
AppConstants.IMG_MENU = "images/menu-icon-pandora-menu.png";
AppConstants.IMG_SKIP = "images/menu-icon-pandora-skip.png";
AppConstants.IMG_PLAY = "images/play.png";
AppConstants.IMG_PLAY_DASH = "images/playdash.png";
AppConstants.IMG_SKIP_DASH = "images/skipdash.png";
AppConstants.IMG_PAUSE_DASH = "images/pausedash.png";
AppConstants.IMG_PAUSE = "images/pause.png";
AppConstants.IMG_ADD = "images/see-more-plus-icon.png";
AppConstants.IMG_AD_FADE = "images/ad_fade.png";
AppConstants.PALM_AUDIO_CLASS = "media";
AppConstants.OFFSET_PARAM = "&offset=";
AppConstants.ELAPSED_TIME_DEFAULT = "0:00";
AppConstants.REMAINING_TIME_DEFAULT = "-0:00";
AppConstants.NEGATIVE = "-";
AppConstants.RETRY = "retry";
AppConstants.DIAGNOSTIC_EMAIL = "palm-diagnostic@pandora.com";
AppConstants.DIAGNOSTIC_LOG_PATH = "/var/log/messages";
AppConstants.DIAGNOSTIC_FILE_NAME = "log.txt";
AppConstants.DIAGNOSTIC_EMAIL_DISPLAY = "Pandora Support";
AppConstants.DIAGNOSTIC_EMAIL_TYPE = "email";
AppConstants.httpUrl = "http://tuner.pandora.com/services/json/";
AppConstants.httpsUrl = "https://tuner.pandora.com/services/json/";
AppConstants.defaultAlbumArt = "images/no-art-available.png";
AppConstants.a = "palm";
AppConstants.b = ["I", "U", "C", "7", "I", "B", "G", "0", "9", "A", "3", "J", "T", "S", "Y", "M", "4", "N", "1", "1", "U", "J", "W", "L", "0", "7", "V", "L", "H", "8", "J", "P", "0"].join("");
AppConstants.s = ["E", "#", "U", "$", "M", "Y", "$", "O", "2", "B", "="].join("");
AppConstants.r = ["%", "5", "2", "6", "C", "B", "L", "$", "Z", "U", "3"].join("");
AppConstants.l = ["V", "L", "H", "8", "J", "#", "Y", "P", "T"].join("");
AppConstants.appId = "com.jmtk.apollo";
AppConstants.helpUrl = "www.pandora.com/faq#1463";
AppConstants.PANDORA_URL = "www.pandora.com";	//New
AppConstants.ART_URL = '@artUrl';				//New
AppConstants.appVersion = "1.1.0";
AppConstants.appVersionParam = "&av=" + AppConstants.appVersion;
AppConstants.runInEmulator = false;
