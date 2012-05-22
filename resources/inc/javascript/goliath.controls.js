/*====================================
Control base classes and functions for Javascript
====================================*/
goliath.namespace('goliath.controls');

// Event type constants
goliath.controls.eventType =
{
    INITIALISE: "eventType_Initialise",
    READY: "eventType_Ready",
    HTML_RENDERED: "eventType_HTML_Rendered",
    VALUE_CHANGED: "VALUE_CHANGED",
    ENABLED_CHANGED: "ENABLED_CHANGED",
    MOUSE_OVER: "MOUSE_OVER",
    MOUSE_OUT: "MOUSE_OUT",
    MOUSE_CLICK: "MOUSE_CLICK",
    MOUSE_MOVE: "MOUSE_MOVE"
}

/**
 * Base control object.
 *
 * Event Order
 *  Initialise
 *  Ready
 *
 *
 */
goliath.controls.Control = (function()
{
    //-------------------------------
    // Private static member variables
    //-------------------------------


    //-------------------------------
    // Private static member functions
    //-------------------------------



    //-------------------------------
    // Returned constructor
    //-------------------------------
    return function(toElement, toOptions)
    {
        //-------------------------------
        // Private static member variables
        //-------------------------------
        var m_oElement = toElement;
        var m_oOptions = toOptions;

        // update the element so it has a link back to the control
        toElement._control = this;

        //-------------------------------
        // Private static member functions
        //-------------------------------

        /**
         * Gets the controls html element
         */
        this.getElement = function(){return m_oElement;};
        this.getID = function(){return m_oElement.id};
        this.setID = function(tcID){m_oElement.id = tcID};
        this.getOptions = function(){return m_oOptions;};




    };

})();


/**
 * This is usually called from goliath.updateControls.  This function will call the specified
 * initialisation function on the Node provided.  This function could also be called manually
 * to create a control programmatically
 * @param tcElementClass the name of the class you are creating
 * @param toNode the html node that is the control
 * @param toCallback the constructor for this object
 * @param toOptions an object that contains any objects for this class
 *
 */
goliath.controls.initialise=function(tcElementClass, toNode, toCallback, toOptions)
{
    // Check if there is already a control
    if (toNode._control)
    {
        return;
    }

    toCallback = (toCallback == null) ? goliath.controls.Control : toCallback;

    // This makes sure the element has the correct class name
    goliath.utilities.Style.addClass(toNode, tcElementClass);

    // Check if we need to do subclassing, this will force all objects to inherit from
    // control, even if not implicitly specified
    if (typeof(toCallback.superclass) == 'undefined')
    {
        // automatically extend with Control
        goliath.utilities.extend(toCallback, goliath.controls.Control);
    }

    // Creates the new control object
    var loObject = new toCallback(toNode, toOptions);

    loObject.initialise();
}

/*
  Helper function to get the control object from the element specified.
  If the element is not a control, then the parent will be checked recursively
  until a control is found or until reaching the top of the hierarchy
*/
goliath.controls.getControl=function(toElement)
{
    while (toElement && !toElement._control)
    {
        toElement = toElement.parentNode;
    }

    return (toElement && toElement._control) ? toElement._control : null;
}

