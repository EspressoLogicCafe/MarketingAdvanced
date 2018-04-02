var MktMgmt = {};  // a common JavaScript technique for name-scoping
var MktMgmtSvcs = {};

/* this code executes when lib ref'd/loaded (e.g., by rule - see "Process Payload to underlying tables")
    here, we save properties into MktMgmt, to outboard strings such as urls, headers etc
    
    API.Properties goes into your LAC folder (where the Derby DBs are - Finance, Marketing, MktConfOffers etc):
    
#API Properties

authHeader={ "headers": {"Authorization" : "CALiveAPICreator AcctgToken:1"} }
resourceURL=http://localhost:8080/rest/default/MktMgmt/v1

    You can extend this to make the properties api-specific (eg, MktMgmt:authHeader=xxx)
        or nodal (eg, MktMgmt.auth.header=xx)
    
*/

// read the properties file, return props
MktMgmtSvcs.readAPIProperties = function readAPIProperties(aProjectURLFragment) {
    var response = {};
    var prop;
    try {
        prop = java.util.Optional.of(new java.util.Properties()).map(function(p)
                { p.load(new java.io.FileInputStream("./API.properties")); return p;}).get();
    } catch (e) {
        print ("** exception reading API.properties: " + e);
        return null;
    }
    var propEnum = prop.propertyNames();
    while (propEnum.hasMoreElements()) {  // you could make these per-API
        var propName = propEnum.nextElement();
        var propValue = prop.getProperty(propName); //  + "";
        print("Prop: " + propName + " = " + propValue);
        if (propValue.startsWith("{"))
            response[propName] = JSON.parse(propValue);
        else
            response[propName] = propValue;
    }
    print ("readAPIProperties returns: " + JSON.stringify(response));
    return response;
};

// table-driven technique so response event can be generic code
MktMgmtSvcs.loadResourcesToAudit = function loadResourcesToAudit(aMktMgmt) {
    print("\n..loadResourcesToAudit()");
    aMktMgmt.resourcesToAudit = {};
    var sysResourceInfoRows = SysUtility.getResource("main:SysResourceInfo", null);
    for (var i = 0 ; i < sysResourceInfoRows.length ; i++) {
        print("  ..each row: " + JSON.stringify(sysResourceInfoRows[i]));
        var eachSysResourceInfo = JSON.stringify(sysResourceInfoRows[i]);
        aMktMgmt.resourcesToAudit[eachSysResourceInfo.ResourceName] = true;
    }
    return aMktMgmt;
};

/* **********************************
    Execution begins here
    Occurs when library loaded
************************************ */

print("\nMktMgmtLib loaded");
print("..debug: current working directory for LAC: " + Java.type("java.lang.System").getProperty("user.dir"));

var props = MktMgmtSvcs.readAPIProperties("MktMgmt");
if (props === null) {
    print(".. from defaults");
    MktMgmt.resourceURL = "http://localhost:8080/rest/default/MktMgmt/v1";
    MktMgmt.authHeader = { 'headers': {'Authorization' : 'CALiveAPICreator' } };
} else {
    print("** from props");
    MktMgmt = props;
}

MktMgmt = MktMgmtSvcs.loadResourcesToAudit(MktMgmt);

print(".. MktMgmtLib - API Properties: " + JSON.stringify(props));
