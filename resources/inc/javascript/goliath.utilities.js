/*====================================
Utility classes for Javascript
====================================*/

goliath.namespace('goliath.utilities');

goliath.utilities =
{
    /*********************************
     Basic utilities
     *********************************/
    // Merges toNew with toOriginal, adding or updating all properties from toOriginal with the ones
    // from toNew
    mergeObjects: function(toOriginal, toNew)
    {
        for (var loKey in toNew)
        {
            var loNewValue = null;
            var loOriginalValue = null;
            if (toNew.hasOwnProperty(loKey))
            {
                loNewValue = toNew[loKey];
                loOriginalValue = toOriginal[loKey];
            }
            toOriginal[loKey] = (loOriginalValue && typeof(loNewValue) == 'object' && typeof(loOriginalValue) == 'object') ?
                    goliath.utilities.mergeObjects(loOriginalValue, loNewValue) :
                    loNewValue;
        }
        return toOriginal;
    },
    /**
     * extends the subclass with super class
     * The constructor to the sub class should be followed by a call to this method
     * The constructor should also contain the following as the first line of code
     * <SubClassConstructorName>.superclass.constructor.call(this, <arguments for constructor>);
     */
    extend: function(toSubClass, toSuperClass)
    {
        if (typeof toSuperClass == 'undefined')
        {
            setTimeout(function(){goliath.utilities.extend(toSubClass, toSuperClass);}, 0);
            return;
        }

        var loEmpty = function(){};
        loEmpty.prototype = toSuperClass.prototype;
        goliath.utilities.augment(toSubClass, toSuperClass);

        toSubClass.superclass = toSuperClass.prototype;
        if (toSuperClass.prototype.constructor == Object.prototype.constructor)
        {
            toSuperClass.prototype.constructor = toSuperClass;
        }
    },
    /**
     * Augments the specifed class by adding all the functions in the giving class if they
     * don't already exist in the receiving class
     * You can also add specific methods by adding them as optional parameters in the call e.g.
     * augment(class1, class2, 'getName', 'getDescription');
     */
    augment: function(toReceivingClass, toGivingClass)
    {
        if (arguments[2])
        {
            // Copy only the specified methods
            for (var i=2, lnLength = arguments.length; i<lnLength; i++)
            {
                toReceivingClass.prototype[arguments[i]] = toGivingClass.prototype[arguments[i]];
            }
        }
        else
        {
            for (var loMethod in toGivingClass.prototype)
            {
                if (!toReceivingClass.prototype[loMethod])
                {
                    toReceivingClass.prototype[loMethod] = toGivingClass.prototype[loMethod];
                }
            }
        }
    },
    /* Adds any values to toReceivingObject that do not already exist
     * Does not override any values that already exist
    */
    update: function(toReceivingObject, toGivingObject)
    {
        for (var loProp in toGivingObject)
        {
            if (typeof toReceivingObject[loProp] == 'undefined')
            {
                toReceivingObject[loProp] = toGivingObject[loProp];
            }
        }
    },
    // Caches the results of a function
    cache: function(toFunction)
    {
        return function()
        {
            toFunction.memory = toFunction.memory || {};
            arguments.join = Array.prototype.join;
            var lcKey = arguments.join("|");

            if (lcKey in toFunction.memory)
            {
                return toFunction.memory[lcKey];
            }
            else
            {
                toFunction.memory[lcKey] = toFunction.apply(this, arguments);
                return toFunction.memory[lcKey];
            }
        };
    },
    parseBoolean:function(toValue)
    {
        toValue = (toValue == null) ? false : toValue;

        if (typeof(toValue) == "boolean")
        {
            return toValue;
        }

        if (typeof(toValue) == "number")
        {
            return toValue >= 1;
        }

        if (typeof(toValue) == "string")
        {
            return toValue.toLowerCase() == "true";
        }

        goliath.alert("unknown value parseboolean -" + typeof(toValue));

        return false;
    },
    getFirstDefined: function()
    {
        for (var i=0, lnLength = arguments.length; i<lnLength; i++)
        {
            if (typeof arguments[i] != 'undefined' && arguments[i] != null)
            {
                return arguments[i];
            }
        }
        return null;
    },
    // Gets the Text from the XML Node
    getXMLNodeText: function(toNode){return (toNode.textContent) ? toNode.textContent : toNode.text;},
    // Converts an xml node to a string
    xmlToString: function(toNode, tlSkipRoot)
    {
        var lcContent = toNode.xml ? toNode.xml : new XMLSerializer().serializeToString(toNode);
        if (tlSkipRoot)
        {
            lcContent = lcContent.substring(lcContent.indexOf(">") +1, lcContent.lastIndexOf("</"));
        }
        return lcContent;
    },
    // Returns true if the string is null or empty
    isNullOrEmpty : function(tcValue){return (tcValue == null || tcValue == "")},
    // Returns toValue if it is not null, otherwise returns toOtherValue
    isNull : function(toValue, toOtherValue){return (toValue != null) ? toValue : toOtherValue;}
}





/*********************************
 Style utilities
 *********************************/
goliath.utilities.Style =
    {
        getStyleValue: function(toElement, tcProperty)
        {
            toElement = $(toElement);
            var lcValue = "";
            if (window.getComputedStyle)
            {
                lcValue = window.getComputedStyle(toElement, null)[goliath.utilities.Text.toHyphens(tcProperty)];
            }
            else if (toElement.currentStyle)
            {
                lcValue = toElement.currentStyle[goliath.utilities.Text.toCamelCase(tcProperty)];
            }
            return lcValue;
        },
        setStyleValue: function(toElement, tcProperty, tcValue)
        {
            toElement = $(toElement);
            if (toElement)
            {
                try
                {
                    if (toElement.style != null && toElement.style.setProperty != null)
                    {
                        toElement.style.setProperty(goliath.utilities.Text.toHyphens(tcProperty), tcValue, "");
                    }
                    else
                    {
                        toElement.style[goliath.utilities.Text.toCamelCase(tcProperty)] = tcValue;
                    }
                }
                catch (ex)
                {
                    //alert(toElement + " - " + tcProperty + " - " + tcValue);
                }
            }
        },
        getClassNames: function(toElement)
        {
            toElement = $(toElement);
            var laClassNames = [];
            if (toElement.className)
            {
                laClassNames = toElement.className.split(' ');
                if (laClassNames.length == 0)
                {
                    laClassNames = [toElement.className];
                }
            }
            return laClassNames;
        },
        addClass: function(toElement, tcClassName)
        {
            toElement = $(toElement);
            var laClasses = tcClassName.split(' ');
            if (laClasses.length > 0)
            {
                for (var i=0, lnLength = laClasses.length; i<lnLength; i++)
                {
                    var laClass = laClasses[i];
                    if (!this.hasClass(toElement, laClass))
                    {
                        var laClassNames = this.getClassNames(toElement);
                        laClassNames.push(laClass);
                        toElement.className = laClassNames.join(' ');
                    }
                }
            }
            else
            {
                toElement.className = tcClassName;
            }
        },
        removeClass: function(toElement, tcClassName)
        {
            toElement = $(toElement);
            var laClassNames = this.getClassNames(toElement);
            laClassNames.remove(tcClassName);
            toElement.className = laClassNames.join(' ');
        },
        hasClass: function(toElement, tcClassName)
        {
            toElement = $(toElement);
            var laClassNames = this.getClassNames(toElement);
            return laClassNames.contains(tcClassName);
        },
        getSize: function(toElement)
        {
            toElement = $(toElement);
            var loDOM = goliath.utilities.DOM;

            var lnWidth = loDOM.getWidth(toElement);
            var lnHeight = loDOM.getHeight(toElement);

            return {width: lnWidth, height: lnHeight};
        },
        setSize: function(toElement, toSize)
        {
            this.setCSSWidth(toElement, toSize.width);
            this.setCSSHeight(toElement, toSize.height);
        },
        getLocation: function(toElement)
        {
            toElement = $(toElement);
            var loDOM = goliath.utilities.DOM;

            var lnX = loDOM.getPageX(toElement);
            var lnY = loDOM.getPageY(toElement);

            return {x: lnX, y: lnY};
        },
        setLocation: function(toElement, toLocation)
        {
            toElement = $(toElement)
            if (toElement != null)
            {
                goliath.utilities.Style.setStyleValue(toElement, 'position', 'absolute');
                goliath.utilities.DOM.setX(toElement, toLocation.x);
                goliath.utilities.DOM.setY(toElement, toLocation.y);
            }
        },
        resetCSS: function(toElement, toProperties)
        {
            var loReturn = {};

            for (var i in toProperties)
            {
                loReturn[i] = toElement.style[i];
                toElement.style[i] = toProperties[i];
            }

            return loReturn;
        },
        restoreCSS: function(toElement, toProperties)
        {
            for (var i in toProperties)
            {
                toElement.style[i] = toProperties[i];
            }
        },
        getCSSX: function(toElement)
        {
            return parseInt(this.getStyleValue(toElement, "left"));
        },
        getCSSY: function(toElement)
        {
            return parseInt(this.getStyleValue(toElement, "right"));
        },
        getCSSHeight: function(toElement)
        {
            var lnValue = parseInt(this.getStyleValue(toElement, "height"));
            return (lnValue.toString() == 'NaN') ? 0 : lnValue;
        },
        getCSSWidth: function(toElement)
        {
            var lnValue = parseInt(this.getStyleValue(toElement, "width"));
            return (lnValue.toString() == 'NaN') ? 0 : lnValue;
        },
        setCSSHeight: function(toElement, tnValue)
        {
            this.setStyleValue(toElement, "height", tnValue + "px");
        },
        setCSSWidth: function(toElement, tnValue)
        {
            this.setStyleValue(toElement, "width", tnValue + "px");
        },
        hide: function(toElement)
        {
            var lcDisplay = this.getStyleValue(toElement, 'display');
            if (lcDisplay != 'none')
            {
                toElement.$oldDisplay = lcDisplay;
            }
            toElement.style.display = 'none';
        },
        show: function(toElement)
        {
            toElement.style.display = toElement.$oldDisplay || '';
        },
        setOpacity: function(toElement, tnLevel)
        {
            if (toElement.filters)
            {
                if (typeof(toElement.style.filter) != 'undefined')
                {
                    toElement.style.filter = 'alpha(opacity=' + tnLevel * 100 + ')';
                }
                else
                {
                    toElement.style.filter = 'alpha(opacity=' + tnLevel + ')';
                }
            }
            else
            {
                // TODO: Check if IE8 supports this, if it does, remove the opacity= tnLevel * 100
                goliath.utilities.Style.setStyleValue(toElement, 'opacity',  tnLevel);
            }
        },
        highlightObject: function(toElement){goliath.utilities.Style.addClass(toElement, "highlight");},
        unHighlightObject: function(toElement){goliath.utilities.Style.removeClass(toElement, "highlight");}
    };





