goliath.Browser.loadModule("goliath.utilities");

/*====================================
Animation classes for Javascript
====================================*/
if (typeof(goliath) == 'undefined')
{
    goliath = function(){};
}
goliath.animation =
    {
        slideDown: function(toElement, tnMillis)
        {
            var lnHeight = goliath.utilities.DOM.getHeight(toElement);
            toElement.style.height = '0px';
            goliath.utilities.Style.show(toElement);

            for (var i=0, lnLength = tnMillis/10; i<=lnLength; i+=5)     // approx 20 fps
            {
                (function()
                {
                    var lnPosition = i;
                    window.setTimeout(function()
                    {
                        toElement.style.height = ((lnPosition / lnLength) * lnHeight) + 'px';

                    }
                    , (lnPosition + 1) * 10);
                })();
            }
        },
        fadeIn: function(toElement, tnMillis)
        {
            goliath.utilities.Style.setOpacity(toElement, 0);
            goliath.utilities.Style.show(toElement);

            for (var i=0, lnLength = tnMillis/10; i<=lnLength; i+=5)     // approx 20 fps
            {
                (function()
                {
                    var lnPosition = i;
                    window.setTimeout(function()
                    {
                        goliath.utilities.Style.setOpacity(toElement, (lnPosition / lnLength) * 100);
                    }
                    , (lnPosition + 1) * 10);
                })();
            }
        },
        fadeOut: function(toElement, tnMillis)
        {
            goliath.utilities.Style.setOpacity(toElement, 100);
            goliath.utilities.Style.show(toElement);

            for (var i=0, lnLength = tnMillis/10; i<=lnLength; i+=5)     // approx 20 fps
            {
                (function()
                {
                    var lnPosition = i;
                    window.setTimeout(function()
                    {
                        goliath.utilities.Style.setOpacity(toElement, 100-((lnPosition / lnLength) * 100));
                    }
                    , (lnPosition + 1) * 10);
                })();
            }
        }
    };




    goliath.animation.fadeOut(goliath.utilities.DOM.getElementsByTagName("div")[0], 5000);
