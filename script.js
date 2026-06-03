const musicToggle = document.getElementById("musicToggle");
const openInvitation = document.getElementById("openInvitation");
const mainInvitation = document.getElementById("undangan");
const guestName = new URLSearchParams(window.location.search).get("to");
let audioContext;
let musicTimer;
let isMusicPlaying = false;

if (guestName) {
    document.getElementById("guestName").textContent = guestName;
}

if (window.location.hash === "#undangan") {
    document.body.classList.add("invitation-opened");
    mainInvitation.scrollIntoView();
}

const weddingMelody = [
    { note: 392.0, duration: 0.42 },
    { note: 523.25, duration: 0.42 },
    { note: 659.25, duration: 0.42 },
    { note: 783.99, duration: 0.84 },
    { note: 659.25, duration: 0.42 },
    { note: 783.99, duration: 0.42 },
    { note: 1046.5, duration: 0.84 },
    { note: 987.77, duration: 0.42 },
    { note: 783.99, duration: 0.42 },
    { note: 659.25, duration: 0.42 },
    { note: 523.25, duration: 0.84 },
];

function playTone(frequency, duration, delay) {
    const startTime = audioContext.currentTime + delay;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, startTime);
    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.08, startTime + 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + duration + 0.05);
}

function scheduleWeddingMusic() {
    if (!isMusicPlaying) return;

    let delay = 0;
    weddingMelody.forEach(({ note, duration }) => {
        playTone(note, duration, delay);
        delay += duration;
    });

    musicTimer = setTimeout(scheduleWeddingMusic, (delay + 0.8) * 1000);
}

function updateMusicButton() {
    musicToggle.textContent = isMusicPlaying ? "Musik: On" : "Musik: Off";
    musicToggle.setAttribute(
        "aria-label",
        isMusicPlaying ? "Matikan musik latar" : "Putar musik latar"
    );
}

async function startWeddingMusic() {
    audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
    await audioContext.resume();

    if (isMusicPlaying) return;
    isMusicPlaying = true;
    updateMusicButton();
    scheduleWeddingMusic();
}

function stopWeddingMusic() {
    isMusicPlaying = false;
    clearTimeout(musicTimer);
    updateMusicButton();
}

musicToggle.addEventListener("click", function() {
    if (isMusicPlaying) {
        stopWeddingMusic();
    } else {
        startWeddingMusic().catch(stopWeddingMusic);
    }
});

openInvitation.addEventListener("click", function(e) {
    e.preventDefault();
    document.body.classList.add("invitation-opened");

    mainInvitation.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    startWeddingMusic().catch(function() {
        stopWeddingMusic();
    });
});

document.getElementById("rsvpForm").addEventListener("submit", function(e){
    e.preventDefault();

    let nama = document.getElementById("nama").value;
    let hadir = document.getElementById("kehadiran").value;
    let ucapan = document.getElementById("ucapan").value;

    let nomorAdmin = "6282111939057"; // TODO: ganti dengan nomor WhatsApp admin, contoh: 6281234567890
    let pesanWA = `RSVP Undangan:\nNama: ${nama}\nKehadiran: ${hadir}\nUcapan: ${ucapan}`;

    let url = `https://wa.me/${nomorAdmin}?text=${encodeURIComponent(pesanWA)}`;

    window.open(url, "_blank");
});
