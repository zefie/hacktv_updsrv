var minisrv_service_file = true;

var ssid = session_data.cancelPendingTransfer();
var transferCanceled = new clientShowAlert({
    'image': minisrv_config.config.service_logo,
    'message': "The transfer of this account to <b>"+ ssid +"</b> has been cancelled.",
    'buttonlabel1': "Okay",
    'buttonaction1': "wtv-home:/home",
    'noback': true,
}).getURL();
var errpage = wtvshared.doRedirect(transferCanceled);
var headers = errpage[0];
var data = errpage[1];