goliath.Browser.loadModule("goliath.controls.consoleFrame");

/*====================================
Base classs for console frame plugins
====================================*/
goliath.namespace('goliath.controls.consoleFrame.tools');

// Constructor method
goliath.controls.consoleFrame.tools.Base=function(toElement)
{
    goliath.controls.consoleFrame.tools.Base.superclass.constructor.call(this, toElement);

    this.addObserverDecorator();
    this.observeMouseEvents();
}
goliath.Browser.onObjectReady({result: function(){return goliath.controls && goliath.controls.consoleFrame}},
        function()
        {
            // Make sure this object inherits from the control base
            goliath.utilities.extend(goliath.controls.consoleFrame.tools.Base, goliath.controls.Control);
            alert('extended');
        });

goliath.controls.consoleFrame.tools.create = function(toConstructor)
{
    if (typeof toCallback.superclass == 'undefined')
    {
        // Make sure this object inherits from the tool base
        goliath.utilities.extend(toConstructor, goliath.controls.consoleFrame.tools.Base);
    }

    // Get a reference to the console.
    var loConsole = goliath.utilities.DOM.getElementsByClassName('goliath-consoleFrame');
    loConsole = (loConsole.length > 0) ? loConsole[0]._control : null;

    var loButton = goliath.createElement("button");
    loConsole.addTool(new toConstructor(loButton));
}