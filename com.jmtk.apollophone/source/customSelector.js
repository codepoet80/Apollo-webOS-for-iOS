enyo.kind({
	name: "customSelector",
	kind: enyo.Control,
	published: {
		/**
		The currently selected value.
		*/
		value: undefined,
		/**
		An array of strings or objects specifying the item choices. If objects are specified,
		they are component configurations and do not specify a kind. Typically, a caption and value
		are specified.
		*/
		items: [],
		/**
		A label descibing the set of available choices. It is shown to the left of the drop-down arrow.
		*/
		label: "",
		/**
		Hides the displayed item.
		*/
		hideItem: false,
		/**
		Hides the drop-down arrow.
		*/
		hideArrow: false,
		disabled: false,
		/**
			Determines with which side of the list selector to align the popup; defaults to right, can also be left.
		*/
		popupAlign: "right",
		/**
			Determines if the content of the list selector is packed to start (default), middle, or end.
		*/
		contentPack: "start"
	},
	events: {
		/**
		Event fired when the selected value changes. The event sends both the current and previous values.
		*/
		onChange: "",
		/**
		Event fired whenever an item is selected, even if it is the same item that was previously selected.
		*/
		onSelect: "",
		onDelete: "",
	},
	layoutKind: "HFlexLayout",
	itemKind: "customMenuCheck",
	className: "enyo-listselector",
	align: "center",
	chrome: [
		{name: "content", kind: "HFlexBox", flex: 1, components: [
			{name: "itemContainer"},
			{name: "client"}
		]},
		{name: "label", className: "enyo-listselector-label enyo-label"},
		{name: "arrow", className: "enyo-listselector-arrow"}
	],
	//* @protected
	create: function(inProps) {
		this.inherited(arguments);
		this.item = this.$.itemContainer.createComponent(
			{kind: this.itemKind, itemClassName: "enyo-listselector-item", tapHighlight: false, owner: this}
		);
		this.makePopup();
		this.contentPackChanged();
		this.itemsChanged();
		this.disabledChanged();
		this.labelChanged();
		this.hideArrowChanged();
	},
	disabledChanged: function() {
		this.$.itemContainer.addRemoveClass("enyo-disabled", this.disabled);
	},
	contentPackChanged: function() {
		this.$.content.pack = this.contentPack;
		this.$.content.flow();
	},
	hideItemChanged: function() {
		this.item.setShowing(!this.hideItem);
	},
	labelChanged: function() {
		this.$.label.setContent(this.label);
	},
	hideArrowChanged: function() {
		this.$.arrow.setShowing(!this.hideArrow);
	},
	fetchDefaultItem: function() {
		var items = this.popup.getControls();
		if (items.length) {
			return items[0];
		}
	},
	makePopup: function() {
		this.popup = this.createComponent({
			kind: "PopupSelect",
			onBeforeOpen: "popupBeforeOpen",
			onSelect: "popupSelect",
			onDelete: "popupDelete",
			defaultKind: this.itemKind
		});
	},
	openPopup: function(inEvent) {
		this.popup.openAroundControl(this, false, this.popupAlign);
		this.popup.scrollToSelected();
	},
	popupBeforeOpen: function() {
		this.valueChanged();
	},
	clickHandler: function(inSender, inEvent) {
		if (!this.disabled) {
			// An owner whose onclick handles the tap (returns true) replaces the popup.
			if (!this.doClick(inEvent)) {
				this.openPopup(inEvent);
			}
		}
	},
	resizeHandler: function() {
		this.inherited(arguments);
		this.popup.resized();
	},
	itemsChanged: function() {
		this.items = this.items || [];
		this.popup.setItems(this.items);
		this.item.setShowing(this.items && this.items.length);
		this.valueChanged();
	},
	valueChanged: function(inOldValue) {
		var i = this.popup.fetchItemByValue(this.value);
		if (!i) {
			i = this.fetchDefaultItem();
			this.value = i ? i.getValue() : "";
		}
		if (this.value != inOldValue) {
			// disallow changes to invalid values
			if (i === undefined) {
				this.value = inOldValue;
			} else {
				// set content and style selection
				this.updateItem(i);
				this.popup.setSelected(i);
			}
		}
	},
	updateItem: function(inItem) {
		if (!this.hideItem) {
			this.setItemProps(inItem);
		}
		this.hideItemChanged();
	},
	setItemProps: function(inItem) {
		this.item.setCaption(inItem.caption);
		this.item.setIcon(inItem.icon);
	},
	popupSelect: function(inSender, inSelected, inOldItem) {
		var oldValue = this.value;
		this.setValue(inSelected.value);
		this.selected = inSelected;
		this.doSelect(this.value);
		if (this.value != oldValue) {
			this.doChange(this.value, oldValue);
		}
	},
	popupDelete: function(inSender, inValue) {
		this.doDelete(inValue);
	}
});
