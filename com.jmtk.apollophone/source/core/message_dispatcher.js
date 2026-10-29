var MessageDispatcher = Class.create({

	initialize: function(code) {
		this.handlers = new Hash();
		this.callbackIdGenerator = 0;
	},

	subscribe: function(type, callback) {
		
		if (this.handlers.get(type) == null) {
			this.handlers.set(type, new Hash());
		}
		var handlerMap = this.handlers.get(type);
		var callbackId = this.callbackIdGenerator++;
		handlerMap.set(callbackId, callback);
		this.handlers.set(type, handlerMap);
		return callbackId;
	},

	unsubscribe: function(type, callbackId) {
		if (this.handlers.get(type) == null) return;
		var handlerMap = this.handlers.get(type);
		if (handlerMap == null) return;
		handlerMap.unset(callbackId);
		this.handlers.set(type, handlerMap);
	},

	dispatchMessage: function(type, message) {
		var handlerMap = this.handlers.get(type);
		if (handlerMap == null) return;
		var keys = handlerMap.keys();
		for (var index = 0, len = keys.length; index < len; ++index) {
			var handlerKey = keys[index];
			var handler = handlerMap.get(handlerKey);
			if ( handler == undefined ) {
				// unsubscribed during this dispatch; keep delivering to the rest
				continue;
			}
			//enyo.error("Dispatching '"+type+"' message");
			try {
				handler(message);
			} catch(ex) {
				enyo.error(ex, "Exception while dispatching message on "+type);
			}
		}
	}

});
