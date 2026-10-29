import { buildEnquiry } from './contact-message.mjs';
import { submitEnquiry } from './contact-submit.mjs';

const body = document.body;
const theme = document.querySelector('[data-theme-toggle]');
try { if (localStorage.getItem('theaicomp-theme') === 'dark') body.dataset.theme = 'dark'; } catch {}
function updateThemeLabel() {
  theme?.setAttribute('aria-label', body.dataset.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  theme?.setAttribute('aria-pressed', String(body.dataset.theme === 'dark'));
}
updateThemeLabel();
theme?.addEventListener('click', () => {
  body.dataset.theme = body.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('theaicomp-theme', body.dataset.theme); } catch {}
  updateThemeLabel();
});

const menu = document.querySelector('[data-menu]');
const links = document.querySelector('.nav-links');
function closeMenu() { links?.classList.remove('open'); menu?.setAttribute('aria-expanded','false'); }
menu?.addEventListener('click', () => menu.setAttribute('aria-expanded', String(links.classList.toggle('open'))));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    const focusedInMenu = document.activeElement?.closest('.nav-links');
    closeMenu();
    if (menu && focusedInMenu) menu.focus();
  }
});
links?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) links?.querySelectorAll('a').forEach(a => {
        if (a.hash === `#${entry.target.id}`) a.setAttribute('aria-current','location');
        else a.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
  document.querySelectorAll('section[id]').forEach(section => observer.observe(section));
}

const form = document.querySelector('#enquiry-form');
const serviceField = document.querySelector('#contact-service');
const messageField = document.querySelector('#contact-message');
const ready = document.querySelector('#email-ready');
const status = document.querySelector('#form-status');
const fallback = document.querySelector('#message-fallback');
const prepared = document.querySelector('#prepared-message');
const copy = document.querySelector('#copy-message');
const submitButton = document.querySelector('[data-enquiry-submit]');
const submitLabel = document.querySelector('[data-submit-label]');
const deliveryEnabled = form?.dataset.delivery === 'web3forms';
let submitting = false;

function updateCount() {
  document.querySelector('#message-count').textContent = `${messageField.value.length} / 3000`;
}
function clearPreparedMessage() {
  if (submitting) return;
  ready.hidden = true;
  fallback.hidden = true;
  prepared.value = '';
  copy.textContent = 'Copy message';
}
function showStatus(message, fallbackText = '') {
  ready.hidden = false;
  status.textContent = message;
  prepared.value = fallbackText;
  fallback.hidden = !fallbackText;
  copy.textContent = 'Copy message';
  status.focus({preventScroll:true});
  ready.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block:'nearest'});
}
function setSubmitting(value) {
  submitting = value;
  form.setAttribute('aria-busy', String(value));
  form.querySelectorAll('input, select, textarea, button').forEach(control => { control.disabled = value; });
  submitLabel.textContent = value ? 'Sending…' : deliveryEnabled ? 'Send enquiry' : 'Prepare your message';
}
document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => {
  if (submitting) return;
  serviceField.value = link.dataset.service;
  clearPreparedMessage();
}));
form?.addEventListener('input', event => { if (event.target !== prepared) clearPreparedMessage(); });
form?.addEventListener('change', event => { if (event.target !== prepared) clearPreparedMessage(); });
messageField?.addEventListener('input', updateCount);
form?.addEventListener('submit', async event => {
  event.preventDefault();
  if (submitting) return;
  let fields, enquiry;
  try {
    fields = Object.fromEntries(new FormData(form));
    enquiry = buildEnquiry(fields);
  } catch (error) {
    showStatus(error.message);
    return;
  }
  if (!deliveryEnabled) {
    showStatus('Your message is ready to copy. This preview has not sent an email.', enquiry.text);
    return;
  }
  setSubmitting(true);
  showStatus('Sending your enquiry…');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 18000);
  let feedback;
  try {
    await submitEnquiry(fields, {key:fields.access_key, signal:controller.signal});
    form.reset();
    updateCount();
    feedback = ['Thank you — your enquiry has been submitted to THEAICOMP.'];
  } catch (error) {
    feedback = [error.name === 'AbortError'
      ? 'We could not confirm whether your enquiry was sent. Your message is still here; please check before retrying.'
      : error instanceof TypeError
        ? 'We could not connect. Please try again or copy your message below.'
        : error.message, enquiry.text];
  } finally {
    clearTimeout(timeout);
    setSubmitting(false);
  }
  showStatus(...feedback);
});
copy?.addEventListener('click', async () => {
  if (!prepared.value) return;
  try {
    await navigator.clipboard.writeText(prepared.value);
    copy.textContent = 'Message copied';
    status.textContent = 'Copied. Paste this into a new email to theaicompltd@gmail.com, then send.';
  } catch {
    prepared.focus();
    prepared.select();
    prepared.setSelectionRange(0, prepared.value.length);
    status.textContent = 'Your message is selected. Use Copy on your device (Ctrl+C or Cmd+C), then paste it into your email app.';
  }
});
// A disabled initial button prevents a default GET containing form data if JS fails.
if (submitButton) submitButton.disabled = false;