goliath.controls.Control.prototype =
{
    /**
     * public variables
     */

    m_oHotTracking : false,
    m_oValue : null,

    /**
     *  Adds the specified decorator to this control, merges the objects
     */
    decorate : function(toDecorator){goliath.utilities.mergeObjects(this, toDecorator);},

    getSize: function(){return goliath.utilities.Style.getSize(this.getElement());},
    setSize: function(toSize){this.getLayoutManager().setSize(this, toSize)},

    setValue: function(toValue){this.m_oValue = toValue; if (this.fire) this.fire(goliath.controls.eventType.VALUE_CHANGED, null, this);},
    getValue: function(){return this.m_oValue;},

    getHotTracking: function(){return this.m_oHotTracking;},
    setHotTracking: function(tlValue)
    {
        this.m_oHotTracking = goliath.utilities.parseBoolean(tlValue);
        if (this.m_oHotTracking)
        {
            goliath.eventListener.add(this.getElement(), this.mouseOver, "mouseover");
            goliath.eventListener.add(this.getElement(), this.mouseOut, "mouseout");
        }
        else
        {
            goliath.eventListener.remove(this.getElement(), this.mouseOver, "mouseover");
            goliath.eventListener.remove(this.getElement(), this.mouseOut, "mouseout");
        }
    },

    // Hook function for adding custom events
    addObservers: function(){},

    /**
     *  Appends an element to this control
     */
    appendChild : function(toElement){this.getElement().appendChild(toElement);},

    initialise : function()
    {
        if (this.fire)
        {
            this.fire(goliath.controls.eventType.INITIALISE, null, this);
        }
    },

    onInitialise: function(){this.fire(goliath.controls.eventType.READY, null, this);},

    // Default handler for the on ready function
    onReady:function()
    {
        this.render();
        this.fire(goliath.controls.eventType.HTML_RENDERED, null, this);
    },

    // Hook method for rendering, by default does nothing
    render:function(){},

    // Hook method for after the html has been rendered, default is to take no action
    onHTMLRendered: function(){},

    // Hook method for after the value has been changed
    onValueChanged: function(){},

    getParent: function(){return goliath.controls.getControl(this.getElement().parentNode);},

    getChildren : function(){return getElement().childNodes;},


    /*************************
     * Helper functions
     ************************/

    // helper method for adding the observer decorator
    addObserverDecorator:function()
    {
        if (!this.m_lHasObserverDecorator)
        {
            this.m_lHasObserverDecorator = true;

            // Decorate this control
            this.decorate(new goliath.controls.decorators.Observer);

            // wire up default listeners
            this.listen(goliath.controls.eventType.READY,
                function()
                {
                    this.onReady();
                });

            this.listen(goliath.controls.eventType.INITIALISE,
                function()
                {
                    if (!this._initialised)
                    {
                        this._initialised = true;
                        this.onInitialise();
                    }
                });
            this.listen(goliath.controls.eventType.HTML_RENDERED,
                function()
                {
                    if (!this._rendered)
                    {
                        this._rendered = true;
                        this.onHTMLRendered();
                    }
                });
            this.listen(goliath.controls.eventType.VALUE_CHANGED,
                function()
                {
                    this.onValueChanged();
                });
            this.listen(goliath.controls.eventType.ENABLED_CHANGED,
                function()
                {
                    this.onEnabledChanged();
                });

            // wire up custom listeners
            this.addObservers();
        }
    },

    // helper method for turning on mouse event listening
    observeMouseEvents:function()
    {
        if (this.listen && !this._mouseEvents)
        {
            this._mouseEvents = true;

            // Add the functions to this object for the mouse events
            this.onMouseOver = this.onMouseOver ? this.onMouseOver : function(){};
            this.onMouseOut = this.onMouseOut ? this.onMouseOut : function(){};
            this.onMouseClick = this.onMouseClick ? this.onMouseClick : function(){};
            this.onMouseMove = this.onMouseMove ? this.onMouseMove : function(){};

            this.listen(goliath.controls.eventType.MOUSE_OVER,
            function(toEvent)
            {
                toEvent.preventDefault();
                this.onMouseOver(toEvent);
            });
            this.listen(goliath.controls.eventType.MOUSE_OUT,
            function(toEvent)
            {
                toEvent.preventDefault();
                this.onMouseOut(toEvent);
            });
            this.listen(goliath.controls.eventType.MOUSE_CLICK,
            function(toEvent)
            {
                toEvent.preventDefault();
                this.onMouseClick(toEvent);
            });
            this.listen(goliath.controls.eventType.MOUSE_MOVE,
            function(toEvent)
            {
                toEvent.preventDefault();
                this.onMouseMove(toEvent);
            });

            var loSelf = this;

            // Finally add in the actual listeners
            goliath.eventListener.add(this.getElement(), function(toEvent){loSelf.fire(goliath.controls.eventType.MOUSE_CLICK, toEvent, loSelf)}, "click");
            goliath.eventListener.add(this.getElement(), function(toEvent){loSelf.fire(goliath.controls.eventType.MOUSE_OVER, toEvent, loSelf)}, "mouseover");
            goliath.eventListener.add(this.getElement(), function(toEvent){loSelf.fire(goliath.controls.eventType.MOUSE_OUT, toEvent, loSelf)}, "mouseout");
            goliath.eventListener.add(this.getElement(), function(toEvent){loSelf.fire(goliath.controls.eventType.MOUSE_MOVE, toEvent, loSelf)}, "mousemove");


        }
    }
}





