var title = "MarketMgmt Startup -- ";
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
MktStart.loadResourcesToAudit = function loadResourcesToAudit(aConfig) {
    var result = {"ProcessCharges": true, "DummyFromStub": true};
    if ( true ) { // aConfig.loadResource !== "true") {
        print(title + ".. resourcesToAudit stub, per aConfig.loadResource: " + aConfig.loadResource);
    } else {
        result={};
        print(title + "..loadResourcesToAudit() using url: " + 
            config.resourceURL + "/main:SysResourceInfo" + ", with authHeader" + JSON.stringify(config.authHeader));
        var sysResourceInfoRows = listenerUtil.restGet(
                MktMgmt.resourceURL + "/main:SysResourceInfo", null, config.authHeader);
        var sysResourceRows = JSON.parse(sysResourceInfoRows);
        for (var i = 0 ; i < sysResourceRows.length ; i++) {
            var eachSysResourceInfoRow = sysResourceRows[i];
            var resourceName = eachSysResourceInfoRow.ResourceName;
            result[resourceName] = true;
            print(title + "  ..setting: " + resourceName + ", in: " + JSON.stringify(eachSysResourceInfoRow));
        }
    }
    return result;
};

/* **********************************
    Execution begins here
    Initialize MktMgmt (a library) props
    Expect MktMgmt like: {"authHeader":{"headers":{"Authorization":"CALiveAPICreator AcctgToken:1"}},"resourceURL":"http://localhost:8080/rest/default/MktMgmt/v1","resourcesToAudit":{"ProcessCharges":true,"DummyFromStub":true}}
************************************ */

var config = {};
var propsSetBy = title + "Properties from property file: ";
var props = MktStart.readAPIProperties("MktMgmt");
if (props === null) {
    propsSetBy = title + "Properties from defaults: ";
    config.resourceURL = "http://localhost:8080/rest/default/MktMgmt/v1";
    config.authHeader = { 'headers': {'Authorization' : 'CALiveAPICreator' } };
    config.loadResources = false;
} else {
    config = props;
}
print (propsSetBy + JSON.stringify(config));

config.resourcesToAudit = MktStart.loadResourcesToAudit(config);
print(title + "MktMgmtLib configuring MktStart.loadResourcesToAudit: " + JSON.stringify(config) + "\n");
MktMgmtSvcs.configMkt(config);
for (i = 0; i < 500000; i++) { 
    if(i%100000===0){
        print("i:" +i);
    }
}

print(title + "MktMgmtLib configured with MktMgmt: " + JSON.stringify(MktMgmt) + "\n");
