function Util() {
}

Util.isEmpty = function(string) {
    if (string == null || string == undefined || string.length == 0 || Util.trim(string).length == 0) {
        return true;
    }
    return false;
}

Util.trim = function(str) {
    return str.replace(/^\s+|\s+$/g, '');
}

Util.isValidZip = function(string) {
    return true;
}

Util.appendToHash = function(hash, originalHash) {
    return originalHash.merge($H(hash)).toObject();
}

Util.TEXT_FIELD_ATTRIBUTES = $H({
	property: 'original',
	modelProperty: 'value',
	multiline: false,
	limitResize: false,
	enterSubmits: false,
	changeOnKeyPress: true,
	textReplacement: false,
	disabledProperty: 'disabled'
});

Util.arrayToString = function(array) {
    var str = "";
    for (var i = 0; i < array.length; ++i) {
        str += array[i] + "<br/><br/>";
    }
    return str;
}

Util.truncateText = function(text, limit) {
    var elipse = "...";
    var limitWithElipise = limit - elipse.length;
    if (text.length > limit) {
        return text.substr(0, limitWithElipise) + elipse;
    } else {
        return text;
    }
}

Util.floor = function(number, target) {
    var mod = -1;
    while (mod != 0) {
        // Util.log("LOOP: Util.floor() number: " + number + " target: " + target);
        mod = number % target;
        if (mod == 0) {
            break;
        } else {
            number--;
        }
    }
    return number;
}


Util.showError = function(messageArray) {
    var message = Util.arrayToString(messageArray);
    var title = null;
    if (messageArray.length > 1) {
        title = AppConstants.MSG_ERROR_TITLE_PLURAL;
    }
	else {
        title = AppConstants.MSG_ERROR_TITLE_SINGULAR;
    }
	var dlg = {
		kind: "Dialog",
		components: [
			{ content: title, className: "enyo-dialog-prompt-title" },
			{ content: message, className: "enyo-dialog-prompt-message" },
			{ kind: enyo.Button, caption: "Okay", onclick: "callback" }
		]
	};
	Application.errCallback = function() { this.$.errorDlg.close(); };
	Application.showError( dlg );
}

Util.showMessage = function(title, message) {
	var dlg = {
		kind: "Dialog",
		components: [
			{ content: title, className: "enyo-dialog-prompt-title" },
			{ content: message, className: "enyo-dialog-prompt-message" },
			{ kind: enyo.Button, caption: "Okay", onclick: "callback" }
		]
	};
	Application.errCallback = function() { this.$.errorDlg.close(); };
	Application.showError( dlg );
}

Util.showMessageWithCallback = function(title, message, callback) {
	var dlg = {
		kind: "Dialog",
		components: [
			{ content: title, className: "enyo-dialog-prompt-title" },
			{ content: message, className: "enyo-dialog-prompt-message" },
			{ kind: enyo.Button, caption: "Okay", onclick: "callback" }
		]
	};
	Application.errCallback = function() { this.$.errorDlg.close(); callback(); }.curry(callback);
	Application.showError( dlg );
}

Util.showRetryMessage = function(title, message, callback) {
	var dlg = {
		kind: "Dialog",
		flyInFrom: "bottom",
		dismissWithClick: false,
		dismissWithEscape: false,
		scrim: true,	
		components: [
			{ content: title, className: "enyo-dialog-prompt-title" },
			{ content: message, className: "enyo-dialog-prompt-message" },
			{ kind: enyo.Button, caption: "Retry", onclick: "callback" }
		]
	};
	Application.errCallback = function() { this.$.errorDlg.close(); callback(); }.curry(callback);
	Application.showError( dlg );
	if ( Application.dashboardShowing() ) {
		Util.showBannerMessage(message);
	}
}

Util.httpGet = function(url) {
    var request = new Ajax.Request(url, {
        method: 'get',
        onSuccess: Util.onSuccess
    });
}

Util.onSuccess = function(response) {
    Util.log("http get complete: " + response.status);
}

Util.showBannerMessage = function(inMessage) {
    enyo.windows.addBannerMessage(inMessage, "{}");
}

Util.isWebkit = function() {
    return Mojo.Host.current == Mojo.Host.mojoHost;
}

Util.inspectObject = function(object) {
    for (name in object) {
        Util.log(name);
    }
}

Util.trimNonAscii = function(utftext) {
    var s = "";
    var c = 0;

    Util.log("length: " + utftext.length);

    for (var i = 0; i < utftext.length; ++i) {

        c = utftext.charCodeAt(i);
        if (c < 8000) {
            s += String.fromCharCode(c);
        } else {
            Util.log("over: " + c);
        }
    }

    Util.log("length: " + s.length);
    return s;
};

Util.log = function(message) {
    if (AppGlobals.debug) {
        enyo.log(Util.PREFIX + message);
    }
}

Util.secondsToTimeString = function(secs) {
    var s = Math.round(secs);
    var minVar = Math.floor(s / 60);
    var secVar = s % 60;
    if (secVar < 10) {
        secVar = "0" + secVar;
    }
    return minVar + ":" + secVar;
}

Util.sendHeadRequest = function(url, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("HEAD", url, true);
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            Util.log("HEAD returned: " + xmlhttp.status);
            var contentLength = xmlhttp.getResponseHeader(Util.CONTENT_LENGTH);
            callback(xmlhttp.status, contentLength, url);
        }
    }
    xmlhttp.send(null);
}

Util.getSceneParams = function(name, transition, disableSceneScroller) {
    var o = {};
    o.name = name;

    if (transition != null) {
        o.transition = transition;
    }

    if (disableSceneScroller != null) {
        o.disableSceneScroller = disableSceneScroller;
    }
    return o;
}


Util.PREFIX = "PANDORA> ";
Util.CONTENT_LENGTH = "Content-Length";
Util.HEAD = "HEAD";
