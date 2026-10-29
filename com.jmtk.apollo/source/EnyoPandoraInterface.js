enyo.kind({
	name:"pageHeader",
	kind: enyo.HFlexBox,
	style:"background-color:#083c6e; background-image:url('images/headerbg.png'); background-repeat:repeat-x; height:40px; color:#DDDDDD;",		
});
var Header = {
		kind:"pageHeader",
		components:[
			{kind:"Image", src:"images/minilogo.png"},
			{flex:0.9},
			{kind: "ListSelector", name:"radioName", hideArrow:true, disabled:false, showing: false,
			 style: "font-size: 15px; margin-top: 3px;", value: 0, onSelect: "setStation", popupAlign: "left",
			 items: AppGlobals.stationList
			},
			{flex:1},
			{kind:"ToolButton", toggling: true, style:"font-size:10px; margin-right:5px;", className:"", name:"menuButton", content:"", onclick:"appmenuPopup", showing:false},
		]
};



var requestPassPopup = {
	name: "requestPassPopup",
	kind: "Popup",
	scrim: true, dismissWithClick: false, dismissWithEscape: false,
	layoutKind: "VFlexLayout",
	height: "175px", width: "300px",
	onOpen: "inputPopupOpened",
	components: [
		{content: "Password Request", style: "text-align:center;"},
		{flex:.05},
		{kind: "RoundedInput", name: "requestPassEmail", hint: "Your email", inputType: "email", alwaysLooksFocused: true, oninput: "requestPassInputChanged"},
		{
			kind:"HFlexBox", 
			components:[
				{flex:1, kind:"Button", content:"Back", onclick:"closePopup"},
				{flex:2, kind: enyo.ActivityButton, name: "requestPassButton", disabled: true, caption: "Email Password", className: "enyo-button-dark", onclick: "requestPassword"}
			]
		}
	]
};

var signInPopup = {
	kind:"Popup", name:"signInPopup",
	scrim: true, dismissWithClick: false, dismissWithEscape: false,
	layoutKind:"VFlexLayout",
	height: "250px", width:"290px",
	onOpen: "inputPopupOpened",

	components:[
		{content:"Sign In", style:"text-align:center;"},
		{flex:.003},
		{kind:"RoundedInput", name: "signInEmail", inputType: "email", hint: "Your email", alwaysLooksFocused: true, oninput: "signInInputChanged", spellcheck:false, autocorrect:false, autoCapitalize:"lowercase",  onkeypress: "keyPressedDuringSignInInput"},
		
		{kind:"PasswordInput",  className:"enyo-rounded-input", name: "signInPassword", hint: "Password", alwaysLooksFocused: true, selectAllOnFocus: true, oninput: "signInInputChanged", onkeypress: "keyPressedDuringSignInInput"},
		//{flex:.01},
		{
			kind:"HFlexBox",
			components:[
				{kind:"Button", flex:1, content:"Back", onclick:"closePopup"},
				{kind:"ActivityButton", name: "signInButton", flex:1, className:"enyo-button-blue", disabled: true, content:"Log in", onclick: "initiateSignIn"}
			]
		},
		{flex:.007},
		{ kind: enyo.Button, name: "forgotPass", className: "enyo-button-dark", caption: "Forgot Password", onclick: "requestPassPopup" }
	]
};

