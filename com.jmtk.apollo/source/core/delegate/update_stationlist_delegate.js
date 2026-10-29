var UpdateStationListDelegate = Class.create(BaseDelegate, {

    initialize: function(){
    },
    
    onError: function(error){
    },
    
    onSuccess: function(result){		
        AppGlobals.setStationListChecksum(result['checksum']);       	
        if (result['stations'] == null || result['stations'].length == 0) {
			AppGlobals.setStationList([]);
        }
        else {
			AppGlobals.setStationList(result['stations']);
        }
    }
});
