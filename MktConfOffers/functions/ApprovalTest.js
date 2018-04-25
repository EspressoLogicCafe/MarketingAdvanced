var testName = "Function testAcctgAlert: ";

// get App Economy World row, JSON Object
function getConfOffer(aMsg) {
    var url = req.localFullBaseURL;
    var eventGetURL = url + "Conferences_Test";
    var headerSettings = { headers: {
           Authorization: "CALiveAPICreator AdminKey:1"    // created on Auth Tokens screen
           , accept: "*"
    }};
    var key = "App Economy World" ;
    var getParams = {sysfilter: "equal(\"name\":" + JSON.stringify( key ) + ")"};
    var eventString = SysUtility.restGet(eventGetURL, getParams, headerSettings);
    db("getConfOffer[" + aMsg + "]: " + eventGetURL + ", getParams: " + JSON.stringify(getParams) + ", get returns: " + eventString + "");
    return JSON.parse(eventString)[0];
}

// put Conference Offer (JSON Object), returns putResponse
function putConfOffer(anEvent, anApprovedFlag) {
    anEvent.Approved = anApprovedFlag;
    var url = req.localFullBaseURL + 'Conferences_Test';
    var putAuth = { headers: { Authorization: "CALiveAPICreator AdminKey:1" }};  // created on Auth Tokens screen
    var putParams = null;
    db("putConfOffer, updating Conferences_Test with: " + JSON.stringify(anEvent));
    var putResponseString = SysUtility.restPut(url, putParams, putAuth, anEvent);

    var putResponse = JSON.parse(putResponseString);
    db(".. putConfOffer, put completed with statusCode: " + putResponse.statusCode + ", putResponse: " + JSON.stringify(putResponse));
    if (putResponse.statusCode !== 200) {
        log.debug(testName + "ERROR: Post txSummary did not find expected 200...");
        log.debug(putResponse); //an object which will include a transaction summary and a summary of the rules fired during this request
        throw new Error(testName + "ERROR: Post txSummary did not find expected 201...");
    }
    return putResponse;
}

// debug prints to log and console
function db(aString) {
    var printString = testName + aString;
    log.debug(printString);
    print("");
    print(printString);
    return printString;
}

// get MktMgmt Charges data, returns JSON String
function getMktMgmtCharges() {
    var url = req.localFullBaseURL;
    url = url.replace('MktConfOffers', 'MktMgmt');          // TODO - fix hard-coded string
    var chargesGetURL = url + "Charges";
    var headerSettings = { headers: {
           Authorization: "CALiveAPICreator AcctgToken:1"   // created on Auth Tokens screen
           , accept: "*"
    }};
    var chargesString = SysUtility.restGet(chargesGetURL, null, headerSettings);
    // db("getMktMgmtCharges, acctgGetURL: " + chargesGetURL + ", get returns: " + chargesString);
    return chargesString;
}


//   ******************* MAIN CODE STARTS HERE

var confOffer = getConfOffer("Starting");
db('Checking if already approved: ' + "[" + confOffer.Approved + "] in: " + JSON.stringify(confOffer));
var reset = false;

if (confOffer.Approved === true) {
    db("Resetting Approved");
    reset = true;
    putConfOffer(confOffer, false);
    confOffer = getConfOffer("for optLock");
}

var chargesOld = getMktMgmtCharges();  // this should add a charges record, visible in diff below

var approveResponse = putConfOffer(confOffer, true);

var chargesNew = getMktMgmtCharges();  // ALERT - diff fails if pagination occurs
var diff = SysUtility.jsonDiff(chargesOld, chargesNew, 0 ,false);
var diffResult = diff.contains("Different size arrays -") ;

if (diffResult === true){
    print("");
    db("Success... diff -->");
    db (diff);
    return {statusCode: 201, message: "ok - MktMgmt Charges row added"};
} else{
    print("");
    db("Diff fails-->");
    db("chargesOld: " + chargesOld);
    db("chargesNew: " + JSON.stringify(chargesNew));
    db("diff -->");
    db (diff);
    return {statusCode: undefined, message: "Diff failed: ", "diff": diff};
}