/*********************************
 Browser addons
 *********************************/
goliath.browser.prototype.onClearBusy=function(toElement)
{
    if (goliath.utilities.Style.hasClass(toElement, "busy"))
    {
        goliath.utilities.Style.removeClass(toElement, "busy");
        if (toElement._busyElement)
        {
            goliath.utilities.DOM.remove(toElement._busyElement);
            toElement._busyElement = null;
        }
    }
}

goliath.browser.prototype.onSetBusyMessage=function(toElement, tcMessage)
{
    if (toElement._busyElement)
    {
        var loLabels = goliath.utilities.DOM.getElementsByTagName("label", toElement._busyElement);
        if (loLabels.length > 0)
        {
            loLabels[0].innerHTML = tcMessage;
        }
    }
}

goliath.browser.prototype.onSetBusy=function(toElement, tnX, tnY, tnWidth, tnHeight)
{
    tnX = (tnX) ? tnX : goliath.utilities.DOM.getPageX(toElement);
    tnY = (tnY) ? tnY : goliath.utilities.DOM.getPageY(toElement);
    tnWidth = (tnWidth) ? tnWidth : goliath.utilities.DOM.getWidth(toElement);
    tnHeight = (tnHeight) ? tnHeight : goliath.utilities.DOM.getHeight(toElement);

    if (!goliath.utilities.Style.hasClass(toElement, "busy"))
    {
        goliath.utilities.Style.addClass(toElement, "busy");
        if (!toElement._busyElement)
        {
            var loBusyElement = goliath.createElement('div');
            loBusyElement.className = "busyScreen";
            goliath.utilities.Style.setStyleValue(loBusyElement, 'position', 'absolute');
            goliath.utilities.DOM.setX(loBusyElement, tnX);
            goliath.utilities.DOM.setY(loBusyElement, tnY);
            goliath.utilities.DOM.setHeight(loBusyElement, tnHeight);
            goliath.utilities.DOM.setWidth(loBusyElement, tnWidth);

            var loImage = goliath.createElement('div');
            loImage.className = "busyImage";
            goliath.utilities.DOM.setHeight(loImage, 200);
            goliath.utilities.DOM.setWidth(loImage, tnWidth);

            loBusyElement.appendChild(loImage);

            var loMessage = goliath.createElement('label');
            loBusyElement.appendChild(loMessage);

            toElement._busyElement = loBusyElement;
            document.body.appendChild(loBusyElement);

            goliath.browser.setBusyMessage(toElement, "Loading, Please Wait...");
        }
    }
}


/*********************************
 Text utilities
 *********************************/
goliath.utilities.Text =
    {
        /*
         * Example of use
         * goliath.replaceText("You have {count} messages waiting in your {folder}.", {
            count: 3,
            folder: "inbox"
        });
        // Outputs "You have 3 messages waiting in your inbox.";
         */
        replaceText:function(tcText, toValues)
        {
            for (var loKey in toValues)
            {
                if (toValues.hasOwnProperty(loKey))
                {
                    if (typeof(toValues[loKey]) == 'undefined')
                    {
                       toValues[loKey] = "";
                    }
                    tcText = tcText.replace(new RegExp("{" + loKey + "}", "g"), toValues[loKey]);
                }
            }
            return tcText;
        },


        // Converts white-space to whiteSpace
        toCamelCase: function(tcHyphenated)
        {
            var lcResult = tcHyphenated.replace(/-\D/g,
                function(tcChar)
                {
                    return tcChar.charAt(1).toUpperCase();
                }
            );
            return lcResult;
        },

        // Converts whiteSpace to white-space
        toHyphens: function(tcCamelCase)
        {
            var lcResult = tcCamelCase.replace(/[A-Z]/g,
                function(tcChar)
                {
                    return ('-' + tcChar.charAt(0).toLowerCase());
                }
            );
            return lcResult;
        },
        padLeft: function(tcString, tcPadChar, tnFinalLength)
        {
            tcString = new String(tcString);
            while(tcString.length < tnFinalLength)
            {
                tcString = tcPadChar + tcString;
            }
            return tcString;
        },
        padRight: function(tcString, tcPadChar, tnFinalLength)
        {
            tcString = new String(tcString);
            while(tcString.length < tnFinalLength)
            {
                tcString += tcPadChar;
            }
            return tcString;
        },
        reverse: function()
        {
            return Array.prototype.reverse.apply(this.split('')).join('');
        },
        // Removes all of the xml tags from the specified string
        removeXMLTags : function(tcString)
        {
            var loTemp = goliath.createElement("div");
            loTemp.innerHTML = tcString;
            return goliath.utilities.Text.trim((document.all) ? loTemp.innerText : loTemp.textContent);
        },
        // Trims the leading and trailing spaces of the string supplied
        trim : function(tcString)
        {
            return tcString.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        }
    };


/*********************************
 DOM utilities
 *********************************/
