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

  // Essays: the URL hash is the single source of truth for which one is open,
  // so every piece has a shareable link and back/forward work as expected.
  const ESSAYS = {
    'acronyms':         { overlay: 'acronyms-overlay',     trigger: 'acronyms-open' },
    'capricorn-energy': { overlay: 'birthday-overlay',     trigger: 'birthday-open' },
    'fantasy-football': { overlay: 'fantasy-overlay',      trigger: 'fantasy-open' },
    '30-vc-clients':    { overlay: 'thirtyclients-overlay', trigger: 'thirtyclients-open' },
  };

  function syncEssayFromHash() {
    const slug = decodeURIComponent(location.hash.slice(1));
    Object.entries(ESSAYS).forEach(([s, essay]) => {
      document.getElementById(essay.overlay).style.display = s === slug ? 'flex' : 'none';
    });
    document.body.style.overflow = ESSAYS[slug] ? 'hidden' : '';
  }

  Object.entries(ESSAYS).forEach(([slug, essay]) => {
    document.getElementById(essay.trigger).addEventListener('click', (e) => {
      e.preventDefault();
      location.hash = slug;
    });

    const overlayEl = document.getElementById(essay.overlay);
    overlayEl.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) location.hash = 'blog';
    });
    overlayEl.querySelector('.close-btn').addEventListener('click', () => {
      location.hash = 'blog';
    });
  });

  window.addEventListener('hashchange', syncEssayFromHash);
  syncEssayFromHash();

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && ESSAYS[decodeURIComponent(location.hash.slice(1))]) {
      location.hash = 'blog';
    }
  });

  // Copy a direct link to the open essay
  document.querySelectorAll('.copy-link-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const url = location.origin + location.pathname + '#' + btn.dataset.slug;
      try {
        await navigator.clipboard.writeText(url);
      } catch {
        return;
      }
      btn.textContent = '✓ COPIED';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = '⧉ COPY LINK';
        btn.classList.remove('copied');
      }, 1600);
    });
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
