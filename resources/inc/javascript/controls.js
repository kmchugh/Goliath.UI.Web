/*====================================
Utility classes for Javascript
====================================*/
if (typeof(goliath) == 'undefined')
{
    goliath = function(){};    
}
goliath.controls = function(){};

if (typeof(ajax) == 'undefined')
{
    ajax = function(){};
}

ajax.control = goliath.controls;

var control = goliath.controls;

var g_oControl = null;

control.create=function(toControl)
{
    if (toControl==null)
    {
        return;
    }
    
    // Initialise the control
    control.initialise(toControl);
}

control.setServerValue=function(toElement, toValue)
{
    if (!toElement.control)
    {
        toElement = $(toElement);
    }
    
    var loControl = toElement.control;
    
    // Notify the server the form has been closed
    var loCommand = new goliath.command();
    loCommand.setName("postFormFromClient");
    
    var lcString = "<Command><Control>" + loControl.getID() + "</Control><Values>";
    
    lcString = lcString + "<Update><ControlName>" + loControl.getID() + "</ControlName><Value>" + helper.escape(toValue) + "</Value></Update>";
    
    lcString = lcString + "</Values></Command>"
    
    loCommand.setBody(lcString)
    loCommand.setSynchronous(true);
    loCommand.setPriority(goliath.commandQueue.PRIORITY_IMMEDIATE);
    loCommand.setMessage(new goliath.browser.statusMessage("Posting Control."));
    loCommand.setOnCommandComplete(ajax.control.getExecuteServerCommandResponse);
    loCommand.send();
}
control.postControl=function(toElement)
{
    if (!toElement.control)
    {
        toElement = $(toElement);        
    }
    
    // Notify the server the form has been closed
    var loCommand = new goliath.command();
    loCommand.setName("postFormFromClient");
    
    
    if (toElement.id != null)
    {
        var lcString = "<Command><Control>" + toElement.id + "</Control><Values>";
        lcString = ajax.control.buildPostXMLString(toElement, lcString);
        lcString = lcString + "</Values></Command>"        
    }
    
    /*
    var loControl = toElement.control;
    var lcString = "<Command><Control>" + loControl.getID() + "</Control><Values>";
    
    lcString = ajax.control.buildPostXMLString(loControl.element, lcString);
    
    lcString = lcString + "</Values></Command>"
    */
    
    loCommand.setBody(lcString)
    loCommand.setSynchronous(true);
    loCommand.setPriority(goliath.commandQueue.PRIORITY_IMMEDIATE);
    loCommand.setMessage(new goliath.browser.statusMessage("Posting Control."));
    loCommand.setOnCommandComplete(ajax.control.getExecuteServerCommandResponse);
    loCommand.send();

}

control.buildPostXMLString=function(toElement, tcString)
{
    if (toElement.id != null && 
        (toElement.className.toLowerCase().indexOf("group") != 0
          && toElement.className.toLowerCase().indexOf("label") != 0
          && toElement.className.toLowerCase().indexOf("button") != 0))
    {
        var lcID = toElement.id;
        var loValue = toElement.value;
        if (loValue == null)
        {
            loValue = toElement.getAttribute("value");
        }
        if (toElement.type == "checkbox")
        {
            loValue = toElement.checked;
        }
        
        if (!helper.isNullOrEmpty(lcID))
        {
            if (loValue == null)
            {
                loValue = "[{NULL}]";
            }
            loValue = new String(loValue);
            tcString = tcString + "<Update><ControlName>" + lcID + "</ControlName><Value>" + helper.escape(loValue) + "</Value></Update>";
        }
    }
    
    for (var i = 0; i < toElement.childNodes.length; i++) 
    {
        var loElement = toElement.childNodes[i];
        
        // TODO: implement this properly so each class can override
        tcString = ajax.control.buildPostXMLString(loElement, tcString);
    }
    return tcString;
    
    /*
    if (toElement.control && 
        (toElement.control.onGetDefaultClassName() != "group"
          && toElement.control.onGetDefaultClassName() != "label"
          && toElement.control.onGetDefaultClassName() != "button"))
    {
        var lcID = toElement.control.getID();
        var loValue = toElement.control.getValue();
        
        if (!helper.isNullOrEmpty(lcID))
        {
            if (loValue == null)
            {
                loValue = "[{NULL}]";
            }
            loValue = new String(loValue);
            tcString = tcString + "<Update><ControlName>" + lcID + "</ControlName><Value>" + helper.escape(loValue) + "</Value></Update>";
        }
    }
    
    for (var i = 0; i < toElement.childNodes.length; i++) 
    {
        var loElement = toElement.childNodes[i];
        
        // TODO: implement this properly so each class can override
        if (loElement.control)
        {
            if (loElement.control.onGetDefaultClassName() == "texteditor")
            {
                var lcID = loElement.control.getID();
                var loValue = loElement.control.getValue();
                
                while (loValue.indexOf("&nbsp;") >= 0)
                {
                    loValue = loValue.replace("&nbsp;", "");
                }
                
                if (!helper.isNullOrEmpty(lcID))
                {
                    if (loValue == null)
                    {
                        loValue = "[{NULL}]";
                    }
                    loValue = new String(loValue);
                    tcString = tcString + "<Update><ControlName>" + lcID + "</ControlName><Value>" + helper.escape(loValue) + "</Value></Update>";
                }
                break;
            }
        }
        tcString = ajax.control.buildPostXMLString(loElement, tcString);
    }
    return tcString;
    */
}


