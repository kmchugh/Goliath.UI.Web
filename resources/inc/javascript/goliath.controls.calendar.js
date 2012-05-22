/*====================================
Calendar date time picker for Javascript
====================================*/

goliath.namespace('goliath.controls');

// Constructor method for the calendar
goliath.controls.Calendar=function(toElement)
{
    goliath.controls.Calendar.superclass.constructor.call(this, toElement);

    this.addObserverDecorator();
    this.observeMouseEvents();
}


goliath.controls.Calendar.prototype =
{
    m_oCalendarButton: null,
    m_oInputControl : null,
    m_oCalendarControl : null,
    m_dDisplayMonth : null,

    m_oStrings:
        {
            days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            months: ["January", "February", "March", "April", "May", "June", "July", "August",
                    "September", "October", "November", "December"],
            previous: '<<',
            next: '>>'
        },


    onInitialise : function()
    {
        // Call the super function
        goliath.controls.Calendar.superclass.onInitialise.call(this);
    },

    onReady : function()
    {
        // Call the super function
        goliath.controls.Calendar.superclass.onReady.call(this);
    },

    onHTMLRendered : function()
    {
        // Make sure there is a calendar selection button
        this.getInputControl();
        this.getCalendarButton();



        // Make sure there is a text input area

//        alert("in the on html rendered event");

        // Call the super function
        goliath.controls.Calendar.superclass.onHTMLRendered.call(this);
    },

    onMouseClick : function(toEvent)
    {
        var loTargetCalendar = goliath.controls.getControl(toEvent.target);
        if (toEvent.target == loTargetCalendar.getCalendarButton())
        {
            this.updateCalendarControl();
            var loCalendarControl = this.getCalendarControl();
            document.body.appendChild(loCalendarControl);
            goliath.utilities.Style.setLocation(loCalendarControl, {x: 20, y: 60});
        }
    },

    onValueChanged : function()
    {
        var ldDate = this.getValue();

        if (ldDate != null)
        {
            this.m_dDisplayMonth = ldDate;
        }

        this.getInputControl().value = (ldDate == null) ? "" : ldDate.format("{dd} {mmm} {yyyy}",
                    this.getDayName(ldDate.getDay()),
                    this.getMonthName(ldDate.getMonth()));

        // Call the super function
        goliath.controls.Calendar.superclass.onValueChanged.call(this);
    },

    onEnabledChanged : function()
    {
        alert("in the on enabled changed event");

        // Call the super function
        goliath.controls.Calendar.superclass.onEnabledChanged.call(this);
    },

    getString: function(){return this.m_oStrings;},
    setString: function(toStrings){goliath.utilities.mergeObjects(this.m_oStrings, toStrings);},
    getDayName : function(tnDay){return this.getString().days[tnDay]},
    getMonthName : function(tnMonth){return this.getString().months[tnMonth]},
    getStartOfFirstWeek: function(tdDate)
    {
        var loDate = tdDate.copy();
        loDate.setDate(1);
        loDate.setDate(1 - loDate.getDay());
        return loDate;
    },
    getEndOfLastWeek: function(tdDate)
    {
        var loDate = tdDate.copy();
        loDate.setDate(1);
        loDate.add({month: 1});
        loDate.setDate(loDate.getDate()-1);
        loDate.add({day: (6- loDate.getDay())});
        return loDate;
    },

    /**
     * Gets the button for opening calendar selection, if the button does not exist, this will create it
     */
    getCalendarButton : function()
    {
        if (this.m_oCalendarButton == null)
        {
            // Try to look for the button in the node
            var laButtons = goliath.utilities.DOM.getElementsByTagName("button", this.getElement());
            if (laButtons.length == 1)
            {
                // The button already exists, so just store it
                this.m_oCalendarButton = laButtons[0];
            }
            else
            {
                // The button does not exist, so we need to create it
                this.m_oCalendarButton = goliath.createElement("button");
                goliath.utilities.DOM.append(this.getElement(), this.m_oCalendarButton);
            }
            this.m_oCalendarButton.innerHTML = "...";
            goliath.utilities.Style.setSize(this.m_oCalendarButton, {width: 25, height: 25});
            this.setValue(new Date());
        }
        return this.m_oCalendarButton;
    },

    /**
     * Gets the input text area for the calendar, if it doesn't exist, it will be created here
     */
    getInputControl : function()
    {
        if (this.m_oInputControl == null)
        {
            // Try to look for the button in the node
            var laInputs = goliath.utilities.DOM.getElementsByTagName("input", this.getElement());
            if (laInputs.length == 1)
            {
                // The button already exists, so just store it
                this.m_oInputControl = laInputs[0];
            }
            else
            {
                // The button does not exist, so we need to create it
                this.m_oInputControl = goliath.createElement("input");
                this.m_oInputControl.type = "text";
                goliath.utilities.DOM.append(this.getElement(), this.m_oInputControl);
            }
        }
        return this.m_oInputControl;
    },

    /**
     * Gets the calendar selection control, if it does not already exist, it will be created here
     */
    getCalendarControl : function()
    {
        if (this.m_oCalendarControl == null)
        {
            var loTable = goliath.createElement('table');
            goliath.utilities.Style.addClass(loTable, "goliath-calendar-view")
            loTable.cellpadding = "0";

            var loHeader = goliath.createElement('thead');
            var loTR = goliath.createElement('tr');
            for (var i=0; i<7; i++)
            {
                var loTH = goliath.createElement('th');
                loTH.title = this.getDayName(i);
                loTH.innerHTML = this.getDayName(i).substr(0, 3);
                loTR.appendChild(loTH);
            }
            loHeader.appendChild(loTR);

            var loBody = goliath.createElement('tbody');

            loTable.appendChild(loHeader);
            loTable.appendChild(loBody);

            this.m_oCalendarControl = loTable;
        }
        return this.m_oCalendarControl;
    },

    /**
     * Draws the contents of the calendar control based on the selected month and year
     */
    updateCalendarControl : function()
    {
        var loCalendarControl = this.getCalendarControl();
        var loBody = goliath.utilities.DOM.getElementsByTagName("tbody", loCalendarControl)[0];

        var ldDisplayMonth = this.m_dDisplayMonth;
        var ldDisplay = this.getStartOfFirstWeek(ldDisplayMonth);
        var ldSelectedDate = this.getValue();

        var loTR;

        goliath.utilities.DOM.clear(loBody);

        for(i=0; i<6; i++)
        {
            loTR = goliath.createElement('tr');

            for(var j=0; j<7; j++)
            {
                var llIsCurrentMonth = ldDisplayMonth.sameMonth(ldDisplay);

                var llIsSelectedDate = ldSelectedDate.match(ldDisplay);

                var loTD = goliath.createElement('td');
                loTD.title = ldDisplay.format("{dddd} {d} {mmmm} {yyyy}",
                    this.getDayName(ldDisplay.getDay()),
                    this.getMonthName(ldDisplay.getMonth()));

                loTD.className = llIsSelectedDate ?
                    (llIsCurrentMonth ? "selected" : "selected otherMonth")
                    : (llIsCurrentMonth ? "currentMonth" : "otherMonth");

                var loA = goliath.createElement('a');
                loA.className = ldDisplay.format("btnDay day-{d}", this.getDayName(ldDisplay.getDay()), "");
                loA.setAttribute("datetime", ldDisplay.format("{tttt}", "", ""));
                loA.innerHTML = ldDisplay.format("{d}", "", "");

                loTD.appendChild(loA);
                loTR.appendChild(loTD);

                ldDisplay.add({days: 1});
            }

            loBody.appendChild(loTR);
        }
    }


};
goliath.utilities.extend(goliath.controls.Calendar, goliath.controls.Control);
goliath.browser.registerInitFunction('goliath-calendar', goliath.controls.Calendar);