goliath.utilities.DOM =
    {
        getElementsByTagName: function(tcTagName, toStartElement)
        {
            return ($(toStartElement) || document).getElementsByTagName(tcTagName);
        },
        /**
         * Gets the elements with the specified class name,  this will include elements that have multiple class names
         * tcClassName The class name to get
         * toStartElement The element to start the search from, if omitted, document will be used
         * tcTag Used to filter elements by tag names
         * tnMaxElements The maximum number of elements to return
         */
        getElementsByClassName: function(tcClassName, toStartElement, tcTag, tnMaxElements)
        {
            var laElements = new Array();
            toStartElement = $(toStartElement);

            toStartElement = (toStartElement == null) ? document : toStartElement;
            tcTag = (tcTag == null) ? '*' : tcTag;
            tnMaxElements = (tnMaxElements == null) ? 100 : tnMaxElements;

            var loInternalElements = toStartElement.getElementsByTagName(tcTag)
            var loInternalLength = loInternalElements.length;
            tcClassName = tcClassName.replace("/\-/g", "\\-");
            var loPattern = new RegExp("(^|\\s)" + tcClassName + "(\\s|$|[^0-9a-fA-F])");

            for (i=0, j=0; i < loInternalLength && j < tnMaxElements; i++)
            {
                if (loPattern.test(loInternalElements[i].className))
                {
                    laElements[j]=loInternalElements[i];
                    j++;
                }
            }
            return laElements;
        },
        previousSibling: function(toElement)
        {
            do {toElement = toElement.previousSibling;} while (toElement && toElement.nodeType != 1);
            return toElement;
        },
        nextSibling: function(toElement)
        {
            do {toElement = toElement.nextSibling;} while (toElement && toElement.nodeType != 1);
            return toElement;
        },
        firstChild: function(toElement)
        {
            toElement = toElement.firstChild;
            return (toElement && toElement.nodeType != 1) ? this.nextSibling(toElement) : toElement;
        },
        lastChild: function(toElement)
        {
            toElement = toElement.lastChild;
            return (toElement && toElement.nodeType != 1) ? this.nextSibling(toElement) : toElement;
        },
        // tnLevel allows you to skip up a level, tnLevel 2 is equivalent to parent(parent(toElement))
        parent: function(toElement, tnLevel)
        {
            tnLevel = tnLevel || 1;
            for (var i=0; i<tnLevel; i++)
            {
                if (toElement != null)
                {
                    toElement = toElement.parentNode;
                }
            }
            return toElement;
        },
        getText: function(toElement)
        {
            var lcReturn = "";
            toElement = toElement.childNodes || toElement;

            for (var i=0, lnLength = toElement.length; i<lnLength; i++)
            {
                lcReturn += (toElement[i].nodeType != 1) ? toElement[i].nodeValue : this.getText(toElement[i].childNodes);
            }

            return lcReturn;
        },
        // If only toElement and tcName are provided, returns the value of the attribute
        // if all three parameters are specified sets the value to the new value
        attribute: function(toElement, tcName, toNewValue)
        {
            // Make sure the name is okay
            if (!tcName || tcName.constructor != String) return '';

            // Fix reserved word attributes
            tcName = {'for': 'htmlFor', 'class': 'className'}[tcName] || tcName;

            // Set the value if required
            if (typeof(toNewValue) != 'undefined')
            {
                // TODO: Check to see if both lines are required here (particularly IE6, and check all attributes)
                // It may be that the first one is needed to change the physical DOM in IE6
                toElement[tcName] = toNewValue;

                if (toElement.setAttribute)
                {
                    toElement.setAttribute(tcName, toNewValue);
                }
            }

            // Firefox changes attributes to be lowercase, so check both the passed in value && the lowercase version
            return toElement[tcName] || toElement.getAttribute(tcName) || toElement[tcName.toLowerCase()] || toElement.getAttribute(tcName.toLowerCase()) || '';
        },
        // Creates an array of dom objects from a string, dom element, or array of dom elements
        createDomArray: function(toDom)
        {
            var laReturn = new Array();
            if (toDom.constructor != Array) toDom = [toDom];

            var j, lnLength1;
            for(var i=0, lnLength = toDom.length; i<lnLength; i++)
            {
                // If its a string
                if (toDom[i].constructor == String)
                {
                    var loDiv = goliath.createElement("div");
                    loDiv.innerHTML = toDom[i];

                    for (j=0, lnLength1 = loDiv.childNodes.length; j < lnLength1; j++)
                    {
                        laReturn.append(loDiv.childNodes[j]);
                    }
                }
                else if (toDom[i].length)
                {
                    for (j=0, lnLength1 = toDom[i].length; j < lnLength1; j++)
                    {
                        laReturn.append(toDom[i][j]);
                    }
                }
                else
                {
                    laReturn.append(toDom[i]);
                }
            }
            return laReturn;
        },
        // toElement could be an array, dom element, or html string
        insertBefore: function(toBefore, toElement)
        {
            var loElements = this.createDomArray(toElement);
            var loParent = this.parent(toBefore);

            for (var i= loElements.length -1; i>=0; i--)
            {
                loParent.insertBefore(loElements[i], toBefore);
            }
        },
        insertAfter: function(toAfter, toElement)
        {
            (toAfter.nextSibling) ? this.insertBefore(toAfter.nextSibling, toElement) : this.parent(toAfter).appendChild(toElement);
        },
        // toElement could be an array, dom element, or html string
        append: function(toParent, toElement)
        {
            var loElements = this.createDomArray(toElement);

            for (var i=0, lnLength = loElements.length; i<lnLength; i++)
            {
                toParent.appendChild(loElements[i]);
            }
        },
        remove: function(toElement)
        {
            if (toElement && toElement.parentNode)
            {
                toElement.parentNode.removeChild(toElement);
            }
        },
        // Clears the contents of the specified element
        clear: function(toElement)
        {
            while (toElement.firstChild)
            {
                this.remove(toElement.firstChild);
            }
        },
        getPageX: function(toElement)
        {
            return (toElement.offsetParent) ? toElement.offsetLeft + this.getPageX(toElement.offsetParent) : toElement.offsetLeft;
        },
        getPageY: function(toElement)
        {
            return (toElement.offsetParent) ? toElement.offsetTop + this.getPageY(toElement.offsetParent) : toElement.offsetTop;
        },
        getParentX: function(toElement)
        {
            return (toElement.parentNode == toElement.offsetParent) ? toElement.offsetLeft : this.getPageX(toElement) - this.getPageX(toElement.parentNode);
        },
        getParentY: function(toElement)
        {
            return (toElement.parentNode == toElement.offsetParent) ? toElement.offsetTop : this.getPageY(toElement) - this.getPageY(toElement.parentNode);
        },
        getHorizontalScroll: function(toElement)
        {
            return toElement.scrollLeft ? toElement.scrollLeft : toElement.pageXOffset;
        },
        getVerticalScroll:function(toElement)
        {
            return toElement.scrollTop ? toElement.scrollTop : toElement.pageYOffset;
        },
        setX: function(toElement, tnX, tcUnits)
        {
            toElement.style.left = tnX + ((tcUnits) ? tcUnits : "px");
        },
        setY: function(toElement, tnY, tcUnits)
        {
            toElement.style.top = tnY + ((tcUnits) ? tcUnits : "px");
        },
        addX: function(toElement, tnX)
        {
            this.setX(toElement, goliath.utilities.Style.getCSSX(toElement) + tnX);
        },
        addY: function(toElement, tnY)
        {
            this.setY(toElement, goliath.utilities.Style.getCSSY(toElement) + tnY);
        },
        setHeight: function(toElement, tnHeight)
        {
            goliath.utilities.Style.setCSSHeight(toElement, tnHeight);
        },
        setWidth: function(toElement, tnWidth)
        {
            goliath.utilities.Style.setCSSWidth(toElement, tnWidth);
        },
        getHeight: function(toElement)
        {
            if (goliath.utilities.Style.getStyleValue(toElement, 'display') != 'none')
            {
                return toElement.offsetHeight || goliath.utilities.Style.getCSSHeight(toElement);
            }

            var loOldCSS = goliath.utilities.Style.resetCSS(toElement, {display: '', visibility: 'hidden', position: 'absolute'});

            var lnValue = toElement.clientHeight || goliath.utilities.Style.getCSSHeight(toElement);

            goliath.utilities.Style.restoreCSS(toElement, loOldCSS);
            return lnValue;
        },
        getWidth: function(toElement)
        {
            if (goliath.utilities.Style.getStyleValue(toElement, 'display') != 'none')
            {
                return toElement.offsetWidth || goliath.utilities.Style.getCSSWidth(toElement);
            }

            var loOldCSS = goliath.utilities.Style.resetCSS(toElement, {display: '', visibility: 'hidden', position: 'absolute'});

            var lnValue = toElement.clientWidth || goliath.utilities.Style.getCSSWidth(toElement);

            goliath.utilities.Style.restoreCSS(toElement, loOldCSS);
            return lnValue;
        }


    };




















/*
 * Evaluates the script that is passed in
*/
goliath.utilities.evaluate=function(tcScript)
{
    while (tcScript.indexOf('|!|') >= 0)
    {
        tcScript = tcScript.replace('|!|', '"');
    }

    while (tcScript.indexOf("\r") >= 0)
    {
        tcScript = tcScript.replace("\r", "\\r");
    }

    while (tcScript.indexOf("\n") >= 0)
    {
        tcScript = tcScript.replace("\n", "\\n");
    }

    try
    {
        eval(tcScript);
    }
    catch (ex)
    {
        goliath.error(ex, tcScript, 0);
        return false;
    }
    return true;
}

goliath.utilities.showProperties=function(toObject)
{
    var lcResult = "";
    for (var loProp in toObject)
    {
        lcResult = lcResult + loProp + " = " + toObject[loProp] + "\n";
    }
    alert(lcResult);
}


/**
 * prints out the current page
 */
goliath.utilities.printPage=function()
{
    if (parseInt(navigator.appVersion) >= 4)
    {
        window.print();
    }
}

