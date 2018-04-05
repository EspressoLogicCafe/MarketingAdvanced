var title = "MktMgmt Listener (1): ";  // persist payload, then process in sep transaction

// print(title + "Running*** on " + listenerUtil.getHostAddress());
var messageContent = message.toString();
var parms = {};
// print(title + "Posting - URL: " + MktMgmt.resourceURL + ", Payload: " + messageContent + "\n\n");
var postPayloadResponse = listenerUtil.restPost(
        MktMgmt.resourceURL + "/ProcessCharges", parms, MktMgmt.authHeader, messageContent);
print(title + "Payload Processed, postPayloadResponse: " + messageContent + "\n\n");
