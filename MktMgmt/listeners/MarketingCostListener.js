var title = "MktMgmt Listener (1): ";  // persist payload, then process in sep transaction
var isEnabled = true;
if (isEnabled === false) {
    print("");
    print (title + "*** DISABLED***");
} else {
    // print(title + "Running*** on " + listenerUtil.getHostAddress());
    var messageContent = message.toString();
    var settings = Config.settings;
    var parms = {};
    // print(title + "Posting - URL: " + MktMgmt.resourceURL + ", Payload: " + messageContent + "\n\n");
    var postPayloadResponse = listenerUtil.restPost(
            settings.resourceURL + "/ProcessCharges", parms, settings.authHeader, messageContent);
    print(title + "Payload Processed, postPayloadResponse: " + messageContent + "\n\n");
}
