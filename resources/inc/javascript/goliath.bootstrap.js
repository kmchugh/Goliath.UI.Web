/*====================================
Bootstrapper for loading Goliath Libraries

This module is standalone and does not required any other modules to be loaded

Sample usage of adding Modules:
goliath.Bootstrap.addModule("goliath", 100, []);
goliath.Bootstrap.addModule("goliath.utilities", 100, ["goliath"]);



Sample usage for loading Modules:
goliath.Bootstrap.loadModule("goliath.utilities.js");


Sample usage for setting up a callback when the modules are loaded:
goliath.Bootstrap.addLoadedCallback(function(){alert("The modules have been loaded")});

====================================*/

// TODO: Implement Styles so they are similar to modules, allowing dependency chains
// TODO: Implement caching flag to add time to URL if not set, forcing the browser not to cache
// TODO: Implement using the sessionID as part of the url if goliath.browser is available


// We include index of here so that the bootstrap can be used standalone
// Return the integer value of the index of the object in the array
// Returns -1 if the object is not found
if (!Array.prototype.indexOf)
{
    Array.prototype.indexOf=function(toObject /*, from */)
    {
        var lnFrom = Number(arguments[1]) || 0;
        lnFrom = (lnFrom < 0) ? 0 : Math.floor(lnFrom);

        for (var lnLength = this.length; lnFrom<lnLength;lnFrom++)
        {
            if (this[lnFrom] === toObject)
            {
                return lnFrom;
            }
        }
        return -1;
    }
}

if (!Array.prototype.append)
{
    Array.prototype.append=function(toObject, tlNoDuplicates)
    {
        if (tlNoDuplicates)
        {
            if (this.indexOf(toObject) >= 0)
            {
                return -1;
            }
        }
        this[this.length]=toObject;
        return this.length-1;
    }
}


// Ensure goliath is defined
if (typeof(goliath) == 'undefined')
{
    goliath = function(){};
}

