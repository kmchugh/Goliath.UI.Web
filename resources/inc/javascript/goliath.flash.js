/*====================================
Flash base classes and functions for Javascript

Extended from Flash code generator on publish
====================================*/
if (typeof goliath == 'undefined')
{
    goliath = function(){};
}
if (typeof goliath.flash == 'undefined')
{
    goliath.flash = function(){};
}

goliath.flash.isIE = (navigator.appVersion.indexOf("MSIE") != -1) ? true : false;
goliath.flash.isWin = (navigator.appVersion.toLowerCase().indexOf("win") != -1) ? true : false;
goliath.flash.isOpera = (navigator.userAgent.indexOf("Opera") != -1) ? true : false;

goliath.flash.controlVersion=function()
{
    var loVersion;
    var loAxo;
    var loError;

    try
    {
        loAxo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
        loVersion = loAxo.GetVariable("$version");
    }
    catch (loError)
    {}

    if (!loVersion)
    {
        try
        {
            loAxo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
            loVersion = "WIN 6,0,21,0";
            loAxo.AllowScriptAccess = "always";
            loVersion = loAxo.GetVariable("$version");
        }
        catch (loError)
        {}
    }

    if (!loVersion)
    {
        try
        {
            loAxo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
            loVersion = loAxo.GetVariable("$version");
        }
        catch (loError)
        {}
    }

    if (!loVersion)
    {
        try
        {
            loAxo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
            loVersion = "WIN 3,0,18,0";
        }
        catch (loError)
        {}
    }

    if (!loVersion)
    {
        try
        {
            loAxo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
            loVersion = "WIN 2,0,0,11";
        }
        catch (loError)
        {
            loVersion = -1;
        }
    }
    return loVersion;
}

