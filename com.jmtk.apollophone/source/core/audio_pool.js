// AudioPool provided by Palm - Re-use audio instances as they don't get GC'd (because they are part of the DOM).

var AudioPool = {
    _list: [],

    getInstance: function(soundComponent) {
		Util.log("AudioPool.getInstance");
        var idx = 0;
        var found = false;
        var retVal = null;

        while ((idx != AudioPool._list.length) && (!found)) {
            Util.log("LOOP: audioPool.getInstance()");
            if (AudioPool._list[idx].isFree && !AudioPool._list[idx].audio.broken) {
                found = true;
                AudioPool._list[idx].isFree = false;
                AudioPool._list[idx].soundComponent = soundComponent;
                retVal = AudioPool._list[idx].audio;
                if (retVal.broken) {
                    continue;
                }
                retVal.recycled = true;
                Util.log("POOL: recycled");
            }
            else {
                ++idx;
            }

        }

        if (!found) {
            var audio;
            if (!soundComponent) {
				// enyo.log("AudioPool: no soundComponent found, creating enyo.Sound instance");
                // audio = new Element('audio', {
                    // 'controls': false,
                    // 'x-palm-media-audio-class': "media"
                // });
				var aClass;
				if ( AppGlobals.platform == "device" ) {
					aClass = 'media';
				}
				soundComponent = enyo.create( { kind: "customSound", audioClass: aClass, preload: false } );
				//enyo.log(soundComponent);
                // document.body.appendChild(audio);
				Application.addSound( soundComponent );
				// enyo.log("AudioPool: was able to add sound to Application");
            }
            // try {
                // // New API for 1.4.  Palm specific APIs for media are in this loadable library.
                // // DO NOT include media.js any more, use this instead.
                // this.libs = MojoLoader.require({ name: "mediaextension", version: "1.0"});
            // }
            // catch(e) {
                // // Prior to 1.4 MojoLoader.require() was restricted to palm apps.  Calling it on
                // // older builds will result in an exception.
                // enyo.log("Cannot load mediaextension library: " + e.message);
            // }
            // try {
                // if (this.libs && this.libs.mediaextension) {
					// enyo.log("AudioPool: libs and libs.mediaextension are valid, creating new audio object and setting class to 'media'");
                    // audio = new Audio();
					// // audio = soundComponent.audio;
                    // audio.broken = false;
                    // audio.recycled = false;
					// audio.audioClass = 'media';

                    // // Palm extensions library is present, get the extension API for the
                    // // audio object in the scene.
                    // this.audioExt = this.libs.mediaextension.MediaExtension.getInstance(audio);

                    // // 1.4 replacement for what previous would be "myAudioObj.palm.audioClass = 'navigation'" - see below
                    // this.audioExt.audioClass = 'media';
                // }
            // }
            // catch(e) {
                // enyo.log("PlayAudioAssistant::setup threw: " + e);
            // }
			audio = soundComponent.audio;
			audio.broken = false;
			audio.recycled = false;
			
            Util.log("POOL: new");


            AudioPool._list.push({audio: soundComponent.audio, isFree: false, soundComponent: soundComponent});
            retVal = audio;
        }

        Util.log("audio pool size: " + AudioPool._list.length);
        return retVal;
    },

    _releaseInstanceByIdx: function(idx) {
        var entry = AudioPool._list[idx];

        entry.isFree = true;
        if (entry.audio.src !== null) {
	Util.log("PAUSING FROM AUDIO POOL");
            entry.audio.pause();
        }
		
    },

    releaseInstance: function(audio) {
        var idx = 0;
        var found = false;

        while ((idx != AudioPool._list.length) && (!found)) {
            Util.log("LOOP: audioPool.releaseInstance()");
            if (AudioPool._list[idx].audio === audio) {
                found = true;
            }
            else {
                ++idx;
            }
        }

        if (found) {
            AudioPool._releaseInstanceByIdx(idx);
        }
    },


    getInstanceCount: function() {
        return AudioPool._list.length;
    },

    cleanup: function() {
        var idx = 0;
        var found = false;

        while (idx != AudioPool._list.length) {
            Util.log("LOOP: audioPool.cleanup()");
            var soundComponent = AudioPool._list[idx].soundComponent;
            if (soundComponent) {
                soundComponent.destroy();
            }
            AudioPool._releaseInstanceByIdx(idx);

            ++idx;
        }
    }
}
