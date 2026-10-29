enyo.kind({
	name:"help",
	kind:"VFlexBox", 
	style:"background-color:#081228; color:#FFFFFF;", 
	flex:1,
	components:[
		{name: "launchApplicationService", kind: enyo.PalmService, service: enyo.palmServices.application, method: "open"},
		{
			kind: "PalmService", 
			name: "appCatalog", 
			service: "palm://com.palm.applicationManager"
		},
		{
			kind:"RowGroup", caption:"Pandora",
			components: [			{
					kind:"HFlexBox", align:"center", 
					components:[
						{content:"Pandora Help", className:"settingsHelpFont"},
						{flex:1},
						{kind:"Button", className:"enyo-button-blue", content:"Open website", onclick:"openHelp"}
					]
				},
			]
		},
		{
			kind:"RowGroup", caption:"Developer feedback",
			components:[
				{
					kind:"HFlexBox", tapHighlight: true, align:"center", onclick:"submitEmail",
					components:[
						{content:"Email Feedback", className:"settingsHelpFont"},
						{flex:1},
						{kind:"Image", style:"width:39px; height:39px;", src:"images/email.png"}
					]
				},
				{
					kind:"HFlexBox", tapHighlight: true, align:"center", onclick:"openTwitter",
					components:[
						{content:"Tweet to @JakeMorrison24", className:"settingsHelpFont"},
						{flex:1},
						{kind:"Image", style:"width:39px; height:39px;", src:"images/twitter.png"}
					]
				},
				{
					kind:"HFlexBox", tapHighlight: true, align:"center", onclick:"openReview",
					components:[
						{content:"Submit App Review", className:"settingsHelpFont"},
						{flex:1},
						{kind:"Image", style:"width:36px; height:36px;", src:"images/review.png"}
					]
				},
				{
					kind:"HFlexBox", tapHighlight: true, align:"center", onclick:"openDonate",
					components:[
						{content:"Show support", className:"settingsHelpFont"},
						{flex:1},
						{kind:"Image", style:"width:42px; height:42px;", src:"images/donate.png"}
					]
				}
			]
		},
		{kind:"BasicScroller", flex:1,
				components:[
					{kind:"HtmlContent", style:"margin-left:5px", srcId:"faq", onLinkClick: "linkClick"},
					{flex:0.2}
				]
		},
		

	],
	submitEmail: function(inSender) {
		var params = {
			summary: "Apollo Feedback",
			text: "<br><br><br><font color=#CCCCCC>webOS Version: "+AppGlobals.deviceInfo.platformVersion+"<br>Device Type: "+AppGlobals.deviceInfo.modelNameAscii+"</font>",
			recipients: [{
			type:"email",
			role:1,
			value:"EnyoPandora@gmail.com",
			contactDisplay:"Apollo Developer" }]
			};
		this.$.launchApplicationService.call({id: "com.palm.app.email", params: params});

	},
	
	linkClick: function( inSender, inUrl ) {
		this.$.launchApplicationService.call( { id: "com.palm.app.browser", params: {target: inUrl} } );
	},
	
	openHelp: function(inSender) {
		var params = {
			target: "http://help.pandora.com/"
		};
		this.$.launchApplicationService.call({id: "com.palm.app.browser", params: params});
	},
		
	openTwitter: function(inSender) {
		var params = {
			target: "http://www.twitter.com/JakeMorrison24"
		};
		this.$.launchApplicationService.call({id: "com.palm.app.browser", params: params});
	},
	
	openReview: function(inSender) {
		Util.showBannerMessage("Email us with your feedback too!");
		this.$.appCatalog.call(
           	 {target: "http://developer.palm.com/appredirect/?packageid=com.jmtk.apollophone"},
            	 {method: "open"}
		);
	},
	openDonate: function(inSender) {
		var params = {
			target: "https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=jake%2emorrison24%40gmail%2ecom&lc=US&item_name=Apollo%20for%20webOS&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted"
		};
		this.$.launchApplicationService.call({id: "com.palm.app.browser", params: params});
	},
}
);
