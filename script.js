const canvas = document.querySelector('#starfield');
const ctx = canvas?.getContext('2d');

function resizeCanvas() {
  if (!canvas || !ctx) return;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

const stars = Array.from({ length: 150 }, (_, index) => ({
  x: Math.random(), y: Math.random(), size: Math.random() * 1.7 + 0.25,
  alpha: Math.random() * 0.6 + 0.15, speed: Math.random() * 0.00013 + 0.00003,
  phase: index * 0.7,
}));

function drawStars(time = 0) {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  stars.forEach((star) => {
    const drift = (time * star.speed + star.phase) % 1;
    const x = ((star.x + drift * 0.035) % 1) * window.innerWidth;
    const y = star.y * window.innerHeight;
    const twinkle = star.alpha * (0.72 + Math.sin(time * 0.0015 + star.phase) * 0.28);
    ctx.beginPath();
    ctx.fillStyle = 'rgba(213, 255, 235, ' + twinkle + ')';
    ctx.arc(x, y, star.size, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(drawStars);
}

resizeCanvas();
drawStars();
window.addEventListener('resize', resizeCanvas);

const glow = document.querySelector('.cursor-glow');
window.addEventListener('pointermove', (event) => {
  if (glow) {
    glow.style.left = event.clientX + 'px';
    glow.style.top = event.clientY + 'px';
  }
});

document.querySelectorAll('.magnetic').forEach((item) => {
  item.addEventListener('pointermove', (event) => {
    const box = item.getBoundingClientRect();
    const x = (event.clientX - box.left - box.width / 2) * 0.12;
    const y = (event.clientY - box.top - box.height / 2) * 0.12;
    item.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
  });
  item.addEventListener('pointerleave', () => { item.style.transform = ''; });
});

const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
menuToggle?.addEventListener('click', () => {
  const open = siteNav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.site-nav a').forEach((link) => link.addEventListener('click', () => {
  siteNav.classList.remove('is-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) revealObserver.unobserve(entry.target);
    entry.target.classList.toggle('is-visible', entry.isIntersecting);
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

document.querySelector('#year').textContent = new Date().getFullYear();