// Create the Bootstrap Object (Singleton)
goliath.Bootstrap = (function(){

    //-------------------------------
    // Private member variables
    //-------------------------------

    // Contains the list of modules
    var m_aModules = [];

    // URL to load scripts from if one isn't provided
    var m_cDefaultURL = "/resources/inc/javascript/";

    // Number of bytes that need to be loaded
    var m_nLoadingBytes = 0;

    // Number of bytes that have been loaded
    var m_nLoadedBytes = 0;

    // The callbacks to call when all the scripts have loaded
    var m_aCallbacks = [];

    // The ready state of the document
    var m_lIsPageLoaded = false;

    // Stores the splash screen if it has been created
    var m_oSplash;

    // Stores the timeout for appending the splash screen
    var m_nSplashTimeout;

    //-------------------------------
    // Private member functions
    //-------------------------------

    /***
    * Checks if a module is in the dependency list
    * tcModuleName - the name of the javascript file
    * returns true if the module exists already, otherwise false
    */
    function containsModule(tcModuleName)
    {
        for (var i=0, lnLength = m_aModules.length; i<lnLength; i++)
        {
            var loModule = m_aModules[i];
            if (loModule.getName() == tcModuleName)
            {
                return true;
            }
        }
        return false;
    }

    function isModuleLoadComplete()
    {
        if (m_aModules == null || m_aModules.length == 0)
        {
            return true;
        }
        for (var i=0, lnLength = m_aModules.length; i<lnLength; i++)
        {
            var loModule = m_aModules[i];
            if (loModule.isLoaded() && !loModule.isCompleted())
            {
                return false;
            }
        }
        return true;
    }

    function isIE6()
    {
        return (document.compatMode && document.all) != undefined;
    }

    return {

        isPageLoaded : function()
        {
            return m_lIsPageLoaded;
        },
        setPageLoaded : function()
        {
            m_lIsPageLoaded = true;
        },

        /**
         * Creates the splash screen if needed, then displays it
         */
        showSplash : function()
        {
            if (!m_oSplash)
            {
                // TODO: Or pick up an element with the id "grpSplash""
                m_oSplash = document.getElementById(arguments[0]) ? document.getElementById(arguments[0]) : document.createElement("div");
                m_oSplash.style.width = (self.innerWidth || (document.documentElement && document.documentElement.clientWidth) || document.body.clientWidth) + "px";
                m_oSplash.style.height = (self.innerHeight || (document.documentElement && document.documentElement.clientHeight) || document.body.clientHeight) + "px";
                m_oSplash.style.position = "absolute";
                m_oSplash.style.top = "0px";
                m_oSplash.style.left = "0px";
                m_oSplash.style.background = "white url('/resources/images/ajax-loader.gif') no-repeat center";

                m_oSplash.id="grpSplash";
                this.appendSplashWhenReady();
            }
        },

        /**
         * Hides the splash screen if it is displayed
         */
        hideSplash : function()
        {
            if (m_nSplashTimeout != 0)
            {
                window.clearTimeout(m_nSplashTimeout);
                m_nSplashTimeout = -1;
            }

            if (m_oSplash && m_oSplash.parentNode)
            {
                m_oSplash.parentNode.removeChild(m_oSplash);
            }

        },

        /**
         * As some browsers do not allow appending of elements until the dom model is created, this defers
         * display of the splash screen until it is safe
         */
        appendSplashWhenReady : function()
        {
            if (m_oSplash.parentElement == null)
            {
                if (!isIE6() && !goliath.Bootstrap.isPageLoaded())
                {
                    m_nSplashTimeout = window.setTimeout(goliath.Bootstrap.appendSplashWhenReady, 100);
                    return;
                }
                document.body.appendChild(m_oSplash);
            }
        },

        /***
        * Adds the module to the list of available modules.
        * tcModuleName - The name of the javascript file
        * tnLength - the size of the module in bytes
        * taDepends - and array of dependent module names
        */
        addModule : function(tcModuleName, tnLength, taDepends)
        {
            // If the module is not already in the list
            if (!containsModule(tcModuleName))
            {
                var loModule = new goliath.Bootstrap.Module(tcModuleName, tnLength, taDepends);
                m_aModules[m_aModules.length] = loModule;
            }
        },

        /**
         * Gets the module object from this list of modules
         * tcModuleName - the name of the module to get
         */
        getModule : function(tcModuleName)
        {
            for (var i=0, lnLength = m_aModules.length; i<lnLength; i++)
            {
                var loModule = m_aModules[i];
                if (loModule.getName() == tcModuleName)
                {
                    return loModule;
                }
            }
            return null;
        },
        /**
         * Loads the specified module
         * tcModuleURL - the FULL url to the module specified.
         * usage example:
         *      No URL specified
         *     goliath.Bootstrap.loadModule("goliath.utilities.js");
         *      URL specified
         *     goliath.Bootstrap.loadModule("./resources/inc/javascript/goliath.utilities.js");
         */
        loadModule : function(tcModuleURL)
        {
            var lcModule = ((tcModuleURL.indexOf(".js") > 0) ?
                lcModule = tcModuleURL.substr(tcModuleURL.lastIndexOf("/") + 1, tcModuleURL.indexOf(".js") - tcModuleURL.lastIndexOf("/")-1).toLowerCase()
                :
                lcModule = tcModuleURL.substr(tcModuleURL.lastIndexOf("/") + 1).toLowerCase());
            var loModule = this.getModule(lcModule);

            if (loModule != null)
            {
                var lcURL = tcModuleURL.substr(0, tcModuleURL.lastIndexOf("/") + 1);

                lcURL = (lcURL == "") ? m_cDefaultURL : lcURL;

                // When we are loading a module, if there is no splash screen create one to stop showing the page jumps
                this.showSplash();

                // Attempt to load the module;
                loModule.load(lcURL);
            }
            else
            {
                alert('Attempted to load ' + tcModuleURL + " which has not been set up as a module");
                throw("Invalid module " + tcModuleURL);
            }
        },
        getLoadingBytes :function()
        {
            return m_nLoadingBytes;
        },
        incrementLoadingBytes :function(tnIncrement)
        {
            m_nLoadingBytes+=tnIncrement;
        },
        getLoadedBytes:function()
        {
            return m_nLoadedBytes;
        },
        incrementLoadedBytes :function(tnIncrement)
        {
            m_nLoadedBytes+=tnIncrement;
        },
        setStatus : function(tcStatus)
        {
            if (goliath.browser && goliath.browser.setStatus)
            {
                goliath.browser.setStatus(tcStatus);
            }
            else
            {
                window.status = tcStatus;
            }
        },
        isFullyLoaded : function()
        {
            return (m_nLoadingBytes > 0 && m_nLoadingBytes == m_nLoadedBytes);
        },
        getCallbacks :function()
        {
            return m_aCallbacks;
        },
        clearCallbacks :function()
        {
            m_aCallbacks = [];
        },
        addLoadedCallback : function(toCallback)
        {
            if (!toCallback)
            {
                return;
            }

            if (this.isFullyLoaded())
            {
                toCallback();
                return;
            }

            // Set up the callback
            if (m_aCallbacks.indexOf(toCallback) < 0)
            {
                m_aCallbacks.append(toCallback);
            }
        },
        executeCallbacks : function()
        {
            while (m_aCallbacks.length > 0)
            {
                try
                {
                    var lnFunction = m_aCallbacks.pop();
                    lnFunction();
                }
                catch (ex)
                {
                    alert("Error: " + ex);
                }
            }
            this.hideSplash();
        },
        onPageLoaded : function()
        {
            var loSelf = goliath.Bootstrap;
            if (loSelf.isFullyLoaded())
            {
                loSelf.executeCallbacks();
            }
            loSelf.setPageLoaded();
        },
        onCompletedModule : function (toModule)
        {
            // If all the modules are complete, then hide the splash screen
            if (isModuleLoadComplete())
            {
                this.hideSplash();
            }
        }
    };
})();