control.createFromElement=function(tcElementName, toCreateFunction)
{
    if (toCreateFunction == null)
    {
        alert('You must pass a create function to the control.createFromElement method');
        return;
    }
    var loElement = $(tcElementName);
    if (loElement != null)
    {
        var loControl = new toCreateFunction(tcElementName);

        // Replace the document element with the new element
        // keeping the internal elements
        var loControls = new Array();
        
        // remove all the children from the document and save them
        for (var i=loElement.childNodes.length -1; i>= 0; i--)
        {
            loControls.insertAt(0, loElement.childNodes[i]);
            loElement.removeChild[i];
        }

        // Append the children back in to the new element
        var loAppendElement = loControl.getAppendElement();        
        for (i=0; i< loControls.length; i++)
        {
            loAppendElement.appendChild(loControls[i]);
        }
        
        var loValue = ajax.control.getAttributesFromElement(loElement, loControl);
        
        if (loControl.onBeforeAppendToDocument)
        {
            loControl.onBeforeAppendToDocument.call(loControl);            
        }
        
        // Append the control to the document, replacing the placeholder node
        loElement.parentNode.replaceChild(loControl.element, loElement);
        
        ajax.control.refreshControlSizes(loControl.element.parentNode);
        
        if (loControl.onAfterAppendToDocument)
        {
            loControl.onAfterAppendToDocument.call(loControl);            
        }
        
        // If this is IE, we need to set the value again.
        if (helper.isIE || helper.isIE7) 
        {
            var lcDefaultName = loControl.onGetDefaultClassName();
            if (lcDefaultName == "checkbox" || lcDefaultName == "optiongroup" || lcDefaultName == "combobox")
            {
                if (loValue != null)
                {
                    loControl.setValue(loValue);                    
                }
            }
        }
    }
    return loControl;
}


control.refreshControlSizes=function(toElement)
{
    if (!toElement)
    {
        return;        
    }
    var lnMaxHeight = helper.getHeight(toElement);
    var lnMaxWidth = helper.getWidth(toElement);
    for (var i = 0; i < toElement.childNodes.length; i++) 
    {
        // go through each child node and if it is a control, attempt to resize it
        if (toElement.childNodes[i].control && (toElement.childNodes[i].control.getHeightPercent() > 0 || toElement.childNodes[i].control.getWidthPercent() > 0))
        {
            var loControl = toElement.childNodes[i].control;
            var lnHeight = lnMaxHeight * (loControl.getHeightPercent()/100);
            var lnWidth = lnMaxWidth * (loControl.getWidthPercent()/100);
            
            if (lnHeight > 1)
            {
              loControl.setHeight(lnHeight);
            }
            if (lnWidth > 1)
            {
              loControl.setWidth(lnWidth);    
            }
        }
    }
}

control.getAttributesFromElement=function(toElement, toControl)
{
    var loReturn = null;
    var loAttribute = toElement.getAttribute('id');
    if (loAttribute != null && loAttribute != "")
    {
        toControl.setID(helper.unescape(loAttribute));
    }
    loAttribute = toElement.getAttribute('height');
    if (loAttribute != null && loAttribute != "")
    {
        toControl.setHeight(loAttribute);
    }
    loAttribute = toElement.getAttribute('heightpercent');
    if (loAttribute != null && loAttribute != "")
    {
        toControl.setHeightPercent(loAttribute);
    }
    loAttribute = toElement.getAttribute('widthpercent');
    if (loAttribute != null && loAttribute != "")
    {
        toControl.setWidthPercent(loAttribute);
    }
    loAttribute = toElement.getAttribute('maxheight');
    if (loAttribute != null && loAttribute != "")
    {
        toControl.setMaxHeight(loAttribute);
    }
    loAttribute = toElement.getAttribute('minheight');
    if (loAttribute != null && loAttribute != "")
    {
        toControl.setMinHeight(loAttribute);
    }
    loAttribute = toElement.getAttribute('maxwidth');
    if (loAttribute != null && loAttribute != "")
    {
        toControl.setMaxWidth(loAttribute);
    }
    loAttribute = toElement.getAttribute('minwidth');
    if (loAttribute != null && loAttribute != "")
    {
        toControl.setMinWidth(loAttribute);
    }
    loAttribute = toElement.getAttribute('width');
    if (loAttribute != null && loAttribute != "")
    {
        toControl.setWidth(loAttribute);
    }
    loAttribute = toElement.getAttribute('top');
    if (loAttribute != null && loAttribute != "")
    {
        toControl.setTop(loAttribute);
    }
    loAttribute = toElement.getAttribute('left');
    if (loAttribute != null && loAttribute != "")
    {
        toControl.setLeft(loAttribute);
    }
    loAttribute = toElement.getAttribute('class');
    if (loAttribute != null && loAttribute != "")
    {
        toControl.setClassName(helper.unescape(loAttribute));
    }
    loAttribute = toElement.getAttribute('text');
    if (loAttribute != null && loAttribute != "")
    {
        toControl.setText(helper.unescape(loAttribute));
    }
    loAttribute = toElement.getAttribute('value');
    if (loAttribute != null && loAttribute != "")
    {
        loReturn = helper.unescape(loAttribute);
        toControl.setValue(helper.unescape(loAttribute));
    }
    loAttribute = toElement.getAttribute('hottrack');
    if (loAttribute != null && loAttribute != "")
    {
        if (loAttribute == "true")
        {
            toControl.setHotTrack(true);
        }
    }
    loAttribute = toElement.getAttribute('enabled');
    if (loAttribute != null && loAttribute != "")
    {
        if (loAttribute == "false")
        {
            toControl.setEnabled(false);
        }
    }    
    loAttribute = toElement.getAttribute('onclick');
    if (loAttribute != null && loAttribute != "")
    {
        toControl.addOnClick(loAttribute);
    }
    loAttribute = toElement.getAttribute('onchanged');
    if (loAttribute != null && loAttribute != "")
    {
        toControl.addOnChange(loAttribute);
    }
    
    if (toControl.onParseAttributes) 
    {
        toControl.onParseAttributes(toElement);
    }
    return loReturn;
}

