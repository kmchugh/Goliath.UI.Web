goliath.Browser.loadModule('goliath.controls');


goliath.namespace('goliath.controls');


// Constructor method for the calendar
goliath.controls.Button=function(toElement)
{
    goliath.controls.Button.superclass.constructor.call(this, toElement);

    this.addObserverDecorator();
    this.observeMouseEvents();

    this._images = new Array();

    this.setHotTracking(true);
}
goliath.browser.registerInitFunction('goliath-button', goliath.controls.Button);

goliath.controls.Button.prototype =
    {
        _images: null,
        _imageElement: null,

        onInitialise: function()
        {
            var loStyle = goliath.utilities.Style;
            var loDOM = goliath.utilities.DOM;

            var loImages = loDOM.getElementsByTagName("img", this._element);

            for (var i=0, lnLength = loImages.length; i<lnLength; i++)
            {
                if (loStyle.hasClass(loImages[i], "disabled"))
                {
                    this._images[1] = loImages[i].src;
                    continue;
                }
                else if (loStyle.hasClass(loImages[i], "mouseover"))
                {
                    this._images[2] = loImages[i].src;
                    continue;
                }
                else if (loStyle.hasClass(loImages[i], "mousedown"))
                {
                    this._images[3] = loImages[i].src;
                    continue;
                }
                else
                {
                    this._images[0] = loImages[i].src;
                    this._imageElement = loImages[i];
                }
            }

            // Make sure there is an image for each state (use the default if no image  supplied)
            for (i=1; i<4; i++)
            {
                if (!this._images[i])
                {
                    this._images[i] = this._images[0];
                }
            }

            // Remove the image elements, except for the current
            for (i = loImages.length; i>= 0; i--)
            {
                if (loImages[i] != this._imageElement)
                {
                    loDOM.remove(loImages[i]);
                }
            }

            if (this._imageElement)
            {
                loStyle.addClass(this._element, "goliath-image-button");
            }

            goliath.controls.Button.superclass.onInitialise.call(this);
        },
        render:function()
        {

        },
        onHTMLRendered:function()
        {
        },
        onMouseOver:function(toEvent)
        {
            this._imageElement.src = this._images[2];
        },
        onMouseOut: function(toEvent)
        {
            this._imageElement.src = (this.getEnabled()) ? this._images[0] : this._images[1];
        },
        onEnabledChanged: function()
        {
            this._imageElement.src = (this.getEnabled()) ? this._images[0] : this._images[1];
        }
    }