/*

goliath.controls.Calendar.eventType =
    {
        INCREMENT_DISPLAY_MONTH: "INCREMENT_DISPLAY_MONTH",
        DECREMENT_DISPLAY_MONTH: "DECREMENT_DISPLAY_MONTH",
        MONTH_CHANGED: "MONTH_CHANGED",
        DATE_SELECTED: "DATE_SELECTED"
    }

goliath.controls.Calendar.prototype =
    {
        _selectedDate: null,
        _displayMonth: null,


        getDisplayMonth: function(){return this._displayMonth.copy();},
        setDisplayMonth: function(tdDate)
        {
            this._displayMonth = (tdDate) ? tdDate.copy() : new Date();
            this._displayMonth.setDate(1);
        },
        getSelectedDate: function(){return this._selectedDate.copy();},
        setSelectedDate: function(tdDate){this._selectedDate = (tdDate) ? tdDate.copy() : new Date();},


        incrementDisplayMonth: function()
        {
            this.setDisplayMonth(this.getDisplayMonth().add({months: 1}));

            this.fire(goliath.controls.Calendar.eventType.MONTH_CHANGED,
                {
                    displayMonth: this.getDisplayMonth(),
                    selectedDate: this.getSelectedDate()
                });
        },

        decrementDisplayMonth: function()
        {
            this.setDisplayMonth(this.getDisplayMonth().add({months: -1}));

            this.fire(goliath.controls.Calendar.eventType.MONTH_CHANGED,
                {
                    displayMonth: this.getDisplayMonth(),
                    selectedDate: this.getSelectedDate()
                });
        },
        addObservers: function()
        {
            var loSelf = this;
            var loCalEvents = goliath.controls.Calendar.eventType;

            this.listen(loCalEvents.INCREMENT_DISPLAY_MONTH, function()
                {
                    loSelf.incrementDisplayMonth();
                });

            this.listen(loCalEvents.DECREMENT_DISPLAY_MONTH, function()
                {
                    loSelf.decrementDisplayMonth();
                });

            this.listen(loCalEvents.DATE_SELECTED, function(tdSelectedDate)
                {
                    loSelf.setSelectedDate(tdSelectedDate);
                    loSelf.setDisplayMonth(tdSelectedDate);
                });

            this.listen(loCalEvents.MONTH_CHANGED, function(tdSelectedDate)
                {
                    loSelf.render();
                });
            this.listen(loCalEvents.DATE_SELECTED, function(tdSelectedDate)
                {
                    loSelf.setSelectedDate(tdSelectedDate);
                    loSelf.render();
                });
        },
        getStartOfFirstWeek: function(tdDate)
        {
            var loDate = tdDate.copy();
            loDate.setDate(1);
            loDate.setDate(1 - loDate.getDay());
            return loDate;
        },
        getEndOfLastWeek: function(tdDate)
        {
            var loDate = tdDate.copy();
            loDate.setDate(1);
            loDate.add({month: 1});
            loDate.setDate(loDate.getDate()-1);
            loDate.add({day: (6- loDate.getDay())});
            return loDate;
        },
        render: function()
        {
            var loMiniDom = document.createDocumentFragment();
            loMiniDom.appendChild(this.getHeadingElement());
            loMiniDom.appendChild(this.getNavigatorElement());
            loMiniDom.appendChild(this.getCalendarElement());

            this._element.innerHTML = "";

            this._element.appendChild(loMiniDom.cloneNode(true));
        },
        getHeadingElement: function()
        {
            var loP = goliath.createElement('p');
            loP.innerHTML = this.getDisplayMonth().format("{mmmm} {yyyy}", "", this.getMonthName(this._displayMonth.getMonth()));
            return loP;
        },
        getNavigatorElement: function()
        {
            var loUL = goliath.createElement('ul');
            var loStyle = goliath.utilities.Style;

            var loPrev = goliath.createElement('li');
            loStyle.addClass(loPrev, 'previous');
            var loPrevLnk = goliath.createElement('a');
            loStyle.addClass(loPrevLnk, 'btnPrevious');
            loPrevLnk.title = this.getStrings().previous;
            loPrevLnk.innerHTML = loPrevLnk.title;
            loPrev.appendChild(loPrevLnk);

            var loNext = goliath.createElement('li');
            loStyle.addClass(loNext, 'next');
            var loNextLnk = goliath.createElement('a');
            loStyle.addClass(loNextLnk, 'btnNext');
            loNextLnk.title = this.getStrings().next;
            loNextLnk.innerHTML = loNextLnk.title;
            loNext.appendChild(loNextLnk);

            loUL.appendChild(loPrev);
            loUL.appendChild(loNext);

            return loUL;
        },
        getCalendarElement:function()
        {
            var ldDisplayMonth = this.getDisplayMonth();
            var ldSelectedDate = this.getSelectedDate();

            var ldDisplay = this.getStartOfFirstWeek(ldDisplayMonth);

            var loTable = goliath.createElement('table');
            loTable.cellpadding = "0";

            var loHeader = goliath.createElement('thead');
            var loTR = goliath.createElement('tr');
            for (var i=0; i<7; i++)
            {
                var loTH = goliath.createElement('th');
                loTH.title = this.getDayName(i);
                loTH.innerHTML = this.getDayName(i).substr(0, 3);
                loTR.appendChild(loTH);
            }
            loHeader.appendChild(loTR);

            var loBody = goliath.createElement('tbody');

            for(i=0; i<6; i++)
            {
                loTR = goliath.createElement('tr');

                for(var j=0; j<7; j++)
                {
                    var llIsCurrentMonth = ldDisplayMonth.sameMonth(ldDisplay);

                    var llIsSelectedDate = ldSelectedDate.match(ldDisplay);

                    var loTD = goliath.createElement('td');
                    loTD.title = ldDisplay.format("{dddd} {d} {mmmm} {yyyy}",
                        this.getDayName(ldDisplay.getDay()),
                        this.getMonthName(ldDisplay.getMonth()));

                    loTD.className = llIsSelectedDate ?
                        (llIsCurrentMonth ? "selected" : "selected otherMonth")
                        : (llIsCurrentMonth ? "currentMonth" : "otherMonth");

                    var loA = goliath.createElement('a');
                    loA.className = ldDisplay.format("btnDay day-{d}", this.getDayName(ldDisplay.getDay()), "");
                    loA.setAttribute("datetime", ldDisplay.format("{tttt}", "", ""));
                    loA.innerHTML = ldDisplay.format("{d}", "", "");

                    loTD.appendChild(loA);
                    loTR.appendChild(loTD);

                    ldDisplay.add({days: 1});
                }
                loBody.appendChild(loTR);
            }



            loTable.appendChild(loHeader);
            loTable.appendChild(loBody);

            return loTable;
        },
        onClick: function(toEvent)
        {
            var loStyle = goliath.utilities.Style;
            var loCalEvents = goliath.controls.Calendar.eventType;

            if (loStyle.hasClass(toEvent.target, "btnPrevious"))
            {
                this.fire(loCalEvents.DECREMENT_DISPLAY_MONTH);
            }
            else if (loStyle.hasClass(toEvent.target, "btnNext"))
            {
                this.fire(loCalEvents.INCREMENT_DISPLAY_MONTH);
            }
            else if (loStyle.hasClass(toEvent.target, "btnDay"))
            {
                var loDate = new Date();
                loDate.setTime(toEvent.target.getAttribute("datetime"));
                this.fire(loCalEvents.DATE_SELECTED, loDate);
            }
        },
    }

    */





