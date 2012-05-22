/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

 // Array of max days in month in a year and in a leap year
goMonthMaxDays	= [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
goMonthMaxDaysLeap= [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
goHideSelectTags = [];

function getRealYear(toDateObj)
{
        return toDateObj.getFullYear();
}

function getDaysPerMonth(toMonth, toYear)
{
	/*
	Check for leap year. 
	*/
	if ((toYear % 4) == 0)
	{
		if ((toYear % 100) == 0 && (toYear % 400) != 0)
                    {
			return goMonthMaxDays[toMonth];
                    }

		return goMonthMaxDaysLeap[toMonth];
	}
	else
            {
		return goMonthMaxDays[toMonth];
            }
}

function createCalender(toYear, toMonth, toDay)
{
	 // current Date
	var loCurDate = new Date();
	var loCurDay = loCurDate.getDate();
	var loCurMonth = loCurDate.getMonth();
	var loCurYear = getRealYear(loCurDate);

	 // if a date already exists, we calculate some values here
	if (!toYear)
	{
		var loYear = loCurYear;
		var loMonth = loCurMonth;
	}

	var loYearFound = 0;
	for (var i=0; i<document.getElementById('selectYear').options.length; i++)
	{
		if (document.getElementById('selectYear').options[i].value == toYear)
		{
			document.getElementById('selectYear').selectedIndex = i;
			loYearFound = true;
			break;
		}
	}
	if (!loYearFound)
	{
		document.getElementById('selectYear').selectedIndex = 0;
		toYear = document.getElementById('selectYear').options[0].value;
	}
	document.getElementById('selectMonth').selectedIndex = toMonth;

	 // first day of the month.
	var loFristDayOfMonthObj = new Date(toYear, toMonth, 1);
	var loFirstDayOfMonth = loFristDayOfMonthObj.getDay();

	goContinue = true;
	goFirstRow = true;
	var loDate	= 0;
	var loDays	= 0;
	var loTableRows = []
	var loTableRowNumber = 0;
        var loTotalDays = getDaysPerMonth(toMonth, toYear);
	while (loDays <= loTotalDays)
	{
		if (goFirstRow)
		{
			loTableRows[loTableRowNumber] = document.createElement("TR");
			if (loFirstDayOfMonth > 0)
			{
				while (loDate < loFirstDayOfMonth)
				{
					loTableRows[loTableRowNumber].appendChild(document.createElement("TD"));
					loDate++;
				}
			}
			goFirstRow = false;
			var loDays = 1;
		}
		if (loDate % 7 == 0)
		{
			loTableRowNumber++;
			loTableRows[loTableRowNumber] = document.createElement("TR");
		}
		if (toDay && loDays == toDay)
		{
			var loSetID = 'calenderChoosenDay';
			var loStyleClass = 'choosenDay';
			var loSetTitle = 'this day is currently selected';
		}
		else if (loDays == loCurDay && toMonth == loCurMonth && toYear == loCurYear)
		{
			var loSetID = 'calenderToDay';
			var loStyleClass = 'toDay';
			var loSetTitle = 'this day today';
		}
		else
		{
			var loSetID = false;
			var loStyleClass = 'normalDay';
			var loSetTitle = false;
		}
		var td = document.createElement("TD");
		td.className = loStyleClass;
		if (loSetID)
		{
			td.id = loSetID;
		}
		if (loSetTitle)
		{
			td.title = loSetTitle;
		}
		td.onmouseover = new Function('highLightDay(this)');
		td.onmouseout = new Function('deHighLightDay(this)');
		if (goTargetElement)
                    {
			td.onclick = new Function('pickDate('+toYear+', '+toMonth+', '+loDays+')');
                    }
		else
                    {
			td.style.cursor = 'default';
                    }
		td.appendChild(document.createTextNode(loDays));
		loTableRows[loTableRowNumber].appendChild(td);
		loDate++;
		loDays++;
	}
	return loTableRows;
}

function showCalender(toCalPos, toTargetElement)
{
	goTargetElement = false;

	if (document.getElementById(toTargetElement))
	{
		goTargetElement = document.getElementById(toTargetElement);
	}
	else
	{
		if (document.forms[0].elements[toTargetElement])
		{
			goTargetElement = document.forms[0].elements[toTargetElement];
		}
	}
	var loCalTable = document.getElementById('calenderTable');

	var loPositions = [0,0];
	var loPositions = getParentOffset(toCalPos, loPositions);
	loCalTable.style.left = loPositions[0]+'px';
	loCalTable.style.top = loPositions[1]+'px';

	loCalTable.style.display='block';

	var loMatchDate = new RegExp('^([0-9]{2})-([0-9]{2})-([0-9]{4})$');
	var loMatchdate = loMatchDate.exec(goTargetElement.value);
	if (loMatchdate == null)
	{
		goTable = createCalender(false, false, false);
		showCalenderBody(goTable);
	}
	else
	{
		if (loMatchdate[1].substr(0, 1) == 0)
                    {
			loMatchdate[1] = loMatchdate[1].substr(1, 1);
                    }
		if (loMatchdate[2].substr(0, 1) == 0)
                    {
			loMatchdate[2] = loMatchdate[2].substr(1, 1);
                    }
		loMatchdate[2] = loMatchdate[2] - 1;
		goTable = createCalender(loMatchdate[3], loMatchdate[2], loMatchdate[1]);
		showCalenderBody(goTable);
	}

	hideSelect(document.body, 1);
}

function showCalenderBody(toTableRows)
{
	var loCalTableBody = document.getElementById('calender');
	while (loCalTableBody.childNodes[0])
	{
		loCalTableBody.removeChild(loCalTableBody.childNodes[0]);
	}
	for (var i in toTableRows)
	{
		loCalTableBody.appendChild(toTableRows[i]);
	}
}

function setYears(toStartYear, toEndYear)
{
	 // current Date
	var loCurDate = new Date();
	var loCurYear = getRealYear(loCurDate);
	document.getElementById('selectYear').options.length = 0;
	var j = 0;
	for (y=toEndYear; y>=toStartYear; y--)
	{
		document.getElementById('selectYear')[j++] = new Option(y, y);
	}
}

function hideSelect(toElement, toSuperTotal)
{
	if (toSuperTotal >= 100)
	{
		return;
	}

	var loTotalChilds = toElement.childNodes.length;
	for (var i=0; i<loTotalChilds; i++)
	{
		var loThisTag = toElement.childNodes[i];
		if (loThisTag.tagName == 'SELECT')
		{
			if (loThisTag.id != 'selectMonth' && loThisTag.id != 'selectYear')
			{
				var loCalenderElement = document.getElementById('calenderTable');
				var loPositions = [0,0];
				var loPositions = getParentOffset(loThisTag, loPositions);	// nieuw
				var loThisLeft	= loPositions[0];
				var loThisRight	= loPositions[0] + loThisTag.offsetWidth;
				var loThisTop	= loPositions[1];
				var loThisBottom	= loPositions[1] + loThisTag.offsetHeight;
				var loCalLeft	= loCalenderElement.offsetLeft;
				var loCalRight	= loCalenderElement.offsetLeft + loCalenderElement.offsetWidth;
				var loCalTop	= loCalenderElement.offsetTop;
				var loCalBottom	= loCalenderElement.offsetTop + loCalenderElement.offsetHeight;

				if (
					(
						/* check if it overlaps horizontally */
						(loThisLeft >= loCalLeft && loThisLeft <= loCalRight)
							||
						(loThisRight <= loCalRight && loThisRight >= loCalLeft)
							||
						(loThisLeft <= loCalLeft && loThisRight >= loCalRight)
					)
						&&
					(
						/* check if it overlaps vertically */
						(loThisTop >= loCalTop && loThisTop <= loCalBottom)
							||
						(loThisBottom <= loCalBottom && loThisBottom >= loCalTop)
							||
						(loThisTop <= loCalTop && loThisBottom >= loCalBottom)
					)
				)
				{
					goHideSelectTags[goHideSelectTags.length] = loThisTag;
					loThisTag.style.display = 'none';
				}
			}

		}
		else if(loThisTag.childNodes.length > 0)
		{
		hideSelect(loThisTag, (toSuperTotal+1));
		}
	}
}

function closeCalender()
{
	for (var i=0; i<goHideSelectTags.length; i++)
	{
          goHideSelectTags[i].style.display = 'block';
	}
	goHideSelectTags.length = 0;
	document.getElementById('calenderTable').style.display='none';
}

function highLightDay(toElement)
{
	toElement.className = 'hlDay';
}

function deHighLightDay(toElement)
{
	if (toElement.id == 'calenderToDay')
		toElement.className = 'toDay';
	else if (toElement.id == 'calenderChoosenDay')
            {
		toElement.className = 'choosenDay';
            }
	else
            {
		toElement.className = 'normalDay';
            }
}

function pickDate(toYear, toMonth, toDay)
{
	toMonth++;
	toDay	= toDay < 10 ? '0'+toDay : toDay;
	toMonth	= toMonth < 10 ? '0'+toMonth : toMonth;
	if (!goTargetElement)
	{
		alert('target for date is not set yet');
	}
	else
	{
		goTargetElement.value= toDay+'-'+toMonth+'-'+toYear;
		closeCalender();
	}
}

function getParentOffset(toElement, toPositions)
{
	toPositions[0] += toElement.offsetLeft;
	toPositions[1] += toElement.offsetTop;
	if (toElement.offsetParent)
            {
             toPositions = getParentOffset(toElement.offsetParent, toPositions);
            }

	return toPositions;
}

