const forside = document.getElementById('forside_page')
const oversigt = document.getElementById('oversigt_page')
const indstillinger = document.getElementById('indstillinger_page')

let pageStatus = 0;

function showForside() {
    forside.style.display = 'inherit';
    oversigt.style.display = 'none';
    indstillinger.style.display = 'none';
}

function showOversigt() {
    forside.style.display = 'none';
    oversigt.style.display = 'inherit';
    indstillinger.style.display = 'none';
}

function showIndstillinger() {
    forside.style.display = 'none';
    oversigt.style.display = 'none';
    indstillinger.style.display = 'inherit';
}
 
// showOversigt()