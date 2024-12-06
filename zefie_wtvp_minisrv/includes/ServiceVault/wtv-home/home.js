var minisrv_service_file = true;

headers =`200 OK
Connection: Keep-Alive
wtv-expire-all: wtv-home:/splash
Content-type: text/html`

var cryptstatus = (wtv_encrypted ? "Encrypted" : "Not Encrypted")
var comp_type = wtvmime.shouldWeCompress(socket.ssid,'text/html');
var compstatus = "uncompressed";
switch (comp_type) {
	case 1:
		compstatus = "wtv-lzpf";
		break;
	case 2:
		compstatus = "gzip (level 9)";
		break;
}

var wtv_system_sysconfig = session_data.get("wtv-system-sysconfig");
var wtv_client_bootrom_version = session_data.get("wtv-client-bootrom-version");
var wtv_system_chipversion_str = session_data.get("wtv-system-chipversion");

var notImplementedAlert = new clientShowAlert({
	'image': minisrv_config.config.service_logo,
	'message': "This feature is not available.",
	'buttonlabel1': "Okay",
	'buttonaction1': "client:donothing",
	'noback': true,
}).getURL();

var ownMinisrv = new clientShowAlert({
	'image': minisrv_config.config.service_logo,
	'message': "To run your own minisrv, please visit the following link on your PC:<br><br><strong>https://zef.pw/minisrv</strong>",
	'buttonlabel1': "Okay",
	'buttonaction1': "client:donothing",
	'noback': true,
}).getURL();

var supportZefieAlert = new clientShowAlert({
	'image': minisrv_config.config.service_logo,
	'message': "If you would like to support zefie or minisrv, please visit the following link on your PC:<br><br><font size=-1><strong>https://zef.pw/helpminisrv</strong></font>",
	'buttonlabel1': "Okay",
	'buttonaction1': "client:donothing",
	'noback': true,
}).getURL();


