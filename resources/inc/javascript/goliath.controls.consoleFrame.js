goliath.Browser.loadModule('goliath.controls');

goliath.namespace('goliath.controls');

// Constructor method for the calendar
goliath.controls.ConsoleFrame=function(toElement)
{
    goliath.controls.ConsoleFrame.superclass.constructor.call(this, toElement);

    this.addObserverDecorator();
}
goliath.Browser.registerInitFunction('goliath-consoleFrame', goliath.controls.ConsoleFrame);

goliath.controls.ConsoleFrame.prototype =
    {
        m_oCommandFrame: null,
        m_oPropertyFrame: null,
        m_oViewport: null,
        m_oActionFrame: null,

        m_nDefaultCommandWidth: 60,
        m_nDefaultPropertyFrameWidth: 200,
        m_nDefaultActionFrameHeight: 200,

        render: function()
        {
            this.setLocation({x: 0, y: 0});
            this.setSize({ width: goliath.Browser.getClientWidth(), height: goliath.Browser.getClientHeight()});

            // Create the command area
            this.m_oCommandFrame = this.createCommandFrame()._control;
            this.m_oPropertyFrame = this.createPropertyFrame()._control;
            this.m_oViewport = this.createViewport()._control;
            this.m_oActionFrame = this.createActionFrame()._control;

            this.appendChild(this.m_oCommandFrame.getElement());
            this.appendChild(this.m_oViewport.getElement());
            this.appendChild(this.m_oActionFrame.getElement());
            this.appendChild(this.m_oPropertyFrame.getElement());
        },
        onHTMLRendered: function()
        {
        },
        createCommandFrame: function()
        {
            var loFrame = goliath.createElement('div');
            goliath.controls.initialise("goliath-panel consoleFrame-Command", loFrame, goliath.controls.Panel);
            var loControl = loFrame._control;

            loControl.setSizeConstraints({maxWidth: this.m_nDefaultCommandWidth, minWidth: this.m_nDefaultCommandWidth});
            loControl.setSize({width: this.m_nDefaultCommandWidth, height: goliath.Browser.getClientHeight()});
            loControl.setLocation({x: 0, y: 0});
            return loFrame;
        },
        createViewport: function()
        {
            var loFrame = goliath.createElement('div');
            goliath.controls.initialise("goliath-panel consoleFrame-ViewPort", loFrame, goliath.controls.Panel);

            var loControl = loFrame._control;

            loControl.setSize(
                {width: goliath.Browser.getClientWidth() - this.m_nDefaultCommandWidth - this.m_nDefaultPropertyFrameWidth,
                 height: goliath.Browser.getClientHeight() - this.m_nDefaultActionFrameHeight});

            loControl.setLocation({x: this.m_nDefaultCommandWidth, y: 0});

            return loFrame;
        },
        createPropertyFrame: function()
        {
            var loFrame = goliath.createElement('div');
            goliath.controls.initialise("goliath-panel consoleFrame-Property", loFrame, goliath.controls.Panel);

            var loControl = loFrame._control;

            loControl.setSizeConstraints({maxWidth: this.m_nDefaultPropertyFrameWidth, minWidth: this.m_nDefaultPropertyFrameWidth});
            loControl.setSize({width: this.m_nDefaultPropertyFrameWidth, height: goliath.Browser.getClientHeight()});

            loControl.setLocation({x: goliath.Browser.getClientWidth() - this.m_nDefaultPropertyFrameWidth, y: 0});


            return loFrame;
        },
        createActionFrame: function()
        {
            var loFrame = goliath.createElement('div');
            goliath.controls.initialise("goliath-panel consoleFrame-Action", loFrame, goliath.controls.Panel);

            var loControl = loFrame._control;

            loControl.setSize(
                {width: goliath.Browser.getClientWidth() - this.m_nDefaultCommandWidth - this.m_nDefaultPropertyFrameWidth,
                 height: this.m_nDefaultActionFrameHeight});

             loControl.setLocation({x: this.m_nDefaultCommandWidth, y: goliath.Browser.getClientHeight() - this.m_nDefaultActionFrameHeight});

            return loFrame;
        },
        loadPlugin: function(tcScript)
        {
            goliath.Browser.loadModule(tcScript);
        },
        addTool: function(toTool)
        {
            alert(toTool);
        }
    }