goliath.logging = function(){};
goliath.logging.Logger = function()
{
    this.LEVEL_TRACE = 1;
    this.LEVEL_DEBUG = 2;
    this.LEVEL_INFO = 3;
    this.LEVEL_WARN = 4;
    this.LEVEL_ERROR = 5;
    this.LEVEL_FATAL = 6;

    this.m_nLogLevel = 5;
    this.m_oTargetDivs = new Array();

    this.setLogLevel=function(tnLevel)
    {
        this.m_nLogLevel = tnLevel;
    }

    this.addTargetDiv=function(toTargetDiv)
    {
        if (!this.m_oTargetDivs.contains(toTargetDiv))
        {
            this.m_oTargetDivs.append(toTargetDiv);
            toTargetDiv.innerHTML = "";
        }
    }

    this.removeTargetDiv=function(toTargetDiv)
    {
        if (this.m_oTargetDivs.contains(toTargetDiv))
        {
            this.m_oTargetDivs.remove(toTargetDiv);
            toTargetDiv.innerHTML = "";
        }
    }

    this.canLog=function(tnLevel)
    {
        return tnLevel >= this.m_nLogLevel && this.m_oTargetDivs.length>0;
    }

    this.logMessage=function(tcMessage)
    {
        for (var i = 0; i < this.m_oTargetDivs.length; i++)
        {
            // Only log if the message is different from the previous one
            if (this.m_oTargetDivs[i].childNodes.length == 0 || tcMessage.indexOf(this.m_oTargetDivs[i].childNodes[this.m_oTargetDivs[i].childNodes.length-1].innerHTML) == -1)
            {
                this.m_oTargetDivs[i].innerHTML += tcMessage;
            }
        }
    }

    this.trace=function(tcMessage)
    {
        if (this.canLog(this.LEVEL_TRACE))
        {
            this.logMessage("<div class='logTrace'>[TRACE] " + tcMessage + "</div>");
        }
    }

    this.debug=function(tcMessage)
    {
        if (this.canLog(this.LEVEL_DEBUG))
        {
            this.logMessage("<div class='logDebug'>[DEBUG] " + tcMessage + "</div>");
        }
    }

    this.info=function(tcMessage)
    {
        if (this.canLog(this.LEVEL_INFO))
        {
            this.logMessage("<div class='logInfo'>[INFO] " + tcMessage + "</div>");
        }
    }

    this.warning=function(tcMessage)
    {
        if (this.canLog(this.LEVEL_WARN))
        {
            this.logMessage("<div class='logWarn'>[WARNING] " + tcMessage + "</div>");
        }
    }

    this.error=function(tcMessage)
    {
        if (this.canLog(this.LEVEL_ERROR))
        {
            this.logMessage("<div class='logError'>[ERROR] " + tcMessage + "</div>");
        }
        else
        {
            //goliath.alert(tcMessage);
        }
    }

    this.fatal=function(tcMessage)
    {
        if (this.canLog(this.LEVEL_FATAL))
        {
            this.logMessage("<div class='logFatal'>[FATAL] " + tcMessage + "</div>");
        }
        else
        {
            goliath.alert(tcMessage);
        }
    }
}

goliath.logger = new goliath.logging.Logger();

goliath.utilities.isNaN=function()
{
    for(var i=0; i<arguments.length; ++i)
    {
        if(arguments[i].toString().toLowerCase() == 'nan') return true;
    }
    return false;
}

// returns true if the argument is a number
goliath.utilities.isNumber=function()
{
    for(var i=0; i<arguments.length; ++i)
    {
        if(typeof(arguments[i])!='number') return false;
    }
    return true;
}

// returns true if the argument is defined
goliath.utilities.isDefined=function()
{
    for(var i=0; i<arguments.length; ++i)
    {
        if (typeof(arguments[i])=='undefined') return false;
    }
    return true;
}

// returns true if the argument is a string
goliath.utilities.isString=function()
{
    for(var i=0; i<arguments.length; ++i)
    {
        if(typeof(arguments[i])!='string') return false;
    }
    return true;
}




goliath.utilities.centerHorizontally=function(toDiv)
{
    var lnBrowser = goliath.utilities.getWindowWidth();
    var lnWidth = goliath.utilities.getWidth(toDiv);
    var lnScroll = goliath.utilities.getHorizontalScroll();
    goliath.utilities.setCssProperty(toDiv, "position", "absolute");
    goliath.utilities.setLeft(toDiv, ((Math.round(lnBrowser/2)) - (Math.round(lnWidth/2))) + lnScroll);
}
goliath.utilities.centerVertically=function(toDiv)
{
    var lnBrowser = goliath.utilities.getWindowHeight();
    var lnWidth = goliath.utilities.getHeight();
    var lnScroll = goliath.utilities.getVerticalScroll();
    goliath.utilities.setCssProperty(toDiv, "position", "absolute");
    goliath.utilities.setTop(toDiv, ((Math.round(lnBrowser/2)) - (Math.round(lnWidth/2))) + lnScroll);
}

goliath.utilities.createSplash=function(toSplashDiv)
{
    goliath.browser.addModule('goliath.splashScreen');
    // Ensure there is a div that will be covered by the splash
    if (toSplashDiv == null)
    {
        toSplashDiv = document.body;
    }
    goliath.splashScreen.generateSplashScreen(toSplashDiv);
}

goliath.utilities.closeSplash=function(toSplashDiv)
{
    if (toSplashDiv == null)
    {
        toSplashDiv = document.body;
    }
    goliath.splashScreen.closeSplashScreen(toSplashDiv);
}

// point object *********************************************************************************
// helper object for creating point objects (x, y coordinates)
// create by passing in an array with [0] = x and [1] = x
goliath.utilities.point=function(taPoint)
{
    this.x = parseInt(taPoint[0]);
    this.y = parseInt(taPoint[1]);
    return this;
}

goliath.utilities.point.prototype.x=0;
goliath.utilities.point.prototype.y=0;
goliath.utilities.point.prototype.toString=function()
{
    return this.x + ", " + this.y;
}
goliath.utilities.point.prototype.toArray=function()
{
    return new Array(this.x, this.y);
}


// End point object *********************************************************************************

// Removes leading and trailing spaces from a string
goliath.utilities.trim = function(tcString)
{
    return tcString.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}


// rect object *********************************************************************************
// rect object is a height width size
// pass in an array with [0] = height and [1] = width
goliath.utilities.rect = function(taSize)
{
    var tnHeight = parseInt(taSize[0]);
    var tnWidth = parseInt(taSize[1]);

    // Ensure the height and width are >= zero
    if (tnHeight < 0)
    {
        tnHeight = 0;
    }
    if (tnWidth < 0)
    {
        tnWidth = 0;
    }

    this.height = tnHeight;
    this.width = tnWidth;

    return this;
}

goliath.utilities.rect.prototype.toString=function()
{
    return this.height + ", " + this.width;
}
goliath.utilities.rect.prototype.toArray=function()
{
    return new Array(this.height, this.width);
}
// END rect object *********************************************************************************

// location object *********************************************************************************
// Location object is a structure that holds top, left, height, and width information
// Pass an array with [0] = top, [1] = left, [2] = height, [3] = width
goliath.utilities.location=function(taLocation)
{
    this.point = new goliath.utilities.point(new Array(taLocation[0], taLocation[1]));
    this.rect = new goliath.utilities.rect(new Array(taLocation[2], taLocation[3]));
    return this;
}

goliath.utilities.location.prototype.toString=function()
{
    return this.point.toString() + ", " + this.rect.toString();
}
goliath.utilities.location.prototype.toArray=function()
{
    return new Array(this.point.x, this.point.y, this.rect.height, this.rect.width);
}
// END location object *********************************************************************************


goliath.utilities.closeWindow=function()
{
    window.opener=window;
    window.close();
}

// returns a point object (top, left) for the element specified
// Can pass in an element or element ID
goliath.utilities.getPoint=function(tcElementID)
{
    tcElementID = $(tcElementID);
    if (tcElementID)
    {
        return new goliath.utilities.point(goliath.utilities.top(tcElementID), goliath.utilities.left(tcElementID));
    }
    return null;
}

// returns a rect object (height, width) for the element specified
// Can pass in an element or element ID
goliath.utilities.getRect=function(tcElementID)
{
    tcElementID = $(tcElementID);
    if (tcElementID)
    {
        return new goliath.utilities.rect(goliath.utilities.height(tcElementID), goliath.utilities.width(tcElementID));
    }
    return null;
}

/**
 * Clears all of the content from the element provided
 */
goliath.utilities.clearElementContent=function(toElement)
{
    var loNode = $(toNode);

    if (loNode.hasChildNodes() )
    {
        while ( loNode.childNodes.length >= 1 )
        {
            loNode.removeChild( loNode.firstChild );
        }
    }
}

goliath.utilities.setElementContent=function(toElement, toContent)
{
    goliath.utilities.clearElementContent(toElement);
    toElement.appendChild(toContent);
}

// inserts the child as the first child of the parent
goliath.utilities.insertAtTop=function(toParent,toChild)
{
    if (toParent.firstChild)
    {
        toParent.insertBefore(toChild,toParent.firstChild);
    }
    else
    {
        toParent.appendChild(toChild);
    }
}

goliath.utilities.getTextWidth=function(toElement, tcText)
{
    var lnWidth = goliath.utilities.getFontWidth(goliath.utilities.getCurrentFont(toElement), goliath.utilities.getCurrentFontSize(toElement));
    return lnWidth * tcText.length + 5;

}

// Moves an element to a new location
goliath.utilities.moveTo=function(tcElementID,tnNewLeft,tnNewTop)
{
    goliath.utilities.left(tcElementID,tnNewLeft);
    goliath.utilities.top(tcElementID,tnNewTop);
}



goliath.utilities.preloadImages=function(taImages)
{
    if (!document.images)
    {
        return;
    }

    for(var i=0; i<taImages.length; i++)
    {
        var lcString = taImages[i];
        lcString = lcString.substring(lcString.indexOf('http:'), lcString.lastIndexOf('.') + 4);
        var loImage = new Image(25, 25);
        loImage.src=lcString;
    }
}

goliath.utilities.postValue = function(tcUrl, tcParameter, tcValue, tcMethod)
{
    if (typeof(tcParameter) != "string")
    {
        goliath.utilities.postValues(tcUrl, tcParameter, tcValue, tcMethod);
    }
    else
    {
        goliath.utilities.postValues(tcUrl, new Array(tcParameter), new Array(tcValue), tcMethod);
    }
}

