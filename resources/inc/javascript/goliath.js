/*====================================
Root of the Goliath JavaScript framework
Nearly all of the other modules depend on this module.

This module should be loaded using goliath.Bootstrap.


====================================*/

// Ensure Goliath namespace is defined
if (typeof(goliath) == 'undefined')
{
    goliath = function(){};
}

/**
 * Identity function.
 * If a single item is passed a single object will be returned
 * If multiples are passed then an array of objects will be returned
 */
function $(/*...*/)
{
    // No argument was passed so return null
    if (arguments.length == 0)
        return null;

    /*
     * A single argument was passed, so return that element if it can be
     * determined
     */
    if (arguments.length == 1)
        return (typeof(arguments[0])!='string') ? arguments[0] : document.getElementById(arguments[0]);

    /*
     * Multiple arguments were passed, so return each element that can be
     * determined as an array.
     */
    var laElements = new Array();
    for (var i = 0, lnLength = arguments.length; i < lnLength; i++)
    {
        laElements.append((typeof(arguments[i])!='string') ? arguments[i] : document.getElementById(arguments[i]));
    }
    return laElements;
}

// ------ Extenstions for Array() object --------------------------------------------------
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

// Checks if an array contains an item, returns true if it does
Array.prototype.contains=function(toObject){
    return (this.indexOf(toObject)>=0);
}

// Removes all the objects from an array
Array.prototype.clear=function(){
    this.length=0;
}

// Adds an item to the beginning of the list, returning the new length
if (!Array.prototype.unshift)
{
    Array.prototype.unshift = function()
    {
        this.reverse();
        for(var i=0, lnLength = arguments.length; i<lnLength; i++)
        {
            this[this.length]=arguments[i]
        }
        this.reverse();
        return this.length;
    }
}


// Insert a new object at the specified location
Array.prototype.insertAt=function(tnIndex,toObject){
    this.splice(tnIndex,0,toObject);
}

// Remove an object from the specified index
Array.prototype.removeAt=function(tnIndex){
    this.splice(tnIndex,1);
}

// Removes the specified object from the array
Array.prototype.remove=function(toObject)
{
    var lnIndex=this.indexOf(toObject);
    if (lnIndex>=0)
    {
        this.removeAt(lnIndex);
    }
}

// returns a set of this array
// (no duplicates, order doesn't matter)
Array.prototype.getSet=function()
{
    var loArray = [];
    for (var i=0, lnLength=this.length; i<lnLength; i++)
    {
        loArray.append(loArray[i], true);
    }
    return loArray;
}

// Returns a copy of the current array
Array.prototype.copy=function()
{
    var loArray = new Array();
    for (var i=0, lnLength=this.length; i<lnLength; i++)
    {
        loArray.push(this[i]);
    }
    return loArray;
}

if (!Array.prototype.forEach)
{
    // Apply the specified function to each item in the array
    // Using toScope as the method scope (this)
    Array.prototype.forEach = function(toFunction, toScope)
    {
        toScope = toScope || window;
        for (var i=0, lnLength = this.length; i<lnLength; i++)
        {
            toFunction.call(toScope, this[i], i, this);
        }
    }
}

if (!Array.prototype.filter)
{
    // Filter the contents of an array using toFunction as a comparison method
    // Using toScope as the method scope (this)
    Array.prototype.filter = function(toFunction, toScope)
    {
        toScope = toScope || window;
        var laReturn = [];
        for (var i=0, lnLength = this.length; i<lnLength; i++)
        {
            var loValue = this[i]; // to handle the function changing this
            if (toFunction.call(toScope, loValue, i, this))
            {
                laReturn.append(loValue);
            }
        }
        return laReturn;
    }
}

// ------ END Extenstions for Array() object ----------------------------------------------

// ------ Extenstions for Error() object ----------------------------------------------
Error.prototype.getMessage=function(){
    return this.description || this.message;
}
Error.prototype.toString=function(){
    return this.name + " - " + this.getMessage();
}
// ------ Extenstions for Error() object ----------------------------------------------

// ------ Publisher/Subscribers --------------------------------------------------
goliath.Publisher = (function()
{
    /** The contstructor */
    return function()
    {
        var m_oSubscribers = {};
        var m_oEvents = [];



        return {
            /**
             * Notifies all subscribers of the event tcEvent, or all events
             * if tcEvent is not specified
             */
            notify : function(toNotification, tcEvent)
            {
                if (typeof(m_oSubscribers[tcEvent]) != "undefined")
                {
                    m_oSubscribers[tcEvent].forEach(
                        function(toSubscriber)
                        {
                            toSubscriber(toNotification);
                        }
                    );
                }
            },

            /**
             * Subscribes toSubscriber to tcEvent, or to all the events that are
             * currently available if tcEvent does not exist, you can also subscribe
             * to multiple events at once by passing an array of events as tcEvent
             */
            addSubscriber: function(toSubscriber, tcEvent)
            {
                tcEvent = tcEvent || m_oEvents;
                var laEvents = null;

                alert(typeof(tcEvent));

                if (typeof(tcEvent) == "string")
                {
                    laEvents = [];
                    laEvents.push(tcEvent);
                }
                else
                {
                    laEvents = tcEvent;
                }

                for (var i=0, lnLength = laEvents.length; i<lnLength; i++)
                {
                    var laEvent = laEvents[i].toLowerCase();

                    if (!m_oEvents.contains(laEvent))
                    {
                        alert("The event has not been registered with this publisher - " + laEvent);
                        continue;
                    }
                    if (typeof(m_oSubscribers[laEvent]) == "undefined")
                    {
                        m_oSubscribers[laEvent] = [];
                    }
                    m_oSubscribers[laEvent].append(toSubscriber, true);
                }
            },

            /**
             * Unsubscribes toSubscriber to tcEvent, or to all the events that are
             * currently available if tcEvent does not exist, you can also unsubscribe
             * to multiple events at once by passing an array of events as tcEvent
             */
            removeSubscriber: function(toSubscriber, tcEvent)
            {
                tcEvent = tcEvent || m_oEvents;
                var laEvents = null;

                if (typeof(tcEvent) == "string")
                {
                    laEvents = [];
                    laEvents.push(tcEvent);
                }
                else
                {
                    laEvents = tcEvent;
                }

                for (var i=0, lnLength = laEvents.length; i<lnLength; i++)
                {
                    var laEvent = laEvents[i].toLowerCase();

                    if (typeof(m_oSubscribers[laEvent]) == "undefined")
                    {
                        continue;
                    }
                    m_oSubscribers[laEvent].remove(toSubscriber);

                    if (m_oSubscribers[laEvent].length == 0)
                    {
                        delete m_oSubscribers[laEvent];
                    }
                }
            },

            /**
             * Registers the events that this can publish
             */
            registerEvent: function(tcEvent)
            {
                 m_oEvents.append(tcEvent.toLowerCase(), false);
            },

             /**
             * helper method to register an array of events
             */
            registerEvents: function(taEvents)
            {
                for (var i = 0, lnLength = taEvents.length; i<lnLength; i++)
                {
                    this.registerEvent(taEvents[i]);
                }
            }
        };
    };

})();


/**
 * Subscribes to the event tcEvent, or all the events if no event was specified
 */
Function.prototype.subscribe = function(toPublisher, tcEvent)
{
    toPublisher.addSubscriber(this, tcEvent);
}

/**
 * Unsubscribes to the event tcEvent, or all the events if no event was specified
 */
Function.prototype.unsubscribe = function(toPublisher, tcEvent)
{
    toPublisher.removeSubscriber(this, tcEvent);
}

// ------ END Publisher/Subscribers --------------------------------------------------