/*

goliath.controls.Control.prototype =
    {
        _element: null,
        _enabled: true,
        _hotTracking: false,
        _value: null,
        _initialised: false,
        _heightPercent: 0,
        _widthPercent: 0,
        _minWidth: 0,
        _minHeight: 0,
        _maxHeight: 99999,
        _maxWidth: 99999,
        _rendered: false,
        _alignment: null,


        setEnabled:function(toValue)
        {
            this._enabled = goliath.utilities.parseBoolean(toValue);
            var lnFunc = (this._enabled) ? goliath.utilities.enableObject : goliath.utilities.disableObject;
            lnFunc(this._element);
            if (this.fire)
            {
                this.fire(goliath.controls.eventType.ENABLED_CHANGED);
            }
        },
        onEnabledChanged:function(){},

        getEnabled:function()
        {
            return this._enabled;
        },
        resizeChildren: function()
        {
            var laChildren = this.getChildren();
            for (var i =0, lnLength = laChildren.length; i<lnLength; i++)
            {
                laChildren[i].resize();
            }
        },
        isInitialised: function()
        {
            return this._initialised;
        },
        isRendered: function()
        {
            return this._rendered;
        },
        getAlignment: function()
        {
            return this._alignment;
        },
        setAlignment:function(tcAlignment)
        {
            this._alignment = tcAlignment;
        },
        resize: function()
        {
            var loParent = this.getParent();
            var lnHeight = (loParent ? loParent.getHeight() : goliath.browser.getClientHeight()) * this._heightPercent;
            var lnWidth = (loParent ? loParent.getWidth() : goliath.browser.getClientWidth()) * this._widthPercent;

            if (this.getHeight() != lnHeight || this.getWidth() != lnWidth)
            {
                this.setHeight(lnHeight);
                this.setWidth(lnWidth);
                this.resizeChildren();
            }
        },
        getSizeConstraints: function()
        {
            return {
              minWidth: this._minWidth,
              maxWidth: this._maxWidth,
              minHeight: this._minHeight,
              maxHeight: this._maxHeight
            };
        },
        setSizeConstraints: function(toValue)
        {
            var loCurrentSize = this.getSizeConstraints();
            var loFN = goliath.utilities.getFirstDefined;
            toValue.minWidth = loFN(toValue.minWidth, loCurrentSize.minWidth);
            toValue.maxWidth = loFN(toValue.maxWidth, loCurrentSize.maxWidth);
            toValue.minHeight = loFN(toValue.minHeight, loCurrentSize.minHeight);
            toValue.maxHeight = loFN(toValue.maxHeight, loCurrentSize.maxHeight);

            if (toValue.minWidth <= toValue.maxWidth &&
                toValue.minHeight <= toValue.maxHeight)
            {
                this._minWidth = toValue.minWidth;
                this._maxWidth = toValue.maxWidth;
                this._minHeight = toValue.minHeight;
                this._maxHeight = toValue.maxHeight;
            }
        },
        getSizePercent: function(){return {width: this._heightPercent, height: this._widthPercent};},
        setSizePercent: function(toValue)
        {
            var loCurrentSize = this.getSizePercent();
            var loFN = goliath.utilities.getFirstDefined;
            toValue.width = loFN(toValue.width, loCurrentSize.width);
            toValue.height = loFN(toValue.height, loCurrentSize.height);

            this._heightPercent = toValue.height;
            this._widthPercent = toValue.width;
            var loParent = this.getParent();

            if (loParent)
            {
                var loSize = loParent.getSize();
                this.setSize({height: loSize.height * this._heightPercent,
                             width: loSize.width * this._widthPercent});
            }
            else if (this._element.parentNode == document.body)
            {
                this.setSize({height: goliath.browser.getClientHeight() * this._heightPercent,
                             width: goliath.browser.getClientWidth() * this._widthPercent});
            }
        },

        getLocation: function(){return goliath.utilities.Style.getLocation(this._element);},
        setLocation: function(toValue)
        {
            var loCurrent = this.getLocation();
            var loFN = goliath.utilities.getFirstDefined;
            toValue.x = loFN(toValue.x, loCurrent.x);
            toValue.y = loFN(toValue.y, loCurrent.y);

            var lnX = toValue.x;
            var lnY = toValue.y;

            if (lnX != loCurrent.x)
            {
                goliath.utilities.Style.setStyleValue(this._element, "position", "absolute");
                goliath.utilities.DOM.setX(this._element, lnX);
            }
            if (lnY != loCurrent.y)
            {
                goliath.utilities.Style.setStyleValue(this._element, "position", "absolute");
                goliath.utilities.DOM.setY(this._element, lnY);
            }
        },
        getAttribute: function(tcAttribute){return goliath.utilities.DOM.attribute(this._element, tcAttribute);},
        setAttribute: function(tcAttribute, toValue){return goliath.utilities.DOM.attribute(this._element, tcAttribute, toValue);},

        preload: function()
        {
            if (this.constructor && this.constructor.onPreload && !this.constructor._preloaded)
            {
                this.constructor._preloaded = true;
                this.constructor.onPreload.call(this);
            }
        },






        getChildren: function()
        {
            var loFunc = function(toNode, taArray)
            {
                if (toNode._control)
                {
                    taArray.append(toNode._control);
                    return;
                }

                for (var j=0, lnLength = toNode.childNodes.length; j<lnLength; j++)
                {
                    var loNode = toNode.childNodes[j];
                    (loNode._control) ?
                        taArray.append(loNode._control) :
                        loFunc(loNode, taArray);
                }
            }

            var laChildren = [];
            for (var j=0, lnLength = this._element.childNodes.length; j<lnLength; j++)
            {
                loFunc(this._element.childNodes[j], laChildren);
            }
            return laChildren;
        },

        mouseOver:function(toEvent)
        {
            var loSelf = goliath.controls.getControl(toEvent.target);
            if (loSelf.getEnabled())
            {
                goliath.utilities.Style.highlightObject(loSelf._element);
                if (loSelf.fire)
                {
                    loSelf.fire(goliath.controls.eventType.MOUSE_OVER);
                }
            }
        },
        mouseOut:function(toEvent)
        {
            var loSelf = goliath.controls.getControl(toEvent.target);
            if (loSelf.getEnabled())
            {
                goliath.utilities.Style.unHighlightObject(loSelf._element);
                if (loSelf.fire)
                {
                    loSelf.fire(goliath.controls.eventType.MOUSE_OUT);
                }
            }
        },
        onMouseOver:function(toEvent){},
        onMouseOut:function(toEvent){}
    }
*/

