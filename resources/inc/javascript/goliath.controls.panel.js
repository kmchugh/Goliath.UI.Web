goliath.namespace('goliath.controls');

goliath.controls.Panel=(function()
{
    //-------------------------------
    // Private static member variables
    //-------------------------------
    var g_cTitleAreaClassName = "goliath-titleArea";
    var g_cContentAreaClassName = "goliath-contentArea";
    // TODO: reduce this to being just title
    var g_cTitleClassName = "goliath-panel-title";


    //-------------------------------
    // Private static member functions
    //-------------------------------


    //-------------------------------
    // Returned constructor
    //-------------------------------
    return function(toElement)
    {
        // Call the constructor
        goliath.controls.Panel.superclass.constructor.call(this, toElement);

        //-------------------------------
        // Private member variables
        //-------------------------------
        var m_nDefaultSize = 3;
        var m_oBorderSize = {top: m_nDefaultSize, right: m_nDefaultSize, bottom: m_nDefaultSize, left: m_nDefaultSize};
        var m_oTitleElement = null;
        var m_oContentElement = null;

        var loSelf = this;

        //-------------------------------
        // Private member functions
        //-------------------------------
        this.getBorderSize = function(){return m_oBorderSize;}

        this.getTitleArea = (function()
        {
            // Try to get the title area from elements that already exist

            var laElements = goliath.utilities.DOM.getElementsByClassName(g_cTitleAreaClassName, loSelf.getElement());
            if (laElements.length > 0)
            {
                m_oTitleElement = laElements[0];
            }
            else
            {
                m_oTitleElement = goliath.createElement("div");
                m_oTitleElement.className = g_cTitleAreaClassName;
            }

            // Check if the title area has an actual title class
            laElements = goliath.utilities.DOM.getElementsByClassName(g_cTitleClassName, loSelf.getElement());
            if (laElements.length == 0)
            {
                var loTitle = goliath.createElement("div");
                loTitle.className = g_cTitleClassName;
                m_oTitleElement.appendChild(loTitle);
            }
            else
            {
                if (laElements[0].parentNode != m_oTitleElement)
                {
                    m_oTitleElement.appendChild(laElements[0]);
                }
            }
            return function(){return m_oTitleElement}
        })();

        this.getContentArea = (function()
        {
            // Try to get the title area from elements that already exist

            var laElements = goliath.utilities.DOM.getElementsByClassName(g_cContentAreaClassName, loSelf.getElement());
            if (laElements.length > 0)
            {
                m_oContentElement = laElements[0];
            }
            else
            {
                m_oContentElement = goliath.createElement("div");
                m_oContentElement.className = g_cContentAreaClassName;
            }



            var loChildren = loSelf.getElement().childNodes;

            var loMoveElements = [];

            // Pull out everything that is not the title and add it to the contentArea
            for (var i=0, lnLength = loChildren.length; i<lnLength; i++)
            {
                if (loChildren[i] != m_oTitleElement && loChildren[i] != m_oContentElement)
                {
                    loMoveElements.append(loChildren[i]);
                }
            }

            // Append to the content area
            for (i=0, lnLength = loMoveElements.length; i<lnLength; i++)
            {
                m_oContentElement.appendChild(loMoveElements[i]);
            }

            return function(){return m_oContentElement}
        })();

        // This control can listen for events
        this.addObserverDecorator();

        // This control can take part in mouse events
        this.observeMouseEvents();

        // This control will be a hot tracked control
        this.setHotTracking(true);


    };
})();

goliath.controls.Panel.prototype =
{
    /**
     *  Makes sure that the title and content are attached correctly and have the proper padding and background
     */
    render:function()
    {

        // Make sure the title and content areas are in the correct places
        var loTitle = this.getTitleArea();
        var loContent = this.getContentArea();
        var loElement = this.getElement();
        if (loTitle.parentNode != loElement)
        {
            (loElement.children.length == 0) ? loElement.appendChild(loTitle) : goliath.utilities.DOM.insertBefore(loElement.children[0], loTitle);
        }

        if (loContent.parentNode != loElement)
        {
            loElement.appendChild(loContent);
        }

        var loBorderSize = this.getBorderSize();

        goliath.utilities.Style.setStyleValue(this.getElement(), "padding", loBorderSize.top + "px " + loBorderSize.right + "px " + loBorderSize.bottom + "px " + loBorderSize.left + "px ");

        this.layout();
    },

    getChildren : function(){return this.getContentArea().childNodes;}

}

goliath.utilities.extend(goliath.controls.Panel, goliath.controls.Container);
goliath.browser.registerInitFunction('goliath-panel', goliath.controls.Panel);

/*
goliath.controls.Panel.prototype =
    {
        _borderSize: {top: 3, right: 3, bottom: 3, left:3},
        _title: null,
        _titleArea: null,
        _contentArea: null,
        _titleHeight: 15,

        onInitialise: function()
        {
            // Make sure the title area exists
            this.getTitleArea();
            this.getContentArea();

            // Make sure the border area exists
            // TOP

            // LEFT

            // RIGHT

            // BOTTOM

            goliath.controls.Panel.superclass.onInitialise.call(this);
        },
        render:function()
        {
        },
        onHTMLRendered:function()
        {

        },
        getBorderSize:function()
        {
            return this._borderSize;
        },
        setBorderSize:function(toSize)
        {
            this._borderSize = toSize;
        },
        getTitle:function()
        {
            return goliath.utilities.DOM.getElementsByClassName('goliath-panel-title', this.getTitleArea())[0].innerHTML;
        },
        setTitle:function(tcTitle)
        {
            goliath.utilities.DOM.getElementsByClassName('goliath-panel-title', this.getTitleArea())[0].innerHTML = tcTitle;
        },

        getContentArea:function()
        {
            if (this._contentArea == null)
            {
                this._contentArea = goliath.createElement("div");
                this._contentArea.className = "goliath-contentArea";
                var loSize = this.getSize();

                goliath.utilities.Style.setCSSWidth(this._contentArea, loSize.width - this._borderSize.left - this._borderSize.right);
                goliath.utilities.Style.setCSSHeight(this._contentArea, loSize.height - this._borderSize.top - this._borderSize.bottom - this._titleHeight);

                (this._element.children.length == 1) ? this._element.appendChild(this._contentArea) : goliath.utilities.DOM.insertAfter(this._titleArea, this._contentArea);

                var loChildren = this._element.childNodes;
                var loMoveElements = [];

                // Pull out everything that is not the label and add it to the contentArea
                for (var i=0, lnLength = loChildren.length; i<lnLength; i++)
                {
                    if (loChildren[i] != this._titleArea && loChildren[i] != this._contentArea)
                    {
                        loMoveElements.append(loChildren[i]);
                    }
                }

                for (var i=0, lnLength = loMoveElements.length; i<lnLength; i++)
                {
                    this._contentArea.appendChild(loMoveElements[i]);
                }
            }
            return this._contentArea;
        }
    }
    */
