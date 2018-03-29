var testName = "Function testAcctgAlert: ";

// get App Economy World row, JSON Object
function getEvent() {
    var url = req.localFullBaseURL;
    var eventGetURL = url + "Conferences_Test";
    var headerSettings = { headers: {
           Authorization: "CALiveAPICreator AdminKey:1"    // created on Auth Tokens screen
           , accept: "*"
    }};
    var key = "App Economy World" ;
    var getParams = {sysfilter: "equal(\"name\":" + JSON.stringify( key ) + ")"};
    var eventString = SysUtility.restGet(eventGetURL, getParams, headerSettings);
    log.debug(testName + "getEvent: " + eventGetURL + ", getParams: " + getParams + ", get returns: " + eventString);
    print(testName + "getEvent: " + eventGetURL + ", getParams: " + getParams + ", get returns: " + eventString + "");
    return JSON.parse(eventString)[0];
}

// put event (JSON Object), returns putResponse
function putEvent(anEvent, anApprovedFlag) {
    anEvent.Approved = anApprovedFlag;
    var url = req.localFullBaseURL + 'Conferences_Test';
    var putAuth = { headers: { Authorization: "CALiveAPICreator AdminKey:1" }};  // created on Auth Tokens screen
    var putParams = null;
    log.debug(testName + "putEvent: " + JSON.stringify(anEvent));
    var putResponseString = SysUtility.restPut(url, putParams, putAuth, anEvent);

    var putResponse = JSON.parse(putResponseString);
    log.debug(".. request completed with statusCode: " + putResponse.statusCode);
    if (putResponse.statusCode !== 200) {
        log.debug(testName + "ERROR: Post txSummary did not find expected 200...");
        log.debug(putResponse); //an object which will include a transaction summary and a summary of the rules fired during this request
        throw new Error(testName + "ERROR: Post txSummary did not find expected 201...");
    }

    return putResponse;
}

// get audit Accounting Messages row, JSON Object
function getAcctgCharges(aTestId) {
    var url = req.localFullBaseURL;
    url = url.replace('mkt', 'acctg')
    var acctgGetURL = url + "Charges";
    var headerSettings = { headers: {
           Authorization: "CALiveAPICreator AcctgToken:1"    // created on Auth Tokens screen
           , accept: "*"
    }};
    var getParams = {sysfilter: "equal(\"TestId\":" + aTestId + ")"};
    var acctgString = SysUtility.restGet(acctgGetURL, getParams, headerSettings);
    log.debug(testName + "acctgGetURL: " + acctgGetURL + ", TestId: " + aTestId
        + ", getParams: " + getParams + ", get returns: " + acctgString);
    return JSON.parse(acctgString)[0];
}


//   ******************* MAIN CODE STARTS HERE

log.debug(testName + 'Starting');
var appEconomyEvent = getEvent();
log.debug(testName + 'Checking if already approved: ' + "[" + appEconomyEvent.Approved + "] in: " + JSON.stringify(appEconomyEvent));
var reset = false;

if (appEconomyEvent.Approved === true) {
    log.debug(testName + "Resetting Approved");
    reset = true;
    print(testName + "Resetting Approved");
    putEvent(appEconomyEvent, false);
    appEconomyEvent = getEvent();  // for opt lock
}

var approveResponse = putEvent(appEconomyEvent, true);
appEconomyEvent = getEvent();
var testId = appEconomyEvent.TestId;
var acctgPost = getAcctgCharges(testId);
log.debug("testName" + "Checking AccountAudit: " + JSON.stringify(acctgPost));
return {statusCode: 201, message: "ok "+ appEconomyEvent.name + "[" + appEconomyEvent.ident + "], TestId: " + testId +", reset: " + reset};
