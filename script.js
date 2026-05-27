// ------------------------------------------------------------
// Footer year
// ------------------------------------------------------------
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ------------------------------------------------------------
// Word-split for hero title — reveals word-by-word on load
// ------------------------------------------------------------
function splitWords(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  let node;
  while ((node = walker.nextNode())) {
    if (node.nodeValue && node.nodeValue.trim()) textNodes.push(node);
  }
  textNodes.forEach((tn) => {
    const parts = tn.nodeValue.split(/(\s+)/);
    const frag = document.createDocumentFragment();
    parts.forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        frag.appendChild(document.createTextNode(part));
      } else {
        const span = document.createElement('span');
        span.className = 'word';
        span.textContent = part;
        frag.appendChild(span);
      }
    });
    tn.parentNode.replaceChild(frag, tn);
  });
}

document.querySelectorAll('.split-words').forEach((el) => {
  splitWords(el);
  const words = el.querySelectorAll('.word');
  words.forEach((w, i) => {
    const delay = prefersReduced ? 0 : 60 + i * 70;
    setTimeout(() => w.classList.add('is-in'), delay);
  });
});

// ------------------------------------------------------------
// Scroll-reveal for sections + grid items (sibling stagger)
// ------------------------------------------------------------
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const siblings = Array.from(el.parentElement?.children || []).filter(
      (c) => c.classList.contains('reveal')
    );
    const index = siblings.indexOf(el);
    const delay = Math.min(index, 6) * 60;
    el.style.transitionDelay = `${delay}ms`;
    el.classList.add('is-in');
    revealObserver.unobserve(el);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

reveals.forEach((el) => revealObserver.observe(el));

// ------------------------------------------------------------
// Number count-up on impact stats
// ------------------------------------------------------------
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function countUp(el) {
  const target = parseInt(el.dataset.count, 10);
  if (isNaN(target)) return;
  const suffix = el.dataset.suffix || '';
  const duration = 1400;
  const start = performance.now();
  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const value = Math.round(target * easeOutCubic(t));
    el.textContent = value + suffix;
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = target + suffix;
  }
  requestAnimationFrame(tick);
}

const numbers = document.querySelectorAll('.impact__num[data-count]');
if (prefersReduced) {
  numbers.forEach((el) => {
    el.textContent = el.dataset.count + (el.dataset.suffix || '');
  });
} else {
  const numberObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      countUp(entry.target);
      numberObserver.unobserve(entry.target);
    });
  }, { threshold: 0.4 });
  numbers.forEach((el) => numberObserver.observe(el));
}
