goliath.Browser.loadModule("goliath.controls");

/*====================================
Control base classes and functions for Javascript
====================================*/
goliath.namespace('goliath.controls');

goliath.controls.Shapeslider = function(toElement, toOptions)
{
    goliath.controls.Shapeslider.superclass.constructor.call(this, toElement);

    this._options = (toOptions) ? toOptions : {};
    goliath.utilities.update(this._options, this._defaultOptions);

    this.addObserverDecorator();
};
goliath.Browser.registerInitFunction('goliath-shapeSlider', goliath.controls.Shapeslider);

goliath.controls.Shapeslider.eventType =
{
    HANDLE_MOVED: "HANDLE_MOVED",
    MOVE: "MOVE"
}

// Gets the calendar items in the document and creates them
goliath.controls.Shapeslider.initialise=function(toElement, toOptions)
{
    goliath.Browser.onObjectReady({ result: function(){return goliath.controls.initialise;}},
    function()
    {
        goliath.controls.initialise('goliath-shapeSlider', toElement, goliath.controls.Shapeslider, toOptions);
    });
}

goliath.controls.Shapeslider.prototype =
    {
        _imgPointer: null,
        _shape: null,
        _valueLabelsContainer: null,
        _mouseIsDown: false,
        _rangeElement: null,

        _map: null,
        _options: null,

        _defaultOptions:
            {
                backgroundImage: '/resources/images/CELogo.png',
                pointerImage: '/resources/images/info.png',
                pointerWidth: 50,
                pointerHeight: 50,
                minHeight: 25,
                minWidth: 200,
                maxHeight: 45,
                maxWidth: 400,
                valueLabels: [],
                showValueLabels: false,
                xValueRange: 0,
                minXValue:0,
                maxXValue:100,
                yValueRange: 0,
                minYValue:0,
                maxYValue:100,
                pointerValueXAlign: 25,
                pointerValueYAlign: 25,
                useYAxis: false,
                useXAxis: true,
                xOffset: 0,
                yOffset:0
            },
        addObservers: function()
        {
            var loSelf = this;
            var loEvents = goliath.controls.eventType;
            var loSliderEvents = goliath.controls.Shapeslider.eventType;

            this.listen(loSliderEvents.HANDLE_MOVED, function()
                {
                    loSelf.fire(loEvents.VALUE_CHANGED);
                });

            this.listen(loSliderEvents.MOVE, function()
                {
                    loSelf.fire(loEvents.VALUE_CHANGED);
                });
        },
        createContents:function()
        {
            var loContainer = this.getShapeElement();

            if (this._options.showValueLabels)
            {
                var loLabels = goliath.createElement("div");
                this._valueLabelsContainer = loLabels;
                goliath.utilities.Style.setStyleValue(loLabels, "position", "relative");
                goliath.utilities.Style.addClass(loLabels, "labels");

                for (var i=0, lnLength = this._options.valueLabels.length; i < lnLength; i++)
                {
                    var loLabel = goliath.createElement("div");
                    loLabel.className = "label";
                    loLabel.innerHTML = this._options.valueLabels[i];
                    loLabels.appendChild(loLabel);
                }
            }

            var loHandle = this.getPointerElement();

            var loHandleRange = this.getRangeElement();
            var lnHeight = Math.min(goliath.utilities.DOM.getHeight(this._element), this._options.maxHeight);
            lnHeight = Math.max(lnHeight, this._options.minHeight);

            var lnWidth = Math.min(goliath.utilities.DOM.getWidth(this._element), this._options.maxWidth);
            lnWidth = Math.max(lnWidth, this._options.minWidth);

            goliath.utilities.DOM.setHeight(loHandleRange, lnHeight);
            goliath.utilities.DOM.setWidth(loHandleRange, lnWidth);

            loHandleRange.appendChild(loHandle);

            loContainer.appendChild(loHandleRange);

            return loContainer;
        },
        positionLabels: function()
        {
            if (this.getValueLabelsContainer() == null)
            {
                return;
            }
            var loDOM = goliath.utilities.DOM;
            var loStyle = goliath.utilities.Style;
            var lnContainerWidth = loDOM.getWidth(this.getValueLabelsContainer());
            var laLabels = loDOM.getElementsByClassName("label", this.getShapeElement());

            var lnDefault = Math.round(lnContainerWidth/laLabels.length);

            for (var i=0, lnLength = laLabels.length; i<lnLength; i++)
            {
                loStyle.setStyleValue(laLabels[i], "position", "absolute");
                var lnWidth = parseInt(loDOM.getWidth(laLabels[i]));
                if (isNaN(lnWidth))
                {
                        lnWidth = lnDefault;
                }

                var lnHalfWidth = Math.round(lnWidth/2);
                var lnProportion = i/(laLabels.length -1);
                var lnPos = (Math.round(lnProportion * lnContainerWidth) - lnHalfWidth);

                loDOM.setWidth(lnWidth);
                loDOM.setX(lnPos);
            }
        },
        setHandleXPercent:function(tnPercent)
        {
            var loDOM = goliath.utilities.DOM;
            var loPointer = this.getPointerElement();
            var loShapeRange = this.getRangeElement();
            if (!this._options.useYAxis)
            {
                // because we are not allowing dragging on the Y axis, just make sure it is set up right
                loDOM.setY(loPointer, (loDOM.getHeight(loShapeRange)/2) - this._options.pointerValueYAlign);
            }

            // Because the pointer can be different sizes, we need to remove an amount from the percentage
            var lnAdjust = this._options.pointerValueYAlign / loDOM.getWidth(loShapeRange) * 100;
            loDOM.setX(loPointer, tnPercent - lnAdjust, "%");
        },
        setHandleYPercent:function(tnPercent)
        {
            var loDOM = goliath.utilities.DOM;
            var loPointer = this.getPointerElement();
            var loShapeRange = this.getRangeElement();
            if (!this._options.useXAxis)
            {
                // because we are not allowing dragging on the X axis, just make sure it is set up right
                loDOM.setX(loPointer, (loDOM.getWidth(loShapeRange)/2) - this._options.pointerValueXAlign);
            }

            // Because the pointer can be different sizes, we need to remove an amount from the percentage
            var lnAdjust = this._options.pointerValueXAlign / loDOM.getHeight(loShapeRange) * 100;
            loDOM.setY(loPointer, tnPercent - lnAdjust, "%");
        },
        setHandleX:function(tnIndex)
        {
            var lnPercent = (tnIndex/this._options.xValueRange)* 100;
            this.setHandleXPercent(lnPercent);
        },
        setHandleY:function(tnIndex)
        {
            var lnPercent = (tnIndex/this._options.yValueRange)* 100;
            this.setHandleYPercent(lnPercent);
        },
        render:function()
        {
            var loContainer = this.createContents();

            // Make sure the slider element is actually in the dom
            if (loContainer.parentNode != this._element)
            {
               this._element.appendChild(loContainer);
            }
        },
        getValueLabelsContiner:function()
        {
            return this._valueLabelsContainer;
        },
        getRangeElement:function()
        {
            if (this._rangeElement == null)
            {
                this._rangeElement = goliath.createElement("div");
                goliath.utilities.Style.addClass(this._rangeElement, "pointerRange");
                goliath.utilities.Style.setStyleValue(this._rangeElement, "position", "relative");

                var loShapeImage = goliath.createElement("img");
                goliath.utilities.Style.addClass(loShapeImage, "shapeImage");
                loShapeImage.src = this._options.backgroundImage;
                this._rangeElement.appendChild(loShapeImage);
            }
            return this._rangeElement;
        },
        getShapeElement:function()
        {
            // Create the background if needed
            if (this._shape == null)
            {
                this._shape = goliath.utilities.DOM.getElementsByClassName("shape", this._element);
                this._shape = (this._shape.length == 0) ? goliath.createElement('div') : this._shape[0];
                goliath.utilities.Style.addClass(this._shape, "shape");
            }
            return this._shape;
        },
        getPointerElement:function()
        {
            // Create the background if needed
            if (this._imgPointer == null)
            {
                this._imgPointer = goliath.utilities.DOM.getElementsByClassName("pointer", this._element);
                this._imgPointer = (this._imgPointer.length == 0) ? goliath.createElement('div') : this._imgPointer[0];
                goliath.utilities.Style.addClass(this._imgPointer, "pointer");
                goliath.utilities.Style.setStyleValue(this._imgPointer, "position", "absolute");
                goliath.utilities.Style.setStyleValue(this._imgPointer, "background", "transparent url('" + this._options.pointerImage +  "') no-repeat center center");
                goliath.utilities.DOM.setHeight(this._imgPointer, this._options.pointerHeight);
                goliath.utilities.DOM.setWidth(this._imgPointer, this._options.pointerWidth);
            }
            return this._imgPointer;
        },
        onHTMLRendered:function()
        {
            var loSelf = this;
            goliath.eventListener.add(this.getPointerElement(),
                    function(toEvent)
                    {
                        loSelf.onMouseDown(toEvent);
                    },
                    "mousedown");
            goliath.eventListener.add(this.getPointerElement(),
                    function(toEvent)
                    {
                        loSelf.onMouseUp(toEvent);
                    },
                    "mouseup");
            goliath.eventListener.add(this.getPointerElement(),
                    function(toEvent)
                    {
                        loSelf.onMouseMove(toEvent);
                    },
                    "mousemove");
            goliath.eventListener.add(this.getPointerElement(),
                    function(toEvent)
                    {
                        loSelf.onMouseOut(toEvent);
                    },
                    "mouseout");

            // Center the image both horizontally and vertically
            goliath.utilities.Style.setStyleValue(this.getShapeElement(), "margin", "" + this._options.yOffset + "px 0 0 " + this._options.xOffset + "px");


            this.fire(goliath.controls.eventType.VALUE_CHANGED);


        },
        onMouseDown: function(toEvent)
        {
            toEvent.preventDefault();
            this._mouseIsDown = true;
            this.onDrag(toEvent);
        },
        onMouseUp: function(toEvent)
        {
            this._mouseIsDown = false;
        },
        onMouseOut: function(toEvent)
        {
            this._mouseIsDown = false;
        },
        onMouseMove: function(toEvent)
        {
            if (this._mouseIsDown)
            {
                this.onDrag(toEvent);
            }
        },
        onDrag:function(toEvent)
        {
            var loDOM = goliath.utilities.DOM;
            var loRange = this.getRangeElement();

            var loPage = goliath.utilities.DOM.getElementsByClassName('page', $('pageHolder'))[0];

            //var lnXScroll = goliath.utilities.DOM.getHorizontalScroll(document.body.);
            //var lnYScroll = goliath.utilities.DOM.getVerticalScroll(loPage);
            var lnPageXScroll = goliath.utilities.DOM.getHorizontalScroll(loPage);
            var lnPageYScroll = goliath.utilities.DOM.getVerticalScroll(loPage);

            if (typeof(lnPageXScroll) == 'undefined')
            {
                lnPageXScroll = 0;
            }
            if (typeof(lnPageYScroll) == 'undefined')
            {
                lnPageYScroll = 0;
            }



            var lnXPercent = 50;
            if (this._options.useXAxis)
            {
                lnXPercent = (((toEvent.pageX + lnPageXScroll )- loDOM.getPageX(loRange))/ loDOM.getWidth(loRange)) * 100;
                if (lnXPercent < 0)
                {
                    lnXPercent = 0;
                }
                if (lnXPercent >100)
                {
                    lnXPercent = 100;
                }
            }

            var lnYPercent = 50;
            if (this._options.useYAxis)
            {
                lnYPercent = (((toEvent.pageY + lnPageYScroll) - loDOM.getPageY(loRange))/ loDOM.getHeight(loRange)) * 100;
                if (lnYPercent < 0)
                {
                    lnYPercent = 0;
                }
                if (lnYPercent >100)
                {
                    lnYPercent = 100;
                }
            }

            this.setValue([lnXPercent, lnYPercent]);
        },
        onValueChanged:function()
        {
            var loValue = this.getValue();
            goliath.utilities.Style.setOpacity(this._imgPointer, (loValue != null ? .9: .45));
            this.setHandleXPercent((loValue != null) ? loValue[0] : 50);
            this.setHandleYPercent((loValue != null) ? loValue[1] : 50);
        }
    }
