/****************************************************
 * Definition of the layout managers
 ****************************************************/
goliath.namespace('goliath.controls.layout');
goliath.controls.layout.LayoutManager = (function()
{
    return function()
    {

    };

})();

goliath.controls.layout.LayoutManager.prototype =
{
    m_oLayoutParameters: [],

    /**
     * Lays out the specified control
     * @param toControl the control to update the layout for
     */
    layout : function(toControl)
    {
        alert("no layout action defined");
    },

    setSize : function(toControl, toSize)
    {
        var loConstraints = this.getLayoutAttributes(toControl);
        toSize.width = Math.min(loConstraints.maxWidth, toSize.width);
        toSize.height = Math.min(loConstraints.maxHeight, toSize.height);
        toSize.width = Math.max(loConstraints.minWidth, toSize.width);
        toSize.height = Math.max(loConstraints.minHeight, toSize.height);

        var lnHeight = loConstraints.actualSize ? loConstraints.actualSize.height : 0;
        var lnWidth = loConstraints.actualSize ? loConstraints.actualSize.width : 0;

        loConstraints.actualSize = toSize;

        // TODO: see if this is required
        /**
        // Both width and height are converted to integers in order to drop the fractions
        var lnWidth = parseInt((toValue.width < this._minWidth ? this._minWidth :(toValue.width > this._maxWidth ? this._maxWidth : toValue.width)));
        var lnHeight = parseInt((toValue.height < this._minHeight ? this._minHeight :(toValue.height > this._maxHeight ? this._maxHeight : toValue.height)));
        **/

        // Only change the height and width if it has actually been changed
        if (lnHeight != loConstraints.actualSize.height)
        {
            goliath.utilities.DOM.setHeight(toControl.getElement(), loConstraints.actualSize.height);
        }
        if (lnWidth != loConstraints.actualSize.width)
        {
            goliath.utilities.DOM.setWidth(toControl.getElement(), loConstraints.actualSize.width);
        }
    },

    /**
     * Parses an object out of all the attributes related to size constraints
     */
    getLayoutAttributes : function(toControl)
    {
        for (var i=0, lnLength = this.m_oLayoutParameters.length; i<lnLength; i++)
        {
            var loProperty = this.m_oLayoutParameters[i];
            if (loProperty.getKey() == toControl)
            {
                return loProperty.getValue();
            }
        }

        var lfnAttribute = goliath.utilities.DOM.attribute;
        var loElement = toControl.getElement();
        var loValue =
            {
                minWidth : parseFloat(lfnAttribute(loElement, "minWidth")) || 0,
                minHeight : parseFloat(lfnAttribute(loElement, "minHeight")) || 0,
                maxWidth : parseFloat(lfnAttribute(loElement, "maxWidth")) || 99999,
                maxHeight : parseFloat(lfnAttribute(loElement, "maxHeight")) || 99999,
                alignment : lfnAttribute(loElement, "alignment") || "horizontal",
                percentWidth : lfnAttribute(loElement, "percentWidth") || 0,
                percentHeight : lfnAttribute(loElement, "percentHeight") || 0,
                definedWidth : parseFloat(lfnAttribute(loElement, "width")) || 0,
                definedHeight : parseFloat(lfnAttribute(loElement, "height")) || 0
            };
        this.m_oLayoutParameters.append(new goliath.property(toControl, loValue));
        return loValue;
    }
}

/**
 * Gets the default layout manager.
 */
goliath.controls.layout.LayoutManager.getDefaultManager = function()
{
    if (goliath.controls.layout.LayoutManager.g_oDefaultManager == null)
    {
        goliath.controls.layout.LayoutManager.g_oDefaultManager = new goliath.controls.layout.BasicLayoutManager();
    }
    return goliath.controls.layout.LayoutManager.g_oDefaultManager;
}



/****************************************************
 * Definition of the basic layout manager
 * --------------------------------------------------
 * The basic layout manager works only on the control
 * specified, it does not navigate on the chain
 ****************************************************/
goliath.controls.layout.BasicLayoutManager = (function()
{
    return function()
    {
        // Make sure the constructor is called
        goliath.controls.layout.BasicLayoutManager.superclass.constructor.call(this);
    };
})();

// TODO: Implement participate in layout property for controls
goliath.controls.layout.BasicLayoutManager.prototype =
{
    layout : function(toControl)
    {
        var loConstraint = this.getLayoutAttributes(toControl);

        var loNewSize = toControl.getSize();
        var lnOWidth = loNewSize.width;
        var lnOHeight = loNewSize.height;

        // Start with the defined size
        if (loConstraint.definedWidth > 0 || loConstraint.definedHeight > 0)
        {
            loNewSize.width = loConstraint.definedWidth || loNewSize.width;
            loNewSize.height = loConstraint.definedHeight || loNewSize.height;
        }

        // Layout the percents if given
        if (loConstraint.percentWidth > 0 || loConstraint.percentHeight > 0)
        {
            var loParentControl = toControl.getParent();

            var loParentSize = (loParentControl != null) ?
                loParentControl.getSize() :
                (toControl.getElement().parentNode == document.body) ?
                    goliath.browser.getClientSize() :
                    goliath.utilities.Style.getSize(toControl.getElement().parentNode);

            loNewSize.width = loParentSize.width * loConstraint.percentWidth || loNewSize.width;
            loNewSize.height = loParentSize.height * loConstraint.percentHeight || loNewSize.height;
        }

        // Finally check if there is a min or max size defined to ensure that even if nothing else was
        // set then we will still be the min/max  size

        if (loConstraint.maxWidth < loNewSize.width ||
            loConstraint.minWidth > loNewSize.width ||
            loConstraint.maxHeight < loNewSize.height ||
            loConstraint.minHeight > loNewSize.height)
        {
            loNewSize.width = Math.min(loConstraint.maxWidth, loNewSize.width);
            loNewSize.height = Math.min(loConstraint.maxHeight, loNewSize.height);
            loNewSize.width = Math.max(loConstraint.minWidth, loNewSize.width);
            loNewSize.height = Math.max(loConstraint.minHeight, loNewSize.height);
        }

        // Only update if needed
        if (lnOWidth != loNewSize.width || lnOHeight != loNewSize.height)
        {
            this.setSize(toControl, loNewSize);
        }
    }
}
// Container extends control
goliath.utilities.extend(goliath.controls.layout.BasicLayoutManager, goliath.controls.layout.LayoutManager);