enyo.kind({
	name:"settings",
	kind:"VFlexBox", style:"background-color:#081228; color:#FFFFFF;",
	flex:1,
	millis: -1,
	timeOfClick:-1,
	events: {
		"onImagePick":"",
		"onImagePickCustom":"",
		"onSetTextBacking":""
	},
	components:[
		{
			name: "alarm",
			kind: "PalmService",
			service: "palm://com.palm.power/timeout/",
			method: "set",
			onSuccess: "setAlarmSuccess",
			onFailure: "setAlarmFailure"
		},
		{
			name: "alarmClear",
			kind: "PalmService",
			service: "palm://com.palm.power/timeout/",
			method: "clear",
			onFailure: "setAlarmFailure"
		},
		// Preferences
		{kind:"RowGroup", name: "prefSection", caption:"Settings", 
		 components:[

			// Audio quality
			{
					kind:"HFlexBox", align:"center", pack: "center",  
					components:[
						{content:"Audio Quality"},
						{flex:1},
						{content:"Low"},
						{kind: "Slider", name: "audioSlider", style: "margin-left:1.0em; margin-right:1.0em;", onChange: "audioSliderChange", flex: 1.7, minimum: 1, maximum: 3, position: 1},
						{content:"High"}
					]
			},
			
			// Background
			{
				kind: "HFlexBox", align: "center",
				components:[
					{content:"Background"} ,{flex:1}, {kind:"ToolButton", caption:"Select an image", onclick:"openBackgroundPopup"}
				]
			},
			
			//Text backing
			{
				kind: "HFlexBox", align: "center",
				components: [
					{content: "Text Backing"}, {flex:1}, {kind: "ToggleButton", name: "textBackingToggle", onLabel: "On", offLabel: "Off", onChange: "toggleTextBacking"}
				]
			},
			
			// Fullscreen
			{
				kind:"HFlexBox", align:"center",
				components:[
					{content:"Full Screen"}, {flex:1}, {kind:"ToggleButton", name: "fullScreenToggle", onLabel: "On", offLabel: "Off", onChange:"toggleFullScreen"}
				]
			},
			
			// Play station on startup
			{
				kind: "HFlexBox", align: "center",
				components: [
					{content: "Auto-play on Startup"}, {flex:1}, {kind: "ToggleButton", name: "autoPlayToggle", onLabel: "Yes", offLabel: "No", onChange: "toggleAutoPlay"}
				]
			},
			
			// Show track progress in notification
			// {
				// kind: "HFlexBox", align: "center",
				// components: [
					// {content: "Song Progress in Dashboard"}, {flex:1}, {kind: "ToggleButton", name: "dashProgressToggle", onLabel: "Yes", offLabel: "No", onChange: "toggleDashProgress"}
				// ]
			// },
			// Auto shut off
			{
				kind: "HFlexBox", align: "center",
				components: [
					{kind:"HFlexBox", flex:1, onclick:"getTimeLeft", components:[{content: "App Timeout"}]},
					{kind: "ListSelector", value: 0, onclick:"listClick", onChange: "itemChanged", 
						items: [
							{caption: "Off", value: 0},
							{caption: "15 minutes", value: 1},
							{caption: "30 minutes", value: 2},
							{caption: "1 hour", value: 3},
							{caption: "2 hours", value: 4},
							{caption: "6 hours", value: 5},
						]
					}
				]
			},
			{kind:"HFlexBox", align:"center",
				components:[
					{content:"Exhibition Interface"},
					{flex:1},
					{kind:"RadioGroup", width:"190px", name:"exhibitionPreference", onChange:"exhibitionPreferenceChanged", components:[{caption:"Simple"}, {caption:"Full"}]},
				]
			}
		 ]
		},
		{ kind: "FilePicker", name: "filePicker", fileType: "image", previewLabel: "Apollo Background Picker", allowMultiSelect: false, onPickFile: "doImagePickCustom" },
		{
			kind:"Popup", name:"backgroundPopup", width:"500px", height:"500px", layoutKind:"VFlexLayout", align: "center",
			components:[
				{kind:"HFlexBox", align:"center", pack:"center", flex:1, 
					components:[
						{kind:"backgroundImagePicker", src:"themes/1.png", onclick:"doImagePick"},
						{kind:"backgroundImagePicker", src:"themes/2.png", onclick:"doImagePick"},
						{kind:"backgroundImagePicker", src:"themes/3.png", onclick:"doImagePick"}
					]
				},
				{kind:"HFlexBox", align:"center", pack:"center", flex:1, 
					components:[
						{kind:"backgroundImagePicker", src:"themes/4.png", onclick:"doImagePick"},
						{kind:"backgroundImagePicker", src:"themes/5.png", onclick:"doImagePick"},
						{kind:"backgroundImagePicker", src:"themes/6.png", onclick:"doImagePick"}
					]
				},
				{kind:"HFlexBox", align:"center", pack:"center", flex:1, 
					components:[
						{kind:"backgroundImagePicker", src:"themes/7.png", onclick:"doImagePick"},
						{kind:"backgroundImagePicker", src:"themes/8.png", onclick:"doImagePick"},
						{kind:"backgroundImagePicker", src:"themes/9.png", onclick:"doImagePick"}
					]
				},
				{kind: "Button", width: "356px", caption: "Browse images...", className: "enyo-button-blue", onclick: "openFilePicker"}
			]
		}
	],
	
	
	ready: function() {
		this.trackChangeCallbackId = MessageDispatcher.subscribe( AppConstants.EVENT_ON_TRACK_CHANGE, this.initiateShutdown.bind(this) );
	},
	
	show: function() {
		this.$.audioSlider.setPositionImmediate( AppGlobals.audioQuality );
		this.$.fullScreenToggle.setState( AppGlobals.fullscreen );
		this.$.autoPlayToggle.setState( AppGlobals.startupAutoPlay );
		this.$.textBackingToggle.setState( AppGlobals.textBacking );
		if (AppGlobals.simpleExhibition) {this.$.exhibitionPreference.setValue(0)} else {this.$.exhibitionPreference.setValue(1)}
		// this.$.dashProgressToggle.setState( AppGlobals.dashProgress );
		
		this.inherited(arguments);
	},
	
	audioSliderChange: function(inSender, inEvent) {
		AppGlobals.setAudioQuality( inEvent );
	},
	
	exhibitionPreferenceChanged: function(inSender) {
		if (inSender.getValue() == 1) {
			AppGlobals.setExhibitionType(false);
		} else {
			AppGlobals.setExhibitionType(true);
		}
		Application.getView().updateView();
	},
	
	openBackgroundPopup: function(inSender) {
		this.$.backgroundPopup.openAtCenter();
	},
	
	openFilePicker: function(inSender) {
		this.$.filePicker.pickFile();
	},
	
	closeImagePicker: function( onlyCloseFilePicker ) {
		if ( onlyCloseFilePicker ) {
			this.$.filePicker.close();
			return;
		}
		this.$.filePicker.close();
		this.$.backgroundPopup.close();
	},
	
	toggleFullScreen: function(inSender, inState) {
		AppGlobals.setFullscreen( inState );
	},
	
	toggleAutoPlay: function(inSender, inState) {
		AppGlobals.setStartupAutoPlay( inState );
	},
	
	toggleTextBacking: function(inSender, inState) {
		AppGlobals.setTextBacking( inState );
		MessageDispatcher.dispatchMessage( AppConstants.EVENT_SET_TEXT_BACKING, inState );
	},
	
	// toggleDashProgress: function(inSender, inState) {
		// AppGlobals.setDashProgress( inState );
	// },
	
	itemChanged: function(inSender, inValue, inOldValue) {
		var inTimeStr = "";
		if (inValue == 0) {
			//turn off: cancel any alarm already scheduled with the system
			this.millis = -1;
			this.timeOfClick = -1;
			this.$.alarmClear.call({ key: settings.ALARM_KEY });
			return;
		}
		else if (inValue == 1) {
			//set to 15 min
			this.millis = 15 * 60 * 1000;
			inTimeStr = "00:15:00";
		}
		else if (inValue == 2) {
			//set to 30 min
			this.millis = 30 * 60 * 1000;
			inTimeStr = "00:30:00";
		}
		else if (inValue == 3) {
			//set to 1 hour
			this.millis = 1 * 60 * 60 * 1000;
			inTimeStr = "01:00:00";
		}
		else if (inValue == 4) {
			//set to 2 hours
			this.millis = 2 * 60 * 60 * 1000;
			inTimeStr = "02:00:00";
		}
		else if (inValue == 5) {
			//set to 6 hours
			this.millis = 6 * 60 * 60 * 1000;
			inTimeStr = "06:00:00";
		}
		// there is no "update" for system alarms: clear any existing one before setting
		this.$.alarmClear.call({ key: settings.ALARM_KEY });
		this.$.alarm.call({
			wakeup: true,
			key: settings.ALARM_KEY,
			uri: "palm://com.palm.applicationManager/launch",
			params: {
				id: "com.jmtk.apollo",
				params: { appTimeout: true }
			},
			in: inTimeStr
		});
		this.timeOfClick=new Date().getTime();
		this.getTimeLeft();
	},
	
	setAlarmSuccess: function( inSender, inResponse ) {
		// Great...success
	},
	
	setAlarmFailure: function( inSender, inError, inRequest ) {
		// Error
		this.log("Error setting alarm: "+enyo.json.stringify(inError));
	},
	
	getTimeLeft: function() {
		if (this.millis==-1) {
			return;
		}
		var timeLeftUntilClose=(this.millis - (new Date().getTime() - this.timeOfClick))/60000; //[min]
		timeLeftUntilClose=Math.ceil(timeLeftUntilClose);
		if ( timeLeftUntilClose >= 60 ) {
			timeLeftUntilClose=timeLeftUntilClose/60; //[hr]
			Util.showBannerMessage("~"+timeLeftUntilClose + " hr until app closes.");
		}
		else {
			Util.showBannerMessage("~"+timeLeftUntilClose + " min until app closes.");
		}
	},

	// Backstop for the system alarm: see if we need to shutdown each time track changes
	initiateShutdown: function() {
		if ( this.timeOfClick != -1 && this.millis != -1 && (new Date().getTime() - this.timeOfClick) >= this.millis ) {
			this.log();
			Application.shutdown();
		}
	}


});

settings.ALARM_KEY = "com.jmtk.apollo.timer";
