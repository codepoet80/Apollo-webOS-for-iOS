
enyo.kind({
	name: "EnyoPandoraSplash",
	kind: enyo.HFlexBox,
	align: "center",
	pack: "center",
	style:"background-image:url('themes/1.png'); background-repeat:no-repeat; background-color:#071228; background-position:center top",
	components: [
		{flex:1},
		{ kind: enyo.Image, src: "images/logo.png", style:"padding-top: 48%;"},
		{flex:1},
		{
            name : "getSysProp",
            kind : "PalmService",
            service : "palm://com.palm.preferences/systemProperties",
            method : "Get",
            onResponse : "getSysPropResponse",
            subscribe : true
        }
	],
	
	ready: function() {
		// this.log(this.name+" is ready...");
		// this.log("Loaded on platform: "+AppGlobals.platform);
		enyo.setAllowedOrientation("up");
		if ( AppGlobals.platform == "device" ) {
			this.$.getSysProp.call({"key": "com.palm.properties.nduid"});
		}
		else {
			this.callPersistence();
		}
		
	},

	getSysPropResponse: function(inSender, inResponse) {
		if ( inResponse.returnValue ) {
			AppGlobals.systemProperties = inResponse;
			inSender.cancel();
		}
		
		this.callPersistence();
	},
	
	callPersistence: function() {
		// this.log("Calling Persistence...");
		AppGlobals.initDB(this.initializePandora.bind(this));
	},
	
	initializePandora: function() {
		if (AppGlobals.licensing && AppGlobals.partnerAuthToken == null && AppGlobals.partnerId == null) {
			// this.log("Calling Api.partnerLogin...");
            Api.partnerLogin(new PartnerLoginDelegate());
        }
		else {
			// this.log("Calling Api.checkLicensing");
            Api.checkLicensing(new CheckLicensingDelegate());
        }
	}
});

