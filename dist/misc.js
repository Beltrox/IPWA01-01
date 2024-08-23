function wechsel_zu_datenschutz(){
    window.location.href="datenschutz.html";
}
function wechsel_zu_impressum(){
    window.location.href="impressum.html";
}
function wechsel_zu_homepage(){
    window.location.href="index.html";
}

document.addEventListener('DOMContentLoaded', () => {
    const datenschutzButton = document.getElementById("datenschutzButton");
    const impressumButton = document.getElementById("impressumButton");
    const zurueckButton = document.getElementById("zurueckButton");
    const logoButton = document.getElementById("logo");

    datenschutzButton.addEventListener("click", () => wechsel_zu_datenschutz());
    impressumButton.addEventListener("click", () => wechsel_zu_impressum());
    zurueckButton.addEventListener("click", () => wechsel_zu_homepage());
    logoButton.addEventListener("click", () => wechsel_zu_homepage());
});