/*

// control constructor
goliath.controls.Control=function(toElement)
{
    if (typeof toElement._control != 'undefined')
    {
        // this element already has a control
        return;
    }

    this._element = toElement;

    // Allows for two way navigation
    this._element._control = this;

    // set up size information
    this.setSizeConstraints({
        minWidth: this.getAttribute("minWidth") ? parseFloat(this.getAttribute("minWidth")) : 0,
        maxWidth: this.getAttribute("maxWidth") ? parseFloat(this.getAttribute("maxWidth")) : 99999,
        minHeight: this.getAttribute("minHeight") ? parseFloat(this.getAttribute("minHeight")) : 0,
        maxHeight: this.getAttribute("maxHeight") ? parseFloat(this.getAttribute("maxHeight")) : 99999
    });

    this.setAlignment(this.getAttribute("alignment") ? this.getAttribute("alignment") : "horizontal");

    this.setSizePercent({
        width: this.getAttribute("widthPercent") ? parseFloat(this.getAttribute("widthPercent")) : 0,
        height: this.getAttribute("heightPercent") ? parseFloat(this.getAttribute("heightPercent")) : 0
    });


    // Set up the hot tracking
    this.setHotTracking(this.getAttribute("hottracking"));

    this.setEnabled(this.getAttribute("enabled") == '' || this.getAttribute("enabled") == 'true');

    // Sort out any data config
    if (this.initData && typeof(this.initData) == 'function')
    {
        this.initData();
    }

    // Sort out all UI config
    if (this.initUI && typeof(this.initUI) == 'function')
    {
        this.initUI();
    }

    // do any preloading that may be required
    this.preload();

    // set the value if it exists
    this.setValue(this._element.getAttribute("value"));
}
*/

