var MktMgmt = {};  // a common JavaScript technique for name-scoping
//TODO: employ arrow functions when fully supported by Nashorn
MktMgmt.out = java.lang.System.out;
MktMgmt.out.println("\nMktMgmtLib loaded");
MktMgmt.auth = {};
MktMgmt.auth.settings = { 'headers': {'Authorization' : 'CALiveAPICreator AcctgToken:1'} };
MktMgmt.auth.resourceURL = "http://localhost:8080/rest/default/MktMgmt/v1";

MktMgmt.transformToWebHook = function transformToWebHook(aLogicContext, aResourceName, aTargetUrl) {
    aLogicContext.logDebug("*** B2B.transformToWebHook *** using: " + aResourceName + ", to: " + aTargetUrl);
    var resourceURL = aTargetUrl; // "http://localhost:8080/rest/default/b2bderbypavlov/v1/SalesReports";

    // custom resource provides name mapping
    // readiness lab: uncomment this  =====>
    // aLogicContext.logDebug("getting aLogicContext.getTableDefinition()");
    var metaTable = aLogicContext.getTableDefinition();
    aLogicContext.logDebug("*** transformToWebHook ***  metaTable: " + metaTable);
    var options = {sysfilter: "equal(OrderID:" + aLogicContext.getCurrentState().OrderID + ")"
            ,"sysfilter..SupplierAlert.Order_DetailsList.Product.Supplier": "equal(CompanyName: '" + "Pavlova, Ltd." + "')" };
    var resourceGetResponse = SysUtility.getResource(aResourceName, options);  // FIXME

    // system console output
    aLogicContext.logDebug("B2B.transformToWebHook posting getResponse: " + JSON.stringify(resourceGetResponse).substring(1, 20) + "...");
    aLogicContext.logDebug("B2B.transformToWebHook to URL: " + resourceURL);

    if (resourceURL === null || resourceURL === "") {
        out = java.lang.System.out;
        out.println("WebHook URL is null/empty - this not posted:\n" + (JSON.stringify(resourceGetResponse)).substring(1, 4) + "...");
    }
    else {
        var settings = { headers: { Authorization: "CALiveAPICreator supplier:1" }};  // FIXME
        var postResponse = SysUtility.restPost(resourceURL, null, settings, resourceGetResponse);

        // API Creator log output
        // log.debug('ok, using re-usable solution');
        if (JSON.parse(postResponse).statusCode !== 201) {
            throw "B2B.transformToWebHook unexpected post response: " + postResponse;
        }
    }

    return null;
};
