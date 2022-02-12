var minisrv_service_file = true;
var { WTVShared, clientShowAlert } = require("./WTVShared.js");

var notImplementedAlert = new clientShowAlert({
	'image': minisrv_config.config.service_logo,
	'message': "This feature is not available.",
	'buttonlabel1': "Okay",
	'buttonaction1': "client:donothing",
	'noback': true,
}).getURL();

headers = `200 OK
Connection: Keep-Alive
wtv-expire-all: wtv-
wtv-expire-all: http
Content-Type: text/html`

data = `<HTML>
<HEAD>
<meta http-equiv="reply-type" content="charset=iso-2022">
<TITLE>
Settings
</TITLE>
<DISPLAY >
</HEAD>
<sidebar width=110> <table cellspacing=0 cellpadding=0 BGCOLOR=452a36>
<tr>
<td colspan=3 abswidth=104 absheight=4>
<td rowspan=99 width=6 absheight=420 valign=top align=left>
<img src="file://ROM/Cache/Shadow.gif" width=6 height=420>
<tr>
<td abswidth=6>
<td abswidth=92 absheight=76>
<table href="wtv-home:/home" absheight=76 cellspacing=0 cellpadding=0>
<tr>
<td align=right>
<img src="${minisrv_config.config.service_logo}" width=87 height=67>
</table>
<td abswidth=6>
<tr><td absheight=5 colspan=3>
<table cellspacing=0 cellpadding=0>
<tr><td abswidth=104 absheight=2 valign=middle align=center bgcolor=2e1e26>
<img src="file://ROM/Cache/Spacer.gif" width=1 height=1>
<tr><td abswidth=104 absheight=1 valign=top align=left>
<tr><td abswidth=104 absheight=2 valign=top align=left bgcolor=6b4657>
<spacer type=block width=1 height=1>
</table>
<tr><td absheight=132>
<tr><td absheight=166 align=right colspan=3>
<img src="ROMCache/SettingsBanner.gif" width=54 height=166>
<tr><td absheight=41>
</table>
</sidebar>
<BODY BGCOLOR="#191919" TEXT="#42CC55" LINK="36d5ff" VLINK="36d5ff" FONTSIZE="large"
hspace=0 vspace=0
>
<table cellspacing=0 cellpadding=0>
<tr>
<td abswidth=14>
<td colspan=3>
<table cellspacing=0 cellpadding=0>
<tr>
<td valign=center absheight=80>
<shadow><blackface><font color="e7ce4a" font size="+1">
Settings
for ${ssid_sessions[socket.ssid].getSessionData("subscriber_username") || "You"}
</font><blackface><shadow>
</table>
<tr>
<TD>
<td colspan=4 height=2 valign=middle align=center bgcolor="2B2B2B">
<spacer type=block width=436 height=1>
<tr>
<TD>
<td colspan=4 height=1 valign=top align=left>
<tr>
<TD>
<td colspan=4 height=2 valign=top align=left bgcolor="0D0D0D">
<spacer type=block width=436 height=1>
<td abswidth=20>
<TR>
<td>
<font size="-1">
<td WIDTH=150 HEIGHT=244 VALIGN=top ALIGN=left>
<br><font size="-1"><blackface>
<img src="ROMCache/BulletArrow.gif" width=6 height=13 valign=absmiddle><spacer type=block width=6 height=1>
<a href="wtv-setup:/mail">Mail</a><BR>
<spacer type=block width=1 height=5><BR>`;
// password
if (!minisrv_config.config.hide_incomplete_features) {
	data += `<img src="ROMCache/BulletArrow.gif" width=6 height=13 valign=absmiddle><spacer type=block width=6 height=1>
<a href="${notImplementedAlert}"><strike>Password</strike></a><BR>
<spacer type=block width=1 height=5><BR>`;
}