control.addOnBlur=function(toFunction)
{
    this.EventRouter.addListener(toFunction, "onblur");
}
control.removeOnBlur=function(toFunction)
{
    this.EventRouter.removeListener(toFunction, "onblur");
}

control.addOnChange=function(toFunction)
{
    this.EventRouter.addListener(toFunction, "onchange");
}
control.removeOnChange=function(toFunction)
{
    this.EventRouter.removeListener(toFunction, "onchange");
}

control.addOnClick=function(toFunction)
{
    this.EventRouter.addListener(toFunction, "onclick");
}
control.removeOnClick=function(toFunction)
{
    this.EventRouter.removeListener(toFunction, "onclick");
}

control.addOnDblClick=function(toFunction)
{
    this.EventRouter.addListener(toFunction, "ondblclick");
}
control.removeOnDblClick=function(toFunction)
{
    this.EventRouter.removeListener(toFunction, "ondblclick");
}

control.addOnFocus=function(toFunction)
{
    this.EventRouter.addListener(toFunction, "onfocus");
}
control.removeOnFocus=function(toFunction)
{
    this.EventRouter.removeListener(toFunction, "onfocus");
}

control.addOnKeyDown=function(toFunction)
{
    this.EventRouter.addListener(toFunction, "onkeydown");
}
control.removeOnKeyDown=function(toFunction)
{
    this.EventRouter.removeListener(toFunction, "onkeydown");
}

control.addOnKeyPress=function(toFunction)
{
    this.EventRouter.addListener(toFunction, "onkeypress");
}
control.removeOnKeyPress=function(toFunction)
{
    this.EventRouter.removeListener(toFunction, "onkeypress");
}

control.addOnKeyUp=function(toFunction)
{
    this.EventRouter.addListener(toFunction, "onkeyup");
}
control.removeOnKeyUp=function(toFunction)
{
    this.EventRouter.removeListener(toFunction, "onkeyup");
}

control.addOnMouseDown=function(toFunction)
{
    this.EventRouter.addListener(toFunction, "onmousedown");
}
control.removeOnMouseDown=function(toFunction)
{
    this.EventRouter.removeListener(toFunction, "onmousedown");
}

control.addOnMouseMove=function(toFunction)
{
    this.EventRouter.addListener(toFunction, "onmousemove");
}
control.removeOnMouseMove=function(toFunction)
{
    this.EventRouter.removeListener(toFunction, "onmousemove");
}

control.addOnMouseOut=function(toFunction)
{
    this.EventRouter.addListener(toFunction, "onmouseout");
}
control.removeOnMouseOut=function(toFunction)
{
    this.EventRouter.removeListener(toFunction, "onmouseout");
}

control.addOnMouseOver=function(toFunction)
{
    this.EventRouter.addListener(toFunction, "onmouseover");
}
control.removeOnMouseOver=function(toFunction)
{
    this.EventRouter.removeListener(toFunction, "onmouseover");
}

control.addOnMouseUp=function(toFunction)
{
    this.EventRouter.addListener(toFunction, "onmouseup");
}
control.removeOnMouseUp=function(toFunction)
{
    this.EventRouter.removeListener(toFunction, "onmouseup");
}

control.addOnSelect=function(toFunction)
{
    this.EventRouter.addListener(toFunction, "onselect");
}
control.removeOnSelect=function(toFunction)
{
    this.EventRouter.removeListener(toFunction, "onselect");
}

control.create.prototype.name = "";

