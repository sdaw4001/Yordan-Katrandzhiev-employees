const fs = require('fs');

function readFileToJson() {           // Reading a .txt local file and convert it into JSON file
    let content = fs.readFileSync('test.txt', 'utf8');
    let stringedContent = content.toString();

    let cells = stringedContent.split('\n').map(function (el) { return el.split(/\s+/); });
    let headings = cells.shift();

    let out = cells.map(function (el) {
        let obj = {};
        for (let i = 0, l = el.length; i < l; i++) {
            obj[headings[i]] = isNaN(Number(el[i])) ? el[i] : +el[i];
        }
        return obj;
    });
    let jsonObj = JSON.stringify(out, null, 2);
    jsonObj = JSON.parse(jsonObj);

    return jsonObj;
}

function getPeriod(date_1, date_2) {  //Function for counting the period between 2 Dates
    //convert to UTC
    let date1_UTC = new Date(Date.UTC(date_1.getUTCFullYear(), date_1.getUTCMonth(), date_1.getUTCDate()));
    let date2_UTC = new Date(Date.UTC(date_2.getUTCFullYear(), date_2.getUTCMonth(), date_2.getUTCDate()));
    let yAppendix, mAppendix, dAppendix;
    //--------------------------------------------------------------
    let days = date2_UTC.getDate() - date1_UTC.getDate();
    if (days < 0) {
        date2_UTC.setMonth(date2_UTC.getMonth() - 1);
        days += DaysInMonth(date2_UTC);
    }
    //--------------------------------------------------------------
    let months = date2_UTC.getMonth() - date1_UTC.getMonth();
    if (months < 0) {
        date2_UTC.setFullYear(date2_UTC.getFullYear() - 1);
        months += 12;
    }
    //--------------------------------------------------------------
    let years = date2_UTC.getFullYear() - date1_UTC.getFullYear();
    if (years > 1) yAppendix = " years";
    else yAppendix = " year";
    if (months > 1) mAppendix = " months";
    else mAppendix = " month";
    if (days > 1) dAppendix = " days";
    else dAppendix = " day";
    return years + yAppendix + ", " + months + mAppendix + ", and " + days + dAppendix;
}

function DaysInMonth(date2_UTC) {     //Counting the days in mount
    let monthStart = new Date(date2_UTC.getFullYear(), date2_UTC.getMonth(), 1);
    let monthEnd = new Date(date2_UTC.getFullYear(), date2_UTC.getMonth() + 1, 1);
    let monthLength = (monthEnd - monthStart) / (1000 * 60 * 60 * 24);
    return monthLength;
}

function countDaysBetweenDates(date1, date2) {
    let oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    let firstDate = new Date(date1);
    let secondDate = new Date(date2);

    let diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
    return diffDays;
}

function getTodayDate(date) { //Converts Json DateTo

    if (date === 'NULL') {
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1; //January is 0!
        let yyyy = today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        today = mm + '-' + dd + '-' + yyyy;
        return new Date(today);
    } else {
        let wholeDate = new Date(date);

        let dd = wholeDate.getDate();
        let mm = wholeDate.getMonth() + 1;
        let yyyy = wholeDate.getFullYear();

        wholeDate = mm + "-" + dd + "-" + yyyy;

        return new Date(wholeDate);
    }
}

function divideEmpByProjId() {                  // Divide the employees by Project,
    let jsonObj = readFileToJson();             //Returns Array of Objects
    let empArray = new Array();
    let lastIndex = Math.max.apply(null, Object.keys(jsonObj).map(Number))

    for (let i = 0; i < lastIndex + 1; i++) {
        for (let j = i + 1; j < lastIndex + 1; j++) {
            if (jsonObj[i].ProjectID == jsonObj[j].ProjectID) {
                let objeect = {
                    first: jsonObj[i],
                    second: jsonObj[j]
                }
                empArray.push(objeect);
            }
        }
    }
    return empArray;
}