// ------ Queue object ----------------------------------------------------------------
goliath.CommandQueue = (function()
{
    // Private static variables:
    var g_nDefaultRetries = 10;
    var g_nDefaultTimeout = 5000;
    var g_cDefaultResponse = "WSResult";
    var g_nRefreshInterval = 60000;
    var g_nWaitingInterval = 5000;

    // The actual constructor returned
    return function()
    {
        this.maxRetries = g_nDefaultRetries;
        this.timeout = g_nDefaultTimeout;
        this.currentAttempt = 0;
        this.paused = false;
        this.connection = {};
        this.timer = null;
        this.commands = [];
        this.sentCommands = {};
        this.refreshTimeout = null;

        this.removeSentCommand = function(tcID)
        {
            var loCommand = this.sentCommands[tcID];
            delete this.sentCommands[tcID];
            return typeof(loCommand) == "undefined" ? null : loCommand;
        }

        /***
         * Resumes the queue if it was paused
         * this will have no effect if the queue was already running
         */
        this.resume=function(){this.paused = false;}

        /**
         * Pauses the queue if it was running
         * This will have no effect if it was paused
         */
        this.pause=function(){this.paused = true;};


        /**
         * Forces the queue to send all the commands it contains
         * If the queue was paused, this will resume.
         */
        this.flush=function()
        {
            // If there are not items, there is nothing to do
            if (this.commands.length == 0)
            {
                return;
            }

            // If the queue is paused, then we will resume
            if (this.paused)
            {
                resume();
            }

            var loSelf = this;
            var loCommand = this.commands[0];

            // If the command is already being executed, then leave it along
            if(loCommand.isExecuting())
            {
                return;
            }

            var laCommandList = [];
            if (loCommand.getName() != "executeCommandSet")
            {
                var llContinue = true;
                // Rather than sending commands individually, combine them all into a single command
                while(this.commands.length >0 && llContinue)
                {
                    var loCombined = this.commands[0];
                    llContinue = !loCombined.isExecuting() && loCombined.getName() != "executeCommandSet";
                    if (llContinue)
                    {
                        laCommandList.append(this.commands.pop());
                        this.sentCommands[loCombined.getID()] = loCombined;
                    }
                }
            }

            if(laCommandList.length > 0)
            {
                var lcContents = "<Commands count='"+ laCommandList.length + "' sessionID='" + (goliath.browser.getSessionID() || "") + "'>" ;
                for (var i=0, lnLength = laCommandList.length; i<lnLength; i++)
                {
                    var loExtractedCommand = laCommandList[i];
                    lcContents += "<Command id='" + loExtractedCommand.getID() + "' name='" + loExtractedCommand.getName() + "' priority='" + loExtractedCommand.getPriority() + "' time='" + loExtractedCommand.getTime() + "'>"
                    if (loCommand.getBody())
                    {
                        lcContents += "<CommandBody>" + loCommand.getBody() + "</CommandBody>";
                    }
                    lcContents += "</Command>";
                }
                lcContents += "</Commands>";

                var loExecutingCommand = new goliath.Command("executeCommandSet", lcContents);
                loExecutingCommand.setPriority(goliath.CommandQueue.PRIORITY_IMMEDIATE);
                loExecutingCommand.setSuccessCallback(this.handleCommandSetComplete);
                this.commands.unshift(loExecutingCommand);

                loCommand = loExecutingCommand;
            }

            loCommand.setExecuting(true);
            this.currentAttempt++;

            var loAbortFunction = function(){
              loSelf.connection.abort();
              window.clearTimeout(loSelf.refreshTimeout);
              loCommand.setExecuting(false);
              if (loSelf.currentAttempt == loSelf.maxRetries)
              {
                  alert("The command " + loCommand.getName() + " has been aborted");
                  loSelf.currentAttempt = 0;
              }
              else
              {
                  loSelf.flush();
              }
            };

            this.timer = window.setTimeout(loAbortFunction, this.timeout);

            var loCallbackFunction = function(toResult)
            {
                window.clearTimeout(loSelf.timer);
                loSelf.commands.shift();
                loCommand.setExecuting(false);
                loSelf.currentAttempt =0;

                if (toResult.responseXML != null)
                {
                    // Attempt to parse out the WSResult object from the Goliath Web Service
                    var loWSResult = toResult.responseXML.getElementsByTagName(g_cDefaultResponse);
                    if (loWSResult != null && loWSResult.length ==1)
                    {
                        // We have had a valid Goliath response, so parse out the session ID and error list if needed
                        if (goliath.browser.getSessionID() == null)
                        {
                            goliath.browser.setSessionID(loWSResult[0].getElementsByTagName("SessionID")[0].childNodes[0].nodeValue);
                        }

                        // Parse out the error list
                        var loErrors = loWSResult[0].getElementsByTagName("Error");
                        if (loErrors.length > 0)
                        {
                            for (var i=0, lnLength = loErrors.length; i<lnLength; i++)
                            {
                                loCommand.addError(loErrors[i].textContent);
                            }
                        }
                    }
                }

                loCommand.complete.call(loCommand, toResult);
                if (loSelf.commands.length >= 0)
                {
                    loSelf.flush();
                }
            };

            this.connection = goliath.browser.getConnection(
                    loCommand.getMethod(),
                    loCommand.getURL(),
                    goliath.browser.createCallbackList(loCallbackFunction),
                    loCommand.getBody());
        }

        /**
         * Handles the completion of command set execution, this runs under
         * the context of the command
         */
        this.handleCommandSetComplete = function(toXHTTP)
        {
            if (!toXHTTP.responseXML)
            {
                return;
            }

            var loCommands = toXHTTP.responseXML.getElementsByTagName('CommandResults')[0];
            if (loCommands!= null)
            {
                loCommands = loCommands.getElementsByTagName('Command');

                // Parse each of the commands we got a response for
                for (var i=0, lnLength = loCommands.length; i<lnLength; i++)
                {
                    var loCommand = goliath.browser.removeSentCommand(loCommands[i].getAttribute('id'));
                    if (loCommand != null)
                    {
                        // Make sure it was a command that was sent in this session
                        loCommand.complete(loCommands[i].getElementsByTagName('CommandResult')[0]);
                    }
                }
            }

            goliath.browser.setupRefresh();
        };



        this.setupRefresh=function()
        {
            var loSelf = this;
            var lnCount = 0;
            for (var loKey in this.sentCommands)
            {
                lnCount++;
            }
            lnCount = (lnCount == 0) ? g_nRefreshInterval : g_nWaitingInterval;

            // Clear any current timeouts
            window.clearTimeout(this.refreshTimeout);

            // There are no more commands to be run, so set up a refresh
            this.refreshTimeout = window.setTimeout(function(){
                var loCommand = new goliath.Command("executeCommandSet");
                loCommand.setPriority(goliath.CommandQueue.PRIORITY_IMMEDIATE);
                loCommand.setSuccessCallback(loSelf.handleCommandSetComplete);
                loCommand.send();
            }, lnCount);
        }

        this.setRetryCount=function(tnCount){this.maxRetries = tnCount;}

        this.setTimeout=function(tnTimeout){this.timeout = tnTimeout;}

        this.add=function(toCommand){this.commands.push(toCommand);}

        this.remove=function(toCommand){this.commands.remove(toCommand);}

        this.setRefreshInterval=function(tnValue){g_nRefreshInterval = tnValue; this.setupRefresh()};

        function clear(){this.commands.clear();}

        return this;
    };
})();

goliath.CommandQueue.PRIORITY_NORMAL = 1;
goliath.CommandQueue.PRIORITY_IMMEDIATE = 999;

// ------ END Queue object ------------------------------------------------------------

/*
 * Creates an element using the tag name
 * Cloning of an element is faster than creating, so we keep a copy
 * of every element that we have created in order to clone them if
 * multiples are needed
 */
goliath.createElement = function(tcTagName)
{
    // Store the list of created items
    this.createdList = (this.createdList) || {};

    this.createFunction = this.createFunction ||
        ((document.createElementNS) ?
            function(tcName){
                return document.createElementNS( 'http://www.w3.org/1999/xhtml', tcName);
            }
            :
            function(tcName){
                return document.createElement(tcName);
            });

    tcTagName = tcTagName.toLowerCase();

    if (!this.createdList[tcTagName])
    {
        this.createdList[tcTagName] = this.createFunction(tcTagName);
    }
    return this.createdList[tcTagName].cloneNode(false);
}

// Evaluate JSON strings
goliath.evalJSON=function(tcJSON)
{
    var loReturn = null;
    try
    {
        loReturn = eval("(" + tcJSON + ")");
    }
    catch(ex)
    {
        var lcMessage = 'The following error occurred when trying to evaluate a JSON string:\r\n';
        lcMessage += ex + "\r\n";
        lcMessage += "-- JSON ------------------\r\n";
        lcMessage += tcJSON;
        goliath.error(lcMessage);
    }
    return loReturn;
}


/*
    This is not a true GUID because of sandbox issues.  It is time based with random
    numbers to attempt uniqueness
 */
goliath.createGUID = function()
{
    var lcResult = '';
    for(var i=0; i<32; i++)
    {

        // insert the dashes at the 8, 12, 16, and 20th positions
        if( i == 8 || i == 12|| i == 16|| i == 20)
        {
            lcResult = lcResult + '-';
        }
        var lnNumber = Math.random();
        // Random algorithm switching
        if (lnNumber > .5)
        {
            lnNumber = lnNumber * Math.random();
        }
        // Clear the units
        lnNumber = lnNumber - Math.floor(lnNumber);
        lcResult = lcResult + Math.floor(lnNumber * 16).toString(16).toLowerCase();
    }
    return lcResult
}


/**
 * Creates an object for the namespace specified, or if the namespace exists
 * returns that namespace
 */
goliath.namespace=function(tcNamespace)
{
    var laParts = tcNamespace.split('.');

    window[laParts[0]] = window[laParts[0]] ? window[laParts[0]] : {};
    var loCurrent = window[laParts[0]];

    for (var i = 1, lnLength=laParts.length; i<lnLength; i++)
    {
        if (!loCurrent[laParts[i]])
        {
            loCurrent[laParts[i]] = {};
        }
        loCurrent = loCurrent[laParts[i]];
    }
    return loCurrent;
}