control.initialise=function(toControl)
{
    toControl.element = null;
    toControl.getElement = control.getElement;
    
    // Set up all the functions
    toControl.setTop=control.setTop;
    toControl.getTop=control.getTop;
    toControl.setValue=control.setValue;
    toControl.getValue=control.getValue;
    toControl.setText=control.setText;
    toControl.getText=control.getText;
    toControl.setLeft=control.setLeft;
    toControl.getLeft=control.getLeft;
    toControl.setWidth=control.setWidth;
    toControl.getWidth=control.getWidth;
    toControl.setHeight=control.setHeight;
    toControl.getHeight=control.getHeight;
    toControl.addOnBlur=control.addOnBlur;
    toControl.removeOnBlur=control.removeOnBlur;
    toControl.addOnChange=control.addOnChange;
    toControl.removeOnChange=control.removeOnChange;
    toControl.addOnClick=control.addOnClick;
    toControl.removeOnClick=control.removeOnClick;
    toControl.addOnDblClick=control.addOnDblClick;
    toControl.removeOnDblClick=control.removeOnDblClick;
    toControl.addOnFocus=control.addOnFocus;
    toControl.removeOnFocus=control.removeOnFocus;
    toControl.addOnKeyDown=control.addOnKeyDown;
    toControl.removeOnKeyDown=control.removeOnKeyDown;
    toControl.addOnKeyPress=control.addOnKeyPress;
    toControl.removeOnKeyPress=control.removeOnKeyPress;
    toControl.addOnKeyUp=control.addOnKeyUp;
    toControl.removeOnKeyUp=control.removeOnKeyUp;
    toControl.addOnMouseDown=control.addOnMouseDown;
    toControl.removeOnMouseDown=control.removeOnMouseDown;
    toControl.addOnMouseMove=control.addOnMouseMove;
    toControl.removeOnMouseMove=control.removeOnMouseMove;
    toControl.addOnMouseOut=control.addOnMouseOut;
    toControl.removeOnMouseOut=control.removeOnMouseOut;
    toControl.addOnMouseOver=control.addOnMouseOver;
    toControl.removeOnMouseOver=control.removeOnMouseOver;
    toControl.addOnMouseUp=control.addOnMouseUp;
    toControl.removeOnMouseUp=control.removeOnMouseUp;
    toControl.addOnSelect=control.addOnSelect;
    toControl.removeOnSelect=control.removeOnSelect;
    toControl.addOn=control.addOn;
    toControl.removeOn=control.removeOn;
    toControl.refresh=control.refresh;
    toControl.appendChild = control.appendChild;
    toControl.setClassName = control.setClassName;
    toControl.getClassName = control.getClassName;
    toControl.setID = control.setID;
    toControl.getID = control.getID;
    toControl.isDraggable = false;
    toControl.dragElement = null;
    toControl.setDraggable = control.setDraggable;
    toControl.getDraggable = control.getDraggable;
    toControl.getDragElement = control.getDragElement;
    toControl.setDragElement = control.setDragElement;
    toControl.setHotTrack = control.setHotTrack;
    toControl.isEnabled = true;
    toControl.setEnabled = control.setEnabled;
    toControl.getEnabled = control.getEnabled;
    toControl.setClickable = control.setClickable;
    toControl.getAppendElement = control.getAppendElement;
    toControl.setAppendElement = control.setAppendElement;
    toControl.appendElement = null;
    toControl.setCssProperty = control.setCssProperty;
    toControl.getCssProperty = control.getCssProperty;
    toControl.parentControl = null;
    toControl.setParent = control.setParent;
    toControl.getParent = control.getParent;
    toControl.minHeight = 0;
    toControl.setMinHeight = control.setMinHeight;
    toControl.getMinHeight = control.getMinHeight;
    toControl.minWidth = 0;
    toControl.setMinWidth = control.setMinWidth;
    toControl.getMinWidth = control.getMinWidth;
    toControl.maxHeight = 0;
    toControl.setMaxHeight = control.setMaxHeight;
    toControl.getMaxHeight = control.getMaxHeight;
    toControl.maxWidth = 0;
    toControl.setMaxWidth = control.setMaxWidth;
    toControl.getMaxWidth = control.getMaxWidth;
    toControl.widthPercent=0;
    toControl.heightPercent=0;
    toControl.setWidthPercent = control.setWidthPercent;
    toControl.getWidthPercent = control.getWidthPercent;
    toControl.getHeightPercent = control.getHeightPercent;
    toControl.setHeightPercent = control.setHeightPercent;
    toControl.canFocus = false;
    toControl.getCanFocus = control.getCanFocus;
    toControl.setCanFocus = control.setCanFocus;
    toControl.bindToObject = control.bindToObject;
    toControl.updateFromDataSource = control.updateFromDataSource
    toControl.refreshDataSource = control.refreshDataSource
    toControl.m_lLayoutSuspended = false;
    toControl.suspendLayout = control.suspendLayout
    toControl.resumeLayout = control.resumeLayout
    
    // Attempt to create the element
    control.createElement(toControl);
    
    // Add an event handler to the control
    toControl.EventRouter = goliath.getEventRouter(toControl.element);

    // Set the class name
    toControl.setClassName(control.getDefaultClassName(toControl), true);        
    
    if (toControl.onInitialise != null)
    {
        toControl.onInitialise();
    }
    
    // need to resize if there is a min width or height
    if (toControl.getMinHeight() > 0)
    {
        toControl.setHeight(toControl.getMinHeight());
    }
    if (toControl.getMinWidth() > 0)
    {
        toControl.setWidth(toControl.getMinWidth());
    }
}

