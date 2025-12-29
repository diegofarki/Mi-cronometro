let startTime, elapsedTime = 0, timerInterval, cdInterval, cdTotalTime = 0;
let currentSection = 'sec-cronometro';
const alarm = document.getElementById('alarm-sound');
const body = document.getElementById('body-env');

// Reloj Digital Superior
setInterval(() => {
    document.getElementById('current-clock').innerText = new Date().toLocaleTimeString('es-ES', { hour12: false });
}, 1000);

function formatTime(time, ms = true) {
    if (time < 0) time = 0;
    let h = Math.floor(time / 3600000), 
        m = Math.floor((time % 3600000) / 60000), 
        s = Math.floor((time % 60000) / 1000);
    let mil = Math.floor((time % 1000) / 10);
    
    let res = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return ms ? res + `.${mil.toString().padStart(2, "0")}` : res;
}

/* --- LÓGICA CRONÓMETRO --- */
function startCron() {
    if (timerInterval) return;
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(() => {
        elapsedTime = Date.now() - startTime;
        document.getElementById('display').innerText = formatTime(elapsedTime);
    }, 10);
}

function stopCron() { 
    clearInterval(timerInterval); 
    timerInterval = null; 
}

function resetCron() {
    stopCron();
    elapsedTime = 0;
    document.getElementById('display').innerText = "00:00:00.00";
}

/* --- LÓGICA CUENTA REGRESIVA --- */
function startCD() {
    if (cdInterval) return;
    
    // Si el tiempo está en cero, capturar de los inputs
    if (cdTotalTime <= 0) {
        const h = parseInt(document.getElementById('cd-h').value) || 0;
        const m = parseInt(document.getElementById('cd-m').value) || 0;
        const s = parseInt(document.getElementById('cd-s').value) || 0;
        cdTotalTime = (h * 3600 + m * 60 + s) * 1000;
    }

    if (cdTotalTime <= 0) return;

    cdInterval = setInterval(() => {
        cdTotalTime -= 1000;
        document.getElementById('cd-display').innerText = formatTime(cdTotalTime, false);
        
        if (cdTotalTime <= 0) { 
            clearInterval(cdInterval); 
            cdInterval = null; 
            triggerAlarm(); 
        }
    }, 1000);
}

function stopCD() {
    clearInterval(cdInterval); 
    cdInterval = null;
    alarm.pause(); 
    alarm.currentTime = 0;
    body.classList.remove('screen-flash');
    document.getElementById('btn-regresiva').classList.remove('nav-alert-active');
    document.getElementById('status-general').innerText = "SYSTEM ONLINE";
}

function resetCD() {
    stopCD();
    cdTotalTime = 0;
    document.getElementById('cd-display').innerText = "00:00:00";
}

function triggerAlarm() {
    alarm.play();
    body.classList.add('screen-flash');
    document.getElementById('btn-regresiva').classList.add('nav-alert-active');
    document.getElementById('status-general').innerText = "!!! ALERTA !!!";
}

/* --- NAVEGACIÓN Y TECLADO --- */
function openSection(event, id) {
    currentSection = id;
    document.querySelectorAll('.content-section').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(id).classList.add('active');
    event.currentTarget.classList.add('active');
}

window.addEventListener('keydown', (e) => {
    if ([" ", "Home", "End", "Delete"].includes(e.key)) e.preventDefault();
    
    if (currentSection === 'sec-cronometro') {
        if (e.key === "Home") startCron();
        if (e.key === "End") stopCron();
        if (e.key === "Delete") resetCron();
        if (e.key === " ") { resetCron(); startCron(); }
    } else {
        if (e.key === "Home") startCD();
        if (e.key === "End") stopCD();
        if (e.key === "Delete") resetCD();
    }
});

document.getElementById('fullscreen-btn').onclick = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
};
