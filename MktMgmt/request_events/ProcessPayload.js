var title = "ProcessPayload Response Event: ";
if ("PersistCharges" == req.resourceName && req.verb.toString() == 'POST') {
    // now process payload, using function get: http://localhost:8080/rest/default/MktMgmt/v1/MessageAudits/102/ProcessPayload
    print(title + "txsummary: " + JSON.stringify(json.txsummary));
    var txsummary1 = json.txsummary[0];
    var href = txsummary1["@metadata"].href;  // eg. http://localhost:8080/rest/default/MktMgmt/v1/PersistCharges/312
    var id = href.substring(1 + href.lastIndexOf("/"));
    var functionURL = MktMgmt.resourceURL + "/MessageAudits/" + id + "/ProcessPayload";
    print(title + ".. href: " + href + ", id: " + id + "; url: " + functionURL);
    var processPayloadResponse = SysUtility.restGet(functionURL, {}, MktMgmt.authHeader);
    print(title + "Payload Processed, processPayloadResponse: " + processPayloadResponse);
}