control.bindToObject=function(toObject, toGetValueFunction, toSetValueFunction)
{
    this.boundTo=toObject;
    this.boundGetValue=this.boundTo[toGetValueFunction];
    this.boundSetValue=this.boundTo[toSetValueFunction];
    this.addOnChange(control.updateFromDataSource);
    this.updateFromDataSource();
}

control.updateFromDataSource=function()
{
    var loControl = this.control;
    if (loControl)
    {
        var loValue = null;
        if (loControl.onGetValue != null)
        {
            loValue = loControl.onGetValue();
        }
        else
        {
            loValue = loControl.value;
        }
        loControl.boundSetValue.call(loControl.boundTo, loValue);
    }
}

control.refreshDataSource=function()
{
    this.setValue(this.getValue());
}

control.updateValue=function(toControl, toValue)
{
    toControl.setValue(toValue);
}

control.setValue=function(toValue)
{
    if (this.onSetValue != null)
    {
        this.onSetValue(toValue);

        // Because some elements may not be displayed yet we need to check this
        if (this.onGetValue() != toValue) 
        {
            if (this.getValue().toString() != helper.unescape(toValue.toString())) 
            {
                if (helper.unescape(this.getValue().toString()) != toValue.toString()) 
                {
                    //alert('settimeout');
                    //window.setTimeout(control.updateValue, 100, this, toValue);                    
                }
            }
        }
    }
    else
    {
        this.value = toValue;
    }
    
    if (this.boundTo != null)
    {
        var loValue = this.boundGetValue.call(this.boundTo);
        if (this.boundTo != toValue)
        {
            this.boundSetValue.call(this.boundTo, toValue);
        }
    }
}
control.getValue=function()
{
    var loValue = null;
    if (this.boundTo != null)
    {
        loValue = this.boundGetValue.call(this.boundTo);
    }
    else
    {
        if (this.onGetValue != null)
        {
            loValue = this.onGetValue();
        }
        else
        {
            loValue = this.value;
        }
    }
    return loValue;
}

control.setClickable=function(tlClickable)
{
    
}
control.setHotTrack=function(tlHotTrack)
{
    if (tlHotTrack)
    {
        this.addOnMouseOver(control.highlightObject);
        this.addOnMouseOut(control.unHighlightObject);
    }
    else
    {
        this.removeOnMouseOver(control.highlightObject);
        this.removeOnMouseOut(control.unHighlightObject);
    }
}

control.setEnabled=function(tlEnabled)
{
    // need to disable the event router for the object as well
    this.EventRouter.setEnabled(tlEnabled);
    if (tlEnabled)
    {
        helper.enableObject(this.element);
    }
    else
    {
        helper.disableObject(this.element);
    }
    this.isEnabled = tlEnabled;
}
control.getEnabled=function()
{
    return this.isEnabled;
}

control.setCanFocus=function(tlSelectable)
{
    if (tlSelectable)
    {
        this.removeOnClick(control.cancelFocus);
        this.addOnClick(control.setFocus);
    }
    else
    {
        this.removeOnClick(control.setFocus);
        this.addOnClick(control.cancelFocus);
    }
    this.isSelectable = tlSelectable;
}
control.getCanFocus=function()
{
    return this.isSelectable;
}

control.setFocus=function()
{
    if (this.control)
    {
        this.control.element.focus();
    }
}
control.cancelFocus=function()
{
    return false;
}

control.highlightObject=function()
{
    helper.highlightObject(this);
}
control.unHighlightObject=function()
{
    helper.unHighlightObject(this);
}

control.setParent=function(toControl)
{
    this.parentControl=toControl;
}
control.getParent=function()
{
    return this.parentControl;
}
control.setID=function(tcName)
{
    this.element.name = tcName;
    this.element.id = tcName;
}
control.getID=function()
{
    return this.element.id;
}

control.setMinWidth=function(tnMinWidth)
{
    tnMinWidth = parseInt(tnMinWidth);
    this.minWidth = tnMinWidth;
    if (this.getWidth() < tnMinWidth)
    {
        this.setWidth(tnMinWidth);
    }
}
control.getMinWidth=function()
{
    return this.minWidth;
}

control.setMinHeight=function(tnMinHeight)
{
    tnMinHeight = parseInt(tnMinHeight);
    this.minHeight = tnMinHeight;
    if (this.getHeight() < tnMinHeight)
    {
        this.setHeight(tnMinHeight);
    }
}
control.getMinHeight=function()
{
    return this.minHeight;
}

control.setMaxHeight=function(tnMaxHeight)
{
    tnMaxHeight = parseInt(tnMaxHeight);
    this.maxHeight = tnMaxHeight;
    if (this.getHeight() > tnMaxHeight)
    {
        this.setHeight(tnMaxHeight);
    }
}
control.getMaxHeight=function()
{
    return this.maxHeight;
}