// Set up a function to notify the bootstrap when the page has loaded
if(document.addEventListener)
{
    document.addEventListener("DOMContentLoaded", goliath.Bootstrap.onPageLoaded, false);
}
else
{
    document.onreadystatechange=function(){
        var loReadyState = document.readyState;
        if (loReadyState == 4 || loReadyState == 'loaded' || loReadyState == 'complete')
        {
            goliath.Bootstrap.onPageLoaded();
        }
    }
}


goliath.Bootstrap.Module = (function()
{
    //-------------------------------
    // Static variables
    //-------------------------------


    /**
     * Constructor function.  Creates a new instance of Module
     * tcName - the name of the module
     * tnLength - the length of the module in bytes
     * taDependencies - the modules that this module depends on
     */
    return function(tcName, tnLength, taDependencies)
    {
        //-------------------------------
        // Private member variables
        //-------------------------------

        // Name of the module
        var m_cName = "";

        // Length of the module in bytes
        var m_nLength = 0;

        // List of dependencies (contains Module objects)
        var m_aDependencies = [];

        // True if the module is loaded, or has a script tag on the page and is loading
        var m_lIsLoaded = false;

        // Reference to the script tag for this module
        var m_oTag = null;

        // true if the module has started to load, or is waiting for dependencies to load
        var m_lStarted = false;

        var m_lIsCompleted = false;

        var m_aLoadedCallbacks = [];


        //-------------------------------
        // Privileged functions
        //-------------------------------

        this.getName = function(){return m_cName;};
        this.setName = function(tcName){m_cName = tcName.toLowerCase();};

        this.getLength = function(){return m_nLength;};
        this.setLength = function(tnLength){m_nLength = tnLength};

        this.isLoaded = function(){return m_lIsLoaded};

        this.isReady = function(){return this.isReadyStateComplete()}

        this.isCompleted = function(){return m_lIsCompleted};

        this.getDependencies = function(){return m_aDependencies;};

        this.hasTag = function(){return m_oTag != null};
        this.setTag = function(toTag){m_oTag = toTag;m_lIsLoaded = true;};
        this.getTag = function(){return m_oTag;};

        this.setStarted = function(){m_lStarted = true};
        this.hasStarted = function(){return m_lStarted};

        this.isReadyStateComplete = function()
        {
            var loReadyState = m_oTag ? m_oTag.readyState ? m_oTag.readyState : m_oTag.getAttribute("readyState") : null;
            return loReadyState == 4 || loReadyState == 'loaded' || loReadyState == 'complete';
        }

        this.addLoadedCallback = function(toCallback)
        {
            // If the callback is added and we are already ready, then just execute
            if (this.isReady())
            {
                toCallback();
            }
            else
            {
                if (m_aLoadedCallbacks.indexOf(toCallback) < 0)
                {
                    m_aLoadedCallbacks.push(toCallback);
                }

            }
        }

        this.executeLoadedCallbacks = function()
        {
            for (var i=0, lnLength = m_aLoadedCallbacks.length; i<lnLength; i++)
            {
                try
                {
                    m_aLoadedCallbacks[i]();
                }
                catch(ex)
                {
                    alert("Callback failed - \n" + m_aLoadedCallbacks[i] + "\n\n\n" + ex);
                }
            }
            m_aLoadedCallbacks.length = 0;
            m_lIsCompleted = true;
            goliath.Bootstrap.onCompletedModule(this);
        }

        /***
         * Adds the specified module as a dependent of this module
         * tcName - the name of the javascript file to add as a module.
         * The module must already have been created in the bootstrapper
         */
        this.addDependency = function(tcName)
        {
            tcName = tcName.toLowerCase();
            var loModule = goliath.Bootstrap.getModule(tcName);

            // Check if the module exists
            if (loModule != null)
            {
                // Make sure this module did not already have it as a dependency
                // No need to report an error if dependency already exists
                if (!this.hasDependency())
                {
                    m_aDependencies[m_aDependencies.length] = loModule;
                }
            }
            else
            {
                alert("an error occured when trying to add the dependency " + tcName + "\nThat module does not exist");
                throw (tcName + " does not exist");
            }
        }

        //-------------------------------
        // Initialisation function
        //-------------------------------
        this.setName(tcName);
        this.setLength(tnLength);

        for (var i=0, lnLength = taDependencies.length; i<lnLength; i++)
        {
            this.addDependency(taDependencies[i]);
        }
    };
})();

