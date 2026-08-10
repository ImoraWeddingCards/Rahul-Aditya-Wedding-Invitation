/* =========================================================
   EASY CONFIGURATION - edit invitation details here
   ========================================================= */
const weddingConfig = {
  groomName: "Rahul M. S",
  brideName: "Aditya M",
  weddingDate: "2026-11-01T11:30:00",
  ceremonyTime: "Muhurtham : Between 11 am and 11.30 am",
  ceremonyVenue: "At Muthodam Auditorium, Mayyanad, Kollam",
  receptionTime: "From 4 pm onwards",
  receptionVenue: "Kings Convention Centre,<br>Puthenchantha, Varkala",
  ceremonyMapUrl: "", // Paste the correct Google Maps URL here
  receptionMapUrl: "" // Paste the correct Google Maps URL here
};

const $ = (selector) => document.querySelector(selector);

function setText(selector, value, allowHtml = false) {
  const element = $(selector);
  if (element) allowHtml ? element.innerHTML = value : element.textContent = value;
}

setText('#ceremonyTime', weddingConfig.ceremonyTime);
setText('#ceremonyVenue', weddingConfig.ceremonyVenue);
setText('#receptionTime', weddingConfig.receptionTime);
setText('#receptionVenue', weddingConfig.receptionVenue, true);

function configureMap(linkSelector, url) {
  const link = $(linkSelector);
  if (!url) {
    link.removeAttribute('href');
    link.setAttribute('aria-disabled', 'true');
    link.title = 'Location link will be added soon';
    link.addEventListener('click', (event) => event.preventDefault());
  } else link.href = url;
}
configureMap('#ceremonyMap', weddingConfig.ceremonyMapUrl);
configureMap('#receptionMap', weddingConfig.receptionMapUrl);

const weddingDate = new Date(weddingConfig.weddingDate);
const countdownIds = ['days', 'hours', 'minutes', 'seconds'];
let previousValues = {};
function updateCountdown() {
  let seconds = Math.max(0, Math.floor((weddingDate - new Date()) / 1000));
  if (seconds <= 0) {
    $('.countdown').hidden = true;
    $('#celebrationBegun').hidden = false;
    return;
  }
  const values = { days: Math.floor(seconds / 86400), hours: Math.floor(seconds % 86400 / 3600), minutes: Math.floor(seconds % 3600 / 60), seconds: seconds % 60 };
  countdownIds.forEach((id) => {
    const next = String(values[id]).padStart(id === 'days' ? 3 : 2, '0');
    const node = $(`#${id}`);
    if (previousValues[id] !== undefined && previousValues[id] !== next) {
      node.classList.add('changing');
      setTimeout(() => node.classList.remove('changing'), 300);
    }
    node.textContent = next;
    previousValues[id] = next;
  });
}
updateCountdown(); setInterval(updateCountdown, 1000);

$('#openInvitation').addEventListener('click', () => {
  audio.play().then(() => {
  musicButton.classList.add('playing');
  musicButton.setAttribute('aria-pressed', 'true');
  musicButton.querySelector('b').textContent = 'Music On';
});
  const opening = $('#opening');
  if (opening.classList.contains('opening-envelope')) return;
  opening.classList.add('opening-envelope');
  $('#openInvitation').disabled = true;
  setTimeout(() => { opening.classList.add('is-open'); document.body.style.overflow = ''; }, 1250);
});
document.body.style.overflow = 'hidden';

const navToggle = $('.nav-toggle'); const nav = $('#siteNav');
navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => { nav.classList.remove('open'); navToggle.setAttribute('aria-expanded', 'false'); }));

const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

// Missing gallery/QR assets become designed placeholders rather than broken images.
document.querySelectorAll('.gallery-item img').forEach((image) => {
  image.addEventListener('load', () => image.closest('.gallery-item').classList.add('has-image'));
  image.addEventListener('error', () => { image.remove(); });
  if (image.complete && image.naturalWidth) image.closest('.gallery-item').classList.add('has-image');
});
document.querySelectorAll('.qr-image').forEach((image) => image.addEventListener('error', () => image.classList.add('image-missing')));

const lightbox = $('#lightbox');
document.querySelectorAll('.gallery-item').forEach((button) => button.addEventListener('click', () => {
  const image = button.querySelector('img');
  if (!image || !image.naturalWidth) return;
  lightbox.querySelector('img').src = image.src; lightbox.querySelector('img').alt = image.alt; lightbox.querySelector('p').textContent = image.alt; lightbox.showModal();
}));
$('.close-lightbox').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', (event) => { if (event.target === lightbox) lightbox.close(); });

const audio = $('#backgroundMusic'); const musicButton = $('#musicButton');
musicButton.addEventListener('click', async () => {
  if (audio.paused) {
    try { await audio.play(); musicButton.classList.add('playing'); musicButton.setAttribute('aria-pressed', 'true'); musicButton.querySelector('b').textContent = 'Music On'; }
    catch { musicButton.querySelector('b').textContent = 'Music unavailable'; }
  } else { audio.pause(); musicButton.classList.remove('playing'); musicButton.setAttribute('aria-pressed', 'false'); musicButton.querySelector('b').textContent = 'Music Off'; }
});
audio.addEventListener('error', () => { musicButton.querySelector('b').textContent = 'Music unavailable'; });
