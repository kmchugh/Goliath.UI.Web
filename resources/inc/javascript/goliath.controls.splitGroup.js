goliath.namespace('goliath.controls');

// Constructor method for the calendar
goliath.controls.SplitGroup=function(toElement)
{
    goliath.controls.SplitGroup.superclass.constructor.call(this, toElement);

    this.addObserverDecorator();
    this.observeMouseEvents();

    this._images = new Array();
}

goliath.controls.SplitGroup.prototype =
{
    _images: null,
    _imageElement: null,
    _dividerSize: 4,

    onInitialise: function()
    {
        var loSize = this.getSize();
        var loChildren = this._element.children;
        var i, lnLength;
        var laSizes = (this._element.getAttribute("sizePercents") ? this._element.getAttribute("sizePercents").split(",") : []);
        if (laSizes.length == 0)
        {
            for (i=0, lnLength = loChildren.length; i<lnLength; i++)
            {
                laSizes[i] = (100 / loChildren.length) /100;
            }
        }
        else
        {
            for (i=0; i<laSizes.length; i++)
            {
                laSizes[i] = parseFloat(laSizes[i]);
            }
        }

        for (i=0, lnLength = loChildren.length; i<lnLength; i++)
        {
            if (this.getAlignment() == "vertical")
            {
                loChildren[i + i].setAttribute("heightPercent", laSizes[i]);
                loChildren[i + i].setAttribute("widthPercent", 1);
            }
            else
            {
                loChildren[i + i].setAttribute("heightPercent", 1);
                loChildren[i + i].setAttribute("widthPercent", laSizes[i]);
            }

            if (i == lnLength -1)
            {
                break;
            }

            var loDivider = goliath.createElement('div');
            loDivider.className = "goliath-divider divider-" + (this.getAlignment() == "vertical" ? "horizontal" : "vertical");

            if (this.getAlignment() == "vertical")
            {
                goliath.utilities.DOM.setHeight(loDivider, this.getDividerSize());
                goliath.utilities.DOM.setWidth(loDivider, loSize.width);
            }
            else
            {
                goliath.utilities.DOM.setWidth(loDivider, this.getDividerSize());
                goliath.utilities.DOM.setHeight(loDivider, loSize.height);
            }

            goliath.utilities.DOM.insertBefore(loChildren[i + 1 + i], loDivider);
        }

        goliath.controls.SplitGroup.superclass.onInitialise.call(this);
    },
    getDividerSize:function()
    {
        return this._dividerSize;
    },
    setDividerSize:function(tnSize)
    {
        this._dividerSize = tnSize;
    },
    render:function()
    {

    },
    onHTMLRendered:function()
    {
    },
    getSize:function()
    {
        var loSize = goliath.controls.SplitGroup.superclass.getSize.call(this);

        if (this.getAlignment() == "vertical")
        {
            loSize.height = loSize.height - ((this._element.children.length - 1 - (goliath.utilities.DOM.getElementsByClassName('goliath-divider', this._element).length)) * this.getDividerSize());

        }
        else
        {
            loSize.width = loSize.width - ((this._element.children.length - 1 - (goliath.utilities.DOM.getElementsByClassName('goliath-divider', this._element).length)) * this.getDividerSize());
        }

        return loSize;
    }
}

goliath.browser.registerInitFunction('goliath-splitGroup', goliath.controls.SplitGroup);