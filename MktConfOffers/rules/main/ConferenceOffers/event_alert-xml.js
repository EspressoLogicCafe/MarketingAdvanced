var title = "Market: Post <XML> to Accounting Event - ";
if (row.Approved === true && row.Approved !== oldRow.Approved) {
    var msgContent = "";
    var url = req.localFullBaseURL;
    var eventGetURL = url + "AccountingAlert" + "?responseformat=xml";                // for JSON, transformCurrentRow is simpler
    var headerSettings = { headers: {Authorization: "CALiveAPICreator AdminKey:1"} }; // created on Auth Tokens screen
    var getParams = {sysfilter: "equal(\"ident\":" + row.ident + ")"};
    msgContent = SysUtility.restGet(eventGetURL , getParams, headerSettings);
    logicContext.logDebug(title + "as XML... getParms: " + JSON.stringify(getParams) + ', url:' + eventGetURL +', xml msgContent: ' + msgContent);
        print(title + 'Post to Accounting, ready with msgContent: ' + msgContent);
        var result = SysUtility.publishMessage("PublishAccountingConnection","MarketingCost", msgContent, null);
}
