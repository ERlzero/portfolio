/* 流离之梦 Portfolio — 交互逻辑
   分层：纯函数 builders（Node 可测） + 薄 DOM 接线（仅浏览器执行） */
(function (root) {
  'use strict';

  /* ---------- 纯函数 builders ---------- */

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function groupByYear(projects) {
    const sorted = projects.slice().sort((a, b) => b.year - a.year);
    const groups = [];
    for (const p of sorted) {
      const last = groups[groups.length - 1];
      if (last && last.year === p.year) last.items.push(p);
      else groups.push({ year: p.year, items: [p] });
    }
    return groups;
  }

  function findProject(projects, id) {
    return projects.find((p) => p.id === id) || null;
  }

  function figNumber(index) {
    return 'fig.' + String(index + 1).padStart(2, '0');
  }

  function projectCardHTML(project, index) {
    return [
      '<article class="project-card reveal" data-id="' + esc(project.id) + '">',
      '<figure class="project-media">',
      '<img src="' + esc(project.cover) + '" alt="' + esc(project.title) + ' 封面" width="800" height="600" loading="lazy"',
      ' onerror="this.parentNode.classList.add(\'is-missing\');this.remove()">',
      '</figure>',
      '<div class="project-info">',
      '<h4 class="project-title">' + esc(project.title) + '</h4>',
      '<p class="project-tagline">' + esc(project.tagline) + '</p>',
      '<p class="project-cta mono">' + figNumber(index) + ' — view case ↗</p>',
      '</div>',
      '<button class="card-hit" type="button" data-open="' + esc(project.id) + '"',
      ' aria-label="查看项目：' + esc(project.title) + '"></button>',
      '</article>'
    ].join('');
  }

  function workHTML(projects) {
    let index = 0;
    return groupByYear(projects).map((group) => {
      const cards = group.items.map((p) => projectCardHTML(p, index++)).join('');
      const label = group.items.length > 1 ? 'projects' : 'project';
      return '<section class="year-group" aria-label="' + group.year + ' 年项目">' +
        '<h3 class="year-label">' + group.year +
        ' <span class="count mono">(' + group.items.length + ' ' + label + ')</span></h3>' +
        cards +
        '</section>';
    }).join('');
  }

  /* ---------- DOM 接线（仅浏览器） ---------- */

  function renderWork(doc) {
    const list = doc.getElementById('project-list');
    if (!list) return;
    const projects = root.PROJECTS;
    if (!Array.isArray(projects) || projects.length === 0) {
      const fallback = doc.getElementById('work-fallback');
      if (fallback) fallback.hidden = false;
      return;
    }
    list.innerHTML = workHTML(projects);
  }

  function overlayHTML(project, index) {
    const stack = project.stack.map((s) => '<li>' + esc(s) + '</li>').join('');
    return [
      '<div class="overlay-head">',
      '<p class="mono">' + figNumber(index) + ' — ' + project.year + '</p>',
      '<button class="overlay-close" type="button" data-close>close ×</button>',
      '</div>',
      '<h3 class="overlay-title" id="overlay-title">' + esc(project.title) + '</h3>',
      '<figure class="overlay-media">',
      '<img src="' + esc(project.cover) + '" alt="' + esc(project.title) + ' 封面" width="1600" height="900"',
      ' onerror="this.parentNode.classList.add(\'is-missing\');this.remove()">',
      '</figure>',
      '<p class="overlay-desc">' + esc(project.description) + '</p>',
      '<ul class="overlay-stack mono">' + stack + '</ul>',
      '<div class="overlay-links">',
      '<a class="btn" href="' + esc(project.links.demo) + '" target="_blank" rel="noopener noreferrer">live demo ↗</a>',
      '<a class="btn" href="' + esc(project.links.github) + '" target="_blank" rel="noopener noreferrer">github ↗</a>',
      '</div>'
    ].join('');
  }

  function initOverlay(doc) {
    const overlay = doc.getElementById('overlay');
    const inner = doc.getElementById('overlay-inner');
    if (!overlay || !inner) return undefined;
    overlay.removeAttribute('hidden');
    let lastTrigger = null;

    // 背景区域：overlay 打开时对其 inert，避免读屏/键盘触达背景内容
    const bgRegions = ['nav', 'main'].map((id) => doc.getElementById(id)).filter(Boolean);
    const footer = doc.querySelector('.footer');
    if (footer) bgRegions.push(footer);

    function focusables() {
      return Array.from(overlay.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ));
    }

    function open(id, trigger) {
      const projects = Array.isArray(root.PROJECTS) ? root.PROJECTS : [];
      const project = findProject(projects, id);
      if (!project) return;
      inner.innerHTML = overlayHTML(project, projects.indexOf(project));
      overlay.classList.add('is-open');
      doc.body.style.overflow = 'hidden';
      bgRegions.forEach((el) => el.setAttribute('inert', ''));
      lastTrigger = trigger || null;
      const closeBtn = inner.querySelector('[data-close]');
      if (closeBtn) closeBtn.focus();
      inner.querySelectorAll('[data-close]').forEach((btn) => btn.addEventListener('click', close));
    }

    function close() {
      overlay.classList.remove('is-open');
      doc.body.style.overflow = '';
      bgRegions.forEach((el) => el.removeAttribute('inert'));
      if (lastTrigger) lastTrigger.focus();
    }

    doc.addEventListener('click', (event) => {
      const opener = event.target.closest('[data-open]');
      if (opener) open(opener.getAttribute('data-open'), opener);
    });

    // Escape 关闭 + Tab 焦点陷阱（焦点在 modal 内循环）
    doc.addEventListener('keydown', (event) => {
      if (!overlay.classList.contains('is-open')) return;
      if (event.key === 'Escape') { close(); return; }
      if (event.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && doc.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && doc.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    return { open, close };
  }

  function initReveal(doc) {
    const targets = doc.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in root)) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    targets.forEach((el) => io.observe(el));
  }

  function initNav(doc) {
    const nav = doc.getElementById('nav');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('nav--solid', root.scrollY > root.innerHeight * 0.9);
    root.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function init() {
    renderWork(document);
    initOverlay(document);
    initReveal(document);
    initNav(document);
  }

  const api = {
    esc, groupByYear, findProject, figNumber, projectCardHTML, workHTML, overlayHTML,
    renderWork, initOverlay, initReveal, initNav, init
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.Portfolio = api;

  if (typeof document !== 'undefined' && typeof window !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
  }
})(typeof window !== 'undefined' ? window : globalThis);