goliath.utilities.postValues = function(tcUrl, tcParameter, tcValue, tcMethod)
{
    if (tcMethod == null)
    {
        tcMethod = "POST";
    }

    loForm = goliath.createElement("FORM");
    loForm.action=tcUrl;
    loForm.method=tcMethod;

    if (tcParameter != null && tcValue != null)
    {
        // Add Values
        for (var i=0; i< tcParameter.length; i++)
        {
            loHidden = goliath.createElement("input");
            loHidden.setAttribute("type", "hidden");
            loHidden.setAttribute("name", tcParameter[i]);
            loHidden.setAttribute("value", tcValue[i]);
            loForm.appendChild(loHidden);
        }
    }
    // Add window width
    loWidth = goliath.createElement("input");
    loWidth.setAttribute("type", "hidden");
    loWidth.setAttribute("name", "lnClientWidth");
    loWidth.setAttribute("value", goliath.utilities.windowWidth());
    loForm.appendChild(loWidth);

    // Add window height
    loHeight = goliath.createElement("input");
    loHeight.setAttribute("type", "hidden");
    loHeight.setAttribute("name", "lnClientHeight");
    loHeight.setAttribute("value", goliath.utilities.windowHeight());
    loForm.appendChild(loHeight);

    document.body.appendChild(loForm);
    loForm.submit();
}



goliath.utilities.forceClientResize = function()
{
    // Get the query parameters
    var lcParameters = window.location.search.substring(1);
    var laQueryParams = new Array();
    var laQueryValues = new Array();
    var i, laParameters, laValues;
    if (lcParameters != null && lcParameters != "")
    {
        var laQueryParameters = lcParameters.split("&");
        for ( i=0; i<laQueryParameters.length; i++)
        {
            var laPair = laQueryParameters[i].split("=");
            laQueryParams.append(laPair[0]);
            laQueryValues.append(laPair[1]);
        }
    }

    // TODO: Combine the following two paragraphs of code
    var lnWidth = goliath.utilities.windowWidth();
    var lnHeight = goliath.utilities.windowHeight();
    if (Math.abs(goliath.utilities.height(document.body) - lnHeight) > 10 || Math.abs(goliath.utilities.width(document.body) - lnWidth) > 10)
    {    laParameters = new Array("lnClientWidth", "lnClientHeight", "lcClientBrowser");
        if (laQueryParams.length > 0)
        {
            for ( i=0; i<laQueryParams.length; i++)
            {
                laParameters.append(laQueryParams[i]);
            }
        }
         laValues = new Array(goliath.utilities.windowWidth(), goliath.utilities.windowHeight(), goliath.utilities.getBrowserName());
        if (laQueryValues.length > 0)
        {
            for ( i=0; i<laQueryValues.length; i++)
            {
                laValues.append(laQueryValues[i]);
            }
        }
        goliath.utilities.postValues("index.jsp", laParameters, laValues);
        return;
    }

    // If this is IE we also need to check the css property
    if (Math.abs(parseInt(document.body.style.height) - lnHeight) > 10)
    {    laParameters = new Array("lnClientWidth", "lnClientHeight", "lcClientBrowser");
        if (laQueryParams.length > 0)
        {
            for ( i=0; i<laQueryParams.length; i++)
            {
                laParameters.append(laQueryParams[i]);
            }
        }
         laValues = new Array(goliath.utilities.windowWidth(), goliath.utilities.windowHeight(), goliath.utilities.getBrowserName());
        if (laQueryValues.length > 0)
        {
            for ( i=0; i<laQueryValues.length; i++)
            {
                laValues.append(laQueryValues[i]);
            }
        }
        goliath.utilities.postValues("index.jsp", laParameters, laValues);
        return;
    }
}

goliath.utilities.isFireFox = false;
goliath.utilities.isIE7 = false;
goliath.utilities.isIE = false;
goliath.utilities.isSafari = false;
goliath.utilities.isKonqueror = false;

goliath.utilities.getBrowserName=function()
{
    if (navigator && navigator.userAgent)
    {
        var lcUserAgent = navigator.userAgent.toLowerCase();

        if (lcUserAgent.indexOf("safari") != -1)
        {
            goliath.utilities.isSafari = true;
            return "Safari";
        }

        if (lcUserAgent.indexOf("gecko") != -1)
        {
            goliath.utilities.isGecko = true;
            return "Gecko";
        }

        if (lcUserAgent.indexOf("konqueror") != -1)
        {
            goliath.utilities.isKonqueror = true;
            return "Konqueror";
        }
    }

    if (window.opera != null && typeof(window.opera) != "undefined")
    {
        goliath.utilities.isOpera = true;
        return "Opera";
    }
    if (window.Iterator != null || Array.every  != null )
    {
        goliath.utilities.isFireFox = true;
        return "Firefox";
    }
    if (document.documentElement != null && typeof( document.documentElement.style.maxHeight)!="undefined")
    {
        goliath.utilities.isIE7 = true;
        return "IE7";
    }

    if (document.compatMode && document.all)
    {
        goliath.utilities.isIE = true;
        return "IE";
    }
}

goliath.utilities.getBrowserName();

goliath.utilities.disableObject=function(toElement)
{
    toElement = $(toElement);
    goliath.utilities.Style.addClass(toElement, "disabled");
}

goliath.utilities.enableObject=function(toElement)
{
    toElement = $(toElement);
    goliath.utilities.Style.removeClass(toElement, "disabled");
}

goliath.utilities.selectObject=function(toElement)
{
    toElement = $(toElement);
    goliath.utilities.Style.addClass(toElement, "selected");
}

goliath.utilities.unSelectObject = function(toElement)
{
    toElement = $(toElement);
    goliath.utilities.Style.removeClass(toElement, "selected");
}



goliath.utilities.setElementContent = function(toElement, content)
{
    var loElement = $(toElement);
    if (loElement != null)
    {
        loElement.innerHTML = content;
    }
    else
    {
        goliath.utilities.writeWarning('Could not find element ' + toElement);
    }
}

goliath.utilities.parseAppendableHTML=function(toHTML, toAppendNode, tlReplaceNode)
{
    var loNode = toHTML;
    if (loNode.nodeType == 1)
    {
        var loCreatedElement = goliath.createElement(loNode.nodeName);

        // Process attributes
        for (var i=0; i<loNode.attributes.length; i++)
        {
            var loAttribute = loNode.attributes[i];
            loCreatedElement.setAttribute(loAttribute.name, loAttribute.value);
        }

        if (tlReplaceNode)
        {
            toAppendNode.parentNode.replaceChild(loCreatedElement, toAppendNode);
        }
        else
        {
            toAppendNode.appendChild(loCreatedElement);
        }

        // process child nodes
        for (i=0; i<loNode.childNodes.length; i++)
        {
            goliath.utilities.parseAppendableHTML(loNode.childNodes[i], loCreatedElement);
        }
    }
}

/**
 * parses the incoming xml document and appends it to the toAppendNewNodes element
 * if tlReplaceNode is true then rather than append, it will replace toAppendNewNodes
 */