// property object *********************************************************************************
// property object is a key value pair
// tcKey Key to use for the pair
// toValue the actual value for the pair
goliath.property = function(tcKey, toValue)
{
    this._key=tcKey;
    this._value=toValue;
}
goliath.property.prototype =
{
    _key: null,
    _value: null,

    getKey: function(){
        return this._key;
    },
    getValue: function(){
        return this._value;
    },
    toString: function(){
        return this._key + " = " + this._value;
    },
    equals: function(toObject){
        return (toObject.getKey != null) ? (toObject.getKey() == this._key) : false;
    }

};

// END property object *********************************************************************************


/*****************************************************************
    event listener object definition
 *****************************************************************/
goliath.eventListener = (function(){

    var m_oListeners = [];


    /**
     * Registers the event listener so that it can be removed at a later time
     * This function is private and internal use only.
     * This solves the problem of removing event listeners with anonymous callbacks
     */
    function registerListener(toElement, tcEventType, toCallback, toInternalCallback)
    {
        var loObject = null;
        for (var i=0, lnLength = m_oListeners.length; i<lnLength; i++)
        {
            if (m_oListeners[i].element === toElement)
            {
                loObject = m_oListeners[i];
                break;
            }
        }
        if (loObject == null)
        {
            loObject = {"element" : toElement,
                        "cache" : {}};
            m_oListeners.append(loObject);
        }

        if (!loObject.cache[tcEventType])
        {
            loObject.cache[tcEventType] = {};
        }

        loObject.cache[tcEventType][toCallback] = toInternalCallback;
    }

    /**
     * Gets the reference to the anonymous callback used for the provided callback
     * This function is private and internal use only.
     * This solves the problem of removing event listeners with anonymous callbacks
     */
    function getInternalCallback(toElement, tcEventType, toCallback)
    {
        var loObject = null;
        for (var i=0, lnLength = m_oListeners.length; i<lnLength; i++)
        {
            if (m_oListeners[i].element === toElement)
            {
                loObject = m_oListeners[i];
                break;
            }
        }

        return (!loObject ||
            !loObject.cache[tcEventType]) ?
                null : loObject.cache[tcEventType][toCallback];
    }

    /**
     * Removes the internal event listener from the list of listeners
     * This function is private and internal use only.
     * This solves the problem of removing event listeners with anonymous callbacks
     */
    function unregisterListener(toElement, tcEventType, toCallback)
    {
        if (typeof(m_oListeners[toElement]) == "undefined")
        {
            return;
        }

        if (typeof(m_oListeners[toElement][tcEventType]) == "undefined")
        {
            return;
        }

        delete m_oListeners[toElement][tcEventType][toCallback];

        var lnCount =0;
        for (loObject in m_oListeners[toElement][tcEventType])
        {
            lnCount++;
        }

        if (lnCount == 0)
        {
            delete m_oListeners[toElement][tcEventType];
        }


        lnCount =0;
        for (loObject in m_oListeners[toElement])
        {
            lnCount++;
        }

        if (lnCount == 0)
        {
            delete m_oListeners[toElement];
        }
    }

    /**
     * Handles both the microsoft attachEvent and the W3C addEventListener
     * The first time this method is called it will figure out what model to
     * use, after that, it will always use the same model
     */
    function attachEvent(toElement, tcEventType, toCallback){

        var loFunction = (toElement.addEventListener) ?
            function(toElement, tcEventType, toCallback){
                // First check if this event is already registered
                var loCallback = getInternalCallback(toElement, tcEventType, toCallback)
                if (loCallback == null)
                {
                    loCallback = function(e){toCallback(cleanEvent(e))};
                    registerListener(toElement, tcEventType, toCallback, loCallback);

                    toElement.addEventListener(tcEventType, loCallback, false);
                }
            }

            :

            function(toElement, tcEventType, toCallback){
                // First check if this event is already registered
                var loCallback = getInternalCallback(toElement, tcEventType, toCallback)
                if (loCallback == null)
                {
                    loCallback = function(e){toCallback(cleanEvent(window.event))};
                    registerListener(toElement, tcEventType, toCallback, loCallback);

                    toElement.attachEvent("on" + tcEventType, loCallback);
                }
            };


        // Cache the function
        attachEvent = loFunction;

        //execute the new function
        attachEvent(toElement, tcEventType, toCallback);
    }

    /**
     * Handles both the microsoft detachEvent and the W3C removeEventListener
     * The first time this method is called it will figure out what model to
     * use, after that, it will always use the same model
     */
    function removeEvent(toElement, tcEventType, toCallback){

        var loFunction = (toElement.removeEventListener) ?
            function(toElement, tcEventType, toCallback){

                var loCallback = function(e){toCallback(cleanEvent(e))};
                loCallback = getInternalCallback(toElement, tcEventType, toCallback);
                if (loCallback != null)
                {
                    toElement.removeEventListener(tcEventType, loCallback, false);
                    unregisterListener(toElement, tcEventType, toCallback);
                }
            }

            :

            function(toElement, tcEventType, toCallback){

                var loCallback = function(e){toCallback(cleanEvent(window.event))};
                loCallback = getInternalCallback(toElement, tcEventType, toCallback);
                if (loCallback != null)
                {
                    toElement.detachEvent("on" + tcEventType, loCallback);
                    unregisterListener(toElement, tcEventType, toCallback);
                }
            };

        // Cache the function
        removeEvent = loFunction;

        //execute the new function
        removeEvent(toElement, tcEventType, toCallback);
    }


    /**
     * Stops the event from firing above the current node
     */
    function stopPropagation(toEvent)
    {
        if (!toEvent)
        {
            return;
        }

        if (toEvent.stopPropagation)
        {
            stopPropagation = function(toEvent){toEvent.stopPropagation()};
        }
        else
        {
            stopPropagation = function(toEvent){toEvent.cancelBubble = true};
        }

        stopPropagation(toEvent);
    }


    /**
     * This function standardised events so they can be treated the same
     * across browsers
     */
    function cleanEvent(toEvent)
    {
        if (!toEvent)
        {
            return null;
        }

        var loPage = getMousePositionRelativeToDocument(toEvent);
        var loOffset = getMousePositionOffset(toEvent);

        // Force the events to stop firing above the current node
        stopPropagation(toEvent);

        // return the new event object
        return {
            // The element the event occurred on
            target: getTarget(toEvent),

            // The element the event was listening for
            relatedTarget: getRelatedTarget(toEvent),

            // The keyboard character related to the event
            key: getCharacterFromKey(toEvent),

            // X and Y position of the mouse pointer relative to document
            pageX: loPage.x,
            pageY: loPage.y,

            // X and Y coordinates of the mouse pointer relative to the target
            offsetX: loOffset.x,
            offsetY: loOffset.y,

            // X and Y coordinates of the mouse pointer in screen coordinates
            screenX: toEvent.screenX,
            screenY: toEvent.screenY,

            // Prevents the browsers default action occuring on the event
            preventDefault: function()
            {
                preventDefault(toEvent);
            }


        };
    }

    /**
     * Stops the browser default action from occurring
     */
    function preventDefault(toEvent)
    {
        if (!toEvent)
        {
            return;
        }

        if (toEvent.preventDefault)
        {
            preventDefault = function(toEvent){toEvent.preventDefault();};
        }
        else
        {
            preventDefault = function(toEvent){toEvent.returnValue = false;};
        }

        preventDefault(toEvent);
    }


    /**
     * Returns the correct target for the event
     */
    function getTarget(toEvent)
    {
        var loTarget = toEvent.target || toEvent.srcElement;

        // fix for safari bug
        if (loTarget.nodeType == 3)
        {
            loTarget = loTarget.parentNode;
        }
        return loTarget;
    }

    /**
     * gets the character that was pressed for this event
     */
    function getCharacterFromKey(toEvent)
    {
        if (!toEvent)
        {
            return null;
        }

        if (toEvent.keycode)
        {
            getCharacterFromKey = function(toEvent){return String.fromCharCode(toEvent.keyCode);};
        }
        else
        {
            getCharacterFromKey = function(toEvent){return String.fromCharCode(toEvent.which);};
        }

        return getCharacterFromKey(toEvent);
    }

    /**
     * Gets the position of the mouse pointer relative to document
     */
    function getMousePositionRelativeToDocument(toEvent)
    {
        if (!toEvent)
        {
            return null;
        }

        if (toEvent.pageX)
        {
            getMousePositionRelativeToDocument = function(toEvent)
            {
                return {
                    x: toEvent.pageX,
                    y: toEvent.pageY
                };
            }
        }
        else
        {
            getMousePositionRelativeToDocument = function(toEvent)
            {
                return {
                    x: toEvent.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
                    y: toEvent.clientY + document.body.scrollTop + document.documentElement.scrollTop
                };
            }
        }

        return getMousePositionRelativeToDocument(toEvent);
    }

    /**
     * Gets the position of the mouse pointer relative to the target
     */
    function getMousePositionOffset(toEvent)
    {
        if (!toEvent)
        {
            return null;
        }

        if (toEvent.layerX)
        {
            getMousePositionOffset = function(toEvent)
            {
                return {
                    x: toEvent.layerX,
                    y: toEvent.layerY
                };
            }
        }
        else
        {
            getMousePositionOffset = function(toEvent)
            {
                return {
                    x: toEvent.offsetX,
                    y: toEvent.offsetY
                };
            }
        }

        return getMousePositionOffset(toEvent);
    }

    /**
     * gets the related targets for the case of
     */
    function getRelatedTarget(toEvent)
    {
        var loTarget = toEvent.relatedTarget;
        if (toEvent.type == "mouseover")
        {
            loTarget = loTarget || toEvent.fromElement;
        }
        else if (toEvent.type == "mouseout" || toEvent.type == "click")
        {
            loTarget = loTarget || toEvent.toElement;
        }
        return loTarget;
    }


    /***
     * The definition of the public interface of the object
     */
    return {
        /*
         * Adds the event handler (toCallback) to the specified element(toElement)
         * for the specified event (tcEventType)
         */
        add: function(toElement, toCallback, tcEventType)
        {
            if (!toElement || !toCallback || !tcEventType)
            {
                return;
            }

            attachEvent(toElement, tcEventType, toCallback);
        },

        remove: function(toElement, toCallback, tcEventType)
        {
            if (!toElement || !toCallback || !tcEventType)
            {
                return;
            }
            removeEvent(toElement, tcEventType, toCallback);
        }
    };

})();
/*****************************************************************
    end event listener definition
 *****************************************************************/


