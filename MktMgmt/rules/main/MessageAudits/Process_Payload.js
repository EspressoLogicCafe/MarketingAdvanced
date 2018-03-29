if (row.ProcessedStatus != oldRow.ProcessedStatus) {
    var title = "Acctg Alert Event (4): ";
    logicContext.logDebug (title + "Running***");
    
    var messageContent = row.msgContent;                       // the json/xml data
    var resourceURL = req.localFullBaseURL + 'Charges';        // mapping and transformation defined by Custom Resource
    var parms = {};
    if (messageContent.startsWith("<"))
        settings.headers["Content-Type"] = "application/xml";  // omit this if strictly JSON
    
    var postResponse = SysUtility.restPost(resourceURL, parms, MktMgmt.auth.settings, messageContent);
    logicContext.logDebug(title + "Post Response: " + postResponse);
    
    // built using Examples (Persist Payload) and Control-Space
}
