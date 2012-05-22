/*====================================
Math classes for Javascript
====================================*/
if (typeof(goliath) == 'undefined')
{
    goliath = function(){};    
}
goliath.math = function(){};


/*
 * Generates a random number between tnMin and tnMax
 */
goliath.math.random=function(tnMin, tnMax)
{
    if (tnMin > tnMax)
        return 0;        
    
    return tnMin + (tnMax - tnMin) * Math.random();
}