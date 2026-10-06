document.documentElement.classList.add('js');
// Nav: background on scroll + mobile menu
const nav = document.getElementById('nav');
const toggle = document.getElementById('navToggle');
const links = document.getElementById('navLinks');

const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

toggle.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  links.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
}));

// Reveal on scroll + stat counters
const countUp = el => {
  const target = +el.dataset.count;
  const suffix = el.dataset.suffix || '+';
  const start = performance.now();
  const step = now => {
    const p = Math.min((now - start) / 1200, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + (p === 1 ? suffix : '');
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    entry.target.querySelectorAll('[data-count]').forEach(countUp);
    io.unobserve(entry.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Hero terminal: a "test run" of the career
const lines = [
  ['c-prompt', '$ npx playwright test career.spec.js'],
  ['c-dim', 'Running 5 tests using 1 worker'],
  ['', ''],
  ['c-pass', '  ✓ manual & exploratory testing      8y'],
  ['c-pass', '  ✓ web automation  Playwright · Selenium'],
  ['c-pass', '  ✓ mobile automation  Appium · iOS/Android'],
  ['c-pass', '  ✓ api testing  Postman · Rest Assured'],
  ['c-pass', '  ✓ leads & trains QA teams'],
  ['', ''],
  ['c-pass', '  5 passed (8 years)'],
];

const term = document.getElementById('terminal');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduced) {
  term.innerHTML = lines.map(([c, t]) => `<span class="${c}">${t}</span>`).join('\n');
} else {
  let li = 0, ci = 0, html = '';
  const cursor = '<span class="cursor"></span>';
  const type = () => {
    if (li >= lines.length) { term.innerHTML = html + cursor; return; }
    const [cls, text] = lines[li];
    const isCmd = li === 0;
    ci = isCmd ? ci + 1 : text.length;
    term.innerHTML = html + `<span class="${cls}">${text.slice(0, ci)}</span>` + cursor;
    if (ci >= text.length) {
      html += `<span class="${cls}">${text}</span>\n`;
      li++; ci = 0;
      setTimeout(type, isCmd ? 500 : 260);
    } else {
      setTimeout(type, 38);
    }
  };
  setTimeout(type, 600);
}

document.getElementById('year').textContent = new Date().getFullYear();
