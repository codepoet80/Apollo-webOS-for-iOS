enyo.kind({
	name: "Canvas", 
	kind: "enyo.Control",
    nodeTag: "div",
	className:"wrapper",
	domAttributes: { 
    	width: "50px",
    	height:"50px",
	},

	create: function() {
		this.inherited(arguments);
	},

	rendered: function() {
		var n = this.hasNode();
		var cl = new CanvasLoader(n.id);
		
		//For more info: http://heartcode.robertpataki.com/canvasloader/
		cl.setColor('#ebebeb');
		cl.setShape('oval');
		cl.setDiameter(95);
		cl.setDensity(80);
		cl.setRange(1);
		cl.setSpeed(3.2);
		cl.setFPS(32);

		this.cl = cl;
	},

	show: function() {
		this.cl.show();
		this.inherited(arguments);
	},

	hide: function() {
		this.cl.hide();
		this.inherited(arguments);
	}
});
