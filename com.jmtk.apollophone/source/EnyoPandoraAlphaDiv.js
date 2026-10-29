/**
A divider designed to show a single letter as its caption. For example:

	{kind: "AlphaDivider", caption: "S"}

*/
enyo.kind({
	name: "EnyoPandoraAlphaDiv",
	kind: enyo.Control,
	className: "alphaDivider",
	published: {
		caption: ""
	},
	components: [
		{name: "caption", className: "alphaDivider-caption"}
	],
	//* @protected
	create: function() {
		this.inherited(arguments);
		this.captionChanged();
	},
	captionChanged: function() {
		this.$.caption.setContent(this.caption);
		if ( this.caption == "W" || this.caption == "M" ) {
			this.$.caption.applyStyle("padding", "0 23px");
		}
		else if ( this.caption == "H" || this.caption == "G" || this.caption == "O" || this.caption == "Q" ) {
			this.$.caption.applyStyle("padding", "0 24px");
		}
		else if ( this.caption == "I" ) {
			this.$.caption.applyStyle("padding", "0 26px");
		}
	}
});
