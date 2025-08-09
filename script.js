/* Interactivity for Namyi's page */
/* - Photo placeholder: allow user to paste an image or pick from device (on mobile)
   - Music controls: use postMessage API to control YouTube iframe. Autoplay attempts muted first.
*/

// -- Photo picker (mobile friendly)
const photoPlaceholder = document.getElementById('photoPlaceholder');
photoPlaceholder.addEventListener('click', async () => {
  // On mobile, prompt the user to pick an image via file input
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = () => {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      photoPlaceholder.style.backgroundImage = `url('${e.target.result}')`;
      photoPlaceholder.style.backgroundSize = 'cover';
      photoPlaceholder.style.backgroundPosition = 'center';
      photoPlaceholder.innerHTML = '';
    };
    reader.readAsDataURL(file);
  };
  input.click();
});

// -- YouTube player control
let ytIframe = document.getElementById('ytPlayer');
let playBtn = document.getElementById('playBtn');
let pauseBtn = document.getElementById('pauseBtn');
let volume = document.getElementById('volume');
let autoplayHint = document.getElementById('autoplayHint');

// PostMessage helper to control iframe via YouTube IFrame API (minimal)
function post(action, args={}){
  ytIframe.contentWindow.postMessage(JSON.stringify(Object.assign({ event: 'command', func: action, args: [] }, args)), '*');
}

// Try to unmute after a user gesture: modern browsers block autoplay with sound
function unmuteAndPlay(){
  try {
    // setVolume expects 0-100
    post('setVolume', {});
    post('playVideo', {});
    autoplayHint.style.display = 'none';
  } catch(e){ console.warn('YouTube API message failed', e); }
}

// Buttons
playBtn.addEventListener('click', () => {
  // If still muted, try to unmute via API by reloading src with unmuted autoplay as user gesture
  // Simpler approach: reload iframe with autoplay=1&mute=0 triggered by click
  const src = ytIframe.src.split('?')[0] + '?rel=0&modestbranding=1&playsinline=1&enablejsapi=1&autoplay=1&mute=0';
  ytIframe.src = src;
  autoplayHint.style.display = 'none';
});

pauseBtn.addEventListener('click', () => {
  // try postMessage pause
  post('pauseVideo', {});
});

// Volume slider - reload with volume param not supported; but we can try to setVolume via postMessage after API is ready
volume.addEventListener('input', () => {
  const vol = Number(volume.value);
  // setVolume via postMessage (YouTube API)
  post('setVolume', {}); // empty - using minimal message; not all methods work cross-domain reliably
});

// Hide hint after first user interaction
document.addEventListener('click', () => {
  autoplayHint.style.opacity = '0.6';
}, { once: true });

// Inject multiple heart SVGs into background for gentle animation
(function injectHearts(){
  const hearts = document.querySelector('.hearts');
  const heartSvg = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-4.35-9.5-7.07C-0.5 10.7 3 6 7.5 6c2.2 0 4 1.2 4.5 3.09C12.5 7.2 14.3 6 16.5 6 21 6 24.5 10.7 21.5 13.93 19 16.65 12 21 12 21z"/></svg>`;
  const classes = ['h1','h2','h3','h4','h5'];
  classes.forEach(c => {
    const wrap = document.createElement('div');
    wrap.className = c;
    wrap.innerHTML = heartSvg;
    hearts.appendChild(wrap);
  });
})();

// Accessibility: autosave message to localStorage so user doesn't lose edits
const msg = document.getElementById('loveMsg');
const LS_KEY = 'namyi_love_msg_v1';
msg.value = localStorage.getItem(LS_KEY) || '';
msg.addEventListener('input', () => {
  localStorage.setItem(LS_KEY, msg.value);
});

// Small UX: warn before unload if message non-empty and not saved
window.addEventListener('beforeunload', (e) => {
  if (msg.value.trim().length > 0){
    e.preventDefault();
    e.returnValue = '';
  }
});