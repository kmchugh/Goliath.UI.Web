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
goliath.controls.grid = function(){};

goliath.controls.grid.initialise=function(toID)
{
    var loControl = new goliath.controls.grid.Grid($(toID));
    loControl.executeServerCommand("onload");
}

goliath.controls.grid.Grid=function(toElement)
{
    goliath.controls.grid.Grid.superclass.constructor.call(this, toElement);
    
}
goliath.utilities.extend(goliath.controls.grid.Grid, goliath.controls.Control);


goliath.controls.grid.Grid.prototype.getContent=function()
{
    var loElement = goliath.utilities.getElementsByClassName("gridContent", this.getElement())[0];
    if (loElement.childNodes.length == 0)
    {
        loElement.appendChild(document.createElement("div"));
    }
    return loElement.childNodes[0];    
}