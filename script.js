const current = document.getElementById('current_task');
const tasks = document.getElementById('task_list');
const btn = document.getElementById('timeBtn');
const bin_table = document.getElementById('bin_list');
let allShifts = {
    startDates: [],
    startTimes: [],
    endDates: [],
    endTimes: []
};

let binObject = {
    startDates: [],
    startTimes: [],
    endDates: [],
    endTimes: []
}

const getBtnStatus = function () {
    let currentStatus = localStorage.getItem('btnStatus')
    if (currentStatus == null) return 'false'
    if (currentStatus == 'false') return 'false'
    if (currentStatus == 'true') return 'true'
    // else return 'false'
}

function unloadList() {
    const obj = JSON.parse(localStorage.getItem('shiftList'))
    //? sorter i objektet (gerne i datoer)
    /* ... */

    tasks.innerHTML = ''; //clear tasks for refill
    for (let i = 0; i < obj['startDates'].length; i++) {
        tasks.innerHTML += `
        <div class="row-element row" id="shift_element${i}">
            <div class="small-column">${i}</div>
            <div class="div"><div>${obj['startDates'][i]}</div></div>
            <div class="div"><div>${obj['startTimes'][i]}</div></div>
            <div class="div"><div>${obj['endTimes'][i]}</div></div>
            <div class="small-column" >
                <span class="material-symbols-outlined" onclick="moreOptions(${i})">more_horiz</span>
                <div id="moreOptions${i}" class="more-options">
                    <b>Vælg</b>
                    <div class="change-container">
                        <div class="change-info">
                            <div class="info-title">Starttid</div>
                            <div class="info-title">Sluttid</div>
                        </div>    
                        <div class="change-time-submit">
                            <input type="time" id="start_time_change${i}" value="${obj['startTimes'][i]}">
                            <input type="time" id="end_time_change${i}" value="${obj['endTimes'][i]}">
                        </div>
                        <div class="change-date-submit">
                            <input type="date" id="start_date_change${i}" value="${obj['startDates'][i]}" max="${obj['startDates'][i]}">
                            <input type="date" id="end_date_change${i}" value="${obj['endDates'][i]}" max="${obj['startDates'][i]}">
                        </div>
                        <button class="change-btn" onclick="changeShift(${i})">Ændr vagt</button>
                    </div>
                    <button  class="delete-btn" onclick="listDelete(${i})">Slet vagt (${i})</button>
                </div>
            </div>
        </div>`;
    }
    calc_data()
}   

// ! unload alle vagter ind i allShifts __ 
if (localStorage.getItem('shiftList') != null) {
    let retrievedObject = localStorage.getItem('shiftList');
    let listObject = JSON.parse(retrievedObject);
    
    allShifts.startDates = listObject['startDates']
    allShifts.startTimes = listObject['startTimes']
    allShifts.endDates = listObject['endDates']
    allShifts.endTimes = listObject['endTimes']

    unloadList()
    localStorage.setItem('shiftList',JSON.stringify(listObject));
    changeStyle(getBtnStatus(), JSON.parse(localStorage.getItem('shiftStart'))['time']);
}


// ! unload alle vagter ind i papirkurven 
if (localStorage.getItem('paperbin') != null) {
    let retrievedObject = localStorage.getItem('paperbin');
    let bin = JSON.parse(retrievedObject);

    binObject.startDates = bin['startDates']
    binObject.startTimes = bin['startTimes']
    binObject.endDates = bin['endDates']
    binObject.endTimes = bin['endTimes']
}

// console.log('shift active : ', getBtnStatus())

btn.addEventListener('click', () => {
    let timeStamp = new Date;
    let stampObj = new DateObject(timeStamp) 
    
    
    if (getBtnStatus() === 'false') { //!begynder vagt
        localStorage.setItem('btnStatus', 'true')
        
        localStorage.setItem('shiftStart', JSON.stringify({ 'date': stampObj.date, 'time': stampObj.time }))
    }
    else if (getBtnStatus() === 'true') { //!afslutter vagt
        localStorage.setItem('btnStatus', 'false')
        let shiftStart = JSON.parse(localStorage.getItem('shiftStart')); //brugt som temp, tømt efter vagt-slut
        
        allShifts['startDates'].push(shiftStart['date'])
        allShifts['startTimes'].push(shiftStart['time'])
        allShifts['endDates'].push(stampObj.date)
        allShifts['endTimes'].push(stampObj.time)
        shiftStart = [];
        
        console.log(allShifts)
        localStorage.setItem('shiftList', JSON.stringify(allShifts))
    }

    changeStyle(getBtnStatus(), JSON.parse(localStorage.getItem('shiftStart'))['time']);
    unloadList()
})