var registerPopup = {
	kind:"Popup", name:"registerPopup",
	scrim: true, dismissWithClick: false, dismissWithEscape: false,
	layoutKind:"VFlexLayout",
	onOpen: "inputPopupOpened",
	width: "600px", height: "495px",
	components:[
		{content:"Register, for free!", style:"text-align:center;"},

		{
			kind:"RowGroup",
			caption:"Account Information", 
			components: [
				{kind:"Input", inputType: "email", name:"registerEmail", spellcheck: false, autocorrect: false, autoCapitalize: "lowercase", oninput: "registerInputChanged", hint:"E-mail address"}, 
				{kind:"PasswordInput",name:"registerPassword", oninput: "registerInputChanged", hint:"Password"}, 
				{kind:"Input", name:"registerBirthyear", oninput: "registerInputChanged", hint:"Birth year"}, 
				{kind:"Input", name:"registerZipcode", oninput: "registerInputChanged", hint:"Zip code"}
			]
		},
		
		{kind:"RadioGroup", name:"registerGender", components:[ {caption:"Male", value:'male'}, {caption:"Female", value:'female'} ], onChange: "registerInputChanged" },
		{kind:"HFlexBox", align:"center",  components:[{kind:"CheckBox", name:"registerSendme"},{content:"&nbsp;Send me personalized recommendations and tips", style:"font-size:16px;"}]},
		{kind:"HFlexBox", align:"center",  components:[
			{kind:"CheckBox", onChange:"registerInputChanged", name:"registerTerms"},
			{content:"<font style=\"font-size:16px\">&nbsp;I have read, understood, and agreed to the Pandora <a href=\"http://www.pandora.com/legal/\">Terms of Use</a> and the <a href=\"http://www.pandora.com/privacy/\">Privacy Policy</a></font>", allowHtml:true}
			]
		},
		{
			kind:"HFlexBox", 
			components:[
				{kind:"Button", flex:1, content:"Back", onclick:"closePopup"},
				{kind:"ActivityButton", flex:1, className:"enyo-button-blue", disabled:true, name:"registerButton", content:"Register", onclick: "register"},
			]
		}
	]
};

var introPopup = {
		name: "introPopup", kind: "Popup", 
		dismissWithClick: false, dismissWithEscape: false, onOpen: "popupOpened",
		style:"",
		layoutKind: "VFlexLayout", width: "270px", height: "175px",
		align: "center",
	    components: [
			{content: "Get Started With Apollo"},
			{flex:1},
			{kind:"Button", name:"signInPopupButton", content:"I have a Pandora account", width:"200px", className:"enyo-button-blue", onclick:"signInPopup"},
			{kind:"Button", className: "enyo-button-dark", content:"I am new to Pandora", width:"200px", onclick:"registerPopup"},
			{flex:1}
		]

};


