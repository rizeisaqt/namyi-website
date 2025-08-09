function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (5 + Math.random() * 5) + 's';
    document.querySelector('.hearts-background').appendChild(heart);
    setTimeout(() => heart.remove(), 10000);
}

setInterval(createHeart, 500);

// Music fade-in
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
    }, 100);
});
