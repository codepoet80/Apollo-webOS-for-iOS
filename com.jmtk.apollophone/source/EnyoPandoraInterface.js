enyo.kind({
	name:"pageHeader",
	kind: enyo.HFlexBox,
	style:"background-color:#0a4884; background-image:url('images/headerbg.png'); background-position:left bottom; background-repeat:repeat-x; height:53px; color:#DDDDDD;",		
});
var Header = {
		kind:"pageHeader", pack:"center", align:"center",
		components:[
			//{kind:"Image", src:"images/minilogo.png"},
			{kind:"ToolButton", className:"", name:"whyThisArtistButton", content:"?", style:"min-width:36px; font-weight:bold;", onclick:"showWhyArtist",  /*height:"35px", style:"font-size:21px; line-height:31px;",*/  showing:false},
			{kind: "ToolButton", className:"", name:"backFromInfo", content:"Back",  /*height:"35px", style:"font-size:21px; line-height:31px;",*/ onclick:"backToMain", showing:false},
			{flex:1},
			{
				kind: "customSelector", name:"radioName", hideArrow:false, disabled:false, showing: false,
				style: "font-size: 16px; margin-top: 0px; margin-right:12px;", value: 0, onDelete: "deleteStation", onSelect: "setStation", popupAlign: "right",
				onclick: "toggleStationList",
				items: AppGlobals.stationList
			},
			{flex:1},
			{kind:"ToolButton", className:"", name:"aboutArtistButton",  /*height:"35px", style:"font-size:21px; line-height:31px;",*/  content:"i", style:"min-width:36px; font-family:Georgia,serif; font-style:italic; font-weight:bold;", onclick:"showAboutArtist", showing:false}
		]
};



var requestPassPopup = {
	name: "requestPassPopup",
	kind: "Dialog",
	scrim: true, dismissWithClick: false, dismissWithEscape: false,
	layoutKind: "VFlexLayout",
	width: "100%",
	onOpen: "inputPopupOpened",
	style: "position:fixed;",
	components: [
		{content: "Password Request", style: "text-align:center;"},
		{flex:.05},
		{kind: "RoundedInput", name: "requestPassEmail", hint: "Your email", inputType: "email", alwaysLooksFocused: true, oninput: "requestPassInputChanged"},
		{
			kind:"HFlexBox", 
			components:[
				{flex:1, kind:"Button", content:"Back",  /*height:"35px", style:"font-size:21px; line-height:31px;",*/  onclick:"closePopup"},
				{flex:2, kind: enyo.ActivityButton, name: "requestPassButton", /*height:"35px", style:"font-size:21px; line-height:31px;",*/  disabled: true, caption: "Email Password", className: "enyo-button-dark", onclick: "requestPassword"}
			]
		}
	]
};

var signInPopup = {
	kind: "Dialog", name:"signInPopup",
	scrim: true, dismissWithClick: false, dismissWithEscape: false,
	layoutKind:"VFlexLayout",
	width:"100%",
	onOpen: "inputPopupOpened",
	style: "position:fixed;",
	components:[
		{content:"Sign In", style:"text-align:center; font-size:21px;"},
		{flex:.003},
		{kind:"RoundedInput", name: "signInEmail", inputType: "email", hint: "Your email", alwaysLooksFocused: true, oninput: "signInInputChanged", spellcheck:false, autocorrect:false, autoCapitalize:"lowercase",  onkeyup: "keyPressedDuringSignInInput"},
		
		{kind:"PasswordInput",  className:"enyo-rounded-input", name: "signInPassword", hint: "Password", alwaysLooksFocused: true, selectAllOnFocus: true, oninput: "signInInputChanged", onkeyup: "keyPressedDuringSignInInput"},
		//{flex:.01},
		{
			kind:"HFlexBox",
			components:[
				{kind:"Button", flex:1, content:"Back",  /*height:"35px", style:"font-size:21px; line-height:31px;",*/ onclick:"closePopup"},
				{kind:"ActivityButton", name: "signInButton", className:"enyo-button-blue", flex:1, /*height:"35px", style:"font-size:21px; line-height:31px;",*/ disabled:true, content:"Log in", onclick: "initiateSignIn"}
			]
		},
		{flex:.007},
		{ kind: enyo.Button, name: "forgotPass", className: "enyo-button-dark", caption: "Forgot Password",  /*height:"35px", style:"font-size:21px; line-height:31px;",*/  onclick: "requestPassPopup" }
	]
};

