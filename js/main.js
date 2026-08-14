/**
 * Hair Salon - Main JavaScript
 * All content is dynamically generated from JSON files
 */

let salonData = {};
let siteDesignData = {};
let menuData = null;
let pendingMenuId = null;
let pendingContactServiceValue = null;
let staffData = [];
let pendingContactStaffId = null;
const serviceDetailCache = new Map();
const conceptSectionIds = Array.from({ length: 10 }, (_, index) => `concept${String(index + 1).padStart(2, '0')}`);

function getFirstConceptSection() {
  return Array.from(document.querySelectorAll('section[id]'))
    .find(section => /^concept(?:0[1-9]|10)$/i.test(section.id)) || null;
}

function scrollToFirstConceptSection() {
  const firstConceptSection = getFirstConceptSection();
  if (!firstConceptSection) return;

  requestAnimationFrame(() => {
    firstConceptSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function applyContactServiceSelection(value) {
  const select = document.getElementById('service');
  const requestedValue = String(value ?? '').trim();

  if (!select) {
    pendingContactServiceValue = requestedValue;
    return;
  }

  const matchingOption = requestedValue
    ? Array.from(select.options).find(option => option.value.toLowerCase() === requestedValue.toLowerCase())
    : null;
  const fallbackOption = Array.from(select.options).find(option => option.value === '') || select.options[0];

  select.value = matchingOption ? matchingOption.value : (fallbackOption?.value || '');
  if (!matchingOption && fallbackOption) {
    select.selectedIndex = fallbackOption.index;
  }
  pendingContactServiceValue = null;
}

function initializeContactLinkNavigation() {
  document.addEventListener('click', event => {
    const link = event.target.closest('a[data-contact-service]');
    if (!link) return;

    applyContactServiceSelection(link.getAttribute('data-contact-service') || '');
  });
}

function initializeMenuLinkNavigation() {
  document.addEventListener('click', event => {
    const link = event.target.closest('a[data-menu-category]');
    if (!link) return;

    navigateToMenuCategory(link.getAttribute('data-menu-category') || '');
  });
}

function getStaffMemberById(staffId) {
  return staffData.find(member => member.id === staffId) || null;
}

function applyStaffContactMessage(staffId) {
  const textarea = document.getElementById('message');
  const normalizedStaffId = String(staffId || '').trim();
  const member = getStaffMemberById(normalizedStaffId);
  const staffName = member?.name || normalizedStaffId;

  if (!textarea) {
    pendingContactStaffId = normalizedStaffId;
    return;
  }

  const template = `【担当スタッフ ${staffName} 希望】\n・ご希望の日時\n・ご希望のスタイル\n・その他のご要望事項。`;
  const previousTemplate = textarea.dataset.staffContactTemplate || '';
  let remainingMessage = textarea.value;

  if (previousTemplate && remainingMessage.startsWith(previousTemplate)) {
    remainingMessage = remainingMessage.slice(previousTemplate.length).replace(/^\n/, '');
  }

  textarea.value = remainingMessage
    ? `${template}\n${remainingMessage}`
    : template;
  textarea.dataset.staffContactTemplate = template;
  textarea.dispatchEvent(new Event('input', { bubbles: true }));
  textarea.focus();
  pendingContactStaffId = null;
}

function initializeStaffContactNavigation() {
  const handleStaffContact = event => {
    const target = event.target.closest?.('[data-contact-staff-id]');
    if (!target) return;
    if (event.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    event.stopPropagation();
    applyStaffContactMessage(target.getAttribute('data-contact-staff-id') || '');
  };

  document.addEventListener('click', handleStaffContact, true);
  document.addEventListener('keydown', handleStaffContact, true);
}

function initializeConceptAnchorNavigation() {
  const handleConceptHash = () => {
    if (window.location.hash.toLowerCase() === '#concept') {
      scrollToFirstConceptSection();
    }
  };

  document.addEventListener('click', event => {
    const link = event.target.closest('a[href="index.html#concept"], a[href="#concept"]');
    if (!link) return;

    const firstConceptSection = getFirstConceptSection();
    if (!firstConceptSection) return;

    event.preventDefault();
    history.pushState(null, '', 'index.html#concept');
    scrollToFirstConceptSection();
  });

  window.addEventListener('hashchange', handleConceptHash);
  handleConceptHash();
}

document.addEventListener('DOMContentLoaded', () => {
  // Load salon.json and site-design.json before rendering the page
  Promise.all([loadSalonData(), loadSiteDesign()]).then(() => {
    renderHeader();
    renderHero();
    renderConceptSections();
    renderCosmetologySections();
    renderServicesSection();
    renderMenuSection();
    renderOurStorySection();
    renderRelaxingSpaceSection();
    renderFirstTimeGuestsSection();
    renderTotalBeautySection();
    renderStaffSection();
    renderGallerySection();
    renderFaqSection();
    renderAccessSection();
    renderFinalMessageSection();
    renderContactSection();
    renderFooter();
    
    // Initialize interactions
    initializeInteractions();
    initializeContactLinkNavigation();
    initializeMenuLinkNavigation();
    initializeStaffContactNavigation();
    initializeConceptAnchorNavigation();
  });
});

// ===== Load Salon Data =====
async function loadSalonData() {
  try {
    const response = await fetch(`./data/salon.json?ts=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to load salon.json');
    salonData = await response.json();
    return salonData;
  } catch (err) {
    console.error('Salon data load error:', err);
  }
}

// ===== Load Site Design =====
async function loadSiteDesign() {
  try {
    const response = await fetch(`./data/site-design.json?ts=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to load site-design.json');
    siteDesignData = await response.json();
    applySiteDesign(siteDesignData);
    return siteDesignData;
  } catch (err) {
    console.error('Site design load error:', err);
    return {};
  }
}

function applySiteDesign(design) {
  const root = document.documentElement;
  const colors = design.colors || {};
  const fonts = design.fonts || {};
  const filming = design.filming || {};
  const colorValue = (key, fallback) => colors[key]?.value || fallback;
  const fontFamily = (key, fallback) => fonts[key]?.family || fallback;

  root.style.setProperty('--color-bg', colorValue('base', '#faf9f6'));
  root.style.setProperty('--color-white', colorValue('base', '#faf9f6'));
  root.style.setProperty('--color-accent', colorValue('sub', '#eae6e0'));
  root.style.setProperty('--color-border', colorValue('sub', '#eae6e0'));
  root.style.setProperty('--color-text', colorValue('text', '#333333'));
  root.style.setProperty('--color-secondary', colorValue('text', '#333333'));
  root.style.setProperty('--color-primary', colorValue('accent', '#8faec4'));
  root.style.setProperty('--color-primary-light', colorValue('accent', '#8faec4'));
  root.style.setProperty('--color-helper', colorValue('helper', '#a8b5a3'));
  root.style.setProperty('--color-text-light', colorValue('text', '#333333'));
  root.style.setProperty('--font-heading', fontFamily('english', "'Cormorant Garamond', serif"));
  root.style.setProperty('--font-english', fontFamily('english', "'Cormorant Garamond', serif"));
  root.style.setProperty('--font-japanese-heading', fontFamily('japaneseHeading', "'Noto Serif JP', serif"));
  root.style.setProperty('--font-body', fontFamily('japaneseBody', "'Noto Sans JP', sans-serif"));
  root.style.setProperty('--filming-font-family', filming.fontFamily || fontFamily('japaneseHeading', "'Noto Serif JP', serif"));
  root.style.setProperty('--filming-color', filming.color || colorValue('sub', '#eae6e0'));
  root.style.setProperty('--filming-background', filming.backgroundColor || colorValue('sub', '#eae6e0'));

  const fontValues = [fonts.english?.googleFont, fonts.japaneseHeading?.googleFont, fonts.japaneseBody?.googleFont]
    .filter(Boolean);
  if (fontValues.length) {
    let fontLink = document.getElementById('site-design-fonts');
    if (!fontLink) {
      fontLink = document.createElement('link');
      fontLink.id = 'site-design-fonts';
      fontLink.rel = 'stylesheet';
      document.head.appendChild(fontLink);
    }
    fontLink.href = `https://fonts.googleapis.com/css2?${fontValues.map(value => `family=${value}`).join('&')}&display=swap`;
  }
}

// ===== Resolve Link Targets =====
function resolveLinkTarget(value) {
  const rawUrl = String(value || '#').trim();

  const contactStaffMatch = rawUrl.match(/^CONTACT-STAFF-(.+)$/i);
  if (contactStaffMatch) {
    return {
      href: '#contact',
      target: '',
      contactStaffId: contactStaffMatch[1].trim()
    };
  }

  const contactMatch = rawUrl.match(/^CONTACT(?:-(.*))?$/i);
  if (contactMatch) {
    return {
      href: '#contact',
      target: '',
      contactServiceValue: contactMatch[1] === undefined ? null : contactMatch[1].trim()
    };
  }

  const menuMatch = rawUrl.match(/^MENU(?:-(.*))?$/i);
  if (menuMatch) {
    return {
      href: '#menu',
      target: '',
      menuCategoryId: menuMatch[1] === undefined ? null : menuMatch[1].trim()
    };
  }

  if (rawUrl.startsWith('#')) {
    return { href: rawUrl, target: '' };
  }

  // CONCEPT01〜CONCEPT10は、共通アンカーであるindex.html#conceptへ統一します。
  // 実際のスクロール先は、ページ内で最初に存在するCONCEPTXXセクションです。
  if (/^CONCEPT(?:0[1-9]|10)$/i.test(rawUrl)) {
    return { href: 'index.html#concept', target: '' };
  }

  // COSMETOLOGY01〜COSMETOLOGY20は、個別のセクションへ直接ジャンプします。
  if (/^COSMETOLOGY(?:0[1-9]|1[0-9]|20)$/i.test(rawUrl)) {
    return { href: `#${rawUrl.toLowerCase()}`, target: '' };
  }

  // SERVICES、OUR STORY、FINAL MESSAGEなど、その他のセクションコメント内の
  // 識別子は対応するsection idへ変換します。
  if (/^[A-Za-z0-9]+(?:[\s_-]+[A-Za-z0-9]+)*$/.test(rawUrl)) {
    const sectionId = rawUrl.toLowerCase().replace(/[\s_]+/g, '-');
    return { href: `#${sectionId}`, target: '' };
  }

  return {
    href: rawUrl || '#',
    target: ' target="_blank" rel="noopener noreferrer"'
  };
}

// ===== Render Header =====
function renderHeader() {
  const header = document.getElementById('header');
  
  let navHtml = '<ul class="nav-links" id="nav-links">';
  salonData.navigation?.forEach(item => {
    navHtml += `<li><a href="${item.url}" class="${item.isButton ? 'nav-reserve-btn' : ''}">${item.name}</a></li>`;
  });
  navHtml += '</ul>';

  header.innerHTML = `
    <div class="container">
      <div class="header-inner">
        <a href="#hero" class="logo" aria-label="${salonData.name} トップへ">
          <span class="logo-main">${escapeHtml(salonData.name)}</span>
          <span class="logo-sub">${escapeHtml(salonData.nameSub)}</span>
        </a>
        <nav aria-label="メインナビゲーション">
          ${navHtml}
        </nav>
        <button
          class="hamburger"
          id="hamburger"
          aria-label="メニューを開く"
          aria-expanded="false"
          aria-controls="nav-links"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  `;

  // Attach hamburger event
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded',
        navLinks.classList.contains('open') ? 'true' : 'false'
      );
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }
}

// ===== Render Hero =====
function renderHero() {
  const hero = document.getElementById('hero');
  const heroData = salonData.hero;

  hero.innerHTML = `
    <div class="hero-bg" style="background-image: url('${heroData.backgroundImage}');" role="img" aria-label="美容室の内装イメージ"></div>
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <div class="hero-badge">${escapeHtml(salonData.nameSub)}</div>
      <h1 class="hero-title">
        <span>${escapeHtml(heroData.subtitle)}</span>
        ${escapeHtml(salonData.name)}
      </h1>
      <p class="hero-tagline">${escapeHtml(heroData.tagline)}</p>
      <div class="hero-buttons">
        <a href="#contact" class="btn btn-primary">${escapeHtml(heroData.reserveBtnText)}</a>
        <a href="#menu" class="btn btn-outline">${escapeHtml(heroData.menuBtnText)}</a>
      </div>
    </div>
    <div class="hero-scroll" aria-hidden="true">SCROLL</div>
  `;

  setTimeout(() => {
    hero.classList.add('loaded');
  }, 100);
}

// ===== Render Dynamic Sections (Concept & Cosmetology) =====
async function renderDynamicSections(prefix, count) {
  const sectionIds = Array.from({ length: count }, (_, index) => `${prefix}${String(index + 1).padStart(2, '0')}`);

  await Promise.all(sectionIds.map(async sectionId => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const fileName = `./data/${sectionId}.json?ts=${Date.now()}`;
    try {
      const response = await fetch(fileName, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const container = section.querySelector('.container');
      if (!container) return;

      const hasImage = typeof data.image === 'string' && data.image.trim() !== '';
      const features = Array.isArray(data.features) ? data.features.filter(Boolean) : [];
      const hasFeatures = features.length > 0;
      const layoutClass = !hasImage && !hasFeatures
        ? 'concept-grid concept-grid--text-only'
        : !hasImage
          ? 'concept-grid concept-grid--no-image'
          : !hasFeatures
            ? 'concept-grid concept-grid--no-features'
            : 'concept-grid';

      const featuresHtml = features.map(feature => `
        <div class="concept-feature">
          <span class="concept-feature-icon">${feature.icon || ''}</span>
          <div>
            <h4>${escapeHtml(feature.title || '')}</h4>
            <p>${escapeHtml(feature.description || '')}</p>
          </div>
        </div>
      `).join('');

      const paragraphsHtml = (data.paragraphs || [])
        .map(para => `<p>${escapeHtmlWithLineBreaks(para)}</p>`)
        .join('');

      const linksHtml = (data.links || []).map(link => {
        const title = escapeHtml(link.title || 'リンク');
        const color = escapeHtml(link.color || 'var(--color-primary)');
        const resolvedLink = resolveLinkTarget(link.url);
        const href = escapeHtml(resolvedLink.href);
        const contactServiceAttribute = resolvedLink.contactServiceValue !== undefined && resolvedLink.contactServiceValue !== null
          ? ` data-contact-service="${escapeHtml(resolvedLink.contactServiceValue)}"`
          : '';
        const menuCategoryAttribute = resolvedLink.menuCategoryId !== undefined && resolvedLink.menuCategoryId !== null
          ? ` data-menu-category="${escapeHtml(resolvedLink.menuCategoryId)}"`
          : '';
        const contactStaffAttribute = resolvedLink.contactStaffId !== undefined && resolvedLink.contactStaffId !== null
          ? ` data-contact-staff-id="${escapeHtml(resolvedLink.contactStaffId)}"`
          : '';

        return `<a class="concept-link-button" href="${href}"${resolvedLink.target}${contactServiceAttribute}${menuCategoryAttribute}${contactStaffAttribute} style="--concept-link-color:${color}">${title}</a>`;
      }).join('');

      const imageHtml = hasImage
        ? `
          <div class="concept-image reveal">
            <img src="${escapeHtml(data.image)}" alt="${escapeHtml(data.title || 'セクション画像')}" loading="lazy">
          </div>
        `
        : '';
      const featuresBlockHtml = hasFeatures
        ? `<div class="concept-features">${featuresHtml}</div>`
        : '';

      container.innerHTML = `
        <div class="${layoutClass}">
          ${imageHtml}
          <div class="concept-text reveal">
            <p class="section-subtitle">${escapeHtml(data.subtitle || '')}</p>
            <h2 class="section-title">${data.title || ''}</h2>
            <div class="section-divider"></div>
            ${paragraphsHtml}
            ${featuresBlockHtml}
            ${linksHtml ? `<div class="concept-links">${linksHtml}</div>` : ''}
          </div>
        </div>
      `;

      observeRevealElements(container);
    } catch (err) {
      console.error(`${sectionId} load error:`, err);
    }
  }));
}

async function renderConceptSections() {
  await renderDynamicSections('concept', 10);
}

async function renderCosmetologySections() {
  await renderDynamicSections('cosmetology', 20);
}

// ===== Render Services Section =====
async function renderServicesSection() {
  try {
    const response = await fetch(`./data/service.json?ts=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to load service.json');
    const data = await response.json();

    const container = document.querySelector('#services .container');
    
    let servicesHtml = '';
    data.items?.forEach(service => {
      servicesHtml += `
        <article class="service-card reveal" data-menuid="${escapeHtml(service.menuid || '')}" tabindex="0" role="button" aria-expanded="false" aria-label="${escapeHtml(service.title)}の詳細を表示">
          <div class="service-card-image">
            <img src="${service.image}" alt="${escapeHtml(service.title)}" loading="lazy">
          </div>
          <div class="service-card-body">
            <h3>${escapeHtml(service.title)}</h3>
            <p>${escapeHtml(service.description)}</p>
            <span class="service-card-price">${escapeHtml(service.price)}</span>
          </div>
        </article>
      `;
    });

    container.innerHTML = `
      <p class="section-subtitle reveal">${escapeHtml(data.subtitle)}</p>
      <h2 class="section-title reveal">${escapeHtml(data.title)}</h2>
      <div class="section-divider reveal"></div>
      <div class="services-grid">
        ${servicesHtml}
      </div>
    `;

    observeRevealElements(container);
    bindServiceCardNavigation();
  } catch (err) {
    console.error('Services load error:', err);
  }
}

// ===== Render Menu Section =====
async function renderMenuSection() {
  try {
    const response = await fetch(`./data/menu.json?ts=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to load menu.json');
    const data = await response.json();
    menuData = data;

    const container = document.querySelector('#menu .container');
    
    // Render tabs
    let tabsHtml = '';
    data.categories?.forEach((cat, index) => {
      tabsHtml += `
        <button class="menu-tab ${index === 0 ? 'active' : ''}" data-target="panel-${cat.id}">
          ${cat.icon} ${escapeHtml(cat.name)}
        </button>
      `;
    });

    // Render panels
    let panelsHtml = '';
    data.categories?.forEach((cat, catIndex) => {
      let rowsHtml = '';
      cat.items?.forEach(item => {
        rowsHtml += `
          <tr>
            <td>
              <div class="menu-item-name">
                ${escapeHtml(item.name)}
                ${item.popular ? '<span class="badge-popular">人気</span>' : ''}
              </div>
              <div class="menu-item-desc">${escapeHtml(item.description)}</div>
            </td>
            <td class="menu-item-price">¥${item.price.toLocaleString()}</td>
            <td class="menu-item-duration">約${item.duration}分</td>
          </tr>
        `;
      });

      panelsHtml += `
        <div class="menu-panel ${catIndex === 0 ? 'active' : ''}" id="panel-${cat.id}">
          <table class="menu-table">
            <thead>
              <tr>
                <th>メニュー</th>
                <th>料金（税込）</th>
                <th>所要時間</th>
              </tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </div>
      `;
    });

    let notesHtml = '';
    data.notes?.forEach(note => {
      notesHtml += `<p>${escapeHtml(note)}</p>`;
    });

    container.innerHTML = `
      <p class="section-subtitle reveal">Menu &amp; Price</p>
      <h2 class="section-title reveal">メニュー・料金表</h2>
      <div class="section-divider reveal"></div>
      <div id="menu-container" class="reveal">
        <div class="menu-tabs" id="menu-tabs" role="tablist" aria-label="メニューカテゴリ">
          ${tabsHtml}
        </div>
        <div id="menu-panels">
          ${panelsHtml}
        </div>
        <div class="menu-notes" id="menu-notes">
          ${notesHtml}
        </div>
      </div>
    `;

    // Attach tab event listeners
    document.querySelectorAll('.menu-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        activateMenuCategory(btn.dataset.target.replace(/^panel-/, ''), false);
      });
    });

    if (pendingMenuId !== null) {
      const requestedMenuId = pendingMenuId;
      pendingMenuId = null;
      activateMenuCategory(requestedMenuId, true);
    }

    observeRevealElements(container);
  } catch (err) {
    console.error('Menu load error:', err);
  }
}

// ===== Service Detail and Menu Navigation =====
function bindServiceCardNavigation() {
  document.querySelectorAll('#services .service-card').forEach(card => {
    const openDetail = () => {
      if (card.classList.contains('is-detail-open')) return;
      showServiceDetail(card);
    };

    card.addEventListener('click', openDetail);
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openDetail();
      }
    });
  });
}

