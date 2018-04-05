var title = "MarketMgmt Startup -- ";
MktStart = {};  // scope our functions

/* When the API in started, this code runes to load outboared strings such as urls, http headers etc.
    We load from a property file (API.Properties) into MktMgmtLib's Config (a data structure in our library).
    API.Properties goes into your LAC folder (where the Derby DBs are - Finance, Marketing, MktConfOffers etc):
    
#API Properties

authHeader={ "headers": {"Authorization" : "CALiveAPICreator AcctgToken:1"} }
resourceURL=http://localhost:8080/rest/default/MktMgmt/v1
loadResourcesFromTable=true
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
    var settings = aConfig.settings;
    if ( settings.loadResourcesFromTable === false) {
        print(title + "-- resourcesToAudit stub, per aConfig.loadResource: " + settings.loadResource);
    } else {
        result={};
        print(title + "..loadResourcesToAudit() using aConfig: " + JSON.stringify(aConfig));
        var sysResourceInfoRows = listenerUtil.restGet(
                settings.resourceURL + "/main:SysResourceInfo", null, settings.authHeader);
        print(title + "..sysResourceInfoRows");
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


/* *************************************************
    Execution begins here
    Initialize MktMgmt (a library) Config.settings
**************************************************** */

var userDir = Java.type("java.lang.System").getProperty("user.dir");
print("\n" + title + "running... current working directory for LAC: " + userDir);

var prepareConfig = {
    createdBy: "MktMgmtStartup Listener",
    settings: {
        loadedBy: "MktMgmtStartup default settings - no API.properties file in " + userDir,
        resourceURL: "http://localhost:8080/rest/default/MktMgmt/v1",
        authHeader: { 'headers': {'Authorization' : 'CALiveAPICreator' } },
        loadResourcesFromTable: true  // set false to bypass restGet for resource names to audit
    }
};
var props = MktStart.readAPIProperties("MktMgmt");
if (props !== null) {
    prepareConfig.settings = props;
    prepareConfig.settings.loadedBy = "API.properties file in " + userDir;
}

prepareConfig.settings.resourcesToAudit = MktStart.loadResourcesToAudit(prepareConfig);
// print(title + "MktMgmtLib configuring MktStart.loadResourcesToAudit: " + JSON.stringify(prepareConfig) + "\n");

Config.save(prepareConfig.settings);
print(title + "Config.settings: " + JSON.stringify(Config.settings) + "\n");