/*
 * Messages are the objects used to display status and busy prompts
 */
goliath.Message = (function(){

    return function(tcMessage)
    {
        var m_cMessage = tcMessage;

        this.getMessage = function()
        {
            return m_cMessage;
        };
    };
})();



// ---------------------------------------------------------------------------------------
// Start of the ajax (browser) object.
// The browser object controls things like client size, status bar,
// and communication to the server using ajax
// ---------------------------------------------------------------------------------------
goliath.browser = (function(){

    var SESSION_COOKIE = "goliath_app_id";

    // Private variables for the browser object

    var m_cSessionID = null;
    var m_oParameters = null;
    var m_lAllowSendingBrowserInfo = false;
    var m_oInitFunctions = {};

    sessionController = (function(){
        var m_cSessionID = null;
        var m_cUserGUID = null;
        var m_nExpiryLength = 0;
        var m_lAuthenticated = false;
        var m_lExpired = false;
        var m_nExpires = 0;
        var m_cUserDisplayName = null;
        var m_lMultiLingual = false;
        var m_cLanguage = null;

        return {

            setUserGUID : function(tcValue){m_cUserGUID = tcValue;},
            getUserGUID : function(){return m_cUserGUID},
            setExpiryLength : function(tnValue){m_nExpiryLength = tnValue;},
            getExpiryLength : function(){return m_nExpiryLength},
            setAuthenticated : function(tlValue){m_lAuthenticated = tlValue;},
            getAuthenticated : function(){return m_lAuthenticated},
            setExpired : function(tlValue){m_lExpired = tlValue;},
            getExpired : function(){return m_lExpired},
            setExpires : function(tnValue){m_nExpires = tnValue; this.updateExpiry()},
            getExpires : function(){return m_nExpires},
            setUserDisplayName : function(tcValue){m_cUserDisplayName = tcValue;},
            getUserDisplayName : function(){return m_cUserDisplayName},
            setMultiLingual : function(tlValue){m_lMultiLingual = tlValue;},
            getMultiLingual : function(){return m_lMultiLingual},
            setLanguage : function(tcValue){m_cLanguage = tcValue;},
            getLanguage : function(){return m_cLanguage},

            // This function will create a user - calling "CreateUserForSession" web service
            createUser : function(tcUserName, tcEmail, tcVerifyEmail, tcPassword, tcVerifyPassword, toCallback, toFailedCallback)
            {
                var lcBody = "<Login create=\"true\" authenticate=\" true\">";
                lcBody += "<UserName>" + tcUserName + "</UserName>";
                lcBody += "<Email>" + tcEmail + "</Email>";
                lcBody += "<Password>" + tcPassword + "</Password>";
                lcBody += "<VerifyEmail>" + tcVerifyEmail +"</VerifyEmail>";
                lcBody += "<VerifyPassword>" + tcVerifyPassword + "</VerifyPassword>";
                lcBody += "</Login>";


                ajax.executeWebServiceCall("CreateUserForSession",
                    {
                        parameters : null,
                        successCallback : toCallback,
                        failureCallback : toFailedCallback,
                        body : lcBody,
                        secure : true
                    });

            },

            // This function will let user login - calling "SigninService" web service
            loginUser : function(tcUserName, tcPassword,  toCallback, toFailedCallback)
            {

                var lcBody = "<Login>";
                lcBody += "<UserName>" + tcUserName + "</UserName>";
                lcBody += "<Password>" + tcPassword + "</Password>";
                lcBody += "</Login>";

                ajax.executeWebServiceCall("SigninService",
                    {
                        parameters : null,
                        successCallback : toCallback,
                        failureCallback : toFailedCallback,
                        body : lcBody,
                        secure : true
                    });

            },

            // This function will let user to logout - calling "SignoutService" web service
            logoutUser : function(tcUserName, tcPassword, toCallback)
            {
                ajax.executeWebServiceCall("SignoutService",
                    {
                        parameters : null,
                        successCallback : toCallback
                    });

            },

            // This function will let user to change password - calling "ChangePassword" web service
            changePassword : function(tcUserName, tcPassword, toCallback)
            {
                var lcBody = "<ChangePassword>";
                lcBody += "<OldPassword>" + "tcPassword" + "</OldPassword>";
                lcBody += " <NewPassword>" + "tcNewPassword" + "</NewPassword>";
                lcBody += "</ChangePassword>";

                ajax.executeWebServiceCall("ChangePassword",
                    {
                        parameters : null,
                        successCallback : toCallback,
                        body : lcBody,
                        secure : true
                    });

            },
            updateExpiry : function()
            {
                var lnExpiryTime = (this.getExpires() - new Date().getTime()) * .75;
                if (lnExpiryTime < 25000)
                {
                    // If the session refresh interval is faster than 25 seconds, then we can slow it down
                    this.setServerSessionExpiry(60000);
                }
                else
                {
                    ajax.setSessionRefreshInterval(lnExpiryTime);
                }
            },

            setServerSessionExpiry : function(tnExpiryMillis)
            {
                ajax.executeWebServiceCall("UpdateSessionExpiry",
                    {
                        parameters : {expiryLength: tnExpiryMillis},
                        successCallback : this.onServerExpirySet
                    });
            },

            getSessionInformation : function()
            {
                // Because we have set the session id, we also want to get the session information
                var loCommand = new goliath.Command("getSessionInformation");
                loCommand.setPriority(goliath.CommandQueue.PRIORITY_IMMEDIATE);
                loCommand.setMessage("Retrieving Session Information.");
                loCommand.setSuccessCallback(sessionController.onReceivedSessionInfo);
                loCommand.send();
            },

            onServerExpirySet : function(toResult)
            {
                sessionController.getSessionInformation();
            },

            getSessionID : function(){return m_cSessionID;},
            setSessionID : function(tcID)
            {
                if (m_cSessionID != null)
                {
                    // We are not currently allowing a session ID to change mid session
                    return;
                }
                if (m_cSessionID != tcID)
                {
                    m_cSessionID = tcID;
                    cookieControl.setCookie(SESSION_COOKIE, m_cSessionID);

                    this.getSessionInformation();
                }
            },

            onReceivedSessionInfo : function(toResult)
            {
                // Parse out the session information
                var loNode = toResult.childNodes[0];
                for (var i=0, lnLength = loNode.childNodes.length; i<lnLength; i++)
                {
                    var lcName = loNode.childNodes[i].nodeName;
                    var lcValue = loNode.childNodes[i].textContent;

                    if (lcName == "UserGUID")
                    {
                        sessionController.setUserGUID(lcValue);
                    }
                    else if (lcName == "SessionID")
                    {
                        // Do nothing here as it has already been set
                    }
                    else if (lcName == "ExpiryLength")
                    {
                        sessionController.setExpiryLength(parseInt(lcValue));
                    }
                    else if (lcName == "Authenticated")
                    {
                        sessionController.setAuthenticated(lcValue == "true");
                    }
                    else if (lcName == "Expired")
                    {
                        sessionController.setExpired(lcValue == "true");
                    }
                    else if (lcName == "Expires")
                    {
                        sessionController.setExpires(parseInt(lcValue));
                    }
                    else if (lcName == "UserDisplayName")
                    {
                        sessionController.setUserDisplayName(lcValue);
                    }
                    else if (lcName == "MultiLingual")
                    {
                        sessionController.setMultiLingual(lcValue == "true");
                    }
                    else if (lcName == "Language")
                    {
                        sessionController.setLanguage(lcValue);
                    }
                    else
                    {
                        alert("The parameter " + lcName + " was specified with value " + lcValue + " but it can not be handled");
                    }
                }
            }
        };
    })(),


    /**
     * The availability controller is used to set areas as busy
     */
    availabilityController = (function(){

        var m_aBusyElements = {};
        var m_aMessages = {};

        function getCurrentMessage(toElement)
        {
            if (typeof(m_aMessages[toElement]) != "undefined")
            {
                return (m_aMessages[toElement][m_aMessages[toElement].length-1]);
            }
            return null;
        }

        /**
         * Create or destroy the visual element for the loading
         * this will toElement is the element that is busy not the display element
         */
        function refreshBusyElement(toElement)
        {
            var loDisplayElement = m_aBusyElements[toElement];
            if (!loDisplayElement)
            {
                // Need to create the busy element
                loDisplayElement = goliath.createElement("div");

                // If we have goliath utilities, then we can size this
                // to fit the element.  Otherwise we just make it full screen
                if (goliath.utilities)
                {
                    alert("goliath utilities for busy screen");
                }
                else
                {
                    var loSize = screenControl.getActualClientSize();
                    loDisplayElement.className = "busy busyScreen";
                    loDisplayElement.style.position = "absolute";
                    loDisplayElement.style.display = "block";
                    loDisplayElement.style.width = loSize.width-2 + "px";
                    loDisplayElement.style.height = loSize.height-2 + "px";
                    loDisplayElement.style.top = "1px";
                    loDisplayElement.style.left = "1px";
                    loDisplayElement.innerHTML = "<div class='message'></div>";
                }
                m_aBusyElements[toElement] = loDisplayElement;
            }
            if (loDisplayElement.parentNode == null)
            {
                document.body.appendChild(loDisplayElement);
            }

            var loTags = loDisplayElement.getElementsByTagName("div");
            for (var i=0, lnLength = loTags.length; i<lnLength; i++)
            {
                if (loTags[i].className=="message")
                {
                    var loMessage = getCurrentMessage(toElement);
                    if (loMessage != null)
                    {
                        loTags[i].innerHTML = loMessage.getMessage();
                    }
                    else
                    {
                        loDisplayElement.parentNode.removeChild(loDisplayElement);
                    }
                }
            }
        }

        function setMessage(toMessage, toElement)
        {
            if (!m_aMessages[toElement])
            {
                m_aMessages[toElement] = [];
            }
            m_aMessages[toElement].push(toMessage);
            toMessage._element = toElement;
            refreshBusyElement(toElement);
        }


        return {
            setBusyMessage: function(tcMessage, toElement)
            {
                toElement = toElement || document.body;
                var loMessage = new goliath.Message(tcMessage);
                setMessage(loMessage, toElement);
                return loMessage;
            },

            clearBusyMessage: function(toMessage)
            {
                if (toMessage._element)
                {
                    var loElement = toMessage._element;
                    delete toMessage["_element"];
                    if (typeof(m_aMessages[loElement]) != "undefined")
                    {
                        m_aMessages[loElement].remove(toMessage);
                        if (m_aMessages[loElement].length == 0)
                        {
                            delete m_aMessages[loElement];
                        }
                    }
                    refreshBusyElement(loElement);
                }
            }

        };
    })();

    /**
     * The status object controls how the browser status bar works
     */
    statusControl = (function(){

        // Private variables for the status object

        // Keep a list of the current status' so that we can move down
        // the list as needed
        var m_oStatus = [];
        var m_oStatusElement = null;


        /**
         * Ensures the correct status is displayed
         */
        function refreshStatus()
        {
            // TODO: Add capability for custom status element
            window.status = m_oStatus.length > 0 ? m_oStatus[m_oStatus.length -1] : window.defaultStatus;
            var lcStatus = "";

            if (m_oStatus.length > 0)
            {
                var loMessage = m_oStatus[m_oStatus.length -1];
                // Check if we are dealing with a message object or a string
                lcStatus = (loMessage.getMessage) ?
                        loMessage.getMessage() :
                        loMessage;

            }
            else
            {
                lcStatus = window.defaultStatus;
            }

            window.status = lcStatus;

            if (!m_oStatusElement)
            {
                m_oStatusElement = goliath.createElement("div");
                m_oStatusElement.className = "statusElement";
                document.body.appendChild(m_oStatusElement);
            }

            m_oStatusElement.innerHTML = lcStatus;
        }

        /**
         * The public interface to the status object
         */
        return{
          /**
           * Sets the current status
           */
          set : function(tcStatus)
          {
              m_oStatus.append(tcStatus);
              refreshStatus();
          },

          clearAll : function()
          {
              m_oStatus.clear();
              refreshStatus();
          },

          // TODO: Use a message object
          clear : function()
          {
              m_oStatus.removeAt(m_oStatus.length);
          }
        };

    })();


    cookieControl = (function(){

        return {

            // Checks if we are allowed to use cookies
            usesCookies: function()
            {
                var lnDate = new Date().getTime();
                var lcCookie = "goliath.test";

                this.setCookie(lcCookie, lnDate);

                var lnCookieValue = this.getCookie(lcCookie);
                this.deleteCookie(lcCookie);

                if (lnDate == lnCookieValue)
                {
                    usesCookies = function(){return true;};
                }
                else
                {
                    usesCookies = function(){return false;};
                }

                return usesCookies();
            },

            /**
             * Gets the current value of a cookie, or null if the cookie doesn't
             * exist
             */
            getCookie: function(tcName)
            {
                var laResults = document.cookie.match ( '(^|;) ?' + tcName + '=([^;]*)(;|$)' );
                return (laResults) ? laResults[2] : null;
            },

            /**
             * Sets the value of a cookie
             */
            setCookie: function(tcName, tcValue, tdExpires, tcPath, tcDomain, tlSecure )
            {
                if (tdExpires)
                {
                    tdExpires = tdExpires * 1000 * 60 * 60 * 24;
                }
                var ldExpires_date = new Date(new Date().getTime() + (tdExpires));

                document.cookie = tcName+'='+escape(tcValue) +
                    ((tdExpires) ? ';expires=' + escape(ldExpires_date.toGMTString()) : '') +
                    ';path=' + escape(tcPath || '/' ) +
                    ';domain=' + escape(tcDomain || '') +
                    ( (tlSecure ) ? ';secure' : '' );
            },

            /**
             * Deletes a cookie
             */
            deleteCookie: function(tcName, tcPath, tcDomain )
            {
                if (this.getCookie(tcName))
                {
                    document.cookie = tcName + '=' +
                        ';path=' + escape(tcPath || '/') +
                        ';domain=' + escape(tcDomain || '') +
                        ';expires=Thu, 01-Jan-1970 00:00:01 GMT';
                }
            }
        };

    })();


    locationControl = (function(){

        return {
            getHref: function(){return location.href;},
            getHash: function(){return location.hash;},
            getHost: function(){return location.host;},
            getHostname: function(){return location.hostname;},
            getPathname: function(){return location.pathname;},
            getPort: function(){return location.port;},
            getProtocol: function(){return location.protocol;},
            getSearch: function(){return location.search;},
            // Sends the browser to a new page
            setLocation: function(tcURL){
                location.assign(this.cleanLocation(tcURL));
            },

            // Sends the browser to a new page, but does not change history
            replaceLocation: function(tcURL){
                location.replace(this.cleanLocation(tcURL));
            },

            // Makes sure the url is valid and adds a session id if required
            cleanLocation: function(tcURL)
            {
                tcURL = tcURL || "/";

                // Add the session id if needed
                if (!cookieControl.usesCookies() && (!tcURL.indexOf(this.getHost()) >= 0 || tcURL.indexOf('.') == 0 || tcURL.indexOf('/') == 0))
                {
                    // need to append the session id
                    var lcSessionID = sessionController.getSessionID();
                    if (tcURL.indexOf("sessionID") <0 && lcSessionID != null)
                    {
                        tcURL += ((tcURL.indexOf('?') >= 0) ? "&" : "?" ) + "sessionID=" + lcSessionID;
                    }
                }
                return tcURL;
            }
        };
    })();


    screenControl = (function(){

        return{
            /**
             * Gets the size available to the browser (full screen size)
             */
            getAvailableSize: function(){return {width: screen.availWidth, height: screen.availHeight};},

            /**
             * Gets the size of the browser
             */
            getSize: function(){return {width: screen.width, height: screen.height};},

            /**
             * Gets the client size the brower reports
             */
            getActualClientSize: function(){
                return {
                    width: (self.innerWidth || (document.documentElement && document.documentElement.clientWidth) || document.body.clientWidth),
                    height: (self.innerHeight || (document.documentElement && document.documentElement.clientHeight) || document.body.clientHeight)
                };
            },

            /**
             * Gets the size that the frameworks has reported the client as.
             */
            getClientSize: function()
            {
                var loSize = {
                    width: this.m_nClientWidth,
                    height: this.m_nClientHeight
                };

                if (!loSize.width || !loSize.height)
                {
                    var loClientSize = this.getActualClientSize();
                    loSize.width = loSize.width || loClientSize.width;
                    loSize.height = loSize.height || loClientSize.height;
                }
                return loSize;

            },
            getColorDepth: function(){
                return screen.colorDepth;
            },

            setClientSize: function(toSize)
            {
                this.m_nClientHeight = toSize.height;
                this.m_nClientWidth = toSize.width;
            }
        };
    })();



    ajax = (function(){

        // This is the number of milliseconds apart that the request will be polled once
        // It has been started
        var STATE_POLLING_INTERVAL =50;

        // States of the XHTTPRequest object
        var UNINITIALISED = "uninitialised";
        var LOADING = "loading";
        var LOADED = "loaded";
        var INTERACTIVE = "interactive";
        var COMPLETE = "complete";


        var m_oCommandQueue = new goliath.CommandQueue();

        /**
         * Gets the actual MSXML object
         */
        function getConnector()
        {
            // Create the connector
            if (window.XMLHttpRequest)
            {
                getConnector = function()
                {
                    try
                    {
                        // Non MS Browser
                        return new XMLHttpRequest();
                    }
                    catch (e)
                    {
                        alert(e);
                    }
                };
                return getConnector();
            }
            else if (window.ActiveXObject)
            {
                // MS Browser
                var laMSXML = new Array(
                    'Msxml2.XMLHTTP.6.0',
                    'Msxml2.XMLHTTP.5.0',
                    'Msxml2.XMLHTTP.4.0',
                    'Msxml2.XMLHTTP.3.0',
                    'Msxml2.XMLHTTP',
                    'Microsoft.XMLHTTP');

                for (var i=0, lnLength = laMSXML.length; i<lnLength; i++)
                {
                    try
                    {
                        var loReturn = new ActiveXObject(laMSXML[i]);
                        if (loReturn != null)
                        {
                            getConnector = function()
                            {
                                return new ActiveXObject(laMSXML[i]);
                            }
                            return loReturn;
                        }
                    }
                    catch (e)
                    {
                    }
                }
            }

            // It could not be created, so we need to inform the user.
            getConnector = function()
            {
                // TODO: Make this an error popup message
                goliath.browser.setStatus("Your browser doesn't seem to support XMLHttpRequests");
                return null;
            }
            return getConnector();
        }


        /* When the state changes, the callback appropriate to the new state will
         * be called.  It is possible to miss state changes using this model.
        */
        handleStateChange = function(toXHTTP, toCallbacks, tnPollingInterval)
        {
            // If there are no callbacks, there is no need to do anything here
            if (!toCallbacks)
            {
                return;
            }

            tnPollingInterval = tnPollingInterval || STATE_POLLING_INTERVAL;

            var lnInterval = window.setInterval(
            function(){
                if (toXHTTP)
                {
                    switch(toXHTTP.readyState)
                    {
                        case 0:
                            if (typeof(toCallbacks[UNINITIALISED]) != "undefined")
                            {
                                toCallbacks[UNINITIALISED](toXHTTP);
                            }
                            break;
                        case 1:
                            if (typeof(toCallbacks[LOADING]) != "undefined")
                            {
                                toCallbacks[LOADING](toXHTTP);
                            }
                            break;
                        case 2:
                            if (typeof(toCallbacks[LOADED]) != "undefined")
                            {
                                toCallbacks[LOADED](toXHTTP);
                            }
                            break;
                        case 3:
                            if (typeof(toCallbacks[INTERACTIVE]) != "undefined")
                            {
                                toCallbacks[INTERACTIVE](toXHTTP);
                            }
                            break;
                        case 4:
                            if (typeof(toCallbacks[COMPLETE]) != "undefined")
                            {
                                window.clearInterval(lnInterval);
                                toCallbacks[COMPLETE](toXHTTP);
                            }
                            break;
                        default :
                    }
                }
            }, tnPollingInterval);
        }

        function sendBrowserInformation()
        {
            var loBrowserInfo = this.screenControl;

            var loSize = loBrowserInfo.getSize();
            var loAvailableSize = loBrowserInfo.getAvailableSize();
            var loClientSize = loBrowserInfo.getClientSize();

            var lcString = "<BrowserInfo>";
            lcString += "<Height>" + loSize.height + "</Height>";
            lcString += "<Width>" + loSize.width + "</Width>";
            lcString += "<AvailableHeight>" + loAvailableSize.height + "</AvailableHeight>";
            lcString += "<AvailableWidth>" + loAvailableSize.width + "</AvailableWidth>";
            lcString += "<ColorDepth>" + loBrowserInfo.getColorDepth() + "</ColorDepth>";
            lcString += "<ClientHeight>" + loClientSize.height + "</ClientHeight>";
            lcString += "<ClientWidth>" + loClientSize.width + "</ClientWidth>";
            lcString += "</BrowserInfo>";

            var loCommand = new goliath.Command("setClientInformation", lcString);
            loCommand.setPriority(goliath.CommandQueue.PRIORITY_IMMEDIATE);
            loCommand.setMessage("Retrieving Session.");
            loCommand.send();
        }

        // Public interface for the ajax component
        return {

            executeWebServiceCall:function(tcServiceName, toOptions)
            {
                // TODO: Make /WS/ configurable
                // TODO: Need to look into cross browser calls to implement https posts
                /*
                var lcServiceName = ((toOptions.secure) ?
                        goliath.browser.getSecureConnection() + "WS/" :
                        "/WS/") + tcServiceName + "/?";
                */
               this.executeCall(lcServiceName = "/WS/" + tcServiceName + "/?", toOptions);
            },
            executeCall:function(tcServiceName, toOptions)
            {
                var lcServiceName = tcServiceName

                if (toOptions.parameters)
                {
                    for (var loParam in toOptions.parameters)
                    {
                        lcServiceName += loParam + "=" + toOptions.parameters[loParam] + "&";
                    }
                }
                lcServiceName +="sessionID=" + sessionController.getSessionID();

                var laCallbacks = null;
                if (toOptions.successCallback || toOptions.failureCallback)
                {
                    var loCallback = function(toResult)
                    {
                        if (toResult.status >= 200 && toResult.status < 300)
                        {
                            if (toOptions.successCallback)
                            {
                                toOptions.successCallback.call(null, toResult);
                            }
                        }
                        else
                        {
                            if (toOptions.failureCallback)
                            {
                                toOptions.failureCallback.call(null, toResult);
                            }
                        }
                        // TODO: also implement a failed callback
                    };
                    laCallbacks = this.createCallbackList(loCallback, null, null, null, null);
                }

                this.getConnection(toOptions.body == null ? "GET" : "POST", lcServiceName, laCallbacks, toOptions.body);
            },

            setSessionRefreshInterval:function(tnInterval)
            {
                m_oCommandQueue.setRefreshInterval(tnInterval);
            },
            removeSentCommand:function(tcID)
            {
                return m_oCommandQueue.removeSentCommand(tcID);
            },
            sendCommand:function(toCommand)
            {
                m_oCommandQueue.add(toCommand);

                // If the command is immediate, flush the queue now.
                if (toCommand.getPriority()== goliath.CommandQueue.PRIORITY_IMMEDIATE)
                {
                    m_oCommandQueue.flush();
                }
            },

            getConnection:function(tcMethod, tcURI, taCallbacks, toBody)
            {
                var loConn = getConnector();


                loConn.open(tcMethod, locationControl.cleanLocation(tcURI), true);
                loConn.setRequestHeader("Content-Type", "application/xml;charset=UTF-8");
                handleStateChange(loConn, taCallbacks);
                loConn.send(toBody || null);
                return loConn;
            },

            createCallbackList: function(toCompleteCallback, toUninitialisedCallback, toLoadingCallback, toLoadedCallback, toInteractiveCallback)
            {
                var loReturn = {};
                if (toUninitialisedCallback)
                {
                    loReturn[UNINITIALISED] = toUninitialisedCallback;
                }

                if (toLoadingCallback)
                {
                    loReturn[LOADING] = toLoadingCallback;
                }

                if (toLoadedCallback)
                {
                    loReturn[LOADED] = toLoadedCallback;
                }

                if (toInteractiveCallback)
                {
                    loReturn[INTERACTIVE] = toInteractiveCallback;
                }

                if (toCompleteCallback)
                {
                    loReturn[COMPLETE] = toCompleteCallback;
                }


                return loReturn;
            },

            setSessionBrowserInfo: function(){sendBrowserInformation()},

            setupRefresh: function()
            {
                m_oCommandQueue.setupRefresh();
            }

        };
    })();


    /**
     * The public interface to the browser object
     */
    return {
        getAjaxController: function(){return ajax;},        // TODO: This is a temporary measure
        removeSentCommand: function(tcID){return ajax.removeSentCommand(tcID)},
        setupRefresh: function(){ajax.setupRefresh()},
        getSessionID: function(){return sessionController.getSessionID();},
        setSessionID: function(tcValue){sessionController.setSessionID(tcValue);},

        getSecureConnection : function()
        {
            var lcLocation = new String(window.location);
            if (lcLocation.indexOf("https://") < 0)
            {
                lcLocation = lcLocation.substring(lcLocation.indexOf("http://") + 7);
                lcLocation = lcLocation.substring(0, lcLocation.indexOf("/"));
                // TODO: 8443 should not be hardcoded
                if (lcLocation.indexOf("8080") >=0)
                {
                    lcLocation = lcLocation.replace("8080", "8443");
                }
                lcLocation = "https://" + lcLocation + "/";
            }
            return lcLocation;
        },

        createUser : function(tcUserName, tcEmailAddress, tcVerifyEmail, tcPassword, tcVerifyPassword , toCallback, toFailedCallback)
        {
            sessionController.createUser(tcUserName, tcEmailAddress, tcVerifyEmail, tcPassword, tcVerifyPassword, toCallback, toFailedCallback);
        },

        loginUser : function(tcUserName, tcPassword,  toCallback, toFailedCallback)
        {
           sessionController.loginUser(tcUserName, tcPassword,  toCallback, toFailedCallback);
        },

        logoutUser : function(tcUserName, tcPassword, toCallback)
        {
           sessionController.logoutUser(tcUserName, tcPassword, toCallback);
        },

        changePassword : function(tcUserName, tcPassword, toCallback)
        {
           sessionController.changePassword(tcUserName, tcPassword, toCallback);
        },

        runBusyFunction: function(toFunction, tcMessage)
        {
            var loMessage = this.setBusyMessage(tcMessage);

            toFunction();

            this.clearBusyMessage(loMessage);
        },

        setBusyMessage: function(tcMessage)
        {
            return availabilityController.setBusyMessage(tcMessage);
        },

        clearBusyMessage: function(toMessage)
        {
            return availabilityController.clearBusyMessage(toMessage);
        },

        initialise: function()
        {
            // Extract the client width and height if it has been forced
            var lnClientWidth = parseInt(this.getParameter("clientWidth"));
            var lnClientHeight = parseInt(this.getParameter("clientHeight"));

            if (!isNaN(lnClientWidth) || !isNaN(lnClientHeight))
            {
                screenControl.setClientSize({width :lnClientWidth, height: lnClientHeight});
            }

            // We are allowed to use cookies, and may have a sessionID on the url, so pull out the session id
            var lcSessionID = this.getCookie(SESSION_COOKIE) || this.getParameter("sessionID");
            if (lcSessionID == null || lcSessionID.length == 0)
            {

                // The sessionID was not available.  We should get this before doing anything
                var loCommand = new goliath.Command("executeCommandSet");
                loCommand.setPriority(goliath.CommandQueue.PRIORITY_IMMEDIATE);
                loCommand.setSuccessCallback(function(){goliath.browser.initWithSessionID();});
                loCommand.send();
            }
            else
            {
                this.setSessionID(lcSessionID);
                this.initWithSessionID();
            }

            // The browser can only be initialised once.
            this.initialise = function(){
                alert("Initialisation has already been completed");
            };
        },

        initWithSessionID: function()
        {
            // Initialisation of browser object
            //this.setStatus("Loading utilities");

            // Load the utilities script
            this.loadModule("goliath.utilities", this.onUtilitiesLoaded);

            //this.setStatus("Optimising Browser Experience");
            if (m_lAllowSendingBrowserInfo)
            {
                ajax.setSessionBrowserInfo();
            }
        },

        allowSendingBrowserInfo: function(tlAllow){m_lAllowSendingBrowserInfo = tlAllow;},
        // Sets the current status
        setStatus: function(toStatus){statusControl.set(toStatus);},
        clearStatus: function(){statusControl.clear();},
        clearAllStatus: function(){statusControl.clearAll();},
        // Checks if the browser is allowed to use cookies
        usesCookies: function(){return cookieControl.usesCookies()},
        // Gets the value of a cookie, or null if the cookie doesn't exist'
        getCookie: function(tcName){return cookieControl.getCookie(tcName);},
        // Sets the value of a cookie
        setCookie: function(tcName, tcValue, tdExpires, tcPath, tcDomain, tlSecure ){cookieControl.setCookie(tcName, tcValue, tdExpires, tcPath, tcDomain, tlSecure);},
        // Deletes a cookie
        deleteCookie: function(tcName, tcPath, tcDomain){cookieControl.deleteCookie(tcName, tcPath, tcDomain);},
        // Reloads the current page
        reload: function(){location.reload();},
        // Sends the browser to a new page
        setLocation: function(tcURL){locationControl.setLocation(tcURL);},
        // Sends the browser to a new page, but does not change history
        replaceLocation: function(tcURL){locationControl.replaceLocation(tcURL);},
        // Utility functions related to window and screen
        getHref: function(){return locationControl.getHref();},
        getHash: function(){return locationControl.getHash();},
        getHost: function(){return locationControl.getHost();},
        getHostname: function(){return locationControl.getHostName();},
        getPathname: function(){return location.getPathname();},
        getPort: function(){return locationControl.getPort();},
        getProtocol: function(){return locationControl.getProtocol();},
        getSearch: function(){return locationControl.getSearch();},
        getAvailableHeight: function(){return screenControl.getAvailableHeight();},
        getSize: function(){return screenControl.getSize()},
        getActualClientSize: function(){return screenControl.getActualClientSize();},
        getClientSize: function(){return screenControl.getClientSize();},
        getColorDepth: function(){return screenControl.getColorDepth();},
        cacheScripts: function(tlCache){m_lCacheScripts = tlCache;},
        cacheStyles: function(tlCache){m_lCacheStyles = tlCache;},
        getDomain: function(){return document.domain},
        setDomain: function(tcDomain){document.domain = tcDomain},

        createCallbackList: function(toCompleteCallback, toUninitialisedCallback, toLoadingCallback, toLoadedCallback, toInteractiveCallback)
        {
            return ajax.createCallbackList(toCompleteCallback, toUninitialisedCallback, toLoadingCallback, toLoadedCallback, toInteractiveCallback);
        },

        getConnection:function(tcMethod, tcURI, taCallbacks, toBody)
        {
            return ajax.getConnection(tcMethod, tcURI, taCallbacks, toBody);
        },

        // Gets the value of the specified parameter from the URL
        getParameter:function(tcParameterName)
        {
            var loParameterList = this.getParameters();
            return (loParameterList[tcParameterName] ? loParameterList[tcParameterName] : "" );
        },

        // gets the list of parameter from the browser URL
        getParameters:function()
        {
            if (!m_oParameters)
            {
                m_oParameters = {};
                var laSearch = this.getSearch();

                laSearch = ((laSearch.length > 0) ? laSearch.substring(1) : laSearch).split('&');

                for (var i=0, lnLength = laSearch.length; i<lnLength; i++)
                {
                    var laParam = laSearch[i].split("=");
                    m_oParameters[laParam[0]] = laParam[1];
                }
            }
            return m_oParameters;
        },

        loadStyle:function(tcStyle)
        {
            // TODO: once bootstrap is implementing style properly, add the ability for a callback
            if (goliath.Bootstrap)
            {
                goliath.Bootstrap.loadStyle(tcStyle);
            }
        },

        loadModule:function(tcModule, toCallback)
        {
            if (goliath.Bootstrap)
            {
                var loModule = goliath.Bootstrap.getModule(tcModule);
                if (loModule == null)
                {
                    // Requested loading a module that doesn't actually exist
                    // We will let the bootstrap handle the error
                    goliath.Bootstrap.loadModule(loModule);
                    return;
                }

                // If there is a callback we need to have it called when the script loads
                if (toCallback)
                {
                    loModule.addLoadedCallback(toCallback);
                }
            }
        },
        sendCommand:function(toCommand){ajax.sendCommand(toCommand);},

        // Registers a function to use to initialise a control
        registerInitFunction: function(tcClassName, toFunction){m_oInitFunctions[tcClassName] = toFunction;},
        // Gets the init function for the specified class
        getInitFunction: function(tcClassName){return m_oInitFunctions[tcClassName];},
        // Gets whether user is authenticated or not
        isAuthenticated : function()
        {
            return sessionController.getAuthenticated();
        }
    };

})();