//-------------------------------
// NON - Privileged functions
//-------------------------------

goliath.Bootstrap.Module.prototype =
{
    load : function(tcURL)
    {
        var i, lnLength;
        if (!this.isLoaded())
        {

            var laDepends = this.getDependencies();

            // First we need to load all of the dependencies
            for (i=0, lnLength = laDepends.length; i<lnLength; i++)
            {
                if (!laDepends[i].isLoaded())
                {
                    laDepends[i].load(tcURL);
                }
            }

            // Double locking, just in case there was circular dependency
            if (!this.isLoaded())
            {
                // Check if a script already exists on the page with this module
                var laScripts = document.getElementsByTagName("script");

                for (i=0, lnLength = laScripts.length; i<lnLength; i++)
                {
                    var lcSrc = laScripts[i].getAttribute('src');
                    if (lcSrc != null)
                    {
                        lcSrc = lcSrc.substr(lcSrc.lastIndexOf("/") + 1, lcSrc.indexOf(".js") - lcSrc.lastIndexOf("/")-1).toLowerCase();
                        if (lcSrc == this.getName())
                        {
                            // The script is already on the page
                            this.setTag(laScripts[i]);
                            break;
                        }
                    }
                }
                if (!this.hasTag())
                {
                    if (!this.hasStarted())
                    {
                        goliath.Bootstrap.incrementLoadingBytes(this.getLength());
                        this.addScriptTag(tcURL + this.getName() + ".js");
                    }
                }
            }
        }
    },

    /***
     * Checks if this module is dependent on the module passed in
     * tcName - the name of the module to check dependency
     * returns true if this module is dependent on the module specified
     */
    hasDependency : function(tcName)
    {
        var laDepends = this.getDependencies();
        for (var i=0, lnLength = laDepends.length; i<lnLength; i++)
        {
            if (laDepends[i].getName() == tcName)
            {
                return true;
            }
        }
        return false;
    },

    areDependenciesReady : function()
    {
        var laDepends = this.getDependencies();
        for (var i=0, lnLength = laDepends.length; i<lnLength; i++)
        {
            if (!laDepends[i].isReady())
            {
                return false;
            }
        }
        return true;
    },

    /***
     * Adds the script tag to the page
     * tcURL - The url to load the tag from
     */
    addScriptTag : function(tcURL)
    {
        this.setStarted();
        var loSelf = this;


        /* We don't actually want to attempt to load this until all of the
         * dependencies are loaded and ready
         */
        if(!this.areDependenciesReady())
        {
            // Find a dependency that is not ready and attach to it's loaded event
            var laDepends = this.getDependencies();
            for (var j=0, lnLength = laDepends.length; j<lnLength; j++)
            {
                if (!laDepends[j].isReady())
                {
                    laDepends[j].addLoadedCallback(function()
                    {
                        // Make sure we haven't been loaded since last we tried
                        if (!loSelf.isLoaded())
                        {
                            loSelf.addScriptTag(tcURL);
                        }
                    });
                    return;
                }
            }

            // If we got here, then during the time it took to find the dependency
            // They were loaded, so we can just continue.
        }

        var loTag = document.createElement("script");

        loTag.src = tcURL;
        loTag.type = "text/javascript";
        loTag.charset = "utf-8";
        loTag.defer = "true";
        document.getElementsByTagName("head")[0].appendChild(loTag);
        this.setTag(loTag);

        if (typeof (loTag.readyState) != 'undefined')
        {

            this.addEventListener(loTag,
                function()
                {
                    if (loTag.readyState == 4 || loTag.readyState == 'loaded' || loTag.readyState == 'complete')
                    {
                        goliath.Bootstrap.incrementLoadedBytes(loSelf.getLength());
                        goliath.Bootstrap.setStatus(goliath.Bootstrap.getLoadedBytes() + "b /" + goliath.Bootstrap.getLoadingBytes() + "b");
                        if (goliath.Bootstrap.isFullyLoaded())
                        {
                            var loCallbacks = goliath.Bootstrap.getCallbacks();
                            goliath.Bootstrap.clearCallbacks();
                            while(loCallbacks.length > 0)
                            {
                                var loFunction = loCallbacks.pop();
                                try
                                {
                                    loFunction();
                                }
                                catch(ex)
                                {
                                    alert("Callback failed - \n" + loFunction + "\n\n\n" + ex);
                                }
                            }
                        }
                        // Execute any callbacks that have been attached externally
                        loSelf.executeLoadedCallbacks();
                    }


                },
                "readystatechange"
                );
        }
        else
        {
            this.addEventListener(loTag,
                function()
                {
                    loTag.setAttribute("readyState", 4);
                    goliath.Bootstrap.incrementLoadedBytes(loSelf.getLength());
                    goliath.Bootstrap.setStatus(goliath.Bootstrap.getLoadedBytes() + "b /" + goliath.Bootstrap.getLoadingBytes() + "b");

                    if (goliath.Bootstrap.isFullyLoaded())
                    {
                        var loCallbacks = goliath.Bootstrap.getCallbacks();
                        goliath.Bootstrap.clearCallbacks();
                        while(loCallbacks.length > 0)
                        {
                            var loFunction = loCallbacks.pop();
                            try
                            {
                                loFunction();
                            }
                            catch(ex)
                            {
                                alert("Callback failed - \n" + loFunction + "\n\n\n" + ex);
                            }
                        }
                    }

                    // Execute any callbacks that have been attached externally
                    loSelf.executeLoadedCallbacks()
                },
                "load"
                );
        }
    },
    addEventListener:function(toElement, toCallback, tcEventType)
    {
        if (toElement.addEventListener)
        {
            toElement.addEventListener(tcEventType, function(e){
                toCallback(e)
                }, false);
        }
        else if (toElement.attachEvent)
        {
            toElement.attachEvent("on" + tcEventType, function(e){
                toCallback(window.event)
                });
        }
    }
};


