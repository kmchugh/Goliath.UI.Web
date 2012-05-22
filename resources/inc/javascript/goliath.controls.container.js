goliath.namespace('goliath.controls');

// Constructor method for the calendar
goliath.controls.Container = (function()
{
    //-------------------------------
    // Private member variables
    //-------------------------------


    //-------------------------------
    // Private member functions
    //-------------------------------


    //-------------------------------
    // Returned constructor
    //-------------------------------
    return function(toElement, toOptions)
    {
        var m_oLayoutManager = null;


        // Make sure the constructor is called
        goliath.controls.Container.superclass.constructor.call(this, toElement, toOptions);



        //-------------------------------
        // member variables
        //-------------------------------


        //-------------------------------
        // member functions
        //-------------------------------
        this.getLayoutManager = function()
        {
            if (m_oLayoutManager == null)
            {
                // Check if there is a layout manager element
                var laManagers = goliath.utilities.DOM.getElementsByTagName("layoutManager", this.getElement());
                if (laManagers.length > 0)
                {
                    var laManagerType = laManagers[0].getAttribute("type");
                    try
                    {
                        m_oLayoutManager = eval("new " + laManagerType + "()");
                    }
                    catch (ex)
                    {}
                }
                if (m_oLayoutManager == null)
                {
                    m_oLayoutManager = goliath.controls.layout.LayoutManager.getDefaultManager();
                }
            }
            return m_oLayoutManager;
        }

        this.setLayoutManger = function(toManager){this.m_oLayoutManager = toManager};
    };

})();



goliath.controls.Container.prototype =
{
    render : function() {this.layout();},
    layout : function() {this.getLayoutManager().layout(this);}

}

// Container extends control
goliath.utilities.extend(goliath.controls.Container, goliath.controls.Control);



// A group is the most basic of containers
goliath.controls.Group=(function()
{
    return function(toElement, toOptions)
    {
        goliath.controls.Group.superclass.constructor.call(this, toElement, toOptions);

        this.addObserverDecorator();
    }
})();
goliath.browser.registerInitFunction('goliath-group', goliath.controls.Group);
goliath.utilities.extend(goliath.controls.Group, goliath.controls.Container);