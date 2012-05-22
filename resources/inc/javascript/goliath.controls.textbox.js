/*====================================
Menu Item base classes and functions for Javascript
====================================*/
if (typeof goliath == 'undefined')
{
    goliath = function(){};
}
if (typeof goliath.controls == 'undefined')
{
    goliath.controls = function(){};
}
goliath.controls.textbox = function(){};

goliath.controls.textbox.initialise=function(toID)
{
    var loControl = new goliath.controls.textbox.Textbox($(toID));
}

goliath.controls.textbox.Textbox=function(toElement)
{
    goliath.controls.textbox.Textbox.superclass.constructor.call(this, toElement);

    // Set the value
    this.setValue(this.getAttribute("value"));


    // Set the type
    this.setType(this.getAttribute("type"));

    // Set the shadow text
    this.setShadowText(this.getAttribute("shadowtext"));
}
goliath.utilities.extend(goliath.controls.textbox.Textbox, goliath.controls.Control);

goliath.controls.textbox.Textbox.prototype.setType=function(tcType)
{
    if (tcType == null || tcType != "password")
    {
        tcType = "textbox";
    }
    this._type = tcType;
}
goliath.controls.textbox.Textbox.prototype.getType=function()
{
    return this._type;
}

goliath.controls.textbox.Textbox.prototype.setShadowText=function(tcShadowText)
{
    this._shadowText = goliath.utilities.unescape(tcShadowText);
    this.updateShadowText();
}
goliath.controls.textbox.Textbox.prototype.getShadowText=function()
{
    return this._shadowText;
}

goliath.controls.textbox.Textbox.prototype.getValue=function()
{
    if (this._value != this._element.value)
    {
        this.setValue(this._element.value);
    }
    return this._value;
}

goliath.controls.textbox.Textbox.prototype.setValue=function(toValue)
{
    toValue = goliath.utilities.unescape(toValue);
    this._value = toValue;
    this._element.value = toValue;
}

goliath.controls.textbox.Textbox.prototype.isSettingShadowText=false;
goliath.controls.textbox.Textbox.prototype.updateShadowText=function()
{
    if (!this.isSettingShadowText)
    {
        this.isSettingShadowText = true;

        var lcShadowText = this.getShadowText();
        var loListener = goliath.getEventRouter(this.getElement());
        if (lcShadowText == null || lcShadowText == "")
        {
            this.removeClass("shadowText");
            // Remove event handlers
            loListener.removeListener(goliath.controls.textbox.Textbox.onFocus, "onfocus");
            loListener.removeListener(goliath.controls.textbox.Textbox.onBlur, "onblur");
        }
        else
        {
            var lcValue = this.getValue();
            if (lcValue == null || lcValue == "")
            {
                this.addClass("shadowText");
                if (this.getType() == "password")
                {
                    this.setAttribute("type", "textbox");
                }
                this.getElement().value=lcShadowText;
                // Add event handlers
                loListener.addListener(goliath.controls.textbox.Textbox.onFocus, "onfocus");
            }
            else
            {
                this.removeClass("shadowText");
                loListener.addListener(goliath.controls.textbox.Textbox.onFocus, "onfocus");
            }
        }

        this.isSettingShadowText = false;
    }
}

goliath.controls.textbox.Textbox.onFocus=function()
{
    goliath.getEventRouter(this).removeListener(goliath.controls.textbox.Textbox.onFocus, "onfocus");
    this._control.removeClass("shadowText");
    if (this.value == this._control.getShadowText())
    {
        this.value="";
    }
    if (this._control.getType() == "password")
    {
        this._control.setAttribute("type", "password");
    }
    goliath.getEventRouter(this).addListener(goliath.controls.textbox.Textbox.onBlur, "onblur");
}

goliath.controls.textbox.Textbox.onBlur=function()
{
    goliath.getEventRouter(this).removeListener(goliath.controls.textbox.Textbox.onBlur, "onblur");
    if (this.value != this._control.getShadowText())
    {
        this._control.setValue(this.value);
    }
    this._control.updateShadowText();
}

