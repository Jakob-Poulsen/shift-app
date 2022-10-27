var monthsArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; 
var monthsArrayFull = ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"];
var lønsats = 150;
const calcWage = function (min) {
    //udregner decimaltal
    let hourly = ((min - (min % 60)) / 60);
    let minutely = ((min % 60)) / 60;

    return (hourly + minutely) * lønsats;
}
const parseWage = function (start, end, num) {
    // console.log(end.getHours() - start.getHours(), end.getMinutes() - start.getMinutes())
    
    var difference = end.getTime() - start.getTime();

    var hoursDifference = Math.floor(difference / 1000 / 60 / 60);
    difference -= hoursDifference * 1000 * 60 * 60

    var minutesDifference = Math.floor(difference / 1000 / 60);
    difference -= minutesDifference * 1000 * 60
    //! lige nu runder den det færdige timetal op, den kan også runde de enkelte start/slut tider op og ned
    let check = minutesDifference % 15; 
    if (check != 0) {
        if (check >= 7) {
            minutesDifference += (15 - check)
        } else if (check <= 7) {
            minutesDifference -= check
        }
    }

    let TOTALminutes = ((hoursDifference * 60) + minutesDifference)
    // console.log(TOTALminutes / 60)
    
    // hoursDifference = hoursDifference > 9 ? hoursDifference : '0' + hoursDifference;
    // minutesDifference = minutesDifference > 9 ? minutesDifference : '0' + minutesDifference;


    return `<div title="${calcWage(TOTALminutes)}"> ${TOTALminutes / 60} </div>
            <div class="wage"><b title="ekskl. skat" class="wage-${start.getFullYear()}-${start.getMonth()}-${num}"> ${calcWage(TOTALminutes)} kr.</b></div>`;
}

function calc_data() {
    const yearsContainer = document.getElementById('månedsData')
    const shifts = JSON.parse(localStorage.getItem('shiftList'))
    let dates = [];
    let endDates = []

    for (let i = 0; i < shifts.startDates.length; i++) {
        let dateString = new Date(shifts.startDates[i] + ' ' + shifts.startTimes[i])
        dates.push(dateString)

        let endDateString = new Date(shifts.startDates[i] + ' ' + shifts.endTimes[i]) //arrayen er til for at blive indekseret , derfor er endtime sammen med startdate
        endDates.push(endDateString)
    }

    dates.sort(function (a, b) { //sorterer arrayen 
        return a - b
    });
    endDates.sort(function (a, b) { //sorterer arrayen 
        return a - b
    });
    
    let datesObj = {}

    for (let i = 0; i < dates.length; i++) { //! Push år
        if (!(dates[i].getFullYear() in datesObj)) datesObj[dates[i].getFullYear()] = {};
    }

    for (let i = 0; i < dates.length; i++) { //! push måneder
        datesObj[dates[i].getFullYear()][dates[i].getMonth()] = []
    }

    for (let i = 0; i < dates.length; i++) { //! push dage
        datesObj[dates[i].getFullYear()][dates[i].getMonth()].push([dates[i], endDates[i]])
    }

    // console.log(datesObj)

    //! DISPLAY
    yearsContainer.innerHTML = '<div class="os-years" id="os_years"></div>';

    for (const year in datesObj) { //? unload år
        document.getElementById('os_years').innerHTML += `
            <div class="os-year">
                <div class="os-year-title os-title"> 
                    <b>${year}</b>
                </div>
                <div class="os-months" id="os-months-${year}">

                </div>
            </div>`;

        const monthsCont = document.getElementById(`os-months-${year}`)
        monthsCont.innerHTML = '';

        for (const month in datesObj[year]) { //? unload måneder
            let monthStr = monthsArray[month]
            monthsCont.innerHTML += `
            <div class="os-month">
                <div class="os-month-title os-title">
                    <b>${monthStr}</b>
                    <span class="material-symbols-outlined copy-span" title="kopier måned" onclick="copy_month(${month}, ${year})">
                        content_copy
                    </span>
                </div>
                <div class="os-days" id="os-days-${monthStr}-${year}">
            
                </div>
            </div>`

            const daysCont = document.getElementById(`os-days-${monthStr}-${year}`)
            // console.log(year, month) 
            daysCont.innerHTML = '';

            for (let i = 0; i < datesObj[year][month].length; i++) { //? unload dage
                let actualDay = datesObj[year][month][i];
                daysCont.innerHTML += `
                <div class="os-day">
                    <div class="os-spec os-spec-day"  >${actualDay[0].toDateString().slice(0, 3)} ${actualDay[0].getDate()}</div>
                    <div class="os-spec os-spec-time" >${DateObject(actualDay[0]).time} - ${DateObject(actualDay[1]).time}</div>
                    <div class="os-spec os-spec-info" > 
                    ${parseWage(actualDay[0], actualDay[1], i)}
                    </div>
                </div>
                `
            }
        }
    }
    monthDATA(datesObj)
}

function copy_month(month, year) {
    let result = `${monthsArray[month]}\nDato\tTid\tTimer\n`; //kopierede tekst
    let usefulArr = []
    
    let hook = document.getElementById(`os-days-${monthsArray[month]}-${year}`);
    // console.log(hook.childNodes);
    //? graver og finder værdien af html'et
    for (let i = 0; i < hook.childNodes.length; i++) {
        if (i % 2 != 0) {
            let dayHook = hook.childNodes[i].childNodes;
            for (let j = 0; j < dayHook.length; j++) {
                if (i % 2 != 0) {
                    if (j === 1) { //day
                        result += `${dayHook[j].innerHTML}.\t`;
                    }
                    if (j === 3) { //start-end time
                        result += `${dayHook[j].innerHTML}\t`;
                    }
                    if (j === 5) {
                        console.log(dayHook[j])
                        result += `${(dayHook[j].childNodes[1].innerHTML).replace('.', ',')}` //1.25 --> 1,25
                        
                    }
                }
            }
            result += '\n';
        }
    }
    result += '\t\t=sum((H2:H12)*150)*0.92';

    // Copy the text inside the text field
    navigator.clipboard.writeText(result);
}

const monthData = document.getElementById('overordnet_data')
function monthDATA(objekt) {
    let totalWage = 0;
    let date = new Date()
    let month = date.getMonth()
    let year = date.getFullYear()
    monthData.innerHTML = `
        <div class="ov-data">
            <div class="ov-curr-month">
                <div class="ov-month-head">
                    Denne måned (${monthsArrayFull[month]})
                </div>
                <div class="ov-month-data" id="ov_month_data">
                </div>
            </div>
        </div>`;
    
    let currentMonth = objekt[year][month]
    let childcountMonth = document.getElementById(`os-days-${monthsArray[month]}-${year}`).childElementCount //tæller antal vagter i den aktuelle måned
    for (let i = 0; i < childcountMonth; i++) {
        let shiftwage = parseFloat(document.querySelector(`.wage-${year}-${month}-${i}`).innerHTML)
        totalWage += shiftwage;
    }
    const ov_data = document.getElementById('ov_month_data');
    ov_data.innerHTML = `<b title="inkl. am-bidrag">${totalWage * 0.92} kr.</b>`
    
}