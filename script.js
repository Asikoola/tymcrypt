/* ============================================================
   TIME CRYPTO — script.js
   Shared JavaScript for index.html and enroll.html
   ============================================================ */
 
/* ── INDEX: Mobile menu ── */
function toggleMenu() {
  var m = document.getElementById('mobileMenu');
  if (m) m.classList.toggle('open');
}
 
function closeMenu() {
  var m = document.getElementById('mobileMenu');
  if (m) m.classList.remove('open');
}
 
/* ── INDEX: Contact form submit ── */
function handleSubmit() {
  var name  = document.getElementById('name');
  var email = document.getElementById('email');
  if (!name || !email) return;
  if (!name.value.trim() || !email.value.trim()) {
    alert('Please fill in your name and email to continue.');
    return;
  }
  window.location.href = 'enroll.html';
}
 
/* ── ENROLL: Coin canvas animation ── */
function initCoinCanvas() {
  var canvas = document.getElementById('coinCanvas');
  if (!canvas) return;
 
  var ctx = canvas.getContext('2d');
 
  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', function () { resize(); buildCoins(); });
 
  var SYMBOLS = ['\u20BF', '\u039E', '$', '\u25C8', '\u20AE', '\u27E0', '\u25CE'];
  var COLORS  = [
    'rgba(240,165,0,',
    'rgba(240,208,96,',
    'rgba(255,107,43,',
    'rgba(200,140,0,'
  ];
 
  function Coin() { this.reset(true); }
 
  Coin.prototype.reset = function (initial) {
    this.x         = Math.random() * canvas.width;
    this.y         = initial ? Math.random() * canvas.height : canvas.height + 60;
    this.size      = 14 + Math.random() * 32;
    this.speed     = 0.25 + Math.random() * 0.55;
    this.drift     = (Math.random() - 0.5) * 0.3;
    this.rotation  = Math.random() * Math.PI * 2;
    this.rotSpeed  = (Math.random() - 0.5) * 0.012;
    this.symbol    = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    this.colorBase = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.opacity   = 0.04 + Math.random() * 0.12;
    this.scaleX    = 1;
    this.flipSpeed = 0.008 + Math.random() * 0.012;
    this.flipDir   = 1;
  };
 
  Coin.prototype.update = function () {
    this.y        -= this.speed;
    this.x        += this.drift;
    this.rotation += this.rotSpeed;
    this.scaleX   += this.flipSpeed * this.flipDir;
    if (this.scaleX >  1) { this.scaleX =  1; this.flipDir = -1; }
    if (this.scaleX < -1) { this.scaleX = -1; this.flipDir =  1; }
    if (this.y < -80) this.reset(false);
  };
 
  Coin.prototype.draw = function () {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.scale(this.scaleX, 1);
 
    var r       = this.size;
    var absScale = Math.abs(this.scaleX);
 
    ctx.beginPath();
    ctx.ellipse(0, 0, r * absScale, r, 0, 0, Math.PI * 2);
    ctx.fillStyle = this.colorBase + (this.opacity * 0.6) + ')';
    ctx.fill();
 
    ctx.beginPath();
    ctx.ellipse(0, 0, r * absScale, r, 0, 0, Math.PI * 2);
    ctx.strokeStyle = this.colorBase + this.opacity + ')';
    ctx.lineWidth   = 1.5;
    ctx.stroke();
 
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.72 * absScale, r * 0.72, 0, 0, Math.PI * 2);
    ctx.strokeStyle = this.colorBase + (this.opacity * 0.6) + ')';
    ctx.lineWidth   = 0.8;
    ctx.stroke();
 
    if (absScale > 0.4) {
      ctx.fillStyle      = this.colorBase + (this.opacity * 2.5) + ')';
      ctx.font           = 'bold ' + (r * 0.68) + 'px Space Grotesk, sans-serif';
      ctx.textAlign      = 'center';
      ctx.textBaseline   = 'middle';
      ctx.scale(1 / this.scaleX, 1);
      ctx.fillText(this.symbol, 0, 0);
    }
 
    ctx.restore();
  };
 
  var coins = [];
 
  function buildCoins() {
    var count = Math.min(38, Math.floor(canvas.width / 36));
    coins = [];
    for (var i = 0; i < count; i++) { coins.push(new Coin()); }
  }
  buildCoins();
 
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    coins.forEach(function (c) { c.update(); c.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
}
 
/* ── ENROLL: Modal controls ── */
function openModal(level, title, price) {
  var overlay = document.getElementById('modalOverlay');
  if (!overlay) return;
 
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalPrice').textContent = price;
 
  var badge = document.getElementById('modalBadge');
  badge.textContent = level;
  badge.className   = 'modal-plan-badge';
  if (level === 'Beginner')     badge.classList.add('badge-green');
  else if (level === 'Intermediate') badge.classList.add('badge-gold');
  else                          badge.classList.add('badge-orange');
 
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
 
function closeModal() {
  var overlay = document.getElementById('modalOverlay');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}
 
function handleOverlayClick(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
}
 
function submitEnrollment() {
  var name  = document.getElementById('mName').value.trim();
  var email = document.getElementById('mEmail').value.trim();
  if (!name || !email) {
    alert('Please enter your name and email to continue.');
    return;
  }
  var plan  = document.getElementById('modalTitle').textContent;
  var price = document.getElementById('modalPrice').textContent;
  closeModal();
  setTimeout(function () {
    alert(
      '\uD83C\uDF89 You\'re enrolled!\n\n' +
      'Name: ' + name + '\n' +
      'Plan: ' + plan + ' (' + price + ')\n\n' +
      'We\'ll send your onboarding details to ' + email + ' within 24 hours. Welcome to Time Crypto!'
    );
  }, 200);
}
 
/* ── ESC closes modal ── */
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeModal();
});
 
/* ── Run on page load ── */
document.addEventListener('DOMContentLoaded', function () {
  initCoinCanvas(); /* safe no-op on index.html (no #coinCanvas) */
});
 