async function showServiceDetail(card) {
  const menuId = card.dataset.menuid || '';
  const serviceTitle = card.querySelector('.service-card-body h3')?.textContent || 'サービス詳細';
  const detail = await loadServiceDetail(menuId);

  if (!detail) {
    console.error(`Service detail not found: data/service-${menuId}.json`);
    return;
  }

  card.classList.add('is-detail-open');
  card.setAttribute('aria-expanded', 'true');
  card.setAttribute('aria-label', `${serviceTitle}の詳細を閉じる`);

  const detailElement = document.createElement('div');
  detailElement.className = 'service-detail';
  detailElement.setAttribute('role', 'dialog');
  detailElement.setAttribute('aria-label', detail.title || `${serviceTitle}の詳細`);
  detailElement.innerHTML = `
    <div class="service-detail-scroll" tabindex="0">
      <h3 class="service-detail-title">${escapeHtml(detail.title || serviceTitle)}</h3>
      <div class="service-detail-body">${detail.content || ''}</div>
    </div>
    <div class="service-detail-footer">
      <a href="#menu" class="service-menu-link">メニューを見る →</a>
    </div>
  `;

  card.appendChild(detailElement);

  detailElement.querySelector('.service-detail-scroll').addEventListener('click', event => {
    event.stopPropagation();
    closeServiceDetail(card);
  });

  detailElement.querySelector('.service-menu-link').addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    closeServiceDetail(card);
    navigateToMenuCategory(menuId);
  });

  startDetailAutoScroll(detailElement.querySelector('.service-detail-scroll'));
}

