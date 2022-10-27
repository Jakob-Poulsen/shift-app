
const starttime = document.getElementById('starttime_display')

//random number
let getRandomNumber = function name(start, range) {
    let getRandom = Math.floor((Math.random() * range) + start);
    while (getRandom > range) {
        getRandom = Math.floor((Math.random() * range) + start)
    }
    return getRandom;
}

//random background
let img_nmbr = getRandomNumber(28, 31);
let image_location = './img/img' + img_nmbr + '.jpg'
document.querySelector('body').style.backgroundImage = 'url(' + image_location + ')';

const DateObject = function(stamp) {
    this.seconds = stamp.getSeconds() < 10 ? '0' + stamp.getSeconds() : stamp.getSeconds();
    this.minutes = stamp.getMinutes() < 10 ? '0' + stamp.getMinutes() : stamp.getMinutes();
    this.hours = stamp.getHours() < 10 ? '0' + stamp.getHours() : stamp.getHours();
    this.day = stamp.getDate() > 10 ? stamp.getDate() : '0' + stamp.getDate();
    this.month = stamp.getMonth() + 1 > 10 ? stamp.getMonth() + 1 : '0' + (stamp.getMonth() + 1);
    this.year = stamp.getFullYear()

    return {
        time: `${this.hours}:${this.minutes}:${this.seconds}`,
        date: `${this.year}-${this.month}-${this.day}`
    } 
}

function clearStorage() {
    localStorage.clear()
}

//? display tid (opdaterer hvert sekund)
function currentTime() {
    let date = new Date();
    hour = updateTime(date.getHours());
    min = updateTime(date.getMinutes());
    sec = updateTime(date.getSeconds());
    document.querySelector(".time-container").innerText = hour + " : " + min + " : " + sec;

    var t = setTimeout(function () {
        currentTime()
    }, 1000);
}
//returnerer '0 + sec' hvis sec < 10;
function updateTime(k) {
    if (k < 10) {
        return "0" + k;
    } else {
        return k;
    }
}
currentTime();

//? display dato

const currentDate = function() {
    const day = new Date;
    const getWeekday = function () {
        let weekdays = [
                'Søndag',
                'Mandag',
                'Tirsdag',
                'Onsdag',
                'Torsdag',
                'Fredag',
                'Lørdag',
        ];
        return `${weekdays[day.getDay()]}`
    }
    const getMonth = function() {
        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        return months[day.getMonth()]
    }
    return `${getWeekday()} <br> ${day.getDate()} ${getMonth()}, ${day.getFullYear()}`

}

document.querySelector('.date-container').innerHTML = currentDate();


const menuBtn = document.getElementById('context-menu')
let menu_open = false;
function context() {
    const expandedMenu = document.getElementById('expanded_menu')

    if (!menu_open) { 
        menuBtn.innerHTML = 'menu_open'; 
        menu_open = true;
        expandedMenu.style.display = 'flex';
    }
    else { 
        menuBtn.innerHTML = 'menu'; 
        menu_open = false;
        expandedMenu.style.display = 'none';
    }
}

let moreOptionsOpen = false;
function moreOptions(i) {
    let displayStyle = document.getElementById(`moreOptions${i}`).style.display;
    //fjerne alle andre åbne faner:
    for (let j = 0; j < JSON.parse(localStorage.getItem('shiftList')).startDates.length; j++) {
        document.getElementById(`moreOptions${j}`).style.display = 'none';
    }
    //åbne/lukke bestemt fane
    if (displayStyle == 'none' || displayStyle == '') {
        document.getElementById(`moreOptions${i}`).style.display = 'flex';
        moreOptionsOpen = true
    } else if (displayStyle == 'inherit') {
        document.getElementById(`moreOptions${i}`).style.display = 'none';
        moreOptionsOpen = false
    }
    //
}

function changeStyle(boolean, tempTime) {

    if (boolean === 'true') {
        //knap indstillinger
        btn.innerHTML = `Stop Timer`
        btn.classList.remove('disabled')
        btn.classList.add('active')
        //tilføj til ekstra information
        current.innerHTML = 'VAGT IGANG';
        // console.log(tempTime)
        starttime.innerHTML = '<b>' + tempTime + '<b>';

    }
    else if (boolean === 'false') { //* knappen bliver grøn
        localStorage.setItem('btnStatus', 'false');
        //knap indstillinger
        btn.innerHTML = `Start Timer`
        btn.classList.remove('active')
        btn.classList.add('disabled')
        //tilføj til ekstra information
        current.innerHTML = 'VAGT SLUT';
        starttime.innerHTML = 'STARTTID'
    }
}

function dateToNumber(date) {
    return date.slice(-2).toString()
}