goliath.utilities.parseExecutableXML=function(toDocument, toAppendNewNodes, tlReplaceNode)
{
    if (toAppendNewNodes == null)
    {
        toAppendNewNodes = document.body;
    }
    if (tlReplaceNode == null)
    {
        tlReplaceNode = false;
    }
    if (toDocument != null)
    {   var i;
        // Extract the control id and the replace parameter if possible
        var loExecutableXML = toDocument.getElementsByTagName("executableXML")[0];
        if (loExecutableXML != null)
        {
            var lcControlID = loExecutableXML.getAttribute("controlID");
            if (lcControlID != null)
            {
                var loControl = $(lcControlID);
                if (loControl != null)
                {
                    if (loControl._control && loControl._control.getContent)
                    {
                        toAppendNewNodes = loControl._control.getContent();
                    }
                    else
                    {
                        toAppendNewNodes = loControl;
                    }
                }
            }
            var lcReplaceNodes = loExecutableXML.getAttribute("replace");
            if (lcReplaceNodes != null)
            {
                tlReplaceNode = goliath.utilities.parseBoolean(lcReplaceNodes);
            }
        }

        var loHTML = toDocument.getElementsByTagName("html");
        for ( i=0; i<loHTML.length; i++)
        {
            for (var j=0; j<loHTML[i].childNodes.length; j++)
            {
                goliath.utilities.parseAppendableHTML(loHTML[i].childNodes[j], toAppendNewNodes, tlReplaceNode);
            }
        }

        // Get and execute any script
        var loScript = toDocument.getElementsByTagName('script');
        if (loScript.length > 0)
        {
            var lnTotalScripts = loScript[0].childNodes.length;
            var lcScriptString = "";
            var lcLeftOver = "";
            for ( i=0; i<loScript[0].childNodes.length; i++)
            {
                goliath.browser.status("Executing Scripts " + ((i +1 / lnTotalScripts) * 100) + "%")
                var loNode = loScript[0].childNodes[i];
                lcScriptString = lcLeftOver + goliath.getXMLNodeText(loNode);

                lcLeftOver = lcScriptString.substring(lcScriptString.lastIndexOf(";") + 1);
                lcScriptString = lcScriptString.substring(0, lcScriptString.lastIndexOf(";") + 1);

                // First we want to extract all the goliath.browser.addModule code, and add all the modules required
                var lcFindString = "goliath.browser.addModule(";
                while (lcScriptString.indexOf(lcFindString) >= 0)
                {
                    var lnIndex = lcScriptString.indexOf(lcFindString);
                    var lcModule = lcScriptString.substring(lnIndex, lcScriptString.indexOf(";", lnIndex) + 1);

                    lcScriptString = lcScriptString.substring(0, lnIndex) + lcScriptString.substring(lnIndex + lcModule.length);
                    goliath.utilities.evaluate(lcModule);
                }

                try
                {
                    // If the script is too large, we need to break it down to execute it
                    if (lcScriptString.length > 4046)
                    {
                        var lcInnerLeftOver = "";
                        var lnLength = 3000;
                        var lnTotalLength = lcScriptString.length;
                        while (lcScriptString.length > 0)
                        {
                            lnLength = lcScriptString.length;
                            if (lnLength > 3000)
                            {
                                lnLength = 3000;

                            }
                            var lcExecuteScript = lcInnerLeftOver + lcScriptString.substring(0, lnLength);
                            lcScriptString = lcScriptString.substring(lnLength);
                            lcInnerLeftOver = lcExecuteScript.substring(lcExecuteScript.lastIndexOf(";") + 1);
                            lcExecuteScript = lcExecuteScript.substring(0, lcExecuteScript.lastIndexOf(";") + 1);

                            goliath.utilities.setStatus("Executing Scripts " + (100 - ((lcScriptString.length / lnTotalLength) * 100)) + "%")

                            while (lcExecuteScript.indexOf('"') >= 0)
                            {
                                lcExecuteScript = lcExecuteScript.replace('"', '|!|');
                            }
                            window.setTimeout("goliath.utilities.evaluate(\"" + lcExecuteScript + "\");", 0);
                        }
                    }
                    else
                    {
                        while (lcScriptString.indexOf('"') >= 0)
                        {
                            lcScriptString = lcScriptString.replace('"', '|!|');
                        }
                        window.setTimeout("goliath.utilities.evaluate(\"" + lcScriptString + "\");", 0);
                    }
                }
                catch (ex)
                {
                    if (ex.message)
                    {
                        goliath.error(ex.message);
                    }
                    else
                    {
                        goliath.error( ex );
                    }
                }
            }
        }
    }
}



// namespace object
var styling=new Object();
goliath.utilities.styling = styling;
styling = styling;



// Move this element to the same level as it's grandparent
styling.promote=function(toElement){
  var loParent=toElement.parentNode;
  if (loParent){
    var loGrandParent=loParent.parentNode;
    if (loGrandParent){
      loParent.removeChild(toElement);
      loGrandParent.appendChild(toElement);
    }
  }
}

// Convert the object to an element, if it is already an element just return the object
styling.toDOMElement=function(toObject,tcWrapperType){
  var loResult=null;
  if (toObject.childNodes)
  {
    loResult = toObject;
  }
  else
  {
      var loTextNode=document.createTextNode(""+toObject);
      if (tcWrapperType){
        var loWrapper=goliath.createElement(tcWrapperType);
        loWrapper.appendChild(loTextNode);
        loResult=loWrapper;
      }else
      {
        loResult=loTextNode;
      }
  }
  return loResult;
}

goliath.utilities.fontHeight = new Array();
goliath.utilities.fontWidth = new Array();
goliath.utilities.fontMap = new Array();
goliath.utilities.getFonts=function()
{
    var lnFontWidth = 0;
    var lnFontHeight = 0;
    var loDiv = goliath.createElement("div");
    var loSpan = goliath.createElement("span");
    loDiv.appendChild(loSpan);
    goliath.utilities.setCssProperty(loDiv, "font-family", "arial");
    goliath.utilities.setCssProperty(loSpan, "font-family", "arial");
    goliath.utilities.setCssProperty(loSpan, "font-size", "72px");
    loSpan.appendChild(document.createTextNode("wwwwwwwwwl"));

    // TODO: Build this list of fonts from the
    // fonts installed on the server
    var laFontList = new Array();
    laFontList.append("Arial");
    laFontList.append("Arial Black");
    laFontList.append("Arial Narrow");
    laFontList.append("Arial Rounded MT Bold");
    laFontList.append("Bookman Old Style");
    laFontList.append("Bradley Hand ITC");
    laFontList.append("Century");
    laFontList.append("Century Gothic");
    laFontList.append("Comic Sans MS");
    laFontList.append("Courier");
    laFontList.append("Courier New");
    laFontList.append("Cursive");
    laFontList.append("Default");
    laFontList.append("Fantasy");
    laFontList.append("Georgia");
    laFontList.append("Gentium");
    laFontList.append("Impact");
    laFontList.append("King");
    laFontList.append("Lucida Console");
    laFontList.append("Lalit");
    laFontList.append("Modena");
    laFontList.append("Monospace");
    laFontList.append("Monotype Corsiva");
    laFontList.append("Papyrus");
    laFontList.append("Sans-serif");
    laFontList.append("Serif");
    laFontList.append("Tahoma");
    laFontList.append("Times");
    laFontList.append("Times New Roman");
    laFontList.append("Trebuchet MS");
    laFontList.append("Verdana");
    laFontList.append("Verona");

    document.body.appendChild(loDiv);
    lnFontWidth = goliath.utilities.getWidth(loSpan);
    lnFontHeight = goliath.utilities.getHeight(loSpan);

    // Arial and Sans-Serif are available
    for (var i=0; i<laFontList.length; i++)
    {
        goliath.utilities.setCssProperty(loSpan, "font-family", laFontList[i]);
        if (goliath.utilities.getWidth(loSpan) != lnFontWidth || goliath.utilities.getHeight(loSpan) != lnFontHeight || laFontList[i] == "Arial" || laFontList[i] == "Sans-serif")
        {
            goliath.utilities.fontMap.append(laFontList[i]);
            goliath.utilities.fontWidth.append(lnFontWidth/10);
            goliath.utilities.fontHeight.append(lnFontHeight);
        }
    }
    loDiv.parentNode.removeChild(loDiv);
}

//goliath.eventListener.add(window, goliath.utilities.getFonts, "onload");

goliath.utilities.getFontWidth=function(tcFontName, tnPixelSize)
{
    var lnIndex = 0;
    var laFonts = tcFontName.split(",");
    for (j = 0; j < laFonts.length; j++)
    {
        var lcFont = laFonts[j];
        for (var i = 0; i < goliath.utilities.fontMap.length; i++)
        {
            if (lcFont == goliath.utilities.fontMap[i])
            {
                return Math.floor(goliath.utilities.fontWidth[i] / 72 * tnPixelSize);
            }
        }
    }

    return 10;
}

goliath.utilities.getCurrentFont=function(toElement)
{
    if (window.getComputedStyle)
    {
        return new String(window.getComputedStyle(toElement, null).fontFamily);
    }
    else
    {
        return new String(toElement.currentStyle.fontFamily);
    }
}
goliath.utilities.getCurrentFontSize=function(toElement)
{
    if (window.getComputedStyle)
    {
        return parseInt(window.getComputedStyle(toElement, null).fontSize);
    }
    else
    {
        return parseInt(toElement.currentStyle.fontSize);
    }
}

goliath.utilities.keyMap = new Array();
goliath.utilities.keyMap_keyDown=function(e)
{
    var lcKey=goliath.getEventKeyCode(e);
    if (!goliath.utilities.keyMap.contains(lcKey))
    {
        goliath.utilities.keyMap.append(lcKey);
    }
}
goliath.utilities.keyMap_keyUp=function(e)
{
    var lcKey=goliath.getEventKeyCode(e);
    goliath.utilities.keyMap.remove(lcKey);
}