async function loadServiceDetail(menuId) {
  if (!menuId) return null;
  if (serviceDetailCache.has(menuId)) return serviceDetailCache.get(menuId);

  try {
    const response = await fetch(`./data/service-${encodeURIComponent(menuId)}.json?ts=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const detail = await response.json();
    serviceDetailCache.set(menuId, detail);
    return detail;
  } catch (error) {
    console.error(`Failed to load service-${menuId}.json`, error);
    return null;
  }
}

function closeServiceDetail(card) {
  const detailElement = card.querySelector('.service-detail');
  detailElement?.remove();
  card.classList.remove('is-detail-open');
  card.setAttribute('aria-expanded', 'false');
  card.setAttribute('aria-label', `${card.querySelector('.service-card-body h3')?.textContent || 'サービス'}の詳細を表示`);
}

function startDetailAutoScroll(scrollElement) {
  if (!scrollElement || scrollElement.scrollHeight <= scrollElement.clientHeight) return;

  let paused = false;
  let reachedBottom = false;
  const step = () => {
    if (!document.body.contains(scrollElement) || reachedBottom) return;
    if (!paused) {
      scrollElement.scrollTop += 0.35;
      if (scrollElement.scrollTop + scrollElement.clientHeight >= scrollElement.scrollHeight - 1) {
        reachedBottom = true;
      }
    }
    requestAnimationFrame(step);
  };

  scrollElement.addEventListener('mouseenter', () => { paused = true; });
  scrollElement.addEventListener('mouseleave', () => { paused = false; });
  scrollElement.addEventListener('touchstart', () => { paused = true; }, { passive: true });
  scrollElement.addEventListener('touchend', () => { paused = false; }, { passive: true });
  requestAnimationFrame(step);
}

function navigateToMenuCategory(menuId) {
  if (!menuData) {
    pendingMenuId = menuId;
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  activateMenuCategory(menuId, true);
}

function activateMenuCategory(menuId, shouldScroll = true) {
  const categories = menuData?.categories || [];
  const matchedCategory = categories.find(category => category.id === menuId);
  const fallbackCategory = categories.find(category => category.id === 'coupon') || categories[0];
  const category = matchedCategory || fallbackCategory;

  if (!category) return;

  document.querySelectorAll('.menu-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.target === `panel-${category.id}`);
  });
  document.querySelectorAll('.menu-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === `panel-${category.id}`);
  });

  if (shouldScroll) {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ===== Render New Editorial Sections =====
async function renderOurStorySection() {
  try {
    const data = await fetchJsonFile('./data/story.json');
    const container = document.querySelector('#our-story .container');
    const paragraphsHtml = (data.paragraphs || []).map(paragraph =>
      `<p class="editorial-copy">${escapeHtml(paragraph)}</p>`
    ).join('');

    container.innerHTML = `
      <div class="editorial-layout editorial-story reveal">
        <div class="editorial-heading">
          <p class="section-subtitle">${escapeHtml(data.title)}</p>
          <h2 class="section-title">${escapeHtml(data.subtitle)}</h2>
          <div class="section-divider"></div>
        </div>
        <div class="editorial-content">${paragraphsHtml}</div>
      </div>
    `;
    observeRevealElements(container);
  } catch (err) {
    console.error('Our Story load error:', err);
  }
}

async function renderRelaxingSpaceSection() {
  try {
    const data = await fetchJsonFile('./data/space.json');
    const container = document.querySelector('#relaxing-space .container');
    const optionsHtml = (data.guide?.options || []).map(option =>
      `<li>${escapeHtml(option)}</li>`
    ).join('');

    container.innerHTML = `
      <div class="editorial-layout editorial-space reveal">
        <div class="editorial-heading">
          <p class="section-subtitle">${escapeHtml(data.title)}</p>
          <h2 class="section-title">${escapeHtml(data.subtitle)}</h2>
          <div class="section-divider"></div>
        </div>
        <div class="editorial-content">
          <p class="editorial-copy">${escapeHtml(data.content)}</p>
          <div class="editorial-note">
            <h3>${escapeHtml(data.guide?.title || '')}</h3>
            <p class="editorial-copy">${escapeHtml(data.guide?.description || '')}</p>
            <ul class="editorial-list">${optionsHtml}</ul>
            <p class="editorial-copy">${escapeHtml(data.guide?.note || '')}</p>
          </div>
        </div>
      </div>
    `;
    observeRevealElements(container);
  } catch (err) {
    console.error('Relaxing Space load error:', err);
  }
}

async function renderFirstTimeGuestsSection() {
  try {
    const data = await fetchJsonFile('./data/guide.json');
    const container = document.querySelector('#first-time-guests .container');
    const stepsHtml = (data.steps || []).map(step => `
      <li class="guide-step">
        <span class="guide-step-number">${escapeHtml(step.number)}</span>
        <div>
          <h3>${escapeHtml(step.title)}</h3>
          <p class="editorial-copy">${escapeHtml(step.description)}</p>
        </div>
      </li>
    `).join('');

    container.innerHTML = `
      <div class="editorial-layout editorial-guide reveal">
        <div class="editorial-heading">
          <p class="section-subtitle">${escapeHtml(data.title)}</p>
          <h2 class="section-title">${escapeHtml(data.subtitle)}</h2>
          <div class="section-divider"></div>
        </div>
        <div class="editorial-content">
          <p class="editorial-copy">${escapeHtml(data.intro)}</p>
          <div class="guide-flow">
            <h3 class="editorial-subheading">${escapeHtml(data.flowTitle || '')}</h3>
            <ol class="guide-steps">${stepsHtml}</ol>
          </div>
        </div>
      </div>
    `;
    observeRevealElements(container);
  } catch (err) {
    console.error('First-time Guests load error:', err);
  }
}

async function renderTotalBeautySection() {
  try {
    const data = await fetchJsonFile('./data/total_beauty.json');
    const container = document.querySelector('#total-beauty .container');

    container.innerHTML = `
      <div class="editorial-layout editorial-total reveal">
        <div class="editorial-heading">
          <p class="section-subtitle">${escapeHtml(data.title)}</p>
          <h2 class="section-title">${escapeHtml(data.subtitle)}</h2>
          <div class="section-divider"></div>
        </div>
        <div class="editorial-content">
          <p class="editorial-copy">${escapeHtml(data.content)}</p>
          <p class="editorial-caution">${escapeHtml(data.note)}</p>
        </div>
      </div>
    `;
    observeRevealElements(container);
  } catch (err) {
    console.error('Total Beauty load error:', err);
  }
}

async function fetchJsonFile(path) {
  const separator = path.includes('?') ? '&' : '?';
  const response = await fetch(`${path}${separator}ts=${Date.now()}`, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Failed to load ${path}`);
  return response.json();
}

// ===== Render Staff Section =====
async function renderStaffSection() {
  try {
    const response = await fetch(`./data/staff.json?ts=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to load staff.json');
    const data = await response.json();
    staffData = Array.isArray(data.staff) ? data.staff : [];

    const container = document.querySelector('#staff .container');
    
    let staffHtml = '';
    data.staff?.forEach(member => {
      const instagramValue = String(member.instagram || '').trim();
      const isFilming = instagramValue.toUpperCase() === 'FILMING';
      const contactButton = member.contactButton || {};
      const contactButtonHtml = `
        <button type="button" class="staff-contact-button" data-contact-staff-id="${escapeHtml(member.id)}" style="--staff-contact-color:${escapeHtml(contactButton.color || '#8faec4')}">
          ${escapeHtml(contactButton.title || 'このスタッフを指名して相談')}
        </button>
      `;
      const cardContent = `
        <div class="staff-card-image">
          <img src="${member.image}" alt="${escapeHtml(member.name)}" loading="lazy"
            onerror="this.src='https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop'">
        </div>
        <div class="staff-card-body">
          <h3 class="staff-name">${escapeHtml(member.name)}</h3>
          <p class="staff-role">${escapeHtml(member.role)}</p>
          <span class="staff-speciality">得意分野：${escapeHtml(member.speciality)}</span>
          <p class="staff-message">${escapeHtml(member.message)}</p>
          ${instagramValue ? '<div class="staff-insta-icon">📷 Instagram</div>' : ''}
          ${contactButtonHtml}
        </div>
      `;

      if (isFilming) {
        staffHtml += `
          <div class="staff-card filming-card reveal" role="button" tabindex="0" aria-pressed="false" aria-label="撮影中。クリックで表示を切り替えます">
            <div class="filming-normal-view">${cardContent}</div>
            <div class="filming-screen" aria-hidden="true"><span>撮影中</span></div>
          </div>
        `;
      } else if (instagramValue) {
        staffHtml += `
          <a href="${escapeHtml(instagramValue)}" target="_blank" rel="noopener noreferrer" class="staff-card reveal">
            ${cardContent}
          </a>
        `;
      } else {
        staffHtml += `
          <div class="staff-card reveal">
            ${cardContent}
          </div>
        `;
      }
    });

    container.innerHTML = `
      <p class="section-subtitle reveal">Our Team</p>
      <h2 class="section-title reveal">スタッフ紹介</h2>
      <div class="section-divider reveal"></div>
      <div class="staff-grid" id="staff-grid">
        ${staffHtml}
      </div>
    `;

    initializeFilmingTargets(container);
    if (pendingContactStaffId !== null) {
      applyStaffContactMessage(pendingContactStaffId);
    }
    observeRevealElements(container);
  } catch (err) {
    console.error('Staff load error:', err);
  }
}

// ===== Render Gallery Section =====
async function renderGallerySection() {
  try {
    const response = await fetch(`./data/gallery.json?ts=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to load gallery.json');
    const data = await response.json();

    const container = document.querySelector('#gallery .container');
    
    let galleryHtml = '';
    data.images?.forEach(image => {
      const thumbnail = image.thumbnail || image.url;
      const instagramValue = String(image.instagram || '').trim();
      const isFilming = instagramValue.toUpperCase() === 'FILMING';
      const imageMarkup = `
        <img src="${escapeHtml(thumbnail)}" alt="${escapeHtml(image.alt || '')}" loading="lazy">
        ${instagramValue && !isFilming ? '<span class="gallery-instagram-label">Instagramで見る</span>' : ''}
      `;
      const itemMarkup = isFilming
        ? `<div class="gallery-item filming-card reveal" role="button" tabindex="0" aria-pressed="false" aria-label="撮影中。クリックで表示を切り替えます"><div class="filming-normal-view">${imageMarkup}</div><div class="filming-screen" aria-hidden="true"><span>撮影中</span></div></div>`
        : instagramValue
          ? `<a href="${escapeHtml(instagramValue)}" target="_blank" rel="noopener noreferrer" class="gallery-item reveal">${imageMarkup}</a>`
          : `<div class="gallery-item reveal">${imageMarkup}</div>`;
      galleryHtml += itemMarkup;
    });

    container.innerHTML = `
      <p class="section-subtitle reveal">${escapeHtml(data.subtitle || 'Gallery')}</p>
      <h2 class="section-title reveal">${escapeHtml(data.title || 'ギャラリー')}</h2>
      <div class="section-divider reveal"></div>
      <div class="gallery-grid">
        ${galleryHtml}
      </div>
    `;

    initializeFilmingTargets(container);
    observeRevealElements(container);
  } catch (err) {
    console.error('Gallery load error:', err);
  }
}

function initializeFilmingTargets(root) {
  root.querySelectorAll('.filming-card').forEach(card => {
    const toggleFilmingScreen = (event) => {
      if (event.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') return;
      if (event.type === 'keydown') event.preventDefault();
      const isFilming = card.classList.toggle('is-filming');
      card.setAttribute('aria-pressed', String(isFilming));
      card.setAttribute('aria-label', isFilming ? '撮影中。クリックで元の画面に戻ります' : '撮影中。クリックで表示を切り替えます');
      const normalView = card.querySelector('.filming-normal-view');
      const filmingScreen = card.querySelector('.filming-screen');
      normalView?.setAttribute('aria-hidden', String(isFilming));
      filmingScreen?.setAttribute('aria-hidden', String(!isFilming));
    };
    card.addEventListener('click', toggleFilmingScreen);
    card.addEventListener('keydown', toggleFilmingScreen);
  });
}

// ===== Render FAQ Section =====
async function renderFaqSection() {
  try {
    const data = await fetchJsonFile('./data/faq.json');
    const container = document.querySelector('#faq .container');
    const itemsHtml = (data.items || []).map((item, index) => `
      <article class="faq-item reveal">
        <button class="faq-question" type="button" aria-expanded="false" aria-controls="faq-answer-${index}">
          <span><b>Q.</b> ${escapeHtml(item.question)}</span>
          <span class="faq-toggle" aria-hidden="true">＋</span>
        </button>
        <div class="faq-answer" id="faq-answer-${index}" hidden>
          <p>${escapeHtml(item.answer)}</p>
        </div>
      </article>
    `).join('');

    container.innerHTML = `
      <p class="section-subtitle reveal">${escapeHtml(data.title || 'FAQ')}</p>
      <h2 class="section-title reveal">${escapeHtml(data.subtitle || 'よくあるご質問')}</h2>
      <div class="section-divider reveal"></div>
      <div class="faq-list">${itemsHtml}</div>
    `;

    container.querySelectorAll('.faq-question').forEach(button => {
      button.addEventListener('click', () => {
        const answer = document.getElementById(button.getAttribute('aria-controls'));
        const isOpen = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!isOpen));
        button.closest('.faq-item')?.classList.toggle('is-open', !isOpen);
        if (answer) answer.hidden = isOpen;
      });
    });

    observeRevealElements(container);
  } catch (err) {
    console.error('FAQ load error:', err);
  }
}

// ===== Render Final Message Section =====
async function renderFinalMessageSection() {
  try {
    const [data, reserveLinks] = await Promise.all([
      fetchJsonFile('./data/final_message.json'),
      fetchJsonFile('./data/reserve-link.json')
    ]);
    const container = document.querySelector('#final-message .container');
    const paragraphsHtml = (data.paragraphs || []).map(paragraph =>
      `<p class="editorial-copy">${escapeHtml(paragraph)}</p>`
    ).join('');
    const reserveLinksHtml = (Array.isArray(reserveLinks) ? reserveLinks : []).map(link => {
      const resolvedLink = resolveLinkTarget(link.url);
      const contactServiceAttribute = resolvedLink.contactServiceValue !== undefined && resolvedLink.contactServiceValue !== null
        ? ` data-contact-service="${escapeHtml(resolvedLink.contactServiceValue)}"`
        : '';
      const menuCategoryAttribute = resolvedLink.menuCategoryId !== undefined && resolvedLink.menuCategoryId !== null
        ? ` data-menu-category="${escapeHtml(resolvedLink.menuCategoryId)}"`
        : '';
      const contactStaffAttribute = resolvedLink.contactStaffId !== undefined && resolvedLink.contactStaffId !== null
        ? ` data-contact-staff-id="${escapeHtml(resolvedLink.contactStaffId)}"`
        : '';
      return `
        <a class="reserve-link-button" href="${escapeHtml(resolvedLink.href)}" style="--reserve-color: ${escapeHtml(link.color || '#b39b7a')}"${resolvedLink.target}${contactServiceAttribute}${menuCategoryAttribute}${contactStaffAttribute}>
          ${escapeHtml(link.title || '')}
        </a>
      `;
    }).join('');

    container.innerHTML = `
      <div class="editorial-layout editorial-final reveal">
        <div class="editorial-heading">
          <p class="section-subtitle">${escapeHtml(data.title || 'FINAL MESSAGE')}</p>
          <h2 class="section-title">${escapeHtml(data.subtitle || '')}</h2>
          <div class="section-divider"></div>
        </div>
        <div class="editorial-content">
          ${paragraphsHtml}
          <div class="reserve-links" aria-label="予約リンク">${reserveLinksHtml}</div>
        </div>
      </div>
    `;
    observeRevealElements(container);
  } catch (err) {
    console.error('Final Message load error:', err);
  }
}

// ===== Render Access Section =====
async function renderAccessSection() {
  try {
    const response = await fetch(`./data/access.json?ts=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to load access.json');
    const data = await response.json();

    const container = document.querySelector('#access .container');
    const contact = salonData.contact || {};
    const businessHours = Array.isArray(contact.businessHours)
      ? contact.businessHours
      : [contact.businessHours?.weekday, contact.businessHours?.weekend].filter(Boolean);
    const phoneDigits = String(contact.phone || '').replace(/[^0-9+]/g, '');
    const commonInfo = [
      {
        label: '住所',
        content: escapeHtml(contact.address || '').replace(/ /g, '<br>')
      },
      {
        label: '電話番号',
        content: `<a href="tel:${escapeHtml(phoneDigits)}" style="color:inherit;">${escapeHtml(contact.phone || '')}</a>`
      },
      {
        label: '営業時間',
        content: businessHours.map(hour => escapeHtml(hour)).join('<br>')
      },
      {
        label: '定休日',
        content: escapeHtml(contact.holiday || contact.businessHours?.holiday || '')
      },
      ...(data.infoDisplay || [])
    ];
    const infoHtml = commonInfo.map(item => `
      <tr>
        <th>${escapeHtml(item.label)}</th>
        <td>${item.content}</td>
      </tr>
    `).join('');

    const embedAddress = contact.address || '';
    const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(embedAddress)}&output=embed`;
    const mapContent = contact.googleMapUrl
      ? `
        <iframe
          class="google-map-embed"
          src="${escapeHtml(embedUrl)}"
          title="${escapeHtml(salonData.name)}のGoogleマップ"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          aria-hidden="true">
        </iframe>
        <span class="map-click-overlay">Googleマップで見る →</span>
      `
      : `
        <div class="map-placeholder">
          <div class="map-icon">📍</div>
          <p class="map-salon-name">${escapeHtml(salonData.name)}</p>
          <p class="map-address">${escapeHtml(contact.address || '')}</p>
          <p class="map-note">${escapeHtml(contact.mapNote || '')}</p>
        </div>
      `;
    const mapHtml = contact.googleMapUrl
      ? `<a class="map-link" href="${escapeHtml(contact.googleMapUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Googleマップで${escapeHtml(salonData.name)}を見る">${mapContent}</a>`
      : mapContent;

    container.innerHTML = `
      <p class="section-subtitle reveal">${escapeHtml(data.subtitle || 'Access')}</p>
      <h2 class="section-title reveal">${escapeHtml(data.title || 'アクセス・店舗情報')}</h2>
      <div class="section-divider reveal"></div>
      <div class="access-grid">
        <div class="access-info reveal">
          <h3>${escapeHtml(salonData.name)}</h3>
          <table class="info-table">
            <tbody>
              ${infoHtml}
            </tbody>
          </table>
        </div>
        <div class="access-map reveal">
          ${mapHtml}
        </div>
      </div>
    `;

    observeRevealElements(container);
  } catch (err) {
    console.error('Access load error:', err);
  }
}

// ===== Render Contact Section =====
async function renderContactSection() {
  try {
    const response = await fetch(`./data/reservation.json?ts=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to load reservation.json');
    const data = await response.json();

    const container = document.querySelector('#contact .container');
    
    let servicesHtml = '';
    data.form.services?.forEach(service => {
      servicesHtml += `<option value="${service.value}">${escapeHtml(service.text)}</option>`;
    });

    container.innerHTML = `
      <div class="contact-inner">
        <p class="section-subtitle reveal">${escapeHtml(data.subtitle)}</p>
        <h2 class="section-title reveal">${escapeHtml(data.title)}</h2>
        <div class="section-divider reveal"></div>
        <p class="reveal">${data.description}</p>

        <form class="contact-form reveal" id="contact-form" novalidate>
          <div class="form-row">
            <div class="form-group">
              <label for="name">${escapeHtml(data.form.nameLabel)}<span class="required">*</span></label>
              <input type="text" id="name" name="name" placeholder="山田 花子" required>
            </div>
            <div class="form-group">
              <label for="phone">${escapeHtml(data.form.phoneLabel)}</label>
              <input type="tel" id="phone" name="phone" placeholder="090-0000-0000">
            </div>
          </div>
          <div class="form-group">
            <label for="email">${escapeHtml(data.form.emailLabel)}<span class="required">*</span></label>
            <input type="email" id="email" name="email" placeholder="example@email.com" required>
          </div>
          <div class="form-group">
            <label for="service">${escapeHtml(data.form.serviceLabel)}</label>
            <select id="service" name="service">
              ${servicesHtml}
            </select>
          </div>
          <div class="form-group">
            <label for="message">${escapeHtml(data.form.messageLabel)}</label>
            <textarea id="message" name="message" placeholder="ご希望の日時やスタイルなどをご記入ください。"></textarea>
          </div>
          <div class="form-submit">
            <button type="submit" class="btn btn-primary">${escapeHtml(data.form.submitButton)}</button>
          </div>
        </form>
      </div>
    `;

    if (pendingContactServiceValue !== null) {
      applyContactServiceSelection(pendingContactServiceValue);
    }
    if (pendingContactStaffId !== null) {
      applyStaffContactMessage(pendingContactStaffId);
    }

    // Attach form event
    const form = document.getElementById('contact-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('.form-submit .btn');
        btn.textContent = '送信しました！';
        btn.style.background = '#4caf50';
        btn.disabled = true;
        setTimeout(() => {
          form.reset();
          btn.textContent = data.form.submitButton;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      });
    }

    observeRevealElements(container);
  } catch (err) {
    console.error('Reservation load error:', err);
  }
}

// ===== Render Footer =====
function renderFooter() {
  const footer = document.getElementById('footer');
  const footerData = salonData.footer || {};
  const contact = salonData.contact || {};
  const businessHours = Array.isArray(contact.businessHours)
    ? contact.businessHours
    : [contact.businessHours?.weekday, contact.businessHours?.weekend].filter(Boolean);
  const holiday = contact.holiday || contact.businessHours?.holiday || '';
  const phoneDigits = String(contact.phone || '').replace(/[^0-9+]/g, '');
  const footerHoursHtml = businessHours.map(hour => `
            <li><a href="#access">🕐 ${escapeHtml(hour)}</a></li>
          `).join('');

  let navHtml = '<ul>';
  salonData.navigation?.forEach(item => {
    if (!item.isButton) {
      navHtml += `<li><a href="${item.url}">${item.name}</a></li>`;
    }
  });
  navHtml += '</ul>';

  footer.innerHTML = `
    <div class="container">
      <div class="footer-inner">
        <div class="footer-brand">
          <span class="logo-main">${escapeHtml(salonData.name)}</span>
          <span class="logo-sub">${escapeHtml(salonData.nameSub)}</span>
          <p>${escapeHtml(footerData.description)}</p>
        </div>

        <div class="footer-col">
          <h4>Navigation</h4>
          ${navHtml}
        </div>

        <div class="footer-col">
          <h4>Info</h4>
          <ul>
            <li><a href="tel:${escapeHtml(phoneDigits)}">📞 ${escapeHtml(contact.phone || '')}</a></li>
            <li><a href="#contact">✉ お問い合わせ</a></li>
            <li><a href="#access">📍 ${escapeHtml(contact.mapNote || '')}</a></li>
            ${footerHoursHtml}
            <li><a href="#access">🚫 ${escapeHtml(holiday)}</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>${escapeHtml(footerData.copyright)}</p>
        <p>${escapeHtml(contact.address || '')}</p>
      </div>
    </div>
  `;
}

// ===== Initialize Interactions =====
function initializeInteractions() {
  // Header scroll effect
  const header = document.getElementById('header');
  const scrollTopBtn = document.getElementById('scroll-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  // Scroll to top
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Observe all reveal elements
  const allRevealElements = document.querySelectorAll('.reveal');
  observeRevealElements(document.body);
}

// ===== Observe Reveal Elements =====
function observeRevealElements(container) {
  const revealElements = container.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

// ===== Utility =====
function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function escapeHtmlWithLineBreaks(value) {
  return escapeHtml(String(value ?? '')).replace(/\r\n|\r|\n/g, '<br>');
}
