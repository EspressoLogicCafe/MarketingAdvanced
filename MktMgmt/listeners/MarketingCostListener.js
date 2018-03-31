var title = "MktMgmt Listener (1): ";  // persist payload, then process in sep transaction
out = java.lang.System.out;
out.println(title + "Running*** on " + listenerUtil.getHostAddress());
var messageContent = message.toString();
var messageAudit = {};  // create payload object for Posting to Messages resource
messageAudit.msgContent = messageContent;
var messageAuditString = JSON.stringify(messageAudit);
var parms = {};
out.println(title + "Posting - URL: " + MktMgmt.resourceURL + ", Payload: " + messageAuditString + "\n\n");
var postPayloadResponse = listenerUtil.restPost(MktMgmt.resourceURL + "/PersistCharges", 
                                parms, MktMgmt.authHeader, messageAuditString);
out.println(title + "Payload Persisted, postPayloadResponse: " + postPayloadResponse + "\n\n");

// now process payload, using function get: http://localhost:8080/rest/default/MktMgmt/v1/MessageAudits/102/ProcessPayload
var payLoadResponseObj = JSON.parse(postPayloadResponse);  // get id from txsummary
var txsummary1 = payLoadResponseObj.txsummary[0];
var href = txsummary1["@metadata"].href;  //http://localhost:8080/rest/default/MktConfOffers/v1/main:ConferenceOffers/1
var id = href.substring(1 + href.lastIndexOf("/"));
var functionURL = MktMgmt.resourceURL + "/MessageAudits/" + id + "/ProcessPayload";
out.println(title + ".. href: " + href + ", id: " + id + "; url: " + functionURL);
var processPayloadResponse = SysUtility.restGet(functionURL, parms, MktMgmt.authHeader);
out.println(title + "Payload Processed, processPayloadResponse: " + processPayloadResponse);

// built using Examples (Persist Payload) and Control-Space
