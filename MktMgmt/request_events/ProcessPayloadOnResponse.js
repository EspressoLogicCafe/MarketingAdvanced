var title = "ProcessPayload Response Event: ";
if ("ProcessCharges" == req.resourceName && req.verb.toString() == 'POST') {
    // now process payload, using function get: http://localhost:8080/rest/default/MktMgmt/v1/MessageAudits/102/ProcessPayload
    var reqData = {};
    reqData.msgContent = req.json;
    print(title + "is audited: " + MktMgmt.resourcesToAudit[req.resourceName] + ", payload: " + req.json);
    var functionURL = MktMgmt.resourceURL + "/PersistCharges" ; // + id + "/ProcessPayload";
    var persistPayloadResponse = SysUtility.restPost(functionURL, {}, MktMgmt.authHeader, reqData);
    print(title + "Payload Persisted, processPayloadResponse: " + persistPayloadResponse);
}
