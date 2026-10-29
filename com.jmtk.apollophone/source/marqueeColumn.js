enyo.kind({
	name: "marqueeColumn",
	kind: "Repeater",
	rendered: function() {
		if ( this.marquee || !this.hasNode() ) 
			return; 
		this.marquee = true; 
		this.speed = Math.floor((Math.random()*16)+1);
		this.hasNode().wrap("marquee", {"direction": "down", "scrolldelay":"70", "scrollamount":""+this.speed+"", "height":"800px"});
		this.inherited(arguments); 
	},
	
	stop: function() {
		this.hasNode().stop();
	},

	start: function() {
		this.hasNode().start();
	}
});
	