/*

(function() {
    function _controls(toElementList)
    {
        this.controls = [];
        for (var i=0, lnLength = toElementList.length; i<lnLength; i++)
        {
            var loElement = toElementList[i];
            if (typeof loElement === 'string')
            {
                loElement = document.getElementById(loElement);
            }
            var loControl = goliath.controls.getControl(loElement);
            if (loControl != null && !this.controls.contains(loControl))
            {
                this.controls.push(loControl);
            }
        }
    };

    _controls.prototype =
        {
            each: function(toFunction)
            {
                for (var i=0, lnLength = this.controls.length; i<lnLength; i++)
                {
                    toFunction.call(this, this.controls[i]);
                }
                return this;
            }
        };

    window.controls = function()
    {
        return new _controls(arguments);
    };
})();
*/


/***************************************
 * Control Decorators
 ***************************************/
goliath.namespace('goliath.controls.decorators');
goliath.controls.decorators.Observer = function()
{
    this._events = [];

    this.listen = function(tcEventName, toCallback)
    {
        tcEventName = tcEventName ? tcEventName : "not defined";
        if (typeof toCallback == 'function')
        {
            if (!this._events[tcEventName])
            {
                this._events[tcEventName] = [];
            }
            if (!this._events[tcEventName].contains(toCallback))
            {
                this._events[tcEventName].append(toCallback);
            }
        }
    };

    this.fire = function(tcEventName, toParams, toScope)
    {
        tcEventName = tcEventName ? tcEventName : "not defined";
        toScope = toScope || window;

        for (var i = 0, lnLength = (this._events[tcEventName]) ? this._events[tcEventName].length : 0; i < lnLength; i++)
        {
            this._events[tcEventName][i].call(toScope, toParams);
        }
    }
}




/****************************************************
 *Creating a textbox that only accepts specific characters
 *switch(e.target.className) {
            case "numerical":
                if (e.key.match(/[^0-9]/g)) {
                    e.preventDefault();
                }
                break;

            case "email":
                // The following regular expression matches all characters not
                // permitted within an email address
                if (e.key.match(/[^a-zA-Z0-9@!#$%&'*+-\/=?^_{}~.]+/g)) {
                    e.preventDefault();
                }
                break;
        }

 **/


/* MAKING AN UPLOAD CONTROL WORK THE SAME ACROSS ALL BROWSERS
 *
 * <form method="post" action="/" id="form" enctype="multipart/form-data">
    <div class="file" id="uploader">
        <input type="file" id="file-upload" />
        <div class="file-label"></div>
    </div>

    <input type="submit" value="Save" />
</form>

In order to ensure the CSS for this control is applied only when JavaScript is enabled, you'll use JavaScript to dynamically add a new class of active to the <div class="file" id="uploader"> element:

$.CSS.addClass(document.getElementById("uploader"), "active");

Then write all your CSS to hang from this new class name:

div.file.active {
    position: relative;
    background: url(file-upload.png) top left no-repeat;
    width: 288px;
    height: 39px;
}

div.file.active .file-label {
    position: absolute;
    top: 0;
    left: 10px;
    width: 175px;
    height: 100%;
    overflow: hidden;
    z-index: 1;
    font-size: 1.4em;
    line-height: 31px;
}

div.file.active input {
    position: absolute;
    -moz-opacity: 0;
    -ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
    filter: alpha(opacity=0);
    opacity: 0;
    z-index: 2;
    border: 0;
    width: 100%;
    height: 100%;

$.onDomReady(function() {
    // Find all the fields with class file within the <form> tag with id of form
    var fileUploadFields = $.Elements.getElementsByClassName("file", Image from book
        document.getElementById("form"));
    for (var index, length = fileUploadFields.length; index < length; index++) {
        var fileUpload = fileUploadFields[index];
        // Add the class active to the file upload fields
        $.CSS.addClass(fileUpload, "active");
    }

    // We'll call the setFileLabel function when certain browser events fire
    var setFileLabel = function(e) {
        if (e.target.type == "file") {
            // Find the nearest text label to display the file name within
            var fileLabel = $.Elements.getElementsByClassName( Image from book
                "file-label", e.target.parentNode)[0];
            // Get the file name from the upload field
            var file = e.target.value;

            // Display only 19 characters of text within the file name label
            var numberOfChars = 19;
            if (file.length > numberOfChars) {
                // Truncate the file name if it's longer than 19 characters
                    file = file.substr(0, 4) + " ... " + Image from book
                file.substr(file.length - numberOfChars + 4, file.length)
            }
            // Write the file name to the label element
            fileLabel.innerHTML = file;
        }
    }

    // Listen for change events on the control and set the label text
    $.Events.add(document.getElementById("file-upload"), "change", Image from book
        setFileLabel);

    // Listen for mouseout events on the control and set the label text - used for
    // Internet Explorer which does not fire the change event when it should
    $.Events.add(document.getElementById("file-upload"), "mouseout", Image from book
        setFileLabel);
});


 ***/















