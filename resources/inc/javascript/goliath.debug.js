/*====================================
Utility classes for Javascript
====================================*/
if (typeof goliath == 'undefined')
{
    goliath = function(){};    
}
goliath.debug = function(){};

goliath.debug.displayProperties(toObject)
{
    var lcProperties = "";
    for (var i in toObject)
    {
        lcProperties += i + " = " + tnObject[i] + "\n";
    }
    helper.alert(lcProperties);
}