control.setMaxWidth=function(tnMaxWidth)
{
    tnMaxWidth = parseInt(tnMaxWidth);
    this.maxWidth = tnMaxWidth;
    if (this.getWidth() > tnMaxWidth)
    {
        this.setWidth(tnMaxWidth);
    }
}
control.getMaxWidth=function()
{
    return this.maxWidth;
}

control.setWidthPercent=function(tnWidthPercent)
{
    tnWidthPercent = parseInt(tnWidthPercent);
    if (tnWidthPercent >= 0 && tnWidthPercent <= 100)
    {
        this.widthPercent = tnWidthPercent;        
    }
}
control.getWidthPercent=function()
{
    return this.widthPercent;
}

control.setHeightPercent=function(tnHeightPercent)
{
    tnHeightPercent = parseInt(tnHeightPercent);

    if (tnHeightPercent >= 0 && tnHeightPercent <= 100)
    {
        this.heightPercent = tnHeightPercent;        
    }
}
control.getHeightPercent=function()
{
    return this.heightPercent;
}

control.setDraggable=function(tlDraggable)
{
    this.isDraggable=tlDraggable;
    if (tlDraggable)
    {
        this.addOnMouseDown(control.setDragControl);
        document.EventRouter.addListener(control.clearDragControl, "onmouseup");
    }
    else
    {
        this.removeOnMouseDown(control.setDragControl);
        document.EventRouter.removeListener(control.clearDragControl, "onmouseup");
    }
}
control.dragControl=null;
control.mouseOffset=null;
control.setDragControl=function(e)
{
    e=goliath.getEvent(e);
    control.dragControl=this.control.getDragElement();
    control.mouseOffset=helper.getMouseOffset(this, e);
    document.EventRouter.addListener(control.onDraggingControl, "onmousemove");
}
control.clearDragControl=function()
{
    control.dragControl = null;
    control.mouseoffset = null;
    document.EventRouter.removeListener(control.onDraggingControl, "onmousemove");
}

control.onDraggingControl=function(e)
{
    var lnPosition = helper.getEventMouseLocation(e);
    if (control.dragControl != null)    
    {
        var lnX = lnPosition.x - control.mouseOffset.x;
        var lnY = lnPosition.y - control.mouseOffset.y;
        control.dragControl.control.setLeft(lnX);
        control.dragControl.control.setTop(lnY);
    }
}

control.getDraggable=function()
{
    return this.isDraggable;
}

control.getElement=function()
{
    return this.element;
}

control.setDragElement=function(toElement)
{
    this.dragElement = toElement;
}

control.getDragElement=function()
{
    return this.dragElement;
}

control.createElement=function(toControl)
{
    if (toControl.element != null)
    {
        return;
    }
    var loElement = null;
    if (toControl.onCreateElement != null)
    {
        loElement = toControl.onCreateElement();
    }
    else
    {
        loElement = document.createElement("div");
    }
    if (toControl.getAppendElement() == null)
    {
        toControl.setAppendElement(loElement);
    }
        
    toControl.element = loElement;
    toControl.element.control = toControl;
    
    // Set the drag element
    if (toControl.dragElement == null)
    {
        toControl.dragElement = loElement;
    }
}

control.setClassName=function(tcClassName, tlOverrideDefault)
{
    if (tlOverrideDefault == null)
    {
        tlOverrideDefault = false;
    }
    
    if (this.element != null)
    {
        if (tlOverrideDefault)
        {
            this.element.className = tcClassName;
        }
        else
        {
            var lcClassName = control.getDefaultClassName(this);
            if (lcClassName != tcClassName)
            {
                this.element.className = control.getDefaultClassName(this) + " " + tcClassName;
            }
            else
            {
                this.element.className = tcClassName;                
            }
        }
    }
}

control.getClassName=function()
{
    if (this.element != null)
    {
        return this.element.className;
    }
    return "";
}

control.getDefaultClassName=function(toControl)
{
    if (toControl.onGetDefaultClassName != null)
    {
        return toControl.onGetDefaultClassName();
    }
    else
    {
        return "control";
    }
}

control.setCssProperty=function(tcProperty, tcValue)
{
    helper.setCssProperty(this.element, tcProperty, tcValue);
}

control.getCssProperty=function(tcProperty, tcValue)
{
    // TODO: Do this so that it makes the property numeric if needed. 
    helper.getNumericCssProperty(this.element, tcProperty);
}

control.refresh=function()
{
    if (!this.m_lLayoutSuspended)
    {
      // We don't want to waste time refreshing a control that can not be seen
      if (this.onRefresh != null && this.getHeight() > 0 && this.getWidth() > 0)
      {
          return this.onRefresh();
      }
    }
    return null;
}

control.suspendLayout=function()
{
    this.m_lLayoutSuspended = true;
}
control.resumeLayout=function()
{
    this.m_lLayoutSuspended = false;
}


control.setTop=function(tnValue)
{
    tnValue = parseInt(tnValue);
    this.setCssProperty("position", "absolute");
    helper.setTop(this.element, tnValue);
}

control.getTop=function()
{
    return helper.getTop(this.element);
}