var registerPopup = {
	kind: "Dialog", name:"registerPopup",
	scrim: true, dismissWithClick: false, dismissWithEscape: false,
	layoutKind:"VFlexLayout",
	onOpen: "inputPopupOpened",
	width: "100%",
	style: "position:fixed;",
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
				{kind:"Button", flex:1, content:"Back",  /*height:"35px", style:"font-size:21px; line-height:31px;",*/  onclick:"closePopup"},
				{kind:"ActivityButton", flex:1, className:"enyo-button-blue", disabled:true, name:"registerButton",  /*height:"35px", style:"font-size:21px; line-height:31px;",*/  content:"Register", onclick: "register"},
			]
		}
	]
};

var introPopup = {
		name: "introPopup", kind: "Dialog", 
		dismissWithClick: false, dismissWithEscape: false, onOpen: "popupOpened",
		layoutKind: "VFlexLayout", width: "100%",
		style: "position:fixed;",
	    components: [
			{content: "Get Started With Apollo", style: "text-align: center;"},
			{flex:1},
			{kind:"Button", name:"signInPopupButton", content:"I have a Pandora account", className:"enyo-button-blue", onclick:"signInPopup"},
			{kind:"Button", className: "enyo-button-dark", content:"I am new to Pandora", onclick:"registerPopup"},
			{flex:1}
		]

};