goliath.flash.getSWFVersion=function()
{
    var loFlashVersion = -1;

    if (navigator.plugins != null && navigator.plugins.length > 0)
    {
        if (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"])
        {
            var lcSWVer2 = navigator.plugins["Shockwave Flash 2.0"] ? " 2.0" : "";
            var lcFlashDescription = navigator.plugins["Shockwave Flash" + lcSWVer2].description;
            var laDescArray = lcFlashDescription.split(" ");
            var laTempMajor = laDescArray[2].split(".");
            var lcMajor = laTempMajor[0];
            var lcMinor = laTempMajor[1];

            var lcRevision = "";

            if (laTempMajor.length >= 3)
                lcRevision = laTempMajor[2];

            if (lcRevision == "")
            {
                lcRevision = laDescArray[3];
            }
            if (lcRevision[0] == "d" || lcRevision[0] == "r")
            {
                lcRevision = lcRevision.substring(1);
            }

            if (lcRevision.indexOf("d") > 0)
            {
                lcRevision = lcRevision.substring(0, lcRevision.indexOf("d"));
            }
        }
        loFlashVersion = lcMajor + "." + lcMinor + "." + lcRevision;
    }
    else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.6") != -1)
    {
        loFlashVersion = 4;
    }
    else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.5") != -1)
    {
        loFlashVersion = 3;
    }
    else if (navigator.userAgent.toLowerCase().indexOf("webtv") != -1)
    {
        loFlashVersion = 2;
    }
    else if (goliath.flash.isIE && goliath.flash.isWin && !goliath.flash.isOpera)
    {
        loFlashVersion = goliath.flash.controlVersion();
    }
    return loFlashVersion;
}

goliath.flash.detectFlashVersion=function(tnMajor, tnMinor, tnRevision)
{
    var lcVersionString = goliath.flash.getSWFVersion();
    var laVersionArray;
    if (lcVersionString == -1)
    {
        return false;
    }
    else if (lcVersionString != 0)
    {
        if(goliath.flash.isIE && goliath.flash.isWin && !goliath.flash.isOpera)
        {
            var laTempArray = lcVersionString.split(" ");
            var lcTempString = laTempArray[1];
            laVersionArray = lcTempString.split(",");
        }
        else
        {
            laVersionArray = lcVersionString.split(".");
        }

        var lcMajor = laVersionArray[0];
        var lcMinor = laVersionArray[1];
        var lcRevision = laVersionArray[2];

        if(lcMajor > tnMajor)
        {
            return true;
        }
        else if (lcMajor == tnMajor)
        {
            if (lcMinor > tnMinor)
            {
                return true;
            }
            else if (lcMinor == tnMinor)
            {
                return lcRevision >= tnRevision;
            }
        }
        return false;
    }
    return false;
}

goliath.flash.AC_AddExtension=function(src, ext)
{
    if (src.indexOf('?') != -1)
        return src.replace(/\?/, ext+'?');
    else
        return src + ext;
}

goliath.flash.AC_Generateobj=function(objAttrs, params, embedAttrs, elementID)
{
    var flashvars = "";
    var str = '';
    var i;
    if (goliath.flash.isIE && goliath.flash.isWin && !goliath.flash.isOpera)
    {
        for (i in params)
        {
            if (i=="flashvars")
            {
                flashvars = params[i];
            }
        }

        str += '<div align="center"><object ';
        for (i in objAttrs)
        {
            str += i + '="' + objAttrs[i] + '" ';
        }
        str += '>';

        for (i in params)
        {

            if (i=="movie")
            {
                str += '<param name="' + i + '" value="' + params[i] + '?' + flashvars + '" /> ';
            }
            else
            {
                str += '<param name="' + i + '" value="' + params[i] + '" /> ';
            }
        }

        str += '</object></div>';

    }
    else
    {
        str += '<div align="center"><embed ';
        for (i in embedAttrs)
        {
            str += i + '="' + embedAttrs[i] + '" ';
        }
        str += '> </embed></div>';
    }
    if (elementID != null)
    {
        goliath.utilities.setElementContent(elementID, str);
    }
    else
    {
        document.write(str);
    }
}

goliath.flash.AC_FL_RunContent=function()
{
    var ret = goliath.flash.AC_GetArgs( arguments, "", "movie", "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000", "application/x-shockwave-flash");
    goliath.flash.AC_Generateobj(ret.objAttrs, ret.params, ret.embedAttrs, ret.elementID);
}

goliath.flash.AC_SW_RunContent=function()
{
    var ret = goliath.flash.AC_GetArgs( arguments, ".dcr", "src", "clsid:166B1BCA-3F9C-11CF-8075-444553540000", null);
    goliath.flash.AC_Generateobj(ret.objAttrs, ret.params, ret.embedAttrs);
}

goliath.flash.AC_GetArgs=function(args, ext, srcParamName, classid, mimeType)
{
    var ret = new Object();
    ret.embedAttrs = new Object();
    ret.params = new Object();
    ret.objAttrs = new Object();
    for (var i=0; i < args.length; i=i+2)
    {
        var currArg = args[i].toLowerCase();
        switch (currArg)
        {
            case "elementid":
                ret.elementID = args[i+1];
                break;
            case "classid":
                break;
            case "pluginspage":
                ret.embedAttrs[args[i]] = args[i+1];
                break;
            case "src":
            case "movie":
                args[i+1] = goliath.flash.AC_AddExtension(args[i+1], ext);
                ret.embedAttrs["src"] = args[i+1];
                ret.params[srcParamName] = args[i+1];
                break;
            case "onafterupdate":
            case "onbeforeupdate":
            case "onblur":
            case "oncellchange":
            case "onclick":
            case "ondblclick":
            case "ondrag":
            case "ondragend":
            case "ondragenter":
            case "ondragleave":
            case "ondragover":
            case "ondrop":
            case "onfinish":
            case "onfocus":
            case "onhelp":
            case "onmousedown":
            case "onmouseup":
            case "onmouseover":
            case "onmousemove":
            case "onmouseout":
            case "onkeypress":
            case "onkeydown":
            case "onkeyup":
            case "onload":
            case "onlosecapture":
            case "onpropertychange":
            case "onreadystatechange":
            case "onrowsdelete":
            case "onrowenter":
            case "onrowexit":
            case "onrowsinserted":
            case "onstart":
            case "onscroll":
            case "onbeforeeditfocus":
            case "onactivate":
            case "onbeforedeactivate":
            case "ondeactivate":
            case "type":
            case "codebase":
            case "id":
                ret.objAttrs[args[i]] = args[i+1];
                break;
            case "width":
            case "height":
            case "align":
            case "vspace":
            case "hspace":
            case "class":
            case "title":
            case "accesskey":
            case "name":
            case "tabindex":
                ret.embedAttrs[args[i]] = ret.objAttrs[args[i]] = args[i+1];
                break;
            default:
                ret.embedAttrs[args[i]] = ret.params[args[i]] = args[i+1];
        }
    }
    ret.objAttrs["classid"] = classid;
    if (mimeType) ret.embedAttrs["type"] = mimeType;
    return ret;
}