goliath.controls.Control.prototype.addClass=function(tcClassName)
{
    goliath.utilities.addClass(this._element, tcClassName);
}
goliath.controls.Control.prototype.removeClass=function(tcClassName)
{
    goliath.utilities.removeClass(this._element, tcClassName);
}

goliath.controls.postControls=function(/* ... */)
{
    if (arguments.length == 0)
        return null;

    var loCommand = new goliath.command();
    loCommand.setName("postControlsFromClient");

    var lcString = "";

    for (var i = 0; i < arguments.length; i++)
    {
        var loElement = $(arguments[i]);
        if (loElement.id != null)
        {
            lcString = lcString + "<Values>";
            lcString = goliath.controls.buildPostXMLString(loElement, lcString);
            lcString = lcString + "</Values>"
        }
    }

    loCommand.setBody(lcString)
    loCommand.setSynchronous(true);
    loCommand.setPriority(goliath.commandQueue.PRIORITY_IMMEDIATE);
    loCommand.setMessage(new goliath.browser.statusMessage("Posting Control Values."));
    if ($(arguments[0])._control != null)
    {
        loCommand.setOnCommandComplete($(arguments[0])._control.getExecuteServerCommandResponse);
    }
    else
    {
        loCommand.setOnCommandComplete(this.getExecuteServerCommandResponse);
    }

    loCommand.send();

    return null;
}

goliath.controls.buildPostXMLString=function(toElement, tcString)
{
    var loElement = toElement;
    var llSkipChildren = false;

    if (toElement.id != null &&
        (toElement.className.toLowerCase().indexOf("group") != 0
          && toElement.className.toLowerCase().indexOf("label") != 0
          && toElement.className.toLowerCase().indexOf("button") != 0))
    {
        var lcID = toElement.id;
        var loValue = null;
        if (toElement._control != null)
        {
            loValue = toElement._control.getValue();
        }

        if (loValue == null)
        {
            loValue = toElement.getAttribute("value");
        }

        if (toElement.type == "checkbox")
        {
            loValue = toElement.checked;
        }

        if (toElement.className.toLowerCase().indexOf("combobox") >= 0)
        {
            loValue = toElement.value;
        }

        if (goliath.utilities.Style.hasClass(toElement, 'optionGroup'))
        {
            if (goliath.utilities.Style.hasClass(toElement, 'yui-buttongroup'))
            {
                var laOptions = goliath.utilities.getElementsByClassName('yui-radio-button-checked', loElement);
                for (var i=0; i<laOptions.length; i++)
                {
                    loValue = laOptions[i].childNodes[0].childNodes[0].innerHTML;
                }
            }

            llSkipChildren = true;
        }

        if (toElement.tagName == "textarea" || toElement.tagName == "TEXTAREA")
        {
            var lcControlName = 'lo' + toElement.id;
            eval(lcControlName + ".saveHTML();");
            loValue = toElement.value;

            llSkipChildren = true;
        }

        if (!goliath.utilities.isNullOrEmpty(lcID))
        {
            if (loValue == null)
            {
                loValue = "[{NULL}]";
            }
            loValue = new String(loValue);
            tcString = tcString + "<Update><ControlName>" + lcID + "</ControlName><Value>" + goliath.utilities.escape(loValue) + "</Value></Update>";
        }
    }

    if (!llSkipChildren)
    {
        for (var i = 0; i < toElement.childNodes.length; i++)
        {
            var loElement = toElement.childNodes[i];

            // TODO: implement this properly so each class can override
            tcString = goliath.controls.buildPostXMLString(loElement, tcString);
        }
    }
    return tcString;
}