enyo.kind({
	name: "EnyoPandoraInterface",
	kind: enyo.VFlexBox,
	pack: "center",
	align: "center",
	components: [		
		{ name: "appEvents", kind: "ApplicationEvents", onBack:"backToMain",  onWindowRotated: "windowRotated" },
		{name:"exhibitionMargin", height:"0px", style:"background-color:#000;"},
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


		{kind:"SlidingPane", name:"stationPane", flex:1, style:"width:100%;", components:[
			{kind:"radioList", name:"radioList", width:"260px", fixedWidth: true, dragAnywhere: false, edgeDragging: false, showing: false},
			// Only the left edge drags the main view: its own swipes skip and show history.
			{name:"mainView", flex:1, dragAnywhere: false, edgeDragging: true, layoutKind:"VFlexLayout", components:[
				{kind:"Pane", name:"viewPane", flex:1, components:[
					{kind: "phoneMain", onback:"backToMain", name:"phoneMain"},
					{kind: "pullout", name:"pullout", onBackMain:"backToMain", onBack:"backToMain", onImagePick: "changeBackgroundImage", onImagePickCustom: "changeCustomBackgroundImage", showing:false},
				]}
			]}
		]},
		
		introPopup,
		signInPopup,
		requestPassPopup,
		registerPopup
	],

	create: function() {
		this.inherited(arguments);
		// A Pane starts on its first view, the station list; the phone starts on its main view.
		this.$.stationPane.selectViewByName("mainView", true);
		// The list's top shading is the tablet panel's 210 px art; here the panel is the phone's width.
		this.$.radioList.$.stationListScroller.applyStyle("background-size", "100% 100px");
	},

	destroy: function() {
		MessageDispatcher.unsubscribe( AppConstants.EVENT_ON_STATION_CHANGE, this.stationChangeCallbackId );
		this.inherited(arguments);
	},

	ready: function() {
		this.stationChangeCallbackId = MessageDispatcher.subscribe( AppConstants.EVENT_ON_STATION_CHANGE, this.hideStationList.bind(this) );
		
		if (AppGlobals.orientation) {
			enyo.setAllowedOrientation("up");
		}
		else {
			enyo.setAllowedOrientation("free");
		}
		this.signOutCallbackId = MessageDispatcher.subscribe( AppConstants.EVENT_ON_SIGN_OUT, this.finishSignOutDelay.bind(this) );
		this.signInCallbackId = MessageDispatcher.subscribe( AppConstants.EVENT_ON_FINISH_SIGN_IN, this.finishSignIn.bind(this) );
		this.stationChangeCallbackId = MessageDispatcher.subscribe( AppConstants.EVENT_ON_STATION_CHANGE, this.setRadioName.bind(this) );
		this.stationListChangeCallbackId = MessageDispatcher.subscribe( AppConstants.EVENT_ON_STATION_LIST_CHANGE, this.setRadioList.bind(this) );

		this.popupStack = [];
		
		var params = enyo.windowParams;
		if ( params.windowType == "dockModeWindow" && params.dockMode) {
			this.$.exhibitionMargin.applyStyle("height", "40px");
		}
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
	
	backToMain: function() {
		this.$.pullout.hide();
		this.$.phoneMain.show();
		this.$.phoneMain.backToMain();
		this.$.backFromInfo.hide();
		if (AppGlobals.station && AppGlobals.station.started && this.$.phoneMain.$.songInfo.showing) {
			this.$.whyThisArtistButton.show();
			this.$.aboutArtistButton.show();
		} 
		else {
			this.$.whyThisArtistButton.hide();
			this.$.aboutArtistButton.hide();
		}
		if (AppGlobals.orientation) {
			enyo.setAllowedOrientation("up");
		}
		else {
			enyo.setAllowedOrientation("free");
		}
	},
	
	setRadioList: function() {
		if ( !AppGlobals.stationList ) {
			return;
		}
		var items = AppGlobals.stationList.slice(0).sort(AppGlobals.sortAlpha);
		for (var i=0; i < items.length; i++) {
			items[i].caption = Util.truncateText(items[i].stationName, 24);
			items[i].value = i;			
		}
		this.$.radioName.setItems( items );
		this.$.radioName.render();
		var arr = this.$.radioName.getItems();
		for ( var i = 0; i < arr.length; i++ ) {
		//	arr[i].applyStyle("font-size", "40px");
		}
		this.setRadioName();
	},
	
	setRadioName: function() {
		if ( AppGlobals.station && AppGlobals.station.started ) {
			if ( !this.$.radioName.showing ) {
				this.$.radioName.show();
				if (this.$.phoneMain.$.songInfo.showing) {
					this.$.whyThisArtistButton.show();
					this.$.aboutArtistButton.show();
				}
			}
			
			for ( var i = 0; i < this.$.radioName.items.length; i++ ) {
				if ( this.$.radioName.items[i].stationToken == AppGlobals.station.stationToken ) {
					this.$.radioName.setValue( i );
				}
			}
		}
		else {
			this.$.radioName.hide();
			this.$.whyThisArtistButton.hide();
			this.$.aboutArtistButton.hide();
			this.$.phoneMain.setRadioList();
			this.$.phoneMain.setRadioName();
		}
	},
	
	setStation: function( inSender, inValue ) {
		var stationData = this.$.radioName.getItems()[inValue];
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
	
	deleteStation: function( inSender, inValue ) {
		var stationData = this.$.radioName.getItems()[inValue];
		Api.deleteStation(stationData.stationToken, new DeleteStationDelegate(stationData.stationToken, this));
	},
	
	// The header's station name: slide the station list out, or back in. Returns true so the
	// selector doesn't also open its own popup. Side by side, the list is already showing.
	toggleStationList: function() {
		var pane = this.$.stationPane;
		if ( !pane.multiView ) {
			pane.selectViewByName( pane.getViewName() == "radioList" ? "mainView" : "radioList" );
		}
		return true;
	},

	// A station was chosen (from the list or anywhere else): back to what's playing.
	hideStationList: function() {
		var pane = this.$.stationPane;
		if ( !pane.multiView && pane.getViewName() == "radioList" ) {
			pane.selectViewByName("mainView");
		}
	},

	resizeHandler: function() {
		this.inherited(arguments);
		this.$.stationPane.resize();
	},

	windowRotated: function(inSender) {
		if ( this.popupStack && this.popupStack.length > 0 ) {
			this.popupStack[this.popupStack.length-1].close();
			this.popupStack[this.popupStack.length-1].open();
		}
	},
	
	changeBackgroundImage: function(inSender, inEvent) {
		AppGlobals.setBackgroundUrl(inEvent.target.src);
		this.$.phoneMain.applyStyle("background-image", "url('"+inEvent.target.src+"')");
		this.$.pullout.$.settings.closeImagePicker( false );
	},
	
	changeCustomBackgroundImage: function(inSender, inResponse, inEvent) {
		if ( inResponse.length ) {
			AppGlobals.setBackgroundUrl(inResponse[0].fullPath);
			this.$.phoneMain.applyStyle("background-image", "url('"+inResponse[0].fullPath+"')");
		}
		else {
			this.$.pullout.$.settings.closeImagePicker( true );
			return;
		}
		this.$.pullout.$.settings.closeImagePicker( false );
	},
	
	showWhyArtist: function() {
		this.$.phoneMain.showExplanation();
		this.$.backFromInfo.show();
		this.$.whyThisArtistButton.hide();
		this.$.aboutArtistButton.hide();
	},
	
	showAboutArtist: function() {
		this.$.phoneMain.showBio();
		this.$.backFromInfo.show();
		this.$.aboutArtistButton.hide();
		this.$.whyThisArtistButton.hide();
	},
	// Load station list etc.
	updateView: function() {
		if ( !AppGlobals.username ) {
			return;
		}
		//this.$.menuButton.show();
		//this.$.menuButton.setCaption(AppGlobals.username);
		//this.$.appMenu.applyStyle("width", (this.$.menuButton.node.clientWidth+5)+"px");
		while ( this.popupStack.length ) {
			this.popupStack.pop().close();
		}
		//var params = enyo.windowParams;
		//if ( params.windowType == "dockModeWindow" && params.dockMode && AppGlobals.simpleExhibition ) {
			if ( !AppGlobals.station && AppGlobals.stationList && AppGlobals.stationList.length > 0 && AppGlobals.startupAutoPlay && !this.firstSignIn ) {
				AppGlobals.setStation(AppGlobals.stationList[0]);
				AppGlobals.station.start();
			}
			// else if ( !AppGlobals.stationList || AppGlobals.stationList.length == 0 ) {
				// Api.musicSearch("Fryderyk Chopin", new MusicSearchDelegate());
			// }
			//this.$.menuButton.setDisabled(true);
			this.$.radioName.disabled = false;
			this.$.radioName.setHideArrow(false);
			this.$.radioList.updateView();
			this.$.viewPane.getView().snapArt();
	//		if (this.$.primaryInterface) {
	//			this.$.primaryInterface.$.contentPage.unsubscribe();
	//		}
		// }
		// else {
			// this.$.viewPane.selectViewByName("primaryInterface", true);
			// this.$.menuButton.setDisabled(false);
			// this.$.radioName.disabled = true;
			// this.$.radioName.setHideArrow(true);
			
	// //		if (this.$.primaryInterface) {
	// //			this.$.primaryInterface.$.contentPage.subscribe();
	// //		}
			// if ( params.windowType == "dockModeWindow" && params.dockMode ) {
				// enyo.setFullScreen(true);
			// }
			// else {
				// enyo.setFullScreen(AppGlobals.fullscreen);
			// }
			// this.$.primaryInterface.$.radioList.updateView();
			// enyo.nextTick( this.$.primaryInterface.$.contentPage, "updateView" );
		// }
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
		AppGlobals.isFirstLoginWithNewDeviceId = true;
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
				this.$.phoneMain.ready();
				this.$.phoneMain.showWelcomeMessage();
			}
			this.$._appMenu.setAutomatic(true);
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
	   	this.$.introPopup.open();
	},
	
	appmenuPopup: function(inSender, inEvent) {
	//	this.$.appMenu.openAt({top: 28, right: 2});
	},
	
	infoPopup: function() {
		this.$.infoPopup.open();
	
	},
	
	signInPopup: function(inSender, inEvent) {
		this.popupStack.push(this.$.signInPopup);
		this.popupStack[this.popupStack.length-2].close();
		this.$.signInPopup.open();
	},
	
	registerPopup: function(inSender, inEvent) {
		this.popupStack.push(this.$.registerPopup);
		this.popupStack[this.popupStack.length-2].close();
		this.$.registerPopup.open();
	},
	
	requestPassPopup: function( inSender ) {
		this.popupStack.push(this.$.requestPassPopup);
		this.popupStack[this.popupStack.length-2].close();
		this.$.requestPassPopup.open();
	},
	
	closePopup: function(inSender) {
	    var container = inSender.container;
	    while(container.kind != "Dialog") {
	    	 container = container.container;
	    }
		container.close();
		if ( this.popupStack[this.popupStack.length-1] == container ) {
			this.popupStack.pop();
			this.popupStack[this.popupStack.length-1].open();
		}
	},

	popupOpened: function( inSender ) {
		if ( inSender.name == "registerPopup" ) {
			// this.$.registerPopup.applyStyle("top", "50px");
			
		}
		else if ( inSender.name == "signInPopup" ) {
			// this.$.signInPopup.applyStyle("top", "150px");
		}
		else if ( inSender.name == "requestPassPopup" ) {
			// this.$.requestPassPopup.applyStyle("top", "150px");
		}
	},
	
	showPullout: function(inSender) {
		enyo.setAllowedOrientation("up");
		if ( inSender.caption == "Settings" ) {
			this.$.pullout.currentView = "settings";
		}
		else if ( inSender.caption == "Help" ) {
			this.$.pullout.currentView = "help";
		}
		else if ( inSender.caption == "My Bookmarks" ) {
			this.$.pullout.currentView = "bookmarks";
			Api.getSongBookmarks(new GetBookmarkDelegate());
		    Api.getArtistBookmarks(new GetBookmarkDelegate());
		}
		this.$.phoneMain.hide();
		this.$.pullout.revealContent();
		this.$.pullout.show();
		this.$.aboutArtistButton.hide();
		this.$.whyThisArtistButton.hide();
		this.$.backFromInfo.hide();
		
	}
	
	
});