function filterEmpById() {    // Filters all employees that have period both
    let filtredArray = [];        // Returns  object of objects 
    let dividedArray = divideEmpByProjId();

    for (let i = 0; i < dividedArray.length; i++) {
        let firstDateFrom = new Date(dividedArray[i].first.DateFrom);
        let firstDateTo = dividedArray[i].first.DateTo
        firstDateTo = getTodayDate(firstDateTo);

        let secondDateFrom = new Date(dividedArray[i].second.DateFrom);
        let secondDateTo = dividedArray[i].second.DateTo
        secondDateTo = getTodayDate(secondDateTo);

        if (firstDateTo <= secondDateFrom ||  //Checking if they even have 
            secondDateTo <= firstDateFrom) {  //any working period together
            console.log("None.")
        } else {

            if (firstDateFrom <= secondDateFrom) {
                if (secondDateTo <= firstDateTo) {

                    let res = getPeriod(secondDateFrom, secondDateTo);
                    let daysBetweenDates = countDaysBetweenDates(secondDateFrom, firstDateTo);
                    let objWithPeriod = {
                        EmployeeFirst: dividedArray[i].first,
                        EmployeeSecond: dividedArray[i].second,
                        PeriodWorkedTogether: res,
                        DaysBetweenDates: daysBetweenDates
                    };
                    filtredArray.push(objWithPeriod);
                } else {
                    let res = getPeriod(secondDateFrom, firstDateTo);
                    let daysBetweenDates = countDaysBetweenDates(secondDateFrom, firstDateTo);
                    let objWithPeriod = {
                        EmployeeFirst: dividedArray[i].first,
                        EmployeeSecond: dividedArray[i].second,
                        PeriodWorkedTogether: res,
                        DaysBetweenDates: daysBetweenDates
                    };
                    filtredArray.push(objWithPeriod);
                }
            } else {
                if (secondDateTo <= firstDateTo) {
                    let res = getPeriod(firstDateFrom, secondDateTo);
                    let daysBetweenDates = countDaysBetweenDates(secondDateFrom, firstDateTo);
                    let objWithPeriod = {
                        EmployeeFirst: dividedArray[i].first,
                        EmployeeSecond: dividedArray[i].second,
                        PeriodWorkedTogether: res,
                        DaysBetweenDates: daysBetweenDates
                    };
                    filtredArray.push(objWithPeriod);

                } else {
                    let res = getPeriod(firstDateFrom, firstDateTo);
                    let daysBetweenDates = countDaysBetweenDates(secondDateFrom, firstDateTo);
                    let objWithPeriod = {
                        EmployeeFirst: dividedArray[i].first,
                        EmployeeSecond: dividedArray[i].second,
                        PeriodWorkedTogether: res,
                        DaysBetweenDates: daysBetweenDates
                    };
                    filtredArray.push(objWithPeriod);

                }
            }
        }
    }
    return filtredArray;
}

function getPairOfLongestWorkingEmps() {         // Comperes the highest Working period of all emp
    let arrayToCompare = filterEmpById();        // Return objectof 2 emp
    let res = {};

    for (let i = 0; i < arrayToCompare.length; i++) {
        for (let j = i + 1; j < arrayToCompare.length; j++) {
            if (arrayToCompare[i].DaysBetweenDates > arrayToCompare[j].DaysBetweenDates) {
                res = arrayToCompare[i];
            } else {
                res = arrayToCompare[j];
            }
        }
    }

    return res;
}

function printLongestWorkingEmps() {                // Printing Last result from filtring
    let objectForPrint = getPairOfLongestWorkingEmps();

    let printInfo = `\nThe workers who worked the most together \n
First Employee ID : ${objectForPrint.EmployeeFirst.EmpID} \n
working from : ${objectForPrint.EmployeeFirst.DateFrom} to ${objectForPrint.EmployeeFirst.DateTo} \n
Second Employee ID : ${objectForPrint.EmployeeSecond.EmpID} \n
working from : ${objectForPrint.EmployeeSecond.DateFrom} to ${objectForPrint.EmployeeSecond.DateTo} \n
Project worked on : ${objectForPrint.EmployeeFirst.ProjectID} \n
Period while working side by side : ${objectForPrint.PeriodWorkedTogether}  \n
Days between the Dates: ${objectForPrint.DaysBetweenDates} \n`

    console.log("\x1b[33m%s\x1b[0m", printInfo);
    // console.log(printInfo);                                // Remove comment if Colored .log don't work. 
}                                                             // I changed the color for better view.         

printLongestWorkingEmps();