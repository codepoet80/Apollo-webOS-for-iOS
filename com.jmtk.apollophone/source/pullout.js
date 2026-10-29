enyo.kind({
	name:"pullout",
	kind:"VFlexBox",
	flex:1,
	donors: [],
	published: {
		"currentView": "",
		//"reach": 405
	},
	events: {
		"onImagePick":"",
		"onImagePickCustom":"",
		"onBackMain":""
	},
	components:[
		{kind:"settings", flex:1, onImagePick:"doImagePick", onImagePickCustom: "doImagePickCustom", showing:false},
		{kind:"help", flex:1, showing:false}, 
		{kind:"bookmarks", flex:1, showing:false},
		{kind:"VFlexBox", showing:false, flex:1, name:"donorDrawer",
		style:"background-color:#081228; color:#FFFFFF;", 
			components:[
				{name:"loadingtext", content:"Loading...", style:"font-size:20px;"},
				{kind :"BasicScroller", flex:1, components:[
					{kind:"VirtualRepeater", name:"donorList", onSetupRow:"donorsRows",
						components:[
							{kind:"Item", name:"resultItem", components:[ 
								{name:"donorName", className:"settingsHelpFont", content:""} 
								]
							 }
						]
					}
					]
				},
				{content:"Thank you for donating!", style:"font-size:20px; text-align:center; padding:7px;"}
			]
		},
		{kind:"BasicScroller", showing:false, flex:1, name:"changelog",
		style:"background-color:#081228; color:#FFFFFF;", 
			components:[
				{kind:"HtmlContent", srcId:"changelog", style:"margin-left:4px;"}
			]
		},
		{
			kind: "Toolbar", showing:false, name: "toolbar", style:"background-color:#061023;", 
			components: [
				//{slidingHandler: true, kind: "GrabButton", style:"background-image: url('images/grabbutton.png');"},
				{kind:"ToolButton", name:"backMain", content:"Back to Main", onclick:"doBackMain"},
				{flex:1},
				{kind:"ToolButton", name:"toDonors", content:"Our Supporters", onclick:"showDonors"},
				{kind:"IconButton", icon: "images/changelog.png", name:"changelogButton", width:"32px", style:"background-color:#040d1c;", onclick:"showChangelog"},
				{kind:"ToolButton", name:"backContent", showing:false, content:"Back", onclick:"revealContent"}
			]
		}
	],
	
	revealContent: function() {
		this.$.donorDrawer.hide();
		this.$.toDonors.show();
		this.$.backContent.hide();
		this.$.changelog.hide();
		this.$.changelogButton.show();
		
		if ( !this.$.toolbar.showing ) {
			this.$.toolbar.show();
		}
		if ( this.currentView == "settings" && !this.$.settings.showing ) {
			this.$.help.hide();
			this.$.settings.show();
			this.$.bookmarks.hide();
		}
		else if ( this.currentView == "help" && !this.$.help.showing ) {
			this.$.settings.hide();
			this.$.help.show();
			this.$.bookmarks.hide();
		}
		else if (this.currentView == "bookmarks" && !this.$.bookmarks.showing ) {
			this.$.settings.hide();
			this.$.help.hide();
			this.$.bookmarks.show();
		}
	},
	
	hideContent: function() {
		this.$.settings.hide();
		this.$.help.hide();
		this.$.bookmarks.hide();
	},
	
	showDonors: function() {
		//Buttons
		this.$.toDonors.hide();
		this.$.changelogButton.hide();
		this.$.backContent.show();
	
		//Content
		this.$[this.currentView].hide();
		this.$.donorDrawer.show();	
		
		//Ajax
		this.openDonors();
	},
	
	showChangelog: function() {
		//Buttons
		this.$.toDonors.hide();
		this.$.changelogButton.hide();
		this.$.backContent.show();
	
		//Content
		this.$[this.currentView].hide();
		this.$.changelog.show();	
		
	},
	
	donorsRetrieved: function( transport ) {
		var data = null;
		try {
			if ( transport.responseText != "" ) {
				data = enyo.json.parse(transport.responseText);
			}
		} catch(e) {
			this.log("Could not parse donor list: " + e);
		}
		if ( !data || !data.donors ) {
			this.donorsFailed();
			return;
		}
		this.donors = data.donors;
		this.$.loadingtext.hide();
		this.$.donorList.render();
	},

	donorsFailed: function() {
		this.donors = [];
		this.$.loadingtext.setContent("Supporter list is not available.");
		this.$.donorList.render();
	},

	donorsRows: function (inSender, inIndex) {
		if ( inIndex < this.donors.length ) {
			var name = this.donors[inIndex];
			this.$.donorName.setContent(name);
			if ( inIndex == 0 ) {
				this.$.resultItem.domStyles["border-top"] = "none";
			}
			else if ( inIndex == (this.donors.length-1) ) {
				this.$.resultItem.domStyles["border-bottom"] = "none";
			}
			return true;
		}
	},
	
	openDonors: function() {
		this.$.loadingtext.setContent("Loading...");
		this.$.loadingtext.show();
		var request = new Ajax.Request( "http://cs.clemson.edu/~tkimmet/donors.json", {
			method: "GET",
			onSuccess: this.donorsRetrieved.bind(this),
			onFailure: this.donorsFailed.bind(this)
		});
	}
}
);