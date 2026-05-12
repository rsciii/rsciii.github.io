function openModal(id) {
  document.getElementById(id).style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id).style.display = 'none';
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', () => {

  // Mobile nav hamburger
  const overlay = document.getElementById('mobile-nav-overlay');
  document.querySelector('.nav-hamburger').addEventListener('click', () => {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
  document.querySelector('.mobile-nav-close').addEventListener('click', () => {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  });
  document.querySelectorAll('.mobile-nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

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

  // Section collapse/expand
  document.querySelectorAll('.section-header.collapsible').forEach(header => {
    header.addEventListener('click', () => {
      const body = document.getElementById(header.dataset.target);
      const btn = header.querySelector('.section-toggle');
      const isCollapsed = body.classList.toggle('collapsed');
      header.classList.toggle('is-collapsed', isCollapsed);
      btn.textContent = isCollapsed ? '+' : '−';
      // Tighten section padding when collapsed
      const section = header.closest('section');
      if (section) section.classList.toggle('section-is-collapsed', isCollapsed);
    });
  });

  // Blog: filter + pagination
  const POSTS_PER_PAGE = 3;
  let currentFilter = 'all';
  let currentPage = 1;

  function getBlogItems() {
    return Array.from(document.querySelectorAll('#blog-list .blog-item'));
  }

  function getFilteredItems() {
    return getBlogItems().filter(item => {
      if (currentFilter === 'all') return true;
      return item.dataset.year === currentFilter;
    });
  }

  function renderBlog() {
    const allItems = getBlogItems();
    const filtered = getFilteredItems();
    const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
    if (currentPage > totalPages) currentPage = 1;

    const start = (currentPage - 1) * POSTS_PER_PAGE;
    const visible = new Set(filtered.slice(start, start + POSTS_PER_PAGE));

    allItems.forEach(item => {
      item.style.display = visible.has(item) ? '' : 'none';
    });

    document.getElementById('blog-prev').disabled = currentPage === 1;
    document.getElementById('blog-next').disabled = currentPage === totalPages;
    document.getElementById('blog-page-indicator').textContent = `Page ${currentPage} of ${totalPages}`;

    const pagination = document.getElementById('blog-pagination');
    pagination.style.display = totalPages <= 1 ? 'none' : 'flex';
  }

  document.querySelectorAll('.blog-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.blog-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      currentPage = 1;
      renderBlog();
    });
  });

  document.getElementById('blog-prev').addEventListener('click', () => {
    if (currentPage > 1) { currentPage--; renderBlog(); }
  });

  document.getElementById('blog-next').addEventListener('click', () => {
    const totalPages = Math.ceil(getFilteredItems().length / POSTS_PER_PAGE);
    if (currentPage < totalPages) { currentPage++; renderBlog(); }
  });

  renderBlog();

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

  // French Guiana is an overseas territory of FR but Bobby hasn't been to South America
  setTimeout(() => {
    const gf = document.querySelector('#world-map .jvm-region[data-code="GF"]');
    if (gf) gf.setAttribute('fill', '#2a2a35');
  }, 100);

  // US states map
  new jsVectorMap({
    selector: '#us-map',
    map: 'us-aea',
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
    selectedRegions: [
      'US-AK','US-AZ','US-CA','US-CT','US-DE','US-FL','US-GA',
      'US-HI','US-IL','US-KY','US-LA','US-MD','US-MA','US-NE',
      'US-NV','US-NH','US-NJ','US-NY','US-NC','US-OR','US-PA',
      'US-RI','US-SC','US-TN','US-UT','US-VT','US-VA','US-WA',
    ],
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
