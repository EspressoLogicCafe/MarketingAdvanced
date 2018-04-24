var testName = "Function testAcctgAlert: ";

// get App Economy World row, JSON Object
function getEvent(aMsg) {
    var url = req.localFullBaseURL;
    var eventGetURL = url + "Conferences_Test";
    var headerSettings = { headers: {
           Authorization: "CALiveAPICreator AdminKey:1"    // created on Auth Tokens screen
           , accept: "*"
    }};
    var key = "App Economy World" ;
    var getParams = {sysfilter: "equal(\"name\":" + JSON.stringify( key ) + ")"};
    var eventString = SysUtility.restGet(eventGetURL, getParams, headerSettings);
    db("getEvent[" + aMsg + "]: " + eventGetURL + ", getParams: " + JSON.stringify(getParams) + ", get returns: " + eventString + "");
    return JSON.parse(eventString)[0];
}

// put event (JSON Object), returns putResponse
function putEvent(anEvent, anApprovedFlag) {
    anEvent.Approved = anApprovedFlag;
    var url = req.localFullBaseURL + 'Conferences_Test';
    var putAuth = { headers: { Authorization: "CALiveAPICreator AdminKey:1" }};  // created on Auth Tokens screen
    var putParams = null;
    db("putEvent, updating Conferences_Test with: " + JSON.stringify(anEvent));
    var putResponseString = SysUtility.restPut(url, putParams, putAuth, anEvent);

    var putResponse = JSON.parse(putResponseString);
    db(".. putEvent, put completed with statusCode: " + putResponse.statusCode + ", putResponse: " + JSON.stringify(putResponse));
    if (putResponse.statusCode !== 200) {
        log.debug(testName + "ERROR: Post txSummary did not find expected 200...");
        log.debug(putResponse); //an object which will include a transaction summary and a summary of the rules fired during this request
        throw new Error(testName + "ERROR: Post txSummary did not find expected 201...");
    }
    return putResponse;
}

// db
function db(aString) {
    var printString = testName + aString;
    log.debug(aString);
    print("");
    print(aString);
    return aString;
}

// get audit Accounting Messages row, JSON Object
function getAcctgCharges(aTestId) {
    var url = req.localFullBaseURL;
    url = url.replace('MktConfOffers', 'MktMgmt');          // TODO - fix hard-coded string
    var acctgGetURL = url + "Charges";
    var headerSettings = { headers: {
           Authorization: "CALiveAPICreator AcctgToken:1"   // created on Auth Tokens screen
           , accept: "*"
    }};
    var getParams = {sysfilter: "equal(\"TestId\":" + aTestId + ")"};
    var acctgString = SysUtility.restGet(acctgGetURL, getParams, headerSettings);
    db("getAcctgCharges, acctgGetURL: " + acctgGetURL + ", TestId: " + aTestId
        + ", getParams: " + JSON.stringify(getParams) + ", get returns: " + acctgString);
    return JSON.parse(acctgString)[0];
}


//   ******************* MAIN CODE STARTS HERE

var appEconomyEvent = getEvent("Starting");
db('Checking if already approved: ' + "[" + appEconomyEvent.Approved + "] in: " + JSON.stringify(appEconomyEvent));
var reset = false;

if (appEconomyEvent.Approved === true) {
    db("Resetting Approved");
    reset = true;
    putEvent(appEconomyEvent, false);
    appEconomyEvent = getEvent("for optLock");
}

var approveResponse = putEvent(appEconomyEvent, true);
appEconomyEvent = getEvent("after put");
var testId = appEconomyEvent.TestId;
db("Checking AccountAudit[" + testId + "]...");
var acctgPost = getAcctgCharges(testId);
db("Checked AccountAudit[" + testId + "]: " + JSON.stringify(acctgPost));
return {statusCode: 201, message: "ok "+ appEconomyEvent.name + "[" + appEconomyEvent.ident + "], TestId: " + testId +", reset: " + reset};
