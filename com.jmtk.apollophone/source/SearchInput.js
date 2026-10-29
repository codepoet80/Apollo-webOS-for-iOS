enyo.kind({
	name: "customSearchInput",
	kind: enyo.Input,
	changeOnInput: true,
	alwaysLooksFocused: true,
	hint: enyo._$L("Search"),
	keypressInputDelay: 250,
	className:"enyo-input enyo-rounded-input",
	events: {
		onCancel: ""
	},
	components: [
		{name: "icon", kind: "CustomButton", className: "enyo-search-input-search", onclick: "iconClick"},
		{kind: "Spinner", name: "spinner", showing: false}
	],
	//* @protected
	iconClick: function() {
		if (!this.isEmpty()) {
			this.setValue("");
			this.doCancel();
		}
	},
	inputHandler: function() {
		this.updateIconClass();
		return this.inherited(arguments);
	},
	updateIconClass: function() {
		var empty = this.isEmpty();
		if (empty != this.lastEmpty) {
			this.$.icon.addRemoveClass("enyo-search-input-cancel", !empty);
		}
		this.lastEmpty = empty;
	},
	toggleSpinner: function( state ) {
		if ( !state ) {
			this.$.spinner.hide();
			this.$.icon.show();
		}
		else {
			this.$.icon.hide();
			this.$.spinner.show();
		}
	},
	valueChanged: function() {
		this.inherited(arguments);
		this.updateIconClass();
	}
});