goliath.controls.refreshControlFromContent=function(tcID, tcContent)
{
    tcID = $(tcID);

    alert(tcID);
    alert(tcContent);
}

goliath.controls.Control.prototype.executeServerCommand=function(tcAction, tcCommandBody)
{
    if (tcCommandBody == null || tcCommandBody == "undefined")
    {
        tcCommandBody = "";
    }

    var loCommand = new goliath.command();
    loCommand.setName("executeUICommand");
    loCommand.setSynchronous(false);
    loCommand.setBody("<Command><Control>" + this.getElement().id + "</Control><Action>" + tcAction + "</Action>" + tcCommandBody + "</Command>")
    loCommand.setPriority(goliath.commandQueue.PRIORITY_IMMEDIATE);
    loCommand.setMessage(new goliath.browser.statusMessage("Executing UI Commands."));
    loCommand.setOnCommandComplete(this.getExecuteServerCommandResponse);
    loCommand.send();
}

goliath.controls.Control.prototype.getExecuteServerCommandResponse=function()
{
    // Execute the executable xml that was returned
    goliath.utilities.parseExecutableXML(this.getResponseXML());
}


/**
 * This method scans the element provided and children for any golith controls
 * if it finds any it will redraw or update them as needed
 * The initilisation is done from the parent level down to the children
 * toElement is not processed, only it's children, it is expected that toElement
 * will normally be document.body
 * @param toElement the element to start the search from
 */
goliath.updateControls=function(toElement)
{
    // It can take some time for IE6 to actually build the utilities object
    // So we have to make sure it exists before we can continue here
    if (!(toElement) && (typeof(goliath.browser) == "undefined" || typeof(goliath.utilities) == "undefined"))
    {
        // Try again in a few milliseconds
        window.setTimeout(goliath.updateControls, 500);
        return;
    }

    toElement = toElement || document.body;

    goliath.onUpdateControls(toElement);

    goliath.browser.clearAllStatus();
}

goliath.onUpdateControls=function(toElement)
{
    // loop through all the children looking for registered classes
    for (var i=0, lnLength = toElement.childNodes.length; i<lnLength; i++)
    {
        var loElement = toElement.childNodes[i];


        // If it is not an element node type, or there is no classname,
        // just continue as there is no need to do anything
        if (typeof(loElement) == "undefined" || loElement.nodeType != 1 || (loElement.className == "" && loElement.childNodes.length == 0))
        {
            continue;
        }

        // if there is a space in the class name, then we need to find the init function
        // otherwise we can just call it
        var loInitFunction = goliath.browser.getInitFunction(loElement.className);
        if (!loInitFunction)
        {
            var laKeys = loElement.className.split(" ");
            for (var j=0, lnLength1 = laKeys.length; j<lnLength1; j++)
            {
                loInitFunction = goliath.browser.getInitFunction(laKeys[j]);
                if (loInitFunction)
                {
                    // Cache the function so we don't have to search next time'
                    goliath.browser.registerInitFunction(loElement.className, loInitFunction);
                    break;
                }
            }
        }

        // Run the initialisation function
        if (loInitFunction)
        {
            goliath.controls.initialise(loElement.className, loElement, loInitFunction, null);
        }

        // then parse the children
        goliath.onUpdateControls(loElement);
    }
}

// force the controls to load and update
goliath.Bootstrap.addLoadedCallback(goliath.updateControls)




