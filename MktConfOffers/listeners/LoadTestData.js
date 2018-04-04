var db = "MktConfOffers Startup Listener, LoadTestData - ";
var url = "http://" + listenerUtil.getHostName() + ':8080/rest/default/mkt/v1/PartnerPost';
var noFilter = {};
var optionsAuth = { 'headers': {'Authorization' : 'CALiveAPICreator AdminKey:1'}};
// log.debug(db + 'running, check for data at: ' + url);
print('');
print(db + 'running, check for data at: ' + url);  // http://localhost:8080/rest/default/mkt/v1/PartnerPost
var response = listenerUtil.restGet(url, noFilter, optionsAuth);
// out.println(db + 'running, restGet response: ' + response);
if ("[]" !== response) {
    print(db + "loaded... no action");
}  else {
    var data = testData();
    print(db + 'empty - posting testData()');
    var postResponse = listenerUtil.restPost(url, null, optionsAuth, data);
    // out.println(db + 'empty - postResponse: ' + postResponse);
}
print('');

function testData() {
    return [
      {
        "name": "App Economy World",
        "Talks_List": [
          {
            "name": "Small Stage",
            "Price": 1000
          },
          {
            "name": "Big Stage",
            "Price": 4000
          },
          {
            "name": "Phone Booth",
            "Price": 100
          }
        ],
        "Exhibits_List": [
          {
            "Price": 1000,
            "name": "Small Table"
          },
          {
            "Price": 10000,
            "name": "Multi-Booth Area"
          },
          {
            "Price": 5000,
            "name": "Booth"
          },
          {
            "Price": 100,
            "name": "Card Table in Parking Lot"
          }
        ]
      },
      {
        "name": "Agility Achieved"
      },
      {
        "name": "Making Friends in Politics"
      }
    ];
}


