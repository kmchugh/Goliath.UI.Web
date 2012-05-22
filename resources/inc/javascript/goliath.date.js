// ------ Extentions for Date() object --------------------------------------------------
Date.prototype.daysInMonth=function()
{
    var lnMonth = this.getMonth();
    var lnLeapYear = (this.isLeapYear()) ? 1 : 0;

    if (lnMonth == 3 || lnMonth == 5 || lnMonth == 8 || lnMonth == 10)
    {
        return 30;
    }
    else if (lnMonth == 1)
    {
        return 28 + lnLeapYear;
    }
    return 31;
}

Date.prototype.isLeapYear=function()
{
    var lnYear = this.getYear();
    return ((lnYear % 4 == 0 && !(lnYear % 100 == 0)) || lnYear % 400 == 0);
}

Date.prototype.copy=function()
{
    var loNewDate = new Date();
    loNewDate.setTime(this.valueOf());
    return loNewDate;
}

Date.prototype.add=function(toOptions)
{
    var lnDays = toOptions.days || 0;
    var lnMonths = toOptions.months || 0;
    var lnYears = toOptions.years || 0;

    this.setFullYear(this.getFullYear() + lnYears);
    this.setMonth(this.getMonth() + lnMonths);
    this.setDate(this.getDate() + lnDays);

    return this.copy();

}

Date.prototype.sameDay=function(toDate)
{
    return this.getDate() == toDate.getDate();
}

Date.prototype.sameMonth=function(toDate)
{
    return this.getMonth() == toDate.getMonth();
}

Date.prototype.sameYear=function(toDate)
{
    return this.getFullYear() == toDate.getFullYear();
}

Date.prototype.match=function(toDate)
{
    return this.sameDay(toDate) && this.sameMonth(toDate) && this.sameYear(toDate);
}

Date.prototype.format=function(tcDefinition, tcDayName, tcMonthName)
{
    var d = this.getDate();
    var dd = goliath.utilities.Text.padLeft(d, '0', 2);
    var dddd = tcDayName;
    var ddd = dddd.substr(0, 3);

    var m = this.getMonth();
    var mm = goliath.utilities.Text.padLeft(m, '0', 2);
    var mmmm = tcMonthName;
    var mmm = mmmm.substr(0, 3);
    var lcYear = new String(this.getYear());
    lcYear = lcYear.substr(lcYear.length -2, 2);
    var yy = goliath.utilities.Text.padLeft(lcYear, '0', 2);
    var yyyy = this.getFullYear();
    var tttt = this.getTime();

    return goliath.utilities.Text.replaceText(tcDefinition,
            {
                d: d,
                dd: dd,
                ddd: ddd,
                dddd: dddd,
                m: m,
                mm: mm,
                mmm: mmm,
                mmmm: mmmm,
                yy: yy,
                yyyy: yyyy,
                tttt: tttt
            }
    );
}



// ------ End Extenstions for Date() object ----------------------------------------------