goliath.Bootstrap.loadStyle=function(tcURL)
{
    var llFound = false;
    var loTag = null;

    var lcScript = tcURL.substr(tcURL.lastIndexOf("/") + 1, tcURL.indexOf(".css") - tcURL.lastIndexOf("/")-1).toLowerCase();
    loTag = goliath.createElement("link");
    loTag.rel = "stylesheet";
    loTag.type = "text/css";
    loTag.href = tcURL;

    var laStyles = document.getElementsByTagName("link");
    for (var i=0, lnLength = laStyles.length; i<lnLength; i++)
    {
        if (laStyles[i].getAttribute("href").toLowerCase().indexOf("/" + lcScript.toLowerCase() + ".css") >= 0)
        {
            loTag = laStyles[i];
            llFound = true;
            break;
        }
    }

    if (!llFound)
    {
        document.getElementsByTagName("head")[0].appendChild(loTag);
    }
}






// TODO:  This section should be autogenerated
// <!--AUTOGENERATED CONTENT -->
goliath.Bootstrap.addModule("goliath", 8328, []);
goliath.Bootstrap.addModule("goliath.date", 1586, []);
goliath.Bootstrap.addModule("goliath.utilities", 8547, ["goliath"]);
goliath.Bootstrap.addModule("goliath.controls", 3327, ["goliath", "goliath.utilities"]);
goliath.Bootstrap.addModule("goliath.controls.layout.layoutManager", 3327, ["goliath", "goliath.controls"]);
goliath.Bootstrap.addModule("goliath.controls.button", 561, ["goliath.controls"]);
goliath.Bootstrap.addModule("goliath.controls.container", 691, ["goliath.controls.layout.layoutManager", "goliath.controls"]);
goliath.Bootstrap.addModule("goliath.controls.panel", 691, ["goliath.controls.container"]);
goliath.Bootstrap.addModule("goliath.controls.shapeSlider", 1918, ["goliath.controls"]);
goliath.Bootstrap.addModule("goliath.controls.splitGroup", 726, ["goliath.controls"]);
goliath.Bootstrap.addModule("goliath.flash", 1586, ["goliath", "goliath.utilities"]);
goliath.Bootstrap.addModule("goliath.controls.calendar", 1586, ["goliath.controls", "goliath.date"]);


// <!--END AUTOGENERATED CONTENT -->
