/*====================================
SplashScreen class for Javascript
====================================*/
if (typeof(goliath) == 'undefined')
{
    goliath = function(){};    
}
goliath.splashScreen = function(){};

goliath.Browser.addModule('goliath.utilities');

goliath.splashScreen.generateSplashScreen=function(toSplashElement)
{
    if (toSplashElement != null && !goliath.splashScreen.hasSplash(toSplashElement))
    {
        goliath.splashScreen.getSplashElements().append(toSplashElement);
        toSplashElement.splash = goliath.splashScreen.SplashScreen(toSplashElement);
    }
    goliath.trace("generated splash screen for - " + toSplashElement.tagName + " (" + toSplashElement.id + ") ");
}

goliath.splashScreen.closeSplashScreen=function(toSplashElement)
{
    if (!goliath.splashScreen.hasSplash(toSplashElement))
        return;        
    
    goliath.splashScreen.getSplashElements().remove(toSplashElement);

    var loSplash = toSplashElement.splash;
    if (loSplash)
    {
        var loStatus = goliath.utilities.getElementsByClassName('statusMessage')[0];
        
        // TODO: Allow loggin to multiple splash screens
        goliath.logger.removeTargetDiv(loStatus);
        
        document.body.removeChild(loSplash);
        toSplashElement.splash = null;
    }
}
    
//TODO : make this an object and allow for multiple splash screens
goliath.splashScreen.SplashScreen=function(toSplashDiv)
{
    var lnHeight = 0;
    var lnWidth = 0;
    var lnWindowHeight = goliath.utilities.getWindowHeight() - 2;
    var lnWindowWidth = goliath.utilities.getWindowWidth() - 2;
    
    if (toSplashDiv == document.body)
    {
        lnHeight = lnWindowHeight;
        lnWidth = lnWindowWidth;
    }
    else
    {
        lnHeight = goliath.utilities.getHeight(toSplashDiv) - 2;
        lnWidth = goliath.utilities.getWidth(toSplashDiv) - 2;

        if (lnHeight > lnWindowHeight)
        {
            lnHeight = lnWindowHeight;
        }
        if (lnWidth > lnWindowWidth)
        {
            lnWidth = lnWindowWidth;
        }
    }
    
    loDiv = document.createElement("div");
    loDiv.className="splashScreen";
    goliath.utilities.setHeight(loDiv, lnHeight);
    goliath.utilities.setWidth(loDiv, lnWidth);
    toSplashDiv.splash = loDiv;
        
    loLogo = document.createElement("div");
    loLogo.className="splashLogo";
    loDiv.appendChild(loLogo);
    goliath.utilities.setHeight(loLogo, (lnHeight /2) - 50);
        
    loImageDiv = document.createElement("div");
    loImageDiv.className="imageDiv";
    goliath.utilities.setHeight(loImageDiv, 100);
    loDiv.appendChild(loImageDiv);
        
    loImage = document.createElement("img");
    loImage.src="./resources/images/splashScreen.gif";
    loImageDiv.appendChild(loImage);
        
    loProgress = document.createElement("div");
    loProgress.className="progressMessage";
    goliath.utilities.setCssProperty(loProgress, "overflow", "hidden");
    loDiv.appendChild(loProgress);               
        
    loStatus = document.createElement("div");
    loStatus.className="statusMessage";
    goliath.utilities.setCssProperty(loStatus, "overflow", "auto");
    goliath.utilities.setCssProperty(loStatus, "margin", "5px 14px 0 14px");
    goliath.utilities.setCssProperty(loStatus, "padding", "5px");
    goliath.utilities.setHeight(loStatus, (lnHeight /2) - 75);
    goliath.utilities.setWidth(loStatus, lnWidth - 30);
    goliath.logger.addTargetDiv(loStatus);
    loDiv.appendChild(loStatus);
        
    if (toSplashDiv == document.body)
    {
        goliath.utilities.setTop(loDiv, 1);
        goliath.utilities.setLeft(loDiv, 1);
    }
    else
    {
        goliath.utilities.setTop(loDiv, goliath.utilities.getTop(toSplashDiv));
        goliath.utilities.setLeft(loDiv, goliath.utilities.getLeft(toSplashDiv));
    }
    goliath.utilities.setCssProperty(loDiv, "position", "absolute");
    goliath.utilities.setCssProperty(loDiv, "overflow", "hidden");

    toSplashDiv.splash = loDiv;        
    //toSplashDiv.appendChild(loDiv);    
    document.body.appendChild(loDiv);
    
    return loDiv;    
}


goliath.splashScreen._splashElements = new Array();
goliath.splashScreen.getSplashElements=function()
{
    return goliath.splashScreen._splashElements;
}
goliath.splashScreen.hasSplash=function(toElement)
{
    return goliath.splashScreen.getSplashElements().contains(toElement);
}
   