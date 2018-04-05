var MktMgmt = {};  // a common JavaScript technique for name-scoping
print("\nMktMgmt loaded\n");

var MktMgmtSvcs = {};  // MktMgmtSvcs

MktMgmtSvcs.configMkt = function configMkt(aMkt) {
    MktMgmt = aMkt;
    print("MtkMgmt configured: " + JSON.stringify(MktMgmt));
};
