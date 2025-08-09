function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (5 + Math.random() * 5) + 's';
    document.querySelector('.hearts-background').appendChild(heart);
    setTimeout(() => heart.remove(), 10000);
}

setInterval(createHeart, 500);

// Add background music
const audioTag = document.createElement('audio');
audioTag.id = 'bg-music';
audioTag.src = 'music.mp3';
audioTag.autoplay = true;
audioTag.loop = true;
document.body.appendChild(audioTag);

// Ensure audio plays after it's ready
audioTag.addEventListener('canplaythrough', () => {
    audioTag.play();  // Start playing once it's fully loaded
});

// Fade-in effect
const audio = document.getElementById('bg-music');
audio.volume = 0;
audio.addEventListener('play', () => {
    let vol = 0;
    const fade = setInterval(() => {
        if (vol < 1) {
            vol += 0.01;
            audio.volume = vol;
        } else {
            clearInterval(fade);
        }
    }, 50); // ~5s fade-in
});

// Handle user interaction to ensure autoplay works on mobile
document.body.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
    }
});

document.body.addEventListener('scroll', () => {
    if (audio.paused) {
        audio.play();
    }
});
