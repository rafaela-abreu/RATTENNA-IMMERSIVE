const root = document.documentElement;
const scene = document.querySelector('.hero-scene');
const ship = document.querySelector('#spaceship');
const coordX = document.querySelector('#coordX');
const coordY = document.querySelector('#coordY');
let dragging = false;
let audioContext;
let engineGain;
let engineOscillator;
let dragOrigin = { x: 0, y: 0 };
let shipOrigin = { x: 0, y: 0 };
let lastShipPoint = { x: 0, y: 0 };

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const updateSceneTilt = (clientX, clientY) => {
  const x = (clientX / window.innerWidth - 0.5) * 2;
  const y = (clientY / window.innerHeight - 0.5) * 2;
  root.style.setProperty('--mx', x.toFixed(3));
  root.style.setProperty('--my', y.toFixed(3));
  if (!dragging) {
    coordX.textContent = `X ${String(Math.round((x + 1) * 50)).padStart(3, '0')}.${String(Math.abs(Math.round(x * 100)) % 100).padStart(2, '0')}`;
    coordY.textContent = `Y ${String(Math.round((y + 1) * 50)).padStart(3, '0')}.${String(Math.abs(Math.round(y * 100)) % 100).padStart(2, '0')}`;
  }
};

window.addEventListener('pointermove', (event) => updateSceneTilt(event.clientX, event.clientY), { passive: true });

function getAudioContext() {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    audioContext = new AudioContextClass();
  }
  if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
  return audioContext;
}

function playGrabSound() {
  const context = getAudioContext();
  if (!context) return;
  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const filter = context.createBiquadFilter();
  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(180, now);
  oscillator.frequency.exponentialRampToValueAtTime(520, now + .12);
  filter.type = 'bandpass';
  filter.frequency.value = 720;
  filter.Q.value = 4;
  gain.gain.setValueAtTime(.0001, now);
  gain.gain.exponentialRampToValueAtTime(.075, now + .025);
  gain.gain.exponentialRampToValueAtTime(.0001, now + .24);
  oscillator.connect(filter).connect(gain).connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + .26);
}

function startEngine() {
  const context = getAudioContext();
  if (!context) return;
  if (engineOscillator) return;
  engineOscillator = context.createOscillator();
  const harmonic = context.createOscillator();
  engineGain = context.createGain();
  const harmonicGain = context.createGain();
  const filter = context.createBiquadFilter();
  engineOscillator.type = 'sawtooth';
  engineOscillator.frequency.setValueAtTime(96, context.currentTime);
  engineOscillator.frequency.exponentialRampToValueAtTime(155, context.currentTime + .45);
  harmonic.type = 'triangle';
  harmonic.frequency.setValueAtTime(194, audioContext.currentTime);
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(760, audioContext.currentTime);
  engineGain.gain.setValueAtTime(0.0001, context.currentTime);
  engineGain.gain.exponentialRampToValueAtTime(0.045, context.currentTime + .12);
  harmonicGain.gain.value = .012;
  engineOscillator.connect(filter).connect(engineGain).connect(context.destination);
  harmonic.connect(harmonicGain).connect(context.destination);
  engineOscillator.start();
  harmonic.start();
  ship._harmonic = harmonic;
}

function stopEngine() {
  if (!engineOscillator || !engineGain) return;
  const now = audioContext.currentTime;
  engineGain.gain.cancelScheduledValues(now);
  engineGain.gain.exponentialRampToValueAtTime(0.0001, now + .18);
  const oscillator = engineOscillator;
  const harmonic = ship._harmonic;
  engineOscillator = null;
  ship._harmonic = null;
  window.setTimeout(() => { oscillator.stop(); harmonic?.stop(); }, 230);
}

function spawnPulse(x, y) {
  const pulse = document.createElement('span');
  pulse.className = 'drag-pulse';
  pulse.style.left = `${x}px`;
  pulse.style.top = `${y}px`;
  document.body.append(pulse);
  window.setTimeout(() => pulse.remove(), 650);
}