//delete
function listDelete(listNR) {
    if(!window.confirm('Slet vagt? \nSlettede vagter kan gendannes under indstillinger > papirkurv')) return;
    let oldList = JSON.parse(localStorage.getItem('shiftList'))
    let newList = {
        startDates: [],
        startTimes: [],
        endDates: [],
        endTimes: []
    };
    
    for (let i = 0; i < oldList.startDates.length; i++) {
        if (i == listNR) { //springer over hvis det er det slettede element
            // load papirkurven
            
            binObject['startDates'].push(oldList['startDates'][i])
            binObject['startTimes'].push(oldList['startTimes'][i])
            binObject['endDates'].push(oldList['endDates'][i])
            binObject['endTimes'].push(oldList['endTimes'][i])
            
            //flyt til papirkurv
            console.log(binObject)
            localStorage.setItem('paperbin', JSON.stringify(binObject))
            updateBin()
            continue
        }
        //overfører gamle liste til nye, springer slettede element over
        for(key in oldList) {
            newList[key].push(oldList[key][i])
        }
    }

    
    localStorage.setItem('shiftList', JSON.stringify(newList)) //uploader ny liste og render den -->
    unloadList()


    document.getElementById(`moreOptions${listNR}`).style.visibility = 'hidden'; //! kan skabe problemer, fjerner boksen efter click
}

function updateBin() {
    let bin_storage = JSON.parse(localStorage.getItem('paperbin'))
    bin_table.innerHTML = '';
    if (bin_storage == null) return
    for (let i = 0; i < bin_storage['startDates'].length; i++) {
        bin_table.innerHTML += `
        <div class="row-element row" id="shift_element${i}">
            <div class="small-column">${i}</div>
            <div class="div"><div>${bin_storage['startDates'][i]}</div></div>
            <div class="div"><div>${bin_storage['startTimes'][i]}</div></div>
            <div class="div"><div>${bin_storage['endTimes'][i]}</div></div>
            <div class="small-column">
                <span class="material-symbols-outlined add-circle" onclick="recoverElement(${i})" title="recover">
                    restore_from_trash
                </div>
            </span>
        </div>`;
    }
}
updateBin()

function recoverElement(number) {
    //gemmer enkelte element som skal 'reddes'
    const bin_element = function () {
        //henter objekt og skal gemme recovered item i array, sletter elementet fra objektet 
        let obj = JSON.parse(localStorage.getItem('paperbin'))
        let output = []; //tom array som fyldes
        //for nøgle i objekt (her 4)
        for (const key in obj) {
            for (let i = 0; i < obj[key].length; i++) { //looper igennem arrays i objektet og finder og gemmer rette nummer
                if (i === number) {  //pusher til output hvis numre er ens
                    output.push(obj[key][i])
                    obj[key].splice(number, 1) //fjerner elementet fra objektet
                }
            }
        }
        localStorage.setItem('paperbin', JSON.stringify(obj)) //opdaterer bin til at være uden elementet der reddes
        updateBin()
        return output
    }
    //opdaterer aktive vagter
    let shift_obj = JSON.parse(localStorage.getItem('shiftList'))
    let array = bin_element();
    for (let i = 0; i < Object.entries(shift_obj).length; i++) {
        shift_obj[Object.entries(shift_obj)[i][0]].unshift(array[i])
    }
    localStorage.setItem('shiftList', JSON.stringify(shift_obj))
    unloadList()
    console.log(shift_obj)
}

//? ændrer tidspunkt på specifikt element (i)
function changeShift(entry) {
    //fetch hooks
    const startTimeChange = document.getElementById(`start_time_change${entry}`)
    const endTimeChange = document.getElementById(`end_time_change${entry}`)
    const startDateChange = document.getElementById(`start_date_change${entry}`)
    const endDateChange = document.getElementById(`end_date_change${entry}`)
    //unload localstorage
    let shift_obj = JSON.parse(localStorage.getItem('shiftList'))
    // console.log(entry, startChange.value, endChange.value);
    shift_obj.startTimes[entry] = startTimeChange.value;
    shift_obj.endTimes[entry] = endTimeChange.value;
    shift_obj.startDates[entry] = startDateChange.value;
    shift_obj.endDates[entry] = endDateChange.value;
    // console.log(shift_obj)
    localStorage.setItem('shiftList', JSON.stringify(shift_obj))
    unloadList()
}

function deleteAll() {
    if (!window.confirm('Vil du tømme papirkurven?\nDette fjerner slettede elementer permanent. \n😁😁😁')) return
    else {
        localStorage.removeItem('paperbin')
        updateBin()
    }
}