/*****************************************************************
    command object definition
*****************************************************************/
goliath.Command=(function()
{
    var g_cDefaultURL="/WS/ExecuteCommandSet";

    function defaultFailed(toXHTTP)
    {
        if (this.hasErrors())
        {
            var lcErrorString = "The command " + this.getName() + " caused the following errors:\n\n";
            var laErrors = this.getErrors();
            for (var i=0, lnLength = laErrors.length; i<lnLength; i++)
            {
                lcErrorString += laErrors[i] + "\n";
            }
            alert(lcErrorString);
        }
    }

    function defaultSuccess(toXHTTP)
    {
    }

    return function(tcName, toBody)
    {
        var m_cID = goliath.createGUID();
        var m_cName = tcName || "";
        var m_nTime = new Date().getTime();
        var m_oFailedFunction = defaultFailed;
        var m_oSuccessFunction = defaultSuccess;
        var m_cURL = g_cDefaultURL;
        var m_oBody = toBody;
        var m_nPriority = 1;
        var m_cMethod = (toBody) ? "POST" : "GET";
        var m_aErrors = [];
        var m_lExecuting = false;
        var m_cMessage = null;
        var m_oParameters = null;



        return{
            getID: function(){return m_cID;},
            getName: function(){return m_cName;},
            setName: function(tcName){m_cName = tcName},
            getTime: function(){return m_nTime;},
            getMessage: function(){return m_cMessage == null ? "Executing Command " + this.getName() : m_cMessage;},
            setMessage: function(tcMessage){m_cMessage = tcMessage},
            getURL: function(){
                var lcReturn = m_cURL;
                if (m_oParameters != null)
                {
                    for (var i=0, lnLength = m_oParameters.length; i<lnLength; i++)
                    {
                        var loParam = m_oParameters[i];
                        lcReturn += (lcReturn.indexOf("?") < 0 ? "?" : "&") + loParam.name + "=" + loParam.value;
                    }
                }
                return lcReturn;
            },
            setURL: function(tcURL){m_cURL = tcURL},
            getBody: function(){return m_oBody},
            toString: function(){return m_cName},
            getPriority: function(){return m_nPriority},
            setPriority: function(tnPriority){m_nPriority = tnPriority;},
            getMethod: function(){return m_cMethod;},
            setMethod: function(tcMethod){m_cMethod = tcMethod},
            hasErrors: function(){return m_aErrors.length > 0},
            addError: function(tcError){m_aErrors.push(tcError)},
            getErrors: function(){return m_aErrors},
            setSuccessCallback: function(toFunction){m_oSuccessFunction = toFunction},
            setFailedCallback: function(toFunction){m_oFailedFunction = toFunction},
            isExecuting: function(){return m_lExecuting;},
            setExecuting: function(tlExecuting){m_lExecuting = tlExecuting},
            addParameter: function(tcName, tcParameter){if (m_oParameters == null){m_oParameters = [];} m_oParameters.append({name:tcName, value:tcValue})},

            send: function()
            {
                goliath.browser.sendCommand(this);
            },

            complete: function(toXHTTP)
            {
                if (typeof(toXHTTP.status) == "number")
                {
                    var lnStatus = toXHTTP.status || 0;

                    if (lnStatus >= 200 && lnStatus < 300 )
                    {
                        if (m_oSuccessFunction != null)
                        {
                            m_oSuccessFunction.call(this, toXHTTP);
                        }
                    }
                    else
                    {
                        if (m_oFailedFunction != null)
                        {
                            m_oFailedFunction.call(this,toXHTTP);
                        }
                    }
                }
                else
                {
                    // This means that the result provided is actually the result, not the xhttp request
                    // TODO: Also need to check the status from the web services
                    if (m_oSuccessFunction != null)
                    {
                        m_oSuccessFunction.call(this, toXHTTP);
                    }
                }
            }
        };
    };
})();