goliath.utilities.isKeyPressed=function(tcCode)
{
    var lcKey = new String(tcCode);
    if (lcKey.length > 1)
    {
        lcKey = lcKey.toLowerCase();
        // Check for CTRL, Shift, ...
        if (lcKey == "backspace")
        {
            return goliath.utilities.keyMap.contains(8);
        }
        else if (lcKey == "tab")
        {
            return goliath.utilities.keyMap.contains(9);
        }
        else if (lcKey == "shift")
        {
            return goliath.utilities.keyMap.contains(16);
        }
        else if (lcKey == "alt")
        {
            return goliath.utilities.keyMap.contains(18);
        }
        else if (lcKey == "break")
        {
            return goliath.utilities.keyMap.contains(19);
        }
        else if (lcKey == "caplock")
        {
            return goliath.utilities.keyMap.contains(20);
        }
        else if (lcKey == "ctrl")
        {
            return goliath.utilities.keyMap.contains(17);
        }
        else if (lcKey == "esc")
        {
            return goliath.utilities.keyMap.contains(27);
        }
        else if (lcKey == "space")
        {
            return goliath.utilities.keyMap.contains(32);
        }
        else if (lcKey == "pageup")
        {
            return goliath.utilities.keyMap.contains(33);
        }
        else if (lcKey == "pagedown")
        {
            return goliath.utilities.keyMap.contains(34);
        }
        else if (lcKey == "end")
        {
            return goliath.utilities.keyMap.contains(35);
        }
        else if (lcKey == "home")
        {
            return goliath.utilities.keyMap.contains(36);
        }
        else if (lcKey == "left")
        {
            return goliath.utilities.keyMap.contains(37);
        }
        else if (lcKey == "up")
        {
            return goliath.utilities.keyMap.contains(38);
        }
        else if (lcKey == "right")
        {
            return goliath.utilities.keyMap.contains(39);
        }
        else if (lcKey == "down")
        {
            return goliath.utilities.keyMap.contains(40);
        }
        else if (lcKey == "insert")
        {
            return goliath.utilities.keyMap.contains(45);
        }
        else if (lcKey == "delete")
        {
            return goliath.utilities.keyMap.contains(46);
        }
        else if (lcKey == "windowsl")
        {
            return goliath.utilities.keyMap.contains(91);
        }
        else if (lcKey == "windowsr")
        {
            return goliath.utilities.keyMap.contains(92);
        }
        else if (lcKey == "menu")
        {
            return goliath.utilities.keyMap.contains(93);
        }
        else if (lcKey == "numlock0")
        {
            return goliath.utilities.keyMap.contains(96);
        }
        else if (lcKey == "numlock1")
        {
            return goliath.utilities.keyMap.contains(97);
        }
        else if (lcKey == "numlock2")
        {
            return goliath.utilities.keyMap.contains(98);
        }
        else if (lcKey == "numlock3")
        {
            return goliath.utilities.keyMap.contains(99);
        }
        else if (lcKey == "numlock4")
        {
            return goliath.utilities.keyMap.contains(100);
        }
        else if (lcKey == "numlock5")
        {
            return goliath.utilities.keyMap.contains(101);
        }
        else if (lcKey == "numlock6")
        {
            return goliath.utilities.keyMap.contains(102);
        }
        else if (lcKey == "numlock7")
        {
            return goliath.utilities.keyMap.contains(103);
        }
        else if (lcKey == "numlock8")
        {
            return goliath.utilities.keyMap.contains(104);
        }
        else if (lcKey == "numlock9")
        {
            return goliath.utilities.keyMap.contains(105);
        }
        else if (lcKey == "numlockmultiply")
        {
            return goliath.utilities.keyMap.contains(106);
        }
        else if (lcKey == "numlockadd")
        {
            return goliath.utilities.keyMap.contains(107);
        }
        else if (lcKey == "numlocksubtract")
        {
            return goliath.utilities.keyMap.contains(109);
        }
        else if (lcKey == "numlockdecimal")
        {
            return goliath.utilities.keyMap.contains(110);
        }
        else if (lcKey == "numlockdivide")
        {
            return goliath.utilities.keyMap.contains(111);
        }
        else if (lcKey == "f1")
        {
            return goliath.utilities.keyMap.contains(112);
        }
        else if (lcKey == "f2")
        {
            return goliath.utilities.keyMap.contains(113);
        }
        else if (lcKey == "f3")
        {
            return goliath.utilities.keyMap.contains(114);
        }
        else if (lcKey == "f4")
        {
            return goliath.utilities.keyMap.contains(115);
        }
        else if (lcKey == "f5")
        {
            return goliath.utilities.keyMap.contains(116);
        }
        else if (lcKey == "f6")
        {
            return goliath.utilities.keyMap.contains(117);
        }
        else if (lcKey == "f7")
        {
            return goliath.utilities.keyMap.contains(118);
        }
        else if (lcKey == "f8")
        {
            return goliath.utilities.keyMap.contains(119);
        }
        else if (lcKey == "f9")
        {
            return goliath.utilities.keyMap.contains(120);
        }
        else if (lcKey == "f10")
        {
            return goliath.utilities.keyMap.contains(121);
        }
        else if (lcKey == "f11")
        {
            return goliath.utilities.keyMap.contains(122);
        }
        else if (lcKey == "f12")
        {
            return goliath.utilities.keyMap.contains(123);
        }
        else if (lcKey == "numlock")
        {
            return goliath.utilities.keyMap.contains(144);
        }
        else if (lcKey == "scroll")
        {
            return goliath.utilities.keyMap.contains(145);
        }
        else
        {
            return goliath.utilities.keyMap.contains(lcKey.charCodeAt());
        }
    }
    else
    {
        return goliath.utilities.keyMap.contains(lcKey.charCodeAt());
    }
}

// Keymap functionality
/*
goliath.getEventRouter(document).addListener(goliath.utilities.keyMap_keyDown, "onkeydown");
goliath.getEventRouter(document).addListener(goliath.utilities.keyMap_keyUp, "onkeyup");
*/


goliath.utilities.objectToPropertyArray=function(toObject)
{
    var loArray = new Array();
    for (i in toObject)
    {
        loArray.append(i);
    }
    return loArray;
}

goliath.utilities.unescape=function(tcString)
{
    if (tcString == null)
    {
        return null;
    }
    try
    {
        return decodeURIComponent(tcString);
    }
    catch(e)
    {
        return tcString;
    }
}
goliath.utilities.escape=function(tcString)
{
    if (tcString == null)
    {
        return null;
    }
    try
    {
        return encodeURIComponent(tcString);
    }
    catch(e)
    {
        return tcString;
    }
}

goliath.utilities.movingControl = null;
goliath.utilities.movingControlTop = null;
goliath.utilities.movingControlLeft = null;
goliath.utilities.movingControlWidth = null;
goliath.utilities.movingControlHeight = null;
goliath.utilities.movingControlMillis = null;
goliath.utilities.moveTo=function(toDiv, tnNewTop, tnNewLeft, tnNewWidth, tnNewHeight, tnMillis)
{
    if (goliath.utilities.movingControl == null && toDiv == null)
    {
        return;
    }

    var lnTimeout = 25;

    if (goliath.utilities.movingControl == null)
    {
        goliath.utilities.movingControl = toDiv;
        goliath.utilities.movingControlTop = tnNewTop;
        goliath.utilities.movingControlLeft = tnNewLeft;
        goliath.utilities.movingControlWidth = tnNewWidth;
        goliath.utilities.movingControlHeight = tnNewHeight;
        goliath.utilities.movingControlMillis = tnMillis;
    }
    else
    {
        toDiv = goliath.utilities.movingControl;
    }

    var lnSteps = goliath.utilities.movingControlMillis / lnTimeout;
    goliath.utilities.movingControlMillis = goliath.utilities.movingControlMillis - lnTimeout;

    var lnTop = goliath.utilities.getTop(toDiv);
    var lnLeft = goliath.utilities.getLeft(toDiv);
    var lnWidth = goliath.utilities.getWidth(toDiv);
    var lnHeight = goliath.utilities.getHeight(toDiv);

    if (lnTop != goliath.utilities.movingControlTop)
    {
        goliath.utilities.setTop(toDiv,(lnTop + (goliath.utilities.movingControlTop - lnTop) / lnSteps));
    }

    if (lnLeft != goliath.utilities.movingControlLeft)
    {
        goliath.utilities.setLeft(toDiv,(lnLeft + (goliath.utilities.movingControlLeft - lnLeft) / lnSteps));
    }

    if (lnWidth != goliath.utilities.movingControlWidth)
    {
        goliath.utilities.setWidth(toDiv,(lnWidth + (goliath.utilities.movingControlWidth - lnWidth) / lnSteps));
    }

    if (lnHeight != goliath.utilities.movingControlHeight)
    {
        goliath.utilities.setHeight(toDiv,(lnHeight + (goliath.utilities.movingControlHeight - lnHeight) / lnSteps));
    }

    if (goliath.utilities.movingControlMillis > 0)
    {
        window.setTimeout(goliath.utilities.moveTo, lnTimeout);
    }
    else
    {
        goliath.utilities.movingControl = null;
        goliath.utilities.movingControlTop = null;
        goliath.utilities.movingControlLeft = null;
        goliath.utilities.movingControlWidth = null;
        goliath.utilities.movingControlHeight = null;
        goliath.utilities.movingControlMillis = null;
    }
}

//Disable text selection as most of the controls on the page are html
disableText=function(e)
{
    return false;
}
reEnableText=function(e)
{
    return true;
}
//document.onselectstart=disableText;
if (window.sidebar)
{
    //document.onmousedown=disableText;
    //document.onclick=reEnableText;
}

//goliath.browser.addModule("goliath.keymap");





/*******************************************
 * Everything below here was copied from goliath.js and may not be required anymore
 *******************************************/

