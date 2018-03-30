MktMgmtLib
var MktMgmt = {};  // a common JavaScript technique for name-scoping

print("DIR: " + Java.type("java.lang.System").getProperty("user.dir"));

MktMgmt.readAPIProperties = function readAPIProperties(aProjectURLFragment) {
    var response = "{";
    var prop = java.util.Optional.of(new java.util.Properties()).map(function(p)
            { p.load(new java.io.FileInputStream("./API.properties")); return p;}).get();
    var propEnum = prop.getPropertyNames();
    while (propEnum.hasMoreElements()) {
        var propName = propEnum.nextElement();
        print("Prop: " + propName + " = " + prop.getProperty(propName));
    }
    // prop = prop.toString();
    // prop = prop.substr(1,prop.length);
    // prop = prop.substr(0,prop.length-1);
    // print(prop);
    // prop = prop.split(",");
    // for (i = 0; i < prop.length; i++) { 
    //     print("prop:" + prop[i]);
    //     var temp = prop[i].split("=");
    //     response = response + "\"" +temp[0] +"\":\"" + temp[1] +"\",";
    // }
    response = response.substr(0,response.length-1);
    response = response+"}";
    
    return JSON.parse(response);
};

MktMgmt.out = java.lang.System.out;
MktMgmt.out.println("\nMktMgmtLib loaded");
MktMgmt.auth = {};
MktMgmt.auth.settings = { 'headers': {'Authorization' : 'CALiveAPICreator' } };

var props = MktMgmt.readAPIProperties("MktMgmt");
MktMgmt.out.println("API Properties: " + JSON.stringify(props));
