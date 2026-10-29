enyo.kind({
	name: "marqueeColumn",
	kind: "Repeater",
	rendered: function() {
		if ( this.marquee || !this.hasNode() ) 
			return; 
		this.marquee = true; 
		var rand = Math.floor((Math.random()*16)+1);
		this.hasNode().wrap("marquee", {"direction": "down", "scrolldelay":"70", "scrollamount":""+rand+"", "height":"1000px"});
		this.inherited(arguments); 
	}
});
	