if (ssid_sessions[socket.ssid].get("wtv-used-8675309") || ssid_sessions[socket.ssid].get("wtv-need-upgrade")) {
	data = `<html>
<head>
<title>MiniBrowser Home</title>
<body background=/ROMCache/Themes/Images/Pattern.gif text=cbcbcb bgcolor=6e5b85 vlink=dddddd link=dddddd hspace=0 vspace=0 fontsize=medium>
<table cellspacing=0 cellpadding=0>
<tr><td>
<td width=100% height=80 valign=top align=left background=/ROMCache/Themes/Images/ShadowLogoMB.gif>
<spacer type=block width=11 height=11><br>
<spacer type=block width=10 height=1>
<img src=${minisrv_config.config.service_logo} width=90 height=69>
<td width=100% height=80 valign=top background=/ROMCache/Themes/Images/ShadowLogoMB.gif>
<td abswidth=460 height=54 valign=top background=/ROMCache/Themes/Images/ShadowLogoMB.gif align=right>
<spacer height=32 type=block><b><shadow><blackface><font color=cbcbcb>MiniBrowser Home &nbsp; </font></blackface></shadow></b>
</td></tr></table>
<table>
<tr align=top>
<td width=10 height=10>
<td valign=top width=100%>
<tr>
<td>
</table>

<table>
<tr><td>
<ul>
<li><a href="wtv-tricks:/tricks">WTV Tricks</a></li>
<li><a href="wtv-flashrom:/big-willie">Big Willie</a> (Custom ROMs)</li>
<li><a href="wtv-flashrom:/willie">Ultra Willie</a> (Stock ROMs)</li>
<li><a href="wtv-head-waiter:/no-mini">Get me outta here!</a> (Unset MiniBrowser Flags)</li>
</ul>
<br>

<form name="urlaccess">
&nbsp;<input type="text" name="visitsite" value="wtv-" border="1" bgcolor="#BBAEC8" text="#423852" cursor="#423852" align="center" width="314" executeurl autoactivate>
<input type="submit" value="Go" width=20>
</form>
`
} else {
	hasJS = session_data.hasCap("client-can-do-javascript");
	title = `Home for ${session_data.getSessionData("subscriber_username") || "minisrv"}`
	data = `<html><head>`;
	if (hasJS) {
		data += `<script src=/ROMCache/h.js></script><script src=/ROMCache/n.js></script></head><script>head('${title}','','','',1,'${minisrv_config.config.service_logo}')</script>`
	} else {
		data += `<body background=/ROMCache/Themes/Images/Pattern.gif text=42bd52 bgcolor=191919 vlink=dddddd link=dddddd hspace=0 vspace=0 fontsize=medium>
<table cellspacing=0 cellpadding=0>
<tr><td>
<td width=100% height=80 valign=top align=left>
<spacer type=block width=11 height=11><br>
<spacer type=block width=10 height=1>
<img src=${minisrv_config.config.service_logo} width=90 height=69>
<td width=100% height=80 valign=top>
<td abswidth=460 height=54 valign=top align=right>
<spacer height=32 type=block><b><shadow><blackface><font color=cbcbcb>${title} &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </font></blackface></shadow></b>
</td></tr></table>`;
	}
	data += `<display nooptions>

<hr>
<center>
<a href="wtv-mail:/listmail" align="center"><b>Mail</b></a> -
<a href="wtv-favorite:/favorite" align="center"><b>Favorites</b></a> -
<a href="wtv-setup:/sound" align="center"><b>Music</b></a> -
<a href="http://frogfind.com" align="center"><b>Search</b></a> -
<a href="wtv-flashrom:/willie" align="center"><b>ROMs</b></a> -
<a href="wtv-setup:/setup" align="center"><b>Settings</b></a> -
<a href="wtv-guide:/help?topic=Index&subtopic=Glossary" align="center"><b>Help</b></a>
</center>
<hr>
<form action="wtv-tricks:/access">
<spacer type=block width="34">`
	if (hasJS) {
		data += `<script>document.write('<input type="text" name="url" width=440 autoexecute bgcolor='+gTC("bg")+' text='+gTC("t")+' cursor='+gTC("t")+' value="wtv-tricks:/tricks">')</script>`;
	} else {
		data += `<input type="text" name="url" width=440 bgcolor=191919 text=42bd52 cursor=42bd52 autoexecute value="wtv-tricks:/tricks">`;
	}
data += `
<input type="submit" value="Go">
</form>
<hr>
<table>
<tr>

<td valign="top" width="135">
<table><tr>
<td><b>&#187; Community &#171;</b></td>
</tr><tr>
<td><a href="wtv-chat:/home" height="18" valign="middle">&#128;&nbsp;Chat</a></td>
</tr><tr>
<td><a href="wtv-news:/lobby" height="18" valign="middle">&#128;&nbsp;Discuss</a></td>
</tr><tr>
<td><a href="wtv-setup:/messenger" height="21" valign="middle">&#128;&nbsp;Messenger</a></td>
</tr></table>
</td>
<td valign="top" width="120">
<table><tr>
<td><b>&#187; Account &#171;</b></td>
</tr><tr>
<td><a href="client:relogin" height="21" valign="middle">&#128;&nbsp;Relogin</a></td>
</tr><tr>
<td><a href="wtv-setup:/serve-billing-overview" height="21" valign="middle">&#128;&nbsp;Configure</a></td>
</tr><tr>
<td><a href="wtv-setup:/edit-password" height="21" valign="middle">&#128;&nbsp;Password</a></td>
</tr><tr>
<td><a href="wtv-setup:/accounts" height="21" valign="middle">&#128;&nbsp;Add User</a></td>
</tr><tr>
<td>
`;
	if (session_data.getSessionData("registered")) data += `<a href="wtv-tricks:/unregister" height="21" valign="middle">&#128;&nbsp;Unregister`;
	else data += `<a href="wtv-tricks:/register" height="21" valign="middle">&#128;&nbsp;Register`
	data += `
</a></td>
</tr></table>
</td>

<td valign="top" width="120">
<table><tr>
<td><b>&#187; Tools &#171;</b></td>
</tr><tr>
<td><a href="wtv-tricks:/tricks">&#128;&nbsp;WTV Tricks</a></td>
</tr><tr>
<td><a href="wtv-tricks:/themes">&#128;&nbsp;Themes</a><td>
</tr><tr>
<td><a href="wtv-author:/documents">&#128;&nbsp;Pagebuilder</a></td>
</tr><tr>
<td><a href="wtv-tricks:/blastbacklist?return_to=wtv-home:/home">&#128;&nbsp;Clear Cache</a></td>
</tr></table>
</td>

<td valign="top">
<table><tr>
<td><b>&#187; More Stuff &#171;</b></td>
</tr><tr>
<td><a href="wtv-tricks:/cSetup">&#128;&nbsp;Switch server</a></td>
</tr><tr>
<td><a href="${ownMinisrv}">&#128;&nbsp;Run your own server</a></td>
</tr><tr>
<td><a href="http://archive.midnightchannel.net/zefie/media/">&#128;&nbsp;Midnight Archives</a></td>
</tr><tr>
<td><a href="${supportZefieAlert}">&#128;&nbsp;Help zefie</a></td>
</tr></table>
</td>
</tr>
</table>

<table>
<tr>
<td align="left" colspan=4>
<table border=0 cellspacing=0 cellpadding=0 width="100%">
<tr>`
	if (hasJS) {
		data += `<script>document.write('<td colspan=2 background="'+thi+gTC('shimg')+'" text="'+gTC('bg')+'" valign=middle absheight=24>')</script>`
	} else {
		data += `<td colspan=2 background="/ROMCache/Themes/Images/Pattern.gif" text=42bd52 valign="middle" absheight="24">`
	}
	data += `
<spacer type=block height=3 width=100%><b><shadow>&nbsp;&#128; Welcome to zefie's minisrv ${minisrv_version_string.split(" ")[3]}</shadow></b>
</td></tr>
<tr><td absheight="6"></tr>
<tr>
<td valign="top" colspan=3>
This server is operated by ${minisrv_config.config.service_owner}.<br>
`;
	if (minisrv_config.config.service_description) {
		if (typeof minisrv_config.config.service_description === "string") {
			if (minisrv_config.config.service_description.length > 0) {
				data += minisrv_config.config.service_description;
			}
		}
	}

	data += `
	<p></p>
</tr>
<tr>`
	if (hasJS) {
		data += `<script>document.write('<td colspan=2 background="'+thi+gTC('shimg')+'" text="'+gTC('bg')+'" valign=middle absheight=24>')</script>`
	} else {
		data += `<td colspan=2 background="/ROMCache/Themes/Images/Pattern.gif" text=42bd52 valign="middle" absheight="24">`
	}
	data += `
<spacer type=block height=3 width=100%><b><shadow>&nbsp;&#128; minisrv Latest Updates</b></shadow>
<tr><td absheight="6"></td></tr>
<tr>
<td valign="top" colspan=4>
&#149;&nbsp; Redesigned home page, uses custom rom theme system.<br>
&#149;&nbsp; Added Protoweb Support (<a href="proto://www.webtv.net/">Try it!</a>)<br>
&#149;&nbsp; Added a new minisrv logo<br>
</td></tr>
</table>
</table>
</body>
</html>`
}