control.setLeft=function(tnValue)
{
    tnValue = parseInt(tnValue);
    this.setCssProperty("position", "absolute");
    helper.setLeft(this.element, tnValue);
}

control.getLeft=function()
{
    return helper.getLeft(this.element);
}

control.setWidth=function(tnValue)
{
    tnValue = parseInt(tnValue);
    if (tnValue < this.getMinWidth()) 
    {
        tnValue = this.getMinWidth();        
    }
    if (this.getMaxWidth() > 0 && tnValue > this.getMaxWidth()) 
    {
        tnValue = this.getMaxWidth();        
    }

    helper.setWidth(this.element, tnValue);
    this.refresh();
}

control.getWidth=function()
{
    return helper.getWidth(this.element);
}

control.updateText=function(toControl, tcValue)
{
    toControl.setText(tcValue);
}

control.setText=function(tcValue)
{
    if (this.onSetText != null)
    {
        this.onSetText(tcValue);
        // Because some elements may not be displayed yet we need to check this
        if (this.onGetText() != tcValue && this.onGetText() != helper.escape(tcValue)) 
        {
            window.setTimeout(control.updateText, 10, this, tcValue);
        }
    }
}

control.getText=function()
{
    if (this.onGetText != null)
    {
        return this.onGetText();
    }
    return null;
}

control.setHeight=function(tnValue)
{
    tnValue = parseInt(tnValue);
    if (tnValue < this.getMinHeight()) 
    {
        tnValue = this.getMinHeight();        
    }
    if (this.getMaxHeight() > 0 && tnValue > this.getMaxHeight()) 
    {
        tnValue = this.getMaxHeight();        
    }
    
    // TODO : Use an onSetHeight override for this
    if(this.onGetDefaultClassName() == "combobox")
    {
        tnValue = tnValue + 4;
    }
    if(this.onGetDefaultClassName() == "textbox" && helper.isFireFox)
    {
        tnValue = tnValue + 8;
    }

    
    helper.setHeight(this.element, tnValue);
    
    this.refresh();
}

control.getHeight=function()
{
    return helper.getHeight(this.element);
}

control.getAppendElement=function()
{
    return this.appendElement;
}

control.setAppendElement=function(toElement)
{
    this.appendElement = toElement;
}
control.appendChild=function(toElement)
{
    var lnMinWidth = 0;
    var lnMinHeight = 0;
    if (toElement.element != null && toElement.element.control == toElement)
    {
        lnMinWidth += toElement.getMinWidth();
        lnMinHeight += toElement.getMinHeight();
        toElement.setParent(this);
        toElement=toElement.element;
    }
    else
    {
        if (toElement.control != null)
        {
            lnMinWidth += toElement.control.getMinWidth();
            lnMinHeight += toElement.control.getMinHeight();
            toElement.control.setParent(this);
        }
    }
    
    // Get the min heights of all the controls inside
    var loAppendElement = this.getAppendElement();
    for (var i=0; i<loAppendElement.childNodes.length; i++)
    {
        var loElement = loAppendElement.childNodes[i];
        if (loElement.control)
        {
            lnMinWidth += loElement.control.getMinWidth();
            lnMinHeight += loElement.control.getMinHeight();            
        }
    }
    
    if (this.getWidth() < lnMinWidth)
    {
        this.setWidth(lnMinWidth);
    }
    
    if (this.getHeight() < lnMinHeight)
    {
        this.setHeight(lnMinHeight);
    }
    
    // TODO: May need to resize the form or the controls inside
    
    loAppendElement.appendChild(toElement);
}

control.isControl=function(toElement)
{
    return (toElement.control != null && toElement.control.element == toElement);
}

control.server_onclick=function(loElement)
{
    control.executeServerCommand(loElement.control.getID(), "onclick");
}
control.server_onselectionchanged=function(toElement)
{
    if (toElement.element)
    {
        toElement = toElement.element;        
    }

    var lcXML = "";

    // get input from the control
    if (toElement.control.getOnSelectionChangedXML)
    {
        lcXML = toElement.control.getOnSelectionChangedXML();                    
    }
    control.executeServerCommand(toElement.control.getID(), "onselectionchanged", lcXML);
    
}

control.server_onchanged=function(toElement)
{
    if (toElement.element)
    {
        toElement = toElement.element;        
    }
    
    var lcXML = ajax.control.buildPostXMLString(toElement, "");
    
    control.executeServerCommand(toElement.control.getID(), "onchanged", lcXML);
}

control.executeServerCommand=function(tcControlName, tcAction, tcAdditionalXML)
{
    var loFunction = new Function("ajax.control.onExecuteServerCommand.call(this, '" + tcControlName + "', '" + tcAction + "', '" + tcAdditionalXML + "');");
    helper.setBusy(loFunction, this);
}
    