data += `
<img src="ROMCache/BulletArrow.gif" width=6 height=13 valign=absmiddle><spacer type=block width=6 height=1>
<a href="wtv-setup:/screen">Television</a><BR>
<spacer type=block width=1 height=5><BR>
<img src="ROMCache/BulletArrow.gif" width=6 height=13 valign=absmiddle><spacer type=block width=6 height=1>
<a href="wtv-setup:/text">Text size</a><BR>
<spacer type=block width=1 height=5><BR>
<img src="ROMCache/BulletArrow.gif" width=6 height=13 valign=absmiddle><spacer type=block width=6 height=1>
<a href="wtv-setup:/sound">Music</a><BR>
<spacer type=block width=1 height=5><BR>`;
//printing
if (!minisrv_config.config.hide_incomplete_features) {
	data += `<img src="ROMCache/BulletArrow.gif" width=6 height=13 valign=absmiddle><spacer type=block width=6 height=1>
<a href="${notImplementedAlert}"><strike>Printing</strike></a><BR>
<spacer type=block width=1 height=5><BR>`;
}

data += `
<img src="ROMCache/BulletArrow.gif" width=6 height=13 valign=absmiddle><spacer type=block width=6 height=1>
<a href="wtv-setup:/keyboard">Keyboard</a><BR>
<spacer type=block width=1 height=5><BR>`;
// extra users
if (!minisrv_config.config.hide_incomplete_features) {
	data += `<img src="ROMCache/BulletArrow.gif" width=6 height=13 valign=absmiddle><spacer type=block width=6 height=1>
<a href="${notImplementedAlert}"><strike>Extra users</strike></a><BR>
<spacer type=block width=1 height=5><BR>`;
}

data += `

<img src="ROMCache/BulletArrow.gif" width=6 height=13 valign=absmiddle><spacer type=block width=6 height=1>
<a href="wtv-setup:/phone")">Dialing</a><BR>

<TD WIDTH=20>
<TD WIDTH=300 VALIGN=top ALIGN=left>
<spacer type=block width=6 height=14><font size="2"><br>
Signature <strike>and more</strike><BR>
<spacer type=block width=6 height=5><font size="2"><br>`;
// password
if (!minisrv_config.config.hide_incomplete_features) {
	data += `<strike>Change your password</strike><BR>
<spacer type=block width=6 height=5><font size="2"><br>`;
}
data += `Options for your TV<BR>
<spacer type=block width=6 height=5><font size="2"><br>
Make text bigger or smaller<BR>
<spacer type=block width=6 height=5><font size="2"><br>
Play background songs<BR>
<spacer type=block width=6 height=5><font size="2"><br>`;
// printing
if (!minisrv_config.config.hide_incomplete_features) {
	data += `<strike>Change how you print</strike><BR>
<spacer type=block width=6 height=5><font size="2"><br>`;
}
data += `Choose an on-screen keyboard<BR>
<spacer type=block width=6 height=5><font size="2"><br>`;
// extra users
if (!minisrv_config.config.hide_incomplete_features) {
	data += `<strike>Add, change, or remove users</strike><BR>
<spacer type=block width=6 height=6><font size="2"><br>`;
}
	data += `
Connecting to WebTV<BR>


<tr>
<td colspan=4 height=2>
<tr>
<TD>
<td colspan=4 height=2 valign=middle align=center bgcolor="2B2B2B">
<spacer type=block width=436 height=1>
<tr>
<TD>
<td colspan=4 height=1 valign=top align=left>
<tr>
<TD>
<td colspan=4 height=2 valign=top align=left bgcolor="0D0D0D">
<spacer type=block width=436 height=1>
<TR>
<TD>
<TD COLSPAN=4 HEIGHT=4 VALIGN=top ALIGN=left>
<TR>
<TD>
<TD COLSPAN=3 VALIGN=top ALIGN=right>
<FORM
action="wtv-home:/home" selected>
<FONT COLOR="#E7CE4A" SIZE=-1><SHADOW>
<INPUT TYPE=SUBMIT BORDERIMAGE="file://ROM/Borders/ButtonBorder2.bif" Value=Done NAME="Done" USESTYLE WIDTH=103>
</SHADOW></FONT></FORM>
<TD>
</TABLE>
</BODY>
</HTML>

`;