/*****************************************************************
    end command object definition
*****************************************************************/





// TODO: Test set location with SessionID
// TODO: Get the session id from the server without changing the location (browser init)

// FOR TESTING DO NOT CACHE THE SCRIPTS OR STYLES
goliath.browser.cacheScripts(false);
goliath.browser.cacheStyles(false);
goliath.browser.allowSendingBrowserInfo(true);

goliath.browser.runBusyFunction(function(){goliath.browser.initialise();}, "Initialising Application");

/**
 * Displays an error message in the appropriate place
 */
goliath.error=function(tcMessage, tcPage, tnLine)
{
    tcPage = (tcPage) ? "Unknown" : tcPage;
    tnLine = (tnLine) ? "Unknown" : tnLine;


    var lcMessage = "An unexpected JavaScript error has occurred.\n\n";
    lcMessage += "Page '" + tcPage + "', line " + tnLine + "\n";
    lcMessage += "Description: " + tcMessage + "\n\n";

    // TODO: Reimplement the logger
    //(goliath.logger) ? goliath.logger.error(lcMessage) : goliath.alert(lcMessage);
    goliath.alert(lcMessage);

    // Also send the message to the server if possible.
    // TODO: Implement logging errors to the server again
    //goliath.browser.logErrorOnServer(lcMessage);
}

