var title = "ProcessPayload Request Event: ";
var resourceInfo = MktMgmt.resourcesToAudit;
// print(title + "checking for resource: " + req.resourceName + " in: " + JSON.stringify(MktMgmt.resourcesToAudit));
if (MktMgmt.resourcesToAudit[req.resourceName] === true && req.verb.toString() == 'POST') {
    var reqData = {};
    reqData.msgContent = req.json;
    print(title + "is audited: " + MktMgmt.resourcesToAudit[req.resourceName] + ", payload: " + req.json);
    var functionURL = MktMgmt.resourceURL + "/PersistCharges" ; // + id + "/ProcessPayload";
    var persistPayloadResponse = SysUtility.restPost(functionURL, {}, MktMgmt.authHeader, reqData);
    print(title + "Payload persisted for resource: " + req.resourceName + ", processPayloadResponse: " + persistPayloadResponse);
} else {
    print(title + "Payload **not** persisted for resource: " + req.resourceName);
}

