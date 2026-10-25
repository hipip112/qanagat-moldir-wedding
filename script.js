const calendarGrid = document.querySelector('#calendarGrid');
const daysInNovember = 30;
const firstDayMondayIndex = 6; // 1 ноября 2026 — жексенбі
for (let i = 0; i < firstDayMondayIndex; i += 1) {
  const empty = document.createElement('span');
  empty.className = 'empty';
  empty.setAttribute('aria-hidden', 'true');
  calendarGrid.appendChild(empty);
}
for (let day = 1; day <= daysInNovember; day += 1) {
  const cell = document.createElement('span');
  cell.textContent = day;
  cell.setAttribute('aria-label', `${day} қараша 2026`);
  if (day === 28) {
    cell.className = 'marked';
    cell.setAttribute('aria-current', 'date');
  }
  calendarGrid.appendChild(cell);
}

const customChoice = document.querySelector('#customChoice');
const customAnswer = document.querySelector('#customAnswer');
const choiceInputs = document.querySelectorAll('input[name="answer"]');
choiceInputs.forEach((input) => {
  input.addEventListener('change', () => {
    const isCustom = input === customChoice;
    customAnswer.required = isCustom;
    if (isCustom) customAnswer.focus();
  });
});

const form = document.querySelector('#rsvpForm');
const message = document.querySelector('#formMessage');
const music = document.querySelector('#weddingMusic');
const musicToggle = document.querySelector('#musicToggle');
let musicStarted = false;
const startMusicAfterGesture = (event) => {
  if (event.target.closest('#musicToggle')) return;
  if (musicStarted || !music.paused) return;
  music.play().then(() => {
    musicStarted = true;
    musicToggle.classList.add('is-playing');
    musicToggle.innerHTML = '♫ <span>ӨШІРУ</span>';
  }).catch(() => {});
};
document.addEventListener('pointerdown', startMusicAfterGesture, { once: true });
musicToggle.addEventListener('click', async () => {
  if (music.paused) {
    await music.play();
    musicToggle.classList.add('is-playing');
    musicToggle.innerHTML = '♫ <span>ӨШІРУ</span>';
  } else {
    music.pause();
    musicToggle.classList.remove('is-playing');
    musicToggle.innerHTML = '♫ <span>МУЗЫКА</span>';
  }
});

const petalRain = document.querySelector('.petal-rain');
const petalPalette = ['rose', 'blush', 'white', 'deep'];
for (let i = 0; i < 28; i += 1) {
  const petal = document.createElement('span');
  petal.className = `petal ${petalPalette[i % petalPalette.length]}`;
  petal.style.left = `${Math.random() * 100}%`;
  petal.style.setProperty('--drift', `${-120 + Math.random() * 240}px`);
  petal.style.setProperty('--sway', `${-45 + Math.random() * 90}px`);
  petal.style.animationDuration = `${10 + Math.random() * 12}s`;
  petal.style.animationDelay = `${Math.random() * -22}s`;
  petal.style.setProperty('--size', `${0.65 + Math.random() * 1.1}`);
  petal.style.opacity = `${0.3 + Math.random() * 0.5}`;
  petalRain.appendChild(petal);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const selected = form.querySelector('input[name="answer"]:checked').value;
  const finalAnswer = selected === 'Өз жауабым' ? customAnswer.value.trim() : selected;
  if (!finalAnswer) {
    message.textContent = 'Өтінеміз, жауабыңызды жазыңыз.';
    customAnswer.focus();
    return;
  }
  const guestName = form.querySelector('[name="guestName"]').value.trim();
  if (!guestName) {
    message.textContent = 'Атыңызды міндетті түрде жазыңыз.';
    form.querySelector('[name="guestName"]').focus();
    return;
  }
  const guestCount = form.querySelector('[name="guestCount"]').value;
  const formspreeEndpoint = 'https://formspree.io/f/xljjgawa';
  const formData = new FormData(form);
  formData.set('guestName', guestName);
  formData.set('answer', finalAnswer);
  formData.set('guestCount', guestCount);
  formData.set('_subject', 'RSVP — Қанағат пен Мөлдірдің тойы');
  const saveResponse = fetch(formspreeEndpoint, { method: 'POST', body: formData, headers: { Accept: 'application/json' } });
  message.textContent = 'Жауабыңыз сақталуда...';
  saveResponse.then((response) => {
    if (!response.ok) throw new Error('Formspree error');
    message.textContent = 'Жауабыңыз сәтті сақталды. Рақмет!';
  }).catch(() => {
    message.textContent = 'Жауапты сақтау кезінде қате болды. Қайта көріңіз.';
  });
});

const countdown = document.querySelector('#countdown');
const countdownTarget = new Date(countdown.dataset.target).getTime();
const updateCountdown = () => {
  const remaining = Math.max(0, countdownTarget - Date.now());
  const values = {
    days: Math.floor(remaining / 86400000),
    hours: Math.floor((remaining / 3600000) % 24),
    minutes: Math.floor((remaining / 60000) % 60),
    seconds: Math.floor((remaining / 1000) % 60),
  };
  Object.entries(values).forEach(([key, value]) => { document.querySelector(`#${key}`).textContent = String(value).padStart(2, '0'); });
};
updateCountdown();
setInterval(updateCountdown, 1000);

const slowAnchors = document.querySelectorAll('a[href^="#"]');
slowAnchors.forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    const start = window.scrollY;
    const end = target.getBoundingClientRect().top + window.scrollY - 14;
    const distance = end - start;
    const duration = Math.min(1800, Math.max(900, Math.abs(distance) * 0.55));
    const startedAt = performance.now();
    const ease = (t) => t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2;
    const step = (now) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      window.scrollTo(0, start + distance * ease(progress));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
});

const revealItems = document.querySelectorAll('.section-pad');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); });
}, { threshold: 0.12 });
revealItems.forEach((item) => { item.classList.add('reveal'); revealObserver.observe(item); });