// Set up error handler
window.onerror=goliath.error;







/*
    this._busyFunctions = new Array();
    this._busyElements = new Array();
}
*/
goliath.browser.prototype =
{
    _busyFunctions: null,
    _busyElements: null,
    _authenticated: false,          // TODO: Move to a Session Initialised

    isIE:   !!window.attachEvent && !(Object.prototype.toString.call(window.opera) == '[object Opera]'),
    isOpera: Object.prototype.toString.call(window.opera) == '[object Opera]',
    isWebKit: navigator.userAgent.indexOf('AppleWebKit/') > -1,
    isGecko: navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') === -1,
    isMobileSafari: /Apple.*Mobile.*Safari/.test(navigator.userAgent),
    isKonqueror: navigator.userAgent.toLowerCase().indexOf("konqueror") != -1,


    isAuthenticated: function(){
        return this._authenticated;
    },
    getPageHeight: function(){
        return document.body.scrollHeight;
    },
    getPageWidth: function(){
        return document.body.scrollWidth;
    },
    getScrollX: function()
    {
        var loDE = document.documentElement;
        return self.pageXOffset || (loDE && loDE.scrollLeft) || document.body.scrollLeft;
    },
    getScrollY: function()
    {
        var loDE = document.documentElement;
        return self.pageYOffset || (loDE && loDE.scrollTop) || document.body.scrollTop;
    },
    getFrames: function(){
        return window.frames;
    },
    getFrameCount: function(){
        return window.frames.length;
    },
    getTitle: function(){
        return document.title;
    },
    setTitle: function(tcTitle){
        document.title = tcTitle;
    },
    getReferrer: function(){
        return document.referrer;
    },

    setBusyMessage: function(toElement, tcMessage)
    {
        if (!toElement) return;

        for (var i=0, lnLength = this._busyElements.length; i<lnLength; i++)
        {
            if (this._busyElements[i].element == toElement)
            {
                this._busyElements[i].message = tcMessage;
                if (this.onSetBusyMessage)
                {
                    this.onSetBusyMessage(toElement, tcMessage);
                }
                return;
            }
        }
    },
    setBusy: function(toElement, tnX, tnY, tnWidth, tnHeight)
    {
        if (!toElement) return;

        for (var i=0, lnLength = this._busyElements.length; i<lnLength; i++)
        {
            if (this._busyElements[i].element == toElement)
            {
                this._busyElements[i].count++;
                return;
            }
        }
        // We got here which means we need to create a new busy element
        this._busyElements.append({
            element: toElement,
            count: 1,
            x: tnX,
            y: tnY,
            width: tnWidth,
            height: tnHeight,
            message: ""
        });

        if (this.onSetBusy)
        {
            this.onSetBusy(toElement, tnX, tnY, tnWidth, tnHeight);
        }
    },
    clearBusy: function(toElement)
    {
        if (!toElement) return;

        for (var i=0, lnLength = this._busyElements.length; i<lnLength; i++)
        {
            if (this._busyElements[i].element == toElement)
            {
                if (this._busyElements[i].count-- == 1)
                {
                    if (this.onClearBusy)
                    {
                        this.onClearBusy(toElement);
                    }
                    this._busyElements.removeAt(i);
                }
                return;
            }
        }
    }

};


