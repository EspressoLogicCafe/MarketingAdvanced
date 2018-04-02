var title = "MktMgmt Listener (1): ";  // persist payload, then process in sep transaction
out = java.lang.System.out;
out.println(title + "Running*** on " + listenerUtil.getHostAddress());
var messageContent = message.toString();
var parms = {};
out.println(title + "Posting - URL: " + MktMgmt.resourceURL + ", Payload: " + messageContent + "\n\n");
var postPayloadResponse = listenerUtil.restPost(MktMgmt.resourceURL + "/ProcessCharges", 
                                parms, MktMgmt.authHeader, messageContent);
out.println(title + "Payload Processed, postPayloadResponse: " + messageContent + "\n\n");
