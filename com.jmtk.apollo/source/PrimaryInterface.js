enyo.kind({
	kind: "SlidingPane", name: "PrimaryInterface", flex: 1, dismissDistance: 1, 
	components: [
		{
			kind:"SlidingView", name: "radioContentContainer", flex: 1, showing: true, style:"background-color:#081228;", onResize: "contentResize",
			components: [
				{
					kind: "SlidingPane", style:"background-color:#081228;",  name: "innerPane", flex: 1,
					components: [
						{width: "210px", kind:"radioList", name:"radioList", fixedWidth: true, dragAnywhere: false, edgeDragging: false, showing: false}, 
						{flex: 1, kind:"contentPage", name:"contentPage", onResize:"contentResize", dragAnywhere: false, edgeDragging: false, showing: false}
					]
				}
			]
		},
		{width: "0px", kind: "pullout", name:"pullout", onDismiss: "pulloutDismissed", onImagePick: "changeBackgroundImage", onImagePickCustom: "changeCustomBackgroundImage", showing: false, dismissible: true}
	],
	
	paneSlideDone: function(inSender, inEvent) {
		if ( inEvent.canTrigger == undefined ) {
			inEvent.canTrigger = true;
			return;
		}
		if ( inEvent.name == "pullout" ) {
			if ( inEvent.showing ) {
				inEvent.revealContent();
				return;
			}
		}
	},
	
	contentResize: function(inSender) {
		var offset = 0;
		if ( this.$.innerPane.getViewName() == "radioList" ) {
			offset = this.$.radioList.hasNode().clientWidth;
		}
		else {
			this.$.radioList.stopSearch();
		}
		this.$.contentPage.$.contentScrim.applyStyle("width", Application.getWidth() - offset+"px");
		this.$.contentPage.adjustForResizing();
	},
	
	pulloutDismissed: function( inSender ) {
		inSender.hideContent();
	},
	
	changeBackgroundImage: function(inSender, inEvent) {
		AppGlobals.setBackgroundUrl(inEvent.target.src);
		this.$.contentPage.$.contentFlex.applyStyle("background-image", "url('"+inEvent.target.src+"')");
		this.$.pullout.$.settings.closeImagePicker( false );
	},
	
	changeCustomBackgroundImage: function(inSender, inResponse, inEvent) {
		if ( inResponse.length ) {
			AppGlobals.setBackgroundUrl(inResponse[0].fullPath);
			this.$.contentPage.$.contentFlex.applyStyle("background-image", "url('"+inResponse[0].fullPath+"')");
		}
		else {
			this.$.pullout.$.settings.closeImagePicker( true );
			return;
		}
		this.$.pullout.$.settings.closeImagePicker( false );
	},
	
	resizeHandler: function() {
		this.$.radioContentContainer.applySize( Application.getWidth(), false );
		this.$.pullout.peekWidth = Application.getWidth() - this.$.pullout.reach;
	},
	
	
}
);