goliath.browser.prototype._styleList = null;
goliath.browser.prototype.getStyleList=function()
{
return this._styleList;
}
goliath.browser.prototype.clearStyles=function()
{
// We always want to clear the defaults
var lcDefault = "./resources/themes/default/stylesheet.css";
if (!this.getStyleList().contains(lcDefault))
{
    this.getStyleList().append(lcDefault);
}

for (var i = 0, lnLength = this.getStyleList().length; i < lnLength; i++)
{
    this.removeStyle(this.getStyleList()[i]);
}
this.getStyleList().clear();
}
goliath.browser.prototype.addStyle=function(tcStylePath)
{
if (tcStylePath.toLowerCase)
{
    tcStylePath = tcStylePath.toLowerCase();
}
if (!this.getStyleList().contains(tcStylePath))
{
    this.getStyleList().append(tcStylePath);

    // Add the style document to the head
    var llFound = false;
    var laLinks = document.getElementsByTagName("link");
    for (i = 0, lnLength = laLinks.length; i < lnLength; i++)
    {
        if (laLinks[i].rel && laLinks[i].rel.indexOf("stylesheet") != -1)
        {
            if (laLinks[i].href.toLowerCase() == tcStylePath)
            {
                llFound = true;
                break;
            }
        }
    }
    if (!llFound)
    {
        var loLink = goliath.createElement("link");
        loLink.rel = "stylesheet";
        loLink.type = "text/css";
        loLink.media = "screen";
        loLink.href = tcStylePath;
        document.getElementsByTagName('head')[0].appendChild(loLink);
    }
}
}

goliath.browser.prototype.removeStyle=function(tcStylePath)
{
    if (tcStylePath.toLowerCase)
    {
        tcStylePath = tcStylePath.toLowerCase();
    }

    if (this.getStyleList().contains(tcStylePath))
    {
        this.getStyleList().remove(tcStylePath);

        var laLinks = document.getElementsByTagName("link");
        for (i = 0, lnLength=laLinks.length; i < lnLength; i++)
        {
            if (laLinks[i].rel && laLinks[i].rel.indexOf("stylesheet") != -1)
            {
                if (laLinks[i].href.toLowerCase() == tcStylePath)
                {
                    laLinks[i].parentNode.removeChild(laLinks[i]);
                }
            }
        }
    }
}

goliath.browser.prototype.updateStyles=function()
{
var loCommand = new goliath.command();
loCommand.setName("GetUIStyles");
loCommand.setSynchronous(true);
loCommand.setPriority(goliath.commandQueue.PRIORITY_IMMEDIATE);
loCommand.setMessage(new goliath.browser.statusMessage("Updating Styling."));
loCommand.setOnCommandComplete(goliath.browser.updateStylesResponse);
loCommand.send();
}


goliath.browser.prototype.updateStylesResponse=function()
{
goliath.utilities.parseExecutableXML(this.getResponseXML());
}

goliath.browser.prototype.logErrorOnServer=function(tcMessage)
{
var loCommand = new goliath.command();
loCommand.setName("logError");
loCommand.setSynchronous(false);
loCommand.setBody("<Error>" + tcMessage + "</Error>");
loCommand.setPriority(goliath.commandQueue.PRIORITY_IMMEDIATE);
loCommand.setMessage(new goliath.browser.statusMessage("Sending Error Information."));
loCommand.send();
}



goliath.browser.prototype.importCSS=function(tcSource, tlNoCache)
{
if (tlNoCache)
{
    var lnMillis = new Date().getTime().toString();
    tcSource = tcSource + "?"+lnMillis;
}
var loScriptElement = goliath.createElement("link");
loScriptElement.setAttribute('rel', "stylesheet");
loScriptElement.setAttribute('type', "text/css");
loScriptElement.setAttribute('href', tcSource);
document.body.appendChild(loScriptElement);
}

// This is to resize splash screen if required
goliath.browser.prototype.onresize=function()
{
    var lnDifference = 15;

    // only if the size changes by more than one
    if (goliath.browser.getURLParameter("clientHeight") != "" && goliath.browser.getURLParameter("clientWidth") != "")
    {
        if (Math.abs(parseInt(goliath.browser.getURLParameter("clientHeight")) - goliath.browser.getClientHeight()) <= lnDifference && Math.abs(parseInt(goliath.browser.getURLParameter("clientWidth")) - goliath.browser.getClientWidth()) <= lnDifference)
        {
            return;
        }
    }

    // Check what the server things the sizes are
    if (Math.abs(goliath.browser.getReportedClientHeight() - goliath.browser.getClientHeight()) <= lnDifference && Math.abs(goliath.browser.getReportedClientWidth() - goliath.browser.getClientWidth()) <= lnDifference)
    {
        return;
    }

    var lcLocation = goliath.browser.getHref();
    if (lcLocation.indexOf("?") <0)
    {
        // No parameters
        lcLocation+="?";
    }
    else
    {
        lcLocation+="&";
    }
    lcLocation+="clientHeight=" + goliath.browser.getClientHeight() + "&clientWidth=" + goliath.browser.getClientWidth()  + "&appContent=" + goliath.createGUID();

    goliath.browser.setLocation(lcLocation);
}

// Creates a copy of the node, using the document for creating the new nodes
// this is for IE6, other browsers do this fine using cloneNode and importNode
goliath.copyNodeForDocument=function(toNode, toDocument, tlDeep)
{
    var loReturn = null;
    if (!toDocument.importNode)
    {
        if (toNode.nodeType == 1) // element node
        {
            loReturn = goliath.createElement(toNode.nodeName);
            for (var i=0, lnLength=toNode.attributes.length; i < lnLength; i++)
            {
                loReturn.setAttribute(toNode.attributes[i].name, toNode.attributes[i].value);
            }
            if (toNode.style)
            {
                loReturn.style.cssText = toNode.style.cssText;
            }
        }
        else if (toNode.nodeType == 3) // text node
        {
            loReturn = toDocument.createTextNode(toNode.nodeValue);
        }

        if (tlDeep && toNode.childNodes.length > 0)
        {
            // recursive call
            for (var loChildNode = toNode.firstChild; loChildNode; loChildNode = loChildNode.nextSibling)
            {
                loReturn.appendChild(goliath.copyNodeForDocument(loChildNode, toDocument, tlDeep));
            }
        }
    }
    else
    {
        loReturn = toDocument.importNode(toNode, tlDeep);
    }
    return loReturn;
}

goliath.createXMLDocument=function(tcString)
{
    var loDocument = null;
    if (tcString == null)
    {
        tcString = "";
    }

    if (document.implementation && document.implementation.createDocument)
    {
        var loParser = new DOMParser();
        loDocument = loParser.parseFromString(tcString, "text/xml");
    }
    else if (window.ActiveXObject)
    {
        loDocument = new ActiveXObject("MSXML2.DOMDocument");
        loDocument.async="false";
        loDocument.loadXML(tcString);
    }
    return loDocument;
}



/*
 * takes an argument and converts it to a function.
 * This is meant to take strings and return a function that executes the provided string
 * You can use arguments to access any arguments after the fifth.
 */
goliath.makeFunction=function(toFunction)
{
    if (typeof(toFunction) != "function")
    {
        toFunction = new Function("arg1, arg2, arg3, arg4, arg5", toFunction);
    }
    return toFunction;
}


goliath.browser.prototype.setReportedClientHeight=function(tnHeight)
{
    this._reportedClientHeight = tnHeight;
}
goliath.browser.prototype.setReportedClientWidth=function(tnWidth)
{
    this._reportedClientWidth = tnWidth;
    if (this._reportedClientWidth <= 0)
    {
        // The server doesn't know the height, so set it
        goliath.browser.onresize();
    }
}
goliath.browser.prototype.getReportedClientHeight=function()
{
    return this._reportedClientHeight;
}
goliath.browser.prototype.getReportedClientWidth=function()
{
    return this._reportedClientWidth;
}


goliath.confirmAction=function(tcMessage, toFunction)
{
    if (goliath.utilities.confirm(tcMessage))
    {
        toFunction = goliath.makeFunction(toFunction);
        toFunction.call(this);
    }
}

goliath.confirm=function(tcMessage)
{
    // TODO: Change this so it uses a nice form rather than the web browser
    return confirm(tcMessage);
}

/**
 * Displays a warning message in the appropriate place
 */
goliath.warning=function(tcMessage)
{
    if (goliath.logger)
    {
        goliath.logger.warning(tcMessage);
    }
}

/**
 * Displays a debug message in the appropriate place
 */
goliath.debug=function(tcMessage)
{
    if (goliath.logger)
    {
        goliath.logger.debug(tcMessage);
    }
}

/**
 * Displays a fatal message in the appropriate place
 */
goliath.fatal=function(tcMessage)
{
    (goliath.logger) ? goliath.logger.fatal(tcMessage) : goliath.alert(tcMessage);
}

/**
 * Displays a trace message in the appropriate place
 */
goliath.trace=function(tcMessage)
{
    if (goliath.logger)
    {
        goliath.logger.trace(tcMessage);
    }
}

/**
 * Displays an info message in the appropriate place
 */
goliath.info=function(tcMessage)
{
    if (goliath.logger)
    {
        goliath.logger.info(tcMessage);
    }
}
