var title = "ProcessPayload Request Event (2): ";
var resourceInfo = MktMgmt.resourcesToAudit;
// print(title + "checking for resource: " + req.resourceName + " in: " + JSON.stringify(MktMgmt.resourcesToAudit) + ", MktMgmt: " +JSON.stringify(MktMgmt));
if (MktMgmt.resourcesToAudit[req.resourceName] === true && req.verb.toString() == 'POST') {
    var reqData = {};
    reqData.msgContent = req.json;
    print(title + "is audited - persisting: " + MktMgmt.resourcesToAudit[req.resourceName] + ", payload: " + req.json);
    var functionURL = MktMgmt.resourceURL + "/PersistCharges" ; // + id + "/ProcessPayload";
    var persistPayloadResponse = SysUtility.restPost(functionURL, {}, MktMgmt.authHeader, reqData);
} else {
    // print(title + "Payload **not** persisted for resource: " + req.resourceName);
}