function moveShip(event) {
  const dx = event.clientX - dragOrigin.x;
  const dy = event.clientY - dragOrigin.y;
  const x = clamp(shipOrigin.x + dx, 48, window.innerWidth - 48);
  const y = clamp(shipOrigin.y + dy, 56, window.innerHeight - 56);
  root.style.setProperty('--ship-x', `${x}px`);
  root.style.setProperty('--ship-y', `${y}px`);
  const angle = clamp((event.clientX - lastShipPoint.x) * .35, -24, 24);
  ship.style.setProperty('--ship-angle', `${angle}deg`);
  lastShipPoint = { x: event.clientX, y: event.clientY };
  coordX.textContent = `X ${String(Math.round((x / window.innerWidth) * 100)).padStart(3, '0')}.00`;
  coordY.textContent = `Y ${String(Math.round((y / window.innerHeight) * 100)).padStart(3, '0')}.00`;
  if (Math.random() > .72) spawnPulse(x, y);
}

ship.addEventListener('pointerdown', (event) => {
  event.preventDefault();
  dragging = true;
  ship.setPointerCapture(event.pointerId);
  ship.dataset.dragging = 'true';
  const rect = ship.getBoundingClientRect();
  dragOrigin = { x: event.clientX, y: event.clientY };
  shipOrigin = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  lastShipPoint = { x: event.clientX, y: event.clientY };
  playGrabSound();
  startEngine();
  spawnPulse(shipOrigin.x, shipOrigin.y);
});
ship.addEventListener('pointermove', (event) => { if (dragging) moveShip(event); });
const releaseShip = (event) => {
  if (!dragging) return;
  dragging = false;
  ship.dataset.dragging = 'false';
  ship.releasePointerCapture?.(event.pointerId);
  ship.style.setProperty('--ship-angle', '0deg');
  stopEngine();
};
ship.addEventListener('pointerup', releaseShip);
ship.addEventListener('pointercancel', releaseShip);
ship.addEventListener('keydown', (event) => {
  const step = event.shiftKey ? 40 : 16;
  const currentX = parseFloat(getComputedStyle(root).getPropertyValue('--ship-x')) || window.innerWidth * .72;
  const currentY = parseFloat(getComputedStyle(root).getPropertyValue('--ship-y')) || window.innerHeight * .59;
  const moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
  if (!moves[event.key]) return;
  event.preventDefault();
  const [dx, dy] = moves[event.key];
  root.style.setProperty('--ship-x', `${clamp(currentX + dx, 48, window.innerWidth - 48)}px`);
  root.style.setProperty('--ship-y', `${clamp(currentY + dy, 56, window.innerHeight - 56)}px`);
  startEngine();
  window.setTimeout(stopEngine, 180);
});

// Pequeno rastro visual sem partículas em forma de estrela: só anéis de energia.
const pulseStyle = document.createElement('style');
pulseStyle.textContent = `.drag-pulse{position:fixed;z-index:10;width:18px;height:18px;border:1px solid rgba(101,243,238,.8);border-radius:50%;pointer-events:none;transform:translate(-50%,-50%);animation:pulse-ring .65s ease-out forwards}@keyframes pulse-ring{to{width:90px;height:90px;opacity:0;border-color:rgba(255,111,84,.1)}}`;
document.head.append(pulseStyle);

// Cards inclinam suavemente para manter a sensação de objeto físico.
document.querySelectorAll('.service-card').forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    const rect = card.getBoundingClientRect();
    const rx = ((event.clientY - rect.top) / rect.height - .5) * -4;
    const ry = ((event.clientX - rect.left) / rect.width - .5) * 5;
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
  });
  card.addEventListener('pointerleave', () => { card.style.transform = ''; });
});

scene.addEventListener('click', () => {
  if (!audioContext) return;
  if (audioContext.state === 'suspended') audioContext.resume();
});
