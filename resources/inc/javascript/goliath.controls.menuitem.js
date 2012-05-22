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
goliath.controls.menuitem = function(){};

goliath.controls.menuitem.onmouseover=function(toElement)
{
    toElement = $(toElement);
    
    // highlight this item.
    goliath.utilities.highlightObject(toElement);
    
    // if there are any menupads below this item, make sure they are shown
    var laMenuPad = goliath.utilities.getElementsByClassName("menuPad", toElement, null, 1);
    if (laMenuPad.length > 0)
    {
        var loMenuPad = laMenuPad[0];
        helper.setCssProperty(loMenuPad, "display", "block");
        if (goliath.controls.menuitem.isOnPad(toElement))
        {
            helper.setCssProperty(loMenuPad, "margin", "0 0 0 3em");    
        }
    }
}
    
goliath.controls.menuitem.onmouseout=function(toElement)
{
    toElement = $(toElement);

    // unhighlight this item.
    goliath.utilities.unHighlightObject(toElement);
    
    // if there are any menupads below this item, make sure they are hidden
    var laMenuPad = goliath.utilities.getElementsByClassName("menuPad", toElement, null, 1);
    if (laMenuPad.length > 0)
    {
        var loMenuPad = laMenuPad[0];
        helper.setCssProperty(loMenuPad, "display", "none");
    }
    
}

goliath.controls.menuitem.isOnPad=function(toElement)
{
    toElement = $(toElement);
    return (toElement.parentNode != null && toElement.parentNode.parentNode != null && goliath.utilities.hasClass(toElement.parentNode.parentNode, "menuPad"));
}

