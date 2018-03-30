var MktMgmt = {};  // a common JavaScript technique for name-scoping

print("DIR: " + Java.type("java.lang.System").getProperty("user.dir"));

MktMgmt.readAPIProperties = function readAPIProperties(aProjectURLFragment) {
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
    while (propEnum.hasMoreElements()) {
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

print("\nMktMgmtLib loaded");

var props = MktMgmt.readAPIProperties("MktMgmt");
if (props === null) {
    MktMgmt.auth = {};
    MktMgmt.auth.settings = { 'headers': {'Authorization' : 'CALiveAPICreator' } };
} else {
    MktMgmt = props;
}
print("** MktMgmtLib - API Properties: " + JSON.stringify(props));