/*
 * When the specified function executes, the element specified will become
 * busy until the function is complete
 */
goliath.browser.prototype.executeBusyFunction=function(toFunction, toElement, toThisValue)
{
    if (toFunction != null && toElement != null)
    {
        if (this.onSetBusy)
        {
            this.onSetBusy(toElement);
        }
        this._busyFunctions.append({
            func: toFunction,
            element: toElement,
            me: toThisValue
        });
        window.setTimeout(goliath.browser.executeBusyFunctions, 0);
    }
}

goliath.browser.executeBusyFunctions=function()
{
    var loBrowser = goliath.browser;
    while(loBrowser._busyFunctions.length > 0)
    {
        var loBusy = loBrowser._busyFunctions[0];
        loBrowser._busyFunctions.removeAt(0);

        if (loBusy && loBusy.func)
        {
            try
            {
                loBusy.func.apply(loBusy.me);
            }
            catch(ex)
            {
                goliath.error(ex);
            }
        }

        if (loBrowser.onClearBusy)
        {
            loBrowser.onClearBusy(loBusy.element);
        }
    }
}

// ---------------------------------------------------------------------------------------
// End of the ajax (browser) object.
// ---------------------------------------------------------------------------------------




/**
 * Sets the status message in the browser
 */
goliath.status=function(tcMessage)
{
    (goliath.browser) ? goliath.browser.setStatus(new goliath.browser.statusMessage(tcMessage)) : window.status = tcMessage;
}

// pops a message to the screen
goliath.alert=function(tcMessage)
{
    // TODO: Change this so it uses a nice form rather than the web browser
    alert(tcMessage);
}

// TODO: Create windowing for opening and closing other windows
// To write a document, document.open({mime-type});
// To clear document in Netscape, document.clear() doesn't work,
//      have to use document.open('text/html');document.write('<br/>');document.close();
