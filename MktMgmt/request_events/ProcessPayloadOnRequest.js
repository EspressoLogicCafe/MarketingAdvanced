var title = "ProcessPayload Request Event (2): ";
// print(title + "Started, with Config: " + JSON.stringify(Config) + "/n");
if ( ! Config.hasOwnProperty('settings') ) { 
    print(title + "no settings - no action (eg., during startup listener");
} else {
    if (Config.settings.hasOwnProperty('resourcesToAudit') ) {
        var resourceInfo = Config.settings.resourcesToAudit;
        // print(title + "checking for resource: " + req.resourceName + " in: " + JSON.stringify(resourceInfo) + ", Config: " + JSON.stringify(Config));
        if (resourceInfo[req.resourceName] === true && req.verb.toString() == 'POST') {
            var reqData = {};
            reqData.msgContent = req.json;
            print(title + "is audited - persisting: " + resourceInfo[req.resourceName] + ", payload: " + req.json);
            var functionURL = Config.settings.resourceURL + "/PersistCharges" ; // + id + "/ProcessPayload";
            var persistPayloadResponse = SysUtility.restPost(functionURL, {}, Config.settings.authHeader, reqData);
        } else {
            // print(title + "Payload **not** persisted for resource: " + req.resourceName);
        }
    }
}