enyo.kind({
	name: "EnyoPandoraInterface",
	kind: enyo.VFlexBox,
	pack: "center",
	align: "center",
	components: [		
		{ name: "appEvents", kind: "ApplicationEvents", onWindowRotated: "windowRotated" },
		
		Header,
		
		{
				kind: "AppMenu", name:"_appMenu", automatic: false,
			components: [
				{caption:"Settings", onclick:"showPullout"},
				{caption:"Help", onclick:"showPullout"},
				{caption:"My Bookmarks", onclick:"showPullout"},
				{caption:"Sign Out", onclick:"initiateSignOut"},
				
			]
		},
		
		{
			kind: "Menu", width:"10px", name:"appMenu", onClose: "toggleMenuButton",
			components: [
				{caption:"Settings", onclick:"showPullout"},
				{caption:"Help", onclick:"showPullout"},
				{caption:"My Bookmarks", onclick:"showPullout"},
				{caption:"Sign Out", onclick:"initiateSignOut"},
				
			]
		},

		{kind:"Pane", name:"viewPane", flex:1, components:[
			{kind: "PrimaryInterface", onSlideComplete:"completeSlide", name:"primaryInterface", lazy:false},
			{kind: "exhibition", name:"exhibition", lazy:true}
		]},
		
		introPopup,
		signInPopup,
		requestPassPopup,
		registerPopup
	],

	ready: function() {
		this.signOutCallbackId = MessageDispatcher.subscribe( AppConstants.EVENT_ON_SIGN_OUT, this.finishSignOutDelay.bind(this) );
		this.signInCallbackId = MessageDispatcher.subscribe( AppConstants.EVENT_ON_FINISH_SIGN_IN, this.finishSignIn.bind(this) );
		this.stationChangeCallbackId = MessageDispatcher.subscribe( AppConstants.EVENT_ON_STATION_CHANGE, this.setRadioName.bind(this) );
		this.stationListChangeCallbackId = MessageDispatcher.subscribe( AppConstants.EVENT_ON_STATION_LIST_CHANGE, this.setRadioList.bind(this) );

		this.popupStack = [];
		
	//	this.log("First sign in with new device: "+AppGlobals.isFirstLoginWithNewDeviceId);
		
		if ( AppGlobals.isFirstLoginWithNewDeviceId ) {
			enyo.keyboard.setResizesWindow(false);
			this.log("Opening introPopup");
			enyo.nextTick( this, "introPopup" );
		}
		else {
			this.setRadioList();
			this.setRadioName();
		}
	},
	
	setRadioList: function() {
		if ( !AppGlobals.stationList ) {
			return;
		}
		var items = AppGlobals.stationList.slice(0).sort(AppGlobals.sortAlpha);
		for (var i=0; i < items.length; i++) {
			items[i].caption = items[i].stationName;
			items[i].value = i;			
		}
		this.$.radioName.setItems( items );
		this.$.radioName.render();
		this.setRadioName();
	},
	
	setRadioName: function() {
		if ( AppGlobals.station && AppGlobals.station.started ) {
			if ( !this.$.radioName.showing ) {
				this.$.radioName.show();
			}
			for ( var i = 0; i < this.$.radioName.items.length; i++ ) {
				if ( this.$.radioName.items[i].stationToken == AppGlobals.station.stationToken ) {
					this.$.radioName.setValue( i );
				}
			}
		}
		else {
			this.$.radioName.hide();
		}
		//this.$.radioName.setLabel(name);
	},
	
	setStation: function( inSender, inValue ) {
		var stationData = this.$.radioName.getItems()[inValue];
		//this.log(enyo.json.stringify(stationData));
		if ( stationData ) {
			var stationToken = stationData['stationToken'];

			if (AppGlobals.station != null && AppGlobals.station.getStationToken() == stationToken) {
				// same station, don't restart
			}
			else {
				if (AppGlobals.station != null) {
					AppGlobals.station.stop();
				}
				AppGlobals.setStation(stationData);
				AppGlobals.station.start();
			}
		}
	},
	
	windowRotated: function(inSender) {
		if ( this.popupStack && this.popupStack.length > 0 ) {
			this.popupStack[this.popupStack.length-1].close();
			this.popupStack[this.popupStack.length-1].openAtCenter();
		}
	//	this.$.contentPage.adjustForResizing();
	},
	

	// Load station list etc.
	updateView: function() {
		if ( !AppGlobals.username ) {
			return;
		}
		this.$.menuButton.show();
		this.$.menuButton.setCaption(AppGlobals.username);
		this.$.appMenu.applyStyle("width", (this.$.menuButton.node.clientWidth+5)+"px");
		while ( this.popupStack.length ) {
			this.popupStack.pop().close();
		}
		var params = enyo.windowParams;
		if ( params.windowType == "dockModeWindow" && params.dockMode && AppGlobals.simpleExhibition ) {
			if ( !AppGlobals.station && AppGlobals.stationList && AppGlobals.stationList.length > 0 ) {
				AppGlobals.setStation(AppGlobals.stationList[0]);
				AppGlobals.station.start();
			}
			else if ( !AppGlobals.stationList || AppGlobals.stationList.length == 0 ) {
				Api.musicSearch("Fryderyk Chopin", new MusicSearchDelegate());
			}
			this.$.menuButton.setDisabled(true);
			this.$.radioName.disabled = false;
			this.$.radioName.setHideArrow(false);
			enyo.setFullScreen(true);
			this.$.viewPane.selectViewByName("exhibition", true);
			this.$.viewPane.getView().snapArt();
	//		if (this.$.primaryInterface) {
	//			this.$.primaryInterface.$.contentPage.unsubscribe();
	//		}
		}
		else {
			this.$.viewPane.selectViewByName("primaryInterface", true);
			this.$.menuButton.setDisabled(false);
			this.$.radioName.disabled = true;
			this.$.radioName.setHideArrow(true);
			
	//		if (this.$.primaryInterface) {
	//			this.$.primaryInterface.$.contentPage.subscribe();
	//		}
			if ( params.windowType == "dockModeWindow" && params.dockMode ) {
				enyo.setFullScreen(true);
			}
			else {
				enyo.setFullScreen(AppGlobals.fullscreen);
			}
			this.$.primaryInterface.$.radioList.updateView();
			enyo.nextTick( this.$.primaryInterface.$.contentPage, "updateView" );
		}
	},
	
	keyPressedDuringSignInInput: function(inSender, inEvent) {
		if ( inEvent.keyCode == 13 ) {
			if ( !this.$.signInButton.disabled ) {
				this.initiateSignIn(this.$.signInButton);
			}
		}
	},
	
	signInInputChanged: function(inSender, inEvent) {
		if ( !this.$.signInEmail.isEmpty() && !this.$.signInPassword.isEmpty() ) {
			this.$.signInButton.setDisabled(false);
		}
		else {
			this.$.signInButton.setDisabled(true);
		}
	},
	
	
	registerInputChanged: function(inSender, inEvent) {
		if ( !this.$.registerEmail.isEmpty() && !this.$.registerPassword.isEmpty() && !this.$.registerBirthyear.isEmpty() && !this.$.registerZipcode.isEmpty() && this.$.registerGender.getValue() && this.$.registerTerms.getChecked()==true ) {
			this.$.registerButton.setDisabled(false);
		}
		else {
			this.$.registerButton.setDisabled(true);
		}
	},
	
	register: function( inSender ) {
		var email = this.$.registerEmail.getValue();
		var password = this.$.registerPassword.getValue();
		var birthYear = this.$.registerBirthyear.getValue();
		var zipCode = this.$.registerZipcode.getValue();
		var gender = this.$.registerGender.getValue();
		var sendMe = this.$.registerSendme.getChecked();
		var agreeToTerms = this.$.registerTerms.getChecked();
	
		var errors = new Array();
		if (Util.isEmpty(email)) {
			errors.push(AppConstants.MSG_EMAIL_ERROR);
		}

		if (Util.isEmpty(password)) {
			errors.push(AppConstants.MSG_PASSWORD_ERROR);
		}

		if (Util.isEmpty(zipCode) || zipCode.length != 5) {
			errors.push(AppConstants.MSG_ZIP_ERROR);
		}

		var birthYearInt = 0;
		try {
			birthYearInt = Number(birthYear);
			if (isNaN(birthYearInt) || birthYearInt > new Date().getFullYear() || birthYearInt < 1878) {
				errors.push(AppConstants.MSG_BIRTH_YEAR_ERROR);
			}
		} catch(ex) {
			errors.push(AppConstants.MSG_BIRTH_YEAR_ERROR);
		}

		if (!agreeToTerms) {
			errors.push(AppConstants.MSG_TERMS_ERROR);
		}

		if (errors.length > 0) {
			Util.showError(errors);
			this.$.registerButton.setActive(false);
			return;
		}
		this.firstSignIn = true;
		Api.createUser(email, password, birthYearInt, zipCode, gender, sendMe, new CreateUserDelegate());
		this.$.registerButton.setActive(true);
	},
	
	requestPassInputChanged: function( inSender ) {
		if ( !this.$.requestPassEmail.isEmpty() ) {
			this.$.requestPassButton.setDisabled(false);
		}
		else {
			this.$.requestPassButton.setDisabled(true);
		}
	},
	
	requestPassword: function( inSender ) {
		var email = this.$.requestPassEmail.getValue();
		Api.emailPassword(email, new RequestPasswordDelegate());
		inSender.setActive(true);
	},
	
	initiateSignIn: function(inSender) {
		this.firstSignIn = true;
		var email = this.$.signInEmail.getValue();
		var password = this.$.signInPassword.getValue();
		Api.userLogin(email, password, new UserLoginDelegate());		
		inSender.setActive(true);
		
	},
	
	finishSignIn: function(success) {
		enyo.keyboard.setManualMode(true);
		enyo.keyboard.hide();
		enyo.keyboard.setManualMode(false);
		if ( this.$.signInButton ) {
			this.$.signInButton.setActive(false);
		}
		
		if (success) {
			if (this.firstSignIn) {
				this.$.primaryInterface.$.contentPage.showWelcomeMessage();
			}
			this.$._appMenu.setAutomatic(true);
			enyo.keyboard.setResizesWindow(true);
			this.updateView();
		}
		this.firstSignIn = undefined;
	},
	
	initiateSignOut: function() {
        Api.disassociateDevice(new DisassociateDeviceDelegate());
    },
	
	finishSignOutDelay: function() {
		enyo.job( "signOut", enyo.bind( this, "finishSignOut"), 200 );
	},
	
	finishSignOut: function() {
		// destroy() tears down all child components
		this.destroy();
		Application.setView("interface");
	},
	
	inputPopupOpened: function(inSender) {
		this.popupOpened(inSender);
		for ( var i = 0; i < inSender.children.length; i++ ) {
			if ( inSender.children[i].kind == "Input" || inSender.children[i].kind == "RoundedInput" ) {
				if ( AppGlobals.platform == "browser" ) {
					inSender.children[i].forceFocusEnableKeyboard();
				}
				return;
			}
		}
	},
	
	introPopup: function() {
		this.popupStack.push(this.$.introPopup);
	   	this.$.introPopup.openAtCenter();
	},
	
	appmenuPopup: function(inSender, inEvent) {
		this.$.appMenu.openAt({top: 28, right: 2});
	},
	
	infoPopup: function() {
		this.$.infoPopup.openAtCenter();
	
	},
	
	signInPopup: function(inSender, inEvent) {
		this.popupStack.push(this.$.signInPopup);
		this.popupStack[this.popupStack.length-2].close();
		this.$.signInPopup.openAtCenter();
	},
	
	registerPopup: function(inSender, inEvent) {
		this.popupStack.push(this.$.registerPopup);
		this.popupStack[this.popupStack.length-2].close();
		this.$.registerPopup.openAtCenter();
	},
	
	requestPassPopup: function( inSender ) {
		this.popupStack.push(this.$.requestPassPopup);
		this.popupStack[this.popupStack.length-2].close();
		this.$.requestPassPopup.openAtCenter();
	},
	
	closePopup: function(inSender) {
	    var container = inSender.container;
	    while(container.kind != "Popup") {
	    	 container = container.container;
	    }
		container.close();
		if ( this.popupStack[this.popupStack.length-1] == container ) {
			this.popupStack.pop();
			this.popupStack[this.popupStack.length-1].openAtCenter();
		}
	},

	popupOpened: function( inSender ) {
		if ( inSender.name == "registerPopup" ) {
			this.$.registerPopup.applyStyle("top", "50px");
			
		}
		else if ( inSender.name == "signInPopup" ) {
			this.$.signInPopup.applyStyle("top", "150px");
		}
		else if ( inSender.name == "requestPassPopup" ) {
			this.$.requestPassPopup.applyStyle("top", "150px");
		}
		//inSender.applyStyle("top","50px");
	},
	
	showPullout: function(inSender) {
		
		if ( inSender.caption == "Settings" ) {
			this.$.primaryInterface.$.pullout.currentView = "settings";
		}
		else if ( inSender.caption == "Help" ) {
			this.$.primaryInterface.$.pullout.currentView = "help";
		}
		else if ( inSender.caption == "My Bookmarks" ) {
			this.$.primaryInterface.$.pullout.currentView = "bookmarks";
			Api.getSongBookmarks(new GetBookmarkDelegate());
		    Api.getArtistBookmarks(new GetBookmarkDelegate());
		}
		
		this.$.primaryInterface.$.pullout.show();
		this.$.primaryInterface.$.pullout.select();
	},

	toggleMenuButton: function() {
		this.$.menuButton.setDepressed(false);
	},
	
	completeSlide: function(inSender, inEvent) {
		this.$.primaryInterface.paneSlideDone(inSender, inEvent);
	}
	
	
	
});
