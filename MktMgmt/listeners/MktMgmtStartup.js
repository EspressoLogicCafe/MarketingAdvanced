var title = "MarketMgmt Startup - ";
MktStart = {};  // scope our functions
print("\n" + title + "running: current working directory for LAC: " + Java.type("java.lang.System").getProperty("user.dir"));

/* When the API in started, this code runes to load outboared strings such as urls, headers etc.
    We load from a property file (API.Properties) into MktMgmt (a data structure in our library).
    API.Properties goes into your LAC folder (where the Derby DBs are - Finance, Marketing, MktConfOffers etc):
    
#API Properties

authHeader={ "headers": {"Authorization" : "CALiveAPICreator AcctgToken:1"} }
resourceURL=http://localhost:8080/rest/default/MktMgmt/v1
resourcesToAudit={"ProcessCharges": true, "DummyResourceName": true}

    You can extend this to make the properties api-specific (eg, MktMgmt:authHeader=xxx)
        or nodal (eg, MktMgmt.auth.header=xx)
*/

// read the properties file, return props
MktStart.readAPIProperties = function readAPIProperties(aProjectURLFragment) {
    var response = {};
    var prop;
    try {
        prop = java.util.Optional.of(new java.util.Properties()).map(function(p)
                { p.load(new java.io.FileInputStream("./API.properties")); return p;}).get();
    } catch (e) {
        print (title + "** exception reading API.properties: " + e);
        return null;
    }
    var propEnum = prop.propertyNames();
    while (propEnum.hasMoreElements()) {  // you could make these per-API
        var propName = propEnum.nextElement();
        var propValue = prop.getProperty(propName); //  + "";
        // print(title + "......each prop: " + propName + " = " + propValue);
        if (propValue.startsWith("{"))
            response[propName] = JSON.parse(propValue);
        else
            response[propName] = propValue;
    }
    // print (title + "....readAPIProperties returns: " + JSON.stringify(response));
    return response;
};

// table-driven technique so response event can be generic code
MktStart.loadResourcesToAudit = function loadResourcesToAudit() {
    var result = {"ProcessCharges": true, "DummyFromStub": true};
    if (MktMgmt.loadResource !== true) {
        print(title + ".. resourcesToAudit stub");
    } else {
        print(title + "..loadResourcesToAudit()");
        var sysResourceInfoRows = listenerUtil.restGet(
                MktMgmt.resourceURL + "/main:SysResourceInfo", null, MktMgmt.authHeader);
        for (var i = 0 ; i < sysResourceInfoRows.length ; i++) {
            print(title + "  ..each row: " + JSON.stringify(sysResourceInfoRows[i]));
            var eachSysResourceInfo = sysResourceInfoRows[i];
            result[eachSysResourceInfo.ResourceName] = true;
        }
    }
    return result;
};

/* **********************************
    Execution begins here
    Initialize MktMgmt (a library) props
    Expect MktMgmt like: {"authHeader":{"headers":{"Authorization":"CALiveAPICreator AcctgToken:1"}},"resourceURL":"http://localhost:8080/rest/default/MktMgmt/v1","resourcesToAudit":{"ProcessCharges":true,"DummyResourceName":true}}
************************************ */

var propsSetBy = title + "Properties from property file: ";
var props = MktStart.readAPIProperties("MktMgmt");
if (props === null) {
    propsSetBy = title + "Properties from defaults: ";
    MktMgmt.resourceURL = "http://localhost:8080/rest/default/MktMgmt/v1";
    MktMgmt.authHeader = { 'headers': {'Authorization' : 'CALiveAPICreator' } };
    MktMgmt.loadResources = false;
} else {
    MktMgmt = props;
}
print (propsSetBy + JSON.stringify(MktMgmt));

MktMgmt.resourcesToAudit = MktStart.loadResourcesToAudit(MktMgmt);
print(title + "MktMgmtLib - API Configuration Properties: " + JSON.stringify(MktMgmt) + "\n");