/*
data =`


<html>
<head>
<display hspace=0 vspace=0 fontsize=small noscroll showwhencomplete>
<title>
Home for ${session_data.getSessionData("subscriber_username") || "minisrv"} 
</title>
</head>
<body bgcolor="#3C2F47" link=#BBAEC8 text="ffffff" vlink=AA9DB7>
<table border=0 cellspacing=0 cellpadding=0 width="100%" height="60" >
<tr>
<td>
<td align="left" background="images/proto3/HomeTopLeftEdge.gif" absheight=82 abswidth=160>
<spacer type=block height=3 width=100><br>
&nbsp;&nbsp;<img src="${minisrv_config.config.service_logo}" width=100 height=75>
</td>
<td valign="top">
<table border=0 cellspacing=0 cellpadding=0>
<tr>
<td colspan=4 valign="top"><img src="images/proto3/HomeTopEdge.gif">
</tr>
<tr><td height=5 colspan=4>
</tr>
<tr><td></TD>
</tr>
<tr><td height=3 colspan=4>
</tr>
<tr>

<td align="left">
<font color=#EEEEEE>&nbsp;<b>WebTV URL, FILE, and CLIENT Access:</b></font>
<table border=0 cellspacing=0 cellpadding=0>
<tr>
<td width="380">
<form name="urlaccess">
&nbsp;<input type="text" name="visitsite" value="wtv-" border="1" bgcolor="#BBAEC8" text="#423852" cursor="#423852" align="center" width="314" executeurl autoactivate>
<input type="submit" value="Go" width=20>
</form>
</td>
</tr>
</table>

<td>
<td width=5>

</tr>
</table>
</td>
</tr>
</table>
<table background="images/proto3/HomeTaskBar.gif" bgcolor="#9486A1" border=0 width="" height="25">
<tr>
<td abswidth=1><spacer type=block height=3 width=1>
<td abswidth=50 bgcolor="#3C2F47" href="wtv-mail:/listmail" align="center"><spacer type=block height=3 width=100%><font color="#EEEEEE"><b>Mail</b></font>
<td abswidth=2><img src="images/proto3/HomeTaskBarDividers.gif">
<td abswidth=86 bgcolor="#3C2F47" href="wtv-favorite:/favorite" align="center"><spacer type=block height=3 width=100%><font color="#EEEEEE"><b>Favorites</b></font>
<td abswidth=2><img src="images/proto3/HomeTaskBarDividers.gif">
<td abswidth=70 bgcolor="#3C2F47" href="wtv-setup:/sound" align="center"><spacer type=block height=3 width=100%><font color="#EEEEEE"><b>Music</b></font>
<td abswidth=2><img src="images/proto3/HomeTaskBarDividers.gif">
<td abswidth=74 bgcolor="#3C2F47" href="http://frogfind.com" align="center"><spacer type=block height=3 width=100%><font color="#EEEEEE"><b>Search</b></font>
<td abswidth=2><img src="images/proto3/HomeTaskBarDividers.gif">
<td abswidth=60 bgcolor="#3C2F47" href="wtv-flashrom:/willie" align="center"><spacer type=block height=3 width=100%><font color="#EEEEEE"><b>ROMs</b></font>
<td abswidth=2><img src="images/proto3/HomeTaskBarDividers.gif">
<td abswidth=86 bgcolor="#3C2F47" href="wtv-setup:/setup" align="center"><spacer type=block height=3 width=100%><font color="#EEEEEE"><b>Settings</b></font>
<td abswidth=2><img src="images/proto3/HomeTaskBarDividers.gif">
<td abswidth=50 bgcolor="#3C2F47" href="wtv-guide:/help?topic=Index&subtopic=Glossary" align="center"><spacer type=block height=3 width=100%><font color="#EEEEEE"><b>Help</b></font>
</table>

<table border=0 bgcolor="#3C2F47">
<tr>
<td valign="top">
<table border=0>
<tr>
<td colspan=3>
<table bgcolor="#BBAEC8" border=0 cellspacing=0 cellpadding=0>
<tr>
<td background="images/proto3/HomeColumn3Header.gif" abswidth="6">
<td abswidth=125 colspan=2 background="images/proto3/HomeColumn3Header.gif" valign="middle" absheight="26"><font size=2 color="#EEEEEE"><b>&#187; Community &#171;</b></font>
<tr>
<td colspan=3 height=7>

<tr>
<td abswidth="6">
<td href="wtv-chat:/home" height="18" valign="middle" bgcolor="#BBAEC8"><font color="#454C73">&#128;&nbsp;</font><font color="#000000">Chat</font>
<tr>
<td absheight="3">
<tr>
<td abswidth="6">
<td href="wtv-news:/lobby" height="18" valign="middle" bgcolor="#BBAEC8"><font color="#454C73">&#128;&nbsp;</font><font color="#000000">Discuss</font>
<td abswidth="15">
<tr>
<td absheight="3">
<tr>
<td abswidth="6">
<td href="wtv-setup:/messenger" height="21" valign="middle" bgcolor="#BBAEC8"><font color="#454C73">&#128;&nbsp;</font><font color="#000000">Messenger</font>
<td abswidth="15">
<tr>
<td absheight="5">
</table>
<tr>
<td valign="top" colspan=3>
<table bgcolor="#BBAEC8" border=0 cellspacing=0 cellpadding=0>
<tr>
<td background="images/proto3/HomeColumn3Header.gif" abswidth="6">
<td abswidth=125 colspan=2 background="images/proto3/HomeColumn3Header.gif" valign="middle" absheight="26" valign="top"><font size=2 color="#EEEEEE"><b>&#187; Account &#171;</b></font>
<tr>
<td colspan=3 height=7>
<tr>
<td abswidth="6">
<td href="client:relogin" height="21" valign="middle" bgcolor="#BBAEC8"><font color="#454C73">&#128;&nbsp;</font><font color="#000000">Relogin</font>
<td abswidth="6">
<tr>
<td absheight="3">
<tr>
<td abswidth="6">
<td href="wtv-setup:/serve-billing-overview" height="21" valign="middle" bgcolor="#BBAEC8"><font color="#454C73">&#128;&nbsp;</font><font color="#000000">Configure</font>
<td abswidth="6">
<tr>
<td absheight="3">
<tr>
<td abswidth="6">
<td href="wtv-setup:/edit-password" height="21" valign="middle" bgcolor="#BBAEC8"><font color="#454C73">&#128;&nbsp;</font><font color="#000000">Password</font>
<td abswidth="6">
<tr>
<td absheight="3">
<tr>
<td abswidth="6">
<td href="wtv-setup:/accounts" height="21" valign="middle" bgcolor="#BBAEC8"><font color="#454C73">&#128;&nbsp;</font><font color="#000000">Add User</font>
<td abswidth="6">
<tr>
<td absheight="3">
<tr>
<td abswidth="6">
`;
if (session_data.getSessionData("registered")) data += `<td href="wtv-tricks:/unregister" height="21" valign="middle" bgcolor="#BBAEC8"><font color="#454C73">&#128;&nbsp;</font><font color="#000000">Unregister</font>`;
else data += `<td href="wtv-tricks:/register" height="21" valign="middle" bgcolor="#BBAEC8"><font color="#454C73">&#128;&nbsp;</font><font color="#000000">Register</font>`
data += `
<td abswidth="6">
<tr>
<td absheight="3">

</table>
</table>
<td valign="top">
<table border=0 width=100%>


<tr>
<td align="left" colspan=4>
<table border=0 cellspacing=0 cellpadding=0 width="100%">
<tr>
<td background="images/proto3/HomeColumn3Header.gif" abswidth="6">
<td  colspan=2 background="images/proto3/HomeColumn3Header.gif" valign="middle" absheight="24"><font color="#EEEEEE"><spacer type=block height=3 width=100%><b> &#128; Welcome to zefie's minisrv ${minisrv_version_string.split(" ")[3]}</b></font>
<tr>
<td absheight="6">
<tr>
<td valign="top" colspan=3 absheight=64>
This server is operated by ${minisrv_config.config.service_owner}.<br>
`;
if (minisrv_config.config.service_description) {
	if (typeof minisrv_config.config.service_description === "string") {
		if (minisrv_config.config.service_description.length > 0) {
			data += minisrv_config.config.service_description;
        }
    }
}

data += `
</table>

<tr>
<td align="left" colspan=4>
<table border=0 cellspacing=0 cellpadding=0 width="100%">
<tr>
<td height=6>	<tr>
<td background="images/proto3/HomeColumn3Header.gif" abswidth="6">
<td colspan=2 background="images/proto3/HomeColumn3Header.gif" valign="middle" absheight="24"><font color="#EEEEEE"><spacer type=block height=3 width=100%><b> &#128; minisrv Latest Updates</b></font>
<tr>
<td absheight="6">
<tr>
<td valign="top" colspan=4 absheight=80 >
&#149;&nbsp; Added Protoweb Support (<a href="proto://www.webtv.net/">Try it!</a>)<br>
&#149;&nbsp; Added a <a href="wtv-tricks:/charmap">WebTV Character Map</a><br>
&#149;&nbsp; Redesigned homepage based on MattMan69's HackTV<br>
&#149;&nbsp; Added a new minisrv logo<br>
</table>
</table>

<td valign="top">


<table border=0 width=160>
<tr>
<td valign="top" colspan=3>


<table bgcolor="#BBAEC8" border=0 cellspacing=0 cellpadding=0>
<tr>

<td background="images/proto3/HomeColumn3Header.gif" abswidth="6">

<td abswidth=125 colspan=2 background="images/proto3/HomeColumn3Header.gif" valign="middle" absheight="24" valign="top"><font size=2 color="#EEEEEE"><b>&#187; Tools &#171;</b></font>
<tr>
<td colspan=3 height=6>
<tr>
<td abswidth="6">
<td href="wtv-tricks:/tricks" height="21" valign="middle" bgcolor="#BBAEC8"><font color="#454C73">&#128;&nbsp;</font><font color="#000000">WTV Tricks</font>
<td abswidth="6">
<tr>
<td absheight="3">
<tr>
<td abswidth="6">
<td href="wtv-author:/documents" height="21" valign="middle" bgcolor="#BBAEC8"><font color="#454C73">&#128;&nbsp;</font><font color="#000000">Pagebuilder</font>
<td abswidth="6">
<tr>
<td absheight="3">
<tr>
<td abswidth="6">
<td href="wtv-tricks:/blastbacklist?return_to=wtv-home:/home" height="21" valign="middle" bgcolor="#BBAEC8"><font color="#454C73">&#128;&nbsp;</font><font color="#000000">Clear Cache</font>
<td abswidth="6">
<tr>
<td absheight="3">
</table>
<tr>
<td valign="top" colspan=3>
<table bgcolor="#BBAEC8" border=0 cellspacing=0 cellpadding=0>
<tr>
<td background="images/proto3/HomeColumn3Header.gif" abswidth="6">

<td abswidth=125 colspan=2 background="images/proto3/HomeColumn3Header.gif" valign="middle" absheight="24" valign="top"><font size=2 color="#EEEEEE"><b>&#187; More Stuff &#171;</b></font>
<tr>
<td colspan=3 height=7>

<tr>
<td abswidth="6">
<td href="wtv-tricks:/cSetup" height="21" valign="middle" bgcolor="#BBAEC8"><font color="#454C73">&#128;&nbsp;</font><font color="#000000">Switch<br>&nbsp;&nbsp; server</font>
<td abswidth="6">
<tr>
<td absheight="5">
<tr>
<td abswidth="6">
<td href="${ownMinisrv}" height="21" valign="middle" bgcolor="#BBAEC8"><font color="#454C73">&#128;&nbsp;</font><font color="#000000">Run your<br>&nbsp;&nbsp; own server</font>
<td abswidth="6">
<tr>
<td absheight="5">
<tr>
<td abswidth="6">
<td href="http://archive.midnightchannel.net/zefie/media/" height="21" valign="middle" bgcolor="#BBAEC8"><font color="#454C73">&#128;&nbsp;</font><font color="#000000">Midnight<br>&nbsp;&nbsp; Archives</font>
<td abswidth="15">
<tr>
<td absheight="4">
<tr>
<td abswidth="6">
<td href="${supportZefieAlert}" height="21" valign="middle" bgcolor="#BBAEC8"><font color="#454C73">&#128;&nbsp;</font><font color="#000000">Help zefie</font>
<td abswidth="15">
<tr>
<td absheight="3">
</table>
</table>
</table>
`
}
data += "</body>\n</html>";
*/