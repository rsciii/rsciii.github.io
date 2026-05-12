function openModal(id) {
  document.getElementById(id).style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id).style.display = 'none';
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', () => {

  // Modal: open
  document.getElementById('acronyms-open').addEventListener('click', (e) => {
    e.preventDefault();
    openModal('acronyms-overlay');
  });

  // Modal: close on overlay background click
  document.getElementById('acronyms-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal('acronyms-overlay');
  });

  // Modal: close buttons
  document.querySelector('#acronyms-overlay .close-btn').addEventListener('click', () => closeModal('acronyms-overlay'));
  document.querySelector('#fantasy-overlay .close-btn').addEventListener('click', () => closeModal('fantasy-overlay'));

  // Fantasy modal: open
  document.getElementById('fantasy-open').addEventListener('click', (e) => {
    e.preventDefault();
    openModal('fantasy-overlay');
  });

  // Birthday modal: open
  document.getElementById('birthday-open').addEventListener('click', (e) => {
    e.preventDefault();
    openModal('birthday-overlay');
  });

  // Birthday modal: close on overlay background click
  document.getElementById('birthday-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal('birthday-overlay');
  });

  // Birthday modal: close button
  document.querySelector('#birthday-overlay .close-btn').addEventListener('click', () => closeModal('birthday-overlay'));

  // 30 clients modal: open
  document.getElementById('thirtyclients-open').addEventListener('click', (e) => {
    e.preventDefault();
    openModal('thirtyclients-overlay');
  });

  // 30 clients modal: close on overlay background click
  document.getElementById('thirtyclients-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal('thirtyclients-overlay');
  });

  // 30 clients modal: close button
  document.querySelector('#thirtyclients-overlay .close-btn').addEventListener('click', () => closeModal('thirtyclients-overlay'));

  // Fantasy modal: close on overlay background click
  document.getElementById('fantasy-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal('fantasy-overlay');
  });

  // Client logo tabs
  document.querySelectorAll('.logo-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.logo-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.logo-grid').forEach(g => g.classList.add('hidden'));
      tab.classList.add('active');
      document.getElementById('tab-' + tab.dataset.tab).classList.remove('hidden');
    });
  });

  // World map
  new jsVectorMap({
    selector: '#world-map',
    map: 'world',
    backgroundColor: '#18181f',
    zoomOnScroll: false,
    zoomButtons: false,
    regionStyle: {
      initial: {
        fill: '#2a2a35',
        stroke: 'rgba(255,255,255,0.06)',
        strokeWidth: 0.5,
      },
      hover: {
        fill: '#63dcb4',
        fillOpacity: 0.5,
        cursor: 'default',
      },
    },
    selectedRegionStyle: {
      fill: '#63dcb4',
      stroke: 'rgba(99,220,180,0.4)',
      strokeWidth: 1,
    },
    selectedRegions: ['US', 'CA', 'MX', 'GB', 'IE', 'IT', 'VA', 'MC', 'BE', 'NL', 'FR', 'ES', 'AU', 'NZ'],
  });

  // Gallery: thumbnail click swaps main image and updates active opacity
  document.querySelectorAll('.gallery-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      document.getElementById('aus-main').src = thumb.src;
      thumb.parentElement.querySelectorAll('.gallery-thumb').forEach(t => {
        t.style.opacity = t === thumb ? '1' : '0.5';
      });
    });
  });

});
