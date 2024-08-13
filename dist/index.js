const userLanguage = navigator.language || navigator.languages[0];

const rtlLanguages = ['ar', 'he', 'fa', 'ur']; // Liste der RTL-Sprachen

const isRTL = rtlLanguages.includes(userLanguage.split('-')[0]);


document.addEventListener('DOMContentLoaded', () => {
    const menu = document.getElementById('menu');

    if (isRTL) {
        menu.classList.add('justify-end');
        menu.classList.remove('justify-start');
    } else {
        menu.classList.add('justify-start');
        menu.classList.remove('justify-end');
    }
});

function wechsel_zu_datenschutz (){
    window.location.href="datenschutz.html";
}
function wechsel_zu_impressum (){
    window.location.href="impressum.html";
}
function wechsel_zu_homepage (){
    window.location.href="index.html";
}