'use strict';

// Keep all navigation links available if JavaScript is disabled.
const menu = document.querySelector('.menu');
const nav = document.querySelector('#navigation');
const compact = window.matchMedia('(max-width: 880px)');

function setMenu(open) {
  menu.hidden = !compact.matches;
  nav.hidden = compact.matches && !open;
  menu.setAttribute('aria-expanded', String(compact.matches && open));
}

setMenu(false);
compact.addEventListener('change', () => setMenu(false));
menu.addEventListener('click', () => setMenu(nav.hidden));
nav.addEventListener('click', event => {
  if (compact.matches && event.target.closest('a')) setMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && compact.matches && !nav.hidden) {
    setMenu(false);
    menu.focus();
  }
});

// Service links preselect the inquiry topic. This page creates a prefilled
// draft in the visitor's email app and sends no data itself.
const { email, phone, phoneLabel } = window.practiceContact;
const service = document.querySelector('#service');
const emailLink = document.querySelector('#email');
const phoneLink = document.querySelector('#phone');

function updateEmail() {
  if (!email) return;
  const subject = encodeURIComponent('Consultation inquiry: ' + service.value);
  const body = encodeURIComponent('Hello, I would like to discuss ' + service.value.toLowerCase() + '.\n\nMy name and preferred contact method:\nTime-sensitive deadline, if any:\n');
  emailLink.href = 'mailto:' + email + '?subject=' + subject + '&body=' + body;
  emailLink.hidden = false;
}

service.addEventListener('change', updateEmail);
document.querySelectorAll('[data-service]').forEach(link => {
  link.addEventListener('click', () => {
    service.value = link.dataset.service;
    updateEmail();
  });
});
if (phone) {
  phoneLink.textContent = phoneLabel || phone;
  phoneLink.href = 'tel:' + phone;
  phoneLink.hidden = false;
}
document.querySelector('#contact-pending').hidden = Boolean(email || phone);
updateEmail();