control.onExecuteServerCommand=function(tcControlName, tcAction, tcAdditionalXML)
{
    if (tcAdditionalXML == null || tcAdditionalXML == "undefined")
    {
        tcAdditionalXML = "";
    }
    
    var loCommand = new goliath.command();
    loCommand.setName("executeUICommand");
    loCommand.setBody("<Command><Control>" + tcControlName + "</Control><Action>" + tcAction + "</Action>" + tcAdditionalXML + "</Command>")
    loCommand.setSynchronous(true);
    loCommand.setPriority(goliath.commandQueue.PRIORITY_IMMEDIATE);
    loCommand.setMessage(new goliath.browser.statusMessage("Executing UI Commands."));
    loCommand.setOnCommandComplete(ajax.control.getExecuteServerCommandResponse);
    loCommand.send();
}

control.getExecuteServerCommandResponse=function(tcControlName, tcAction)
{
    // Execute the executable xml that was returned
    helper.parseExecutableXML(this.getResponseXML());
}

control.refreshFromServer=function(tcControlID)
{
    goliath.Browser.setLocation("/Project/?appContent=" + goliath.createGUID());
    /*
    var loControl = $(tcControlID);
    if (!loControl)
    {
        return;
    }
    
    // TODO : Do this properly with a form manager
    // clear any form elements from outside the appcontent if this is a refresh of appcontent
    if (tcControlID == "appContent")
    {
        var loForms = helper.getElementsByClassName("form");
        for (var i = 0; i < loForms.length; i++) 
        {
            loForms[i].parentNode.removeChild(loForms[i]);
        }
    }
    
    helper.createSplash(loControl);
    g_oControl = loControl;
    window.setTimeout(ajax.control.onRefreshFromServer, 0);
    */
}
control.onRefreshFromServer=function()
{
    var loCommand = new goliath.command();
    loCommand.setName("refreshControl");
    var lcID = null;
    if (g_oControl == null)
    {
        helper.closeSplash(g_oControl);
        return;
    }
    loCommand.setBody("<Command><Control>" + g_oControl.id + "</Control></Command>")
    loCommand.setSynchronous(true);
    loCommand.setPriority(goliath.commandQueue.PRIORITY_IMMEDIATE);
    loCommand.setMessage(new goliath.browser.statusMessage("Retrieving Content for control."));
    loCommand.setOnCommandComplete(ajax.control.refreshFromServerResponse);
    loCommand.control = g_oControl;
    loCommand.send();
}

control.refreshFromServerResponse=function()
{
    var loControl = this.control;
    if (!loControl)
    {
        helper.alert("lost access to control");
        return;
    }
    // Execute the executable xml that was returned
    helper.parseExecutableXML(this.getResponseXML(), loControl, true);
    
    helper.closeSplash(loControl);
}


var controls = new Object();


controls.buttonClicked =function(toElement, tcAction, taParameterNames, taValues, tcMethod)
{
    toElement = $(toElement);
    if (controls.isEnabled(toElement))
    {
        helper.postValues(tcAction, taParameterNames, taValues, tcMethod);
    }
}

controls.buttonClickedWithConfirm =function(toElement, tcMessage, tcAction, taParameterNames, taValues, tcMethod)
{
    toElement = $(toElement);
    if (controls.isEnabled(toElement))
    {
        if (helper.confirm(tcMessage))
        {
            helper.postValues(tcAction, taParameterNames, taValues, tcMethod);
        }
    }
}

controls.isEnabled = function(toElement)
{
    return (!helper.hasClass(toElement, 'disabled'));
}

controls.isSelected = function(toElement)
{
    return (helper.hasClass(toElement, 'selected'));
}

controls.getSelectedRowValue =function(toElement)
{
    var lcReturn = "";
    var laRows = helper.getElementsByClassName('row', toElement);
    for (var i=0; i<laRows.length; i++)
    {
        if (controls.isSelected(laRows[i]))        
        {
            return laRows[i].getAttribute('value');
        }
    }
    return lcReturn;
}

controls.submitForm = function(toForm, tcAction, taParameterNames, taValues, tcMethod)
{
    // Get all the inputs
    var laInputs = helper.getElementsByTagName('input', toForm);
    for (var i=0; i<laInputs.length; i++)
    {
        if (laInputs[i].id != null && laInputs[i].value != null)
        {
            taParameterNames[taParameterNames.length] = laInputs[i].id;
            if (laInputs[i].type == "checkbox")
            {
                taValues[taValues.length] = laInputs[i].checked;
            }
            else
            {
                taValues[taValues.length] = laInputs[i].value;
            }
            
        }
    }
    
    // Get all the text areas
    laInputs = helper.getElementsByTagName('textarea', toForm);
    for (i=0; i<laInputs.length; i++)
    {
        if (laInputs[i].id != null && laInputs[i].value != null)
        {
            taParameterNames[taParameterNames.length] = laInputs[i].id;
            taValues[taValues.length] = laInputs[i].value;
        }
    }
    
    // Get all the text areas
    laInputs = helper.getElementsByTagName('select', toForm);
    for (i=0; i<laInputs.length; i++)
    {
        if (laInputs[i].id != null && laInputs[i].value != null)
        {
            taParameterNames[taParameterNames.length] = laInputs[i].id;
            taValues[taValues.length] = laInputs[i].value;
        }
    }
    
    helper.postValues(tcAction, taParameterNames, taValues, tcMethod);
}
