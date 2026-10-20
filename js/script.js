/* ==========================================================================
   CodeCanvas — site behaviour
   Sections: config · helpers · navigation · reveal · portfolio · reviews
             · contact form · review form · init
   Supabase tables used (unchanged): portfolio, testimonials, messages
   ========================================================================== */
(() => {
  'use strict';

  /* ── Config ─────────────────────────────────────────────────────────────
     The anon key is a public, client-side key by design; access is governed
     by your Supabase Row Level Security policies. Unchanged from the
     previous version of the site. */
  const SUPABASE_URL = 'https://uewrlpeeatsrbsfhsbbs.supabase.co';
  const SUPABASE_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVld3JscGVlYXRzcmJzZmhzYmJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0NTM5MDcsImV4cCI6MjA5NDAyOTkwN30.rZtwA-xBATzqynv9oEjVkIEroDVm_NfRcY0W9K-jq-8';
  const WHATSAPP_URL = 'https://wa.me/256706018343';

  let client = null;
  try {
    if (window.supabase && typeof window.supabase.createClient === 'function') {
      client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }
  } catch (err) {
    console.error('Supabase failed to initialise', err);
  }

  /* ── Helpers ─────────────────────────────────────────────────────────── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

  /** Only allow http(s) links from database content; adds https:// when missing. */
  function safeUrl(raw) {
    if (!raw || raw === 'null' || raw === 'undefined') return '';
    let url = String(raw).trim();
    if (!url) return '';
    if (!/^[a-z][a-z0-9+.-]*:/i.test(url)) url = 'https://' + url;
    try {
      const u = new URL(url);
      return u.protocol === 'http:' || u.protocol === 'https:' ? u.href : '';
    } catch (_) {
      return '';
    }
  }

  const icon = (name, cls = '') =>
    `<svg class="icon ${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;

  function timeAgo(dateString) {
    const then = new Date(dateString);
    if (isNaN(then)) return '';
    const s = Math.max(0, Math.floor((Date.now() - then) / 1000));
    const units = [
      ['year', 31536000], ['month', 2592000], ['week', 604800],
      ['day', 86400], ['hour', 3600], ['minute', 60],
    ];
    for (const [name, secs] of units) {
      const n = Math.floor(s / secs);
      if (n >= 1) return `${n} ${name}${n > 1 ? 's' : ''} ago`;
    }
    return 'Just now';
  }

  /* ── Navigation ──────────────────────────────────────────────────────── */
  function initNav() {
    const header = $('.site-header');
    const toggle = $('.nav-toggle');
    const menu = $('#mobile-menu');
    if (!header || !toggle || !menu) return;

    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.hidden = !open;
      document.body.classList.toggle('menu-open', open);
    };

    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
    window.matchMedia('(min-width: 960px)').addEventListener('change', (e) => { if (e.matches) setOpen(false); });

    // Border under the header once the page has scrolled.
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        header.classList.toggle('is-scrolled', window.scrollY > 8);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Highlight the nav link for the section currently in view.
    if ('IntersectionObserver' in window) {
      const links = new Map($$('.nav__list a[href^="#"]').map((a) => [a.getAttribute('href').slice(1), a]));
      if (!links.size) return;
      const spy = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((l) => l.removeAttribute('aria-current'));
          const link = links.get(entry.target.id); // the hero has no link, so it just clears the highlight
          if (link) link.setAttribute('aria-current', 'true');
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      const hero = document.getElementById('hero');
      if (hero) spy.observe(hero);
      links.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
    }
  }

  /* ── Scroll reveal (progressive enhancement) ─────────────────────────── */
  function initReveal() {
    const items = $$('[data-reveal]');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!items.length || reduce || !('IntersectionObserver' in window)) return;

    // Anything already on screen is shown immediately, so nothing flashes.
    const vh = window.innerHeight;
    items.forEach((el) => { if (el.getBoundingClientRect().top < vh * 0.95) el.classList.add('is-in'); });
    document.documentElement.classList.add('reveal-ready');

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });
    items.forEach((el) => { if (!el.classList.contains('is-in')) io.observe(el); });
  }

  /* ── Portfolio ───────────────────────────────────────────────────────── */
  const portfolio = { items: [], filter: 'all' };
  const CATEGORY_ORDER = ['website', 'app', 'graphics', 'branding'];

  const catKey = (p) => String(p.category || '').trim().toLowerCase() || 'other';
  const catLabel = (p) => {
    const raw = String(p.category || '').trim();
    return raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : 'Other';
  };

  /** A project has a case study once any of these optional columns is filled in. */
  const hasCaseStudy = (p) => ['problem', 'solution', 'result'].some((k) => String(p[k] || '').trim());

  function projectCard(p, lead) {
    const caseUrl = hasCaseStudy(p) && p.id != null ? `project.html?id=${encodeURIComponent(p.id)}` : '';
    const live = safeUrl(p.liveurl);
    // No live site? Fall back to the project's own image, opened full size.
    const imageLink = !caseUrl && !live ? safeUrl(p.image) : '';
    const url = caseUrl || live || imageLink;
    const title = esc(p.title || 'Untitled project');
    const image = p.image
      ? `<img src="${esc(p.image)}" alt="${title} — screenshot" loading="lazy" decoding="async">`
      : fallbackMedia(catLabel(p));
    const heading = !url ? title
      : caseUrl
        ? `<a class="project__link" href="${esc(caseUrl)}">${title}<span class="sr-only"> (read case study)</span></a>`
        : `<a class="project__link" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${title}<span class="sr-only"> (opens in a new tab)</span></a>`;
    return `
      <article class="project${lead ? ' project--lead' : ''}">
        <div class="project__media">${image}</div>
        <div class="project__body">
          <p class="project__cat">${esc(catLabel(p))}</p>
          <h3 class="project__title">${heading}</h3>
          ${p.description ? `<p class="project__desc">${esc(p.description)}</p>` : ''}
          ${caseUrl ? `<span class="project__cta" aria-hidden="true">Read case study ${icon('arrow-right')}</span>`
            : live ? `<span class="project__cta" aria-hidden="true">View live site ${icon('arrow-up-right')}</span>`
            : imageLink ? `<span class="project__cta" aria-hidden="true">View full size ${icon('arrow-up-right')}</span>` : ''}
        </div>
      </article>`;
  }

  function fallbackMedia(label) {
    return `<div class="project__fallback"><img src="images/logo-mark-light.png" alt="" width="72" height="49"><span>${esc(label)}</span></div>`;
  }

  function renderFilters() {
    const wrap = $('#portfolioFilters');
    if (!wrap) return;
    const counts = new Map();
    const labels = new Map();
    portfolio.items.forEach((p) => {
      const k = catKey(p);
      counts.set(k, (counts.get(k) || 0) + 1);
      if (!labels.has(k)) labels.set(k, catLabel(p));
    });
    if (counts.size < 2) { wrap.hidden = true; return; }

    const keys = Array.from(counts.keys()).sort((a, b) => {
      const ia = CATEGORY_ORDER.indexOf(a), ib = CATEGORY_ORDER.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a.localeCompare(b);
    });
    const chip = (key, label, n) =>
      `<button class="chip" type="button" data-filter="${esc(key)}" aria-pressed="${portfolio.filter === key}">${esc(label)}<small>${n}</small></button>`;
    wrap.innerHTML = chip('all', 'All', portfolio.items.length) + keys.map((k) => chip(k, labels.get(k), counts.get(k))).join('');
    wrap.hidden = false;
  }

  function renderProjects() {
    const grid = $('#portfolioGrid');
    if (!grid) return;
    const list = portfolio.filter === 'all' ? portfolio.items : portfolio.items.filter((p) => catKey(p) === portfolio.filter);
    grid.setAttribute('aria-busy', 'false');

    if (!list.length) {
      grid.innerHTML = `<p class="projects__empty">New projects are being added. Want to see examples now? <a href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer">Message us on WhatsApp</a>.</p>`;
      return;
    }
    // A wide lead project only when the rest fill complete rows of three.
    const useLead = list.length % 3 === 1;
    grid.innerHTML = list.map((p, i) => projectCard(p, useLead && i === 0)).join('');
  }

  async function loadPortfolio() {
    const grid = $('#portfolioGrid');
    if (!grid) return;
    if (!client) return showPortfolioError();

    const { data, error } = await client.from('portfolio').select('*').order('id', { ascending: false });
    if (error) {
      console.error(error);
      return showPortfolioError();
    }
    portfolio.items = Array.isArray(data) ? data : [];
    renderFilters();
    renderProjects();
  }

  function showPortfolioError() {
    const grid = $('#portfolioGrid');
    grid.setAttribute('aria-busy', 'false');
    grid.innerHTML = `<p class="projects__empty">We couldn’t load our projects just now. Please refresh the page, or <a href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer">message us on WhatsApp</a> and we’ll send examples directly.</p>`;
  }

  function initPortfolio() {
    const wrap = $('#portfolioFilters');
    const grid = $('#portfolioGrid');
    if (!grid) return;

    if (wrap) {
      wrap.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-filter]');
        if (!btn) return;
        portfolio.filter = btn.dataset.filter;
        $$('.chip', wrap).forEach((c) => c.setAttribute('aria-pressed', String(c === btn)));
        renderProjects();
      });
    }
    // Missing/broken images fall back to a branded placeholder.
    grid.addEventListener('error', (e) => {
      const img = e.target;
      if (img.tagName !== 'IMG' || !img.closest('.project__media') || img.closest('.project__fallback')) return;
      const cat = img.closest('.project').querySelector('.project__cat');
      img.closest('.project__media').innerHTML = fallbackMedia(cat ? cat.textContent : 'Project');
    }, true);

    loadPortfolio();
  }

  /* ── Reviews ─────────────────────────────────────────────────────────── */
  function stars(n) {
    const rating = Math.max(0, Math.min(5, Number(n) || 0));
    let out = '';
    for (let i = 1; i <= 5; i++) out += icon('star', i > rating ? 'is-off' : '');
    return `<div class="review__stars" role="img" aria-label="${rating} out of 5 stars">${out}</div>`;
  }

  async function loadReviews() {
    const list = $('#reviewsList');
    if (!list) return;
    if (!client) {
      list.innerHTML = '<p class="reviews__empty">Reviews are unavailable right now.</p>';
      return;
    }
    const { data, error } = await client
      .from('testimonials').select('*').eq('approved', true).order('created_at', { ascending: false });
    if (error) {
      console.error(error);
      list.innerHTML = '<p class="reviews__empty">We couldn’t load reviews right now.</p>';
      return;
    }
    if (!data || !data.length) {
      list.innerHTML = '<p class="reviews__empty">No reviews published yet. If you’ve worked with us, we’d be glad to hear how it went.</p>';
      return;
    }
    list.innerHTML = data.map((r) => `
      <figure class="review">
        ${stars(r.rating)}
        <blockquote>“${esc(r.text)}”</blockquote>
        <figcaption><strong>${esc(r.name)}</strong>${esc(r.business)}${r.created_at ? ` · ${esc(timeAgo(r.created_at))}` : ''}</figcaption>
      </figure>`).join('');
  }

  function initReviews() {
    if (!$('#reviewsList')) return;
    loadReviews();
    if (!client) return;
    let timer;
    try {
      client.channel('public:testimonials')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'testimonials' }, () => {
          clearTimeout(timer);
          timer = setTimeout(loadReviews, 250);
        })
        .subscribe();
    } catch (err) {
      console.error('Realtime subscription failed', err);
    }
  }

  /* ── Case-study page (project.html) ─────────────────────────────────────
     Reads one row from `portfolio`. Optional columns: client, year, problem,
     solution, result, gallery (image URLs, one per line). Anything empty is
     simply not shown. */
  const paragraphs = (text) =>
    String(text || '').split(/\n+/).map((t) => t.trim()).filter(Boolean).map((t) => `<p>${esc(t)}</p>`).join('');

  function projectMessage(root, html) {
    root.setAttribute('aria-busy', 'false');
    root.innerHTML = `<p class="projects__empty">${html}</p>`;
  }

  function renderProject(root, p) {
    const title = esc(p.title || 'Untitled project');
    const live = safeUrl(p.liveurl);
    const gallery = String(p.gallery || '').split(/\s+/).map(safeUrl).filter(Boolean);
    const meta = [
      ['Category', catLabel(p)],
      p.client ? ['Client', p.client] : null,
      p.year ? ['Year', p.year] : null,
    ].filter(Boolean).map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')
      + (live ? `<div><dt>Live site</dt><dd><a href="${esc(live)}" target="_blank" rel="noopener noreferrer">Visit site ${icon('arrow-up-right')}<span class="sr-only"> (opens in a new tab)</span></a></dd></div>` : '');
    const block = (label, text) => String(text || '').trim()
      ? `<section class="case__block"><h2>${label}</h2><div class="case__text">${paragraphs(text)}</div></section>` : '';
    const blocks = block('The problem', p.problem) + block('What we built', p.solution) + block('The result', p.result);

    root.setAttribute('aria-busy', 'false');
    root.innerHTML = `
      <header class="case__head">
        <p class="kicker"><span>Case study</span>${esc(catLabel(p))}</p>
        <h1>${title}</h1>
        ${p.description ? `<p class="case__lede">${esc(p.description)}</p>` : ''}
        <dl class="case__meta">${meta}</dl>
      </header>
      ${p.image ? `<figure class="case__hero"><img src="${esc(p.image)}" alt="${title} — screenshot" decoding="async"></figure>` : ''}
      ${blocks ? `<div class="case__blocks">${blocks}</div>` : ''}
      ${gallery.length ? `<div class="case__gallery">${gallery.map((g) => `<img src="${esc(g)}" alt="${title} — additional screenshot" loading="lazy" decoding="async">`).join('')}</div>` : ''}
      <aside class="case__cta">
        <div><h2>Want something similar?</h2><p>Tell us about your business and what you need. We’ll reply with next steps.</p></div>
        <div class="case__cta-actions">
          <a class="btn btn--primary" href="index.html#contact">Start a project ${icon('arrow-right')}</a>
          <a class="btn btn--secondary" href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer"><svg class="icon icon--brand" aria-hidden="true"><use href="#b-whatsapp"/></svg> WhatsApp</a>
        </div>
      </aside>`;

    document.title = `${p.title || 'Project'} — CodeCanvas`;
    const desc = $('meta[name="description"]');
    if (desc && p.description) desc.setAttribute('content', String(p.description).slice(0, 155));
  }

  async function initProject() {
    const root = $('#projectContent');
    if (!root) return;
    const id = new URLSearchParams(location.search).get('id');
    const back = '<a href="index.html#portfolio">Back to the portfolio</a>';
    if (!id) return projectMessage(root, `We couldn’t tell which project to show. ${back}.`);
    if (!client) return projectMessage(root, `This project couldn’t be loaded right now. Please refresh, or ${back.toLowerCase()}.`);

    const { data, error } = await client.from('portfolio').select('*').eq('id', id).maybeSingle();
    if (error) {
      console.error(error);
      return projectMessage(root, `This project couldn’t be loaded right now. Please refresh, or ${back.toLowerCase()}.`);
    }
    if (!data) return projectMessage(root, `We couldn’t find that project. ${back}.`);
    renderProject(root, data);
  }

  /* ── Forms ───────────────────────────────────────────────────────────── */
  function setStatus(form, type, html) {
    const el = $('.form-status', form);
    if (!el) return;
    el.className = `form-status form-status--${type}`;
    el.innerHTML = `${icon(type === 'ok' ? 'circle-check' : 'circle-alert')}<span>${html}</span>`;
    el.hidden = false;
  }
  const clearStatus = (form) => { const el = $('.form-status', form); if (el) el.hidden = true; };

  function setFieldError(input, message) {
    input.setAttribute('aria-invalid', 'true');
    let err = input.parentElement.querySelector('.field__error');
    if (!err) {
      err = document.createElement('p');
      err.className = 'field__error';
      err.id = `${input.id}-error`;
      input.parentElement.appendChild(err);
    }
    err.textContent = message;
    input.setAttribute('aria-describedby', err.id);
  }
  function clearFieldErrors(form) {
    $$('[aria-invalid]', form).forEach((i) => { i.removeAttribute('aria-invalid'); i.removeAttribute('aria-describedby'); });
    $$('.field__error', form).forEach((e) => e.remove());
  }

  function setBusy(btn, busy, busyLabel) {
    if (busy) {
      btn.dataset.label = btn.innerHTML;
      btn.innerHTML = `${icon('loader-circle', 'spinner')} ${busyLabel}`;
    } else if (btn.dataset.label) {
      btn.innerHTML = btn.dataset.label;
    }
    btn.disabled = busy;
  }

  const FAIL_MSG = `Something went wrong and your message wasn’t sent. Please try again, or reach us on <a href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer">WhatsApp</a>.`;

  function initContactForm() {
    const form = $('#contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearFieldErrors(form);
      clearStatus(form);

      const f = {
        name: form.elements.name, email: form.elements.email,
        service: form.elements.service, message: form.elements.message,
      };
      let firstBad = null;
      const bad = (input, msg) => { setFieldError(input, msg); firstBad = firstBad || input; };
      if (!f.name.value.trim()) bad(f.name, 'Please enter your name.');
      if (!f.email.value.trim()) bad(f.email, 'Please enter your email address.');
      else if (!f.email.checkValidity()) bad(f.email, 'That email address doesn’t look right.');
      if (!f.service.value) bad(f.service, 'Please choose a service.');
      if (!f.message.value.trim()) bad(f.message, 'Please tell us a little about your project.');
      if (firstBad) { firstBad.focus(); return; }

      const btn = $('button[type="submit"]', form);

      // Honeypot: bots fill the hidden field; pretend success and send nothing.
      if (form.elements.website && form.elements.website.value) {
        form.reset();
        setStatus(form, 'ok', 'Thanks, your message has been sent.');
        return;
      }
      if (!client) { setStatus(form, 'error', FAIL_MSG); return; }

      setBusy(btn, true, 'Sending…');
      const { error } = await client.from('messages').insert([{
        name: f.name.value.trim(),
        email: f.email.value.trim(),
        service: f.service.value,
        message: f.message.value.trim(),
      }]);
      setBusy(btn, false);

      if (error) {
        console.error(error);
        setStatus(form, 'error', FAIL_MSG);
        return;
      }
      const first = esc(f.name.value.trim().split(/\s+/)[0]);
      form.reset();
      setStatus(form, 'ok', `Thanks, ${first}. Your message has been sent and we’ll be in touch by email.`);
    });
  }

  function initReviewForm() {
    const form = $('#review-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearFieldErrors(form);
      clearStatus(form);

      const name = $('#review-name'), business = $('#review-business'), text = $('#review-text');
      let firstBad = null;
      const bad = (input, msg) => { setFieldError(input, msg); firstBad = firstBad || input; };
      if (!name.value.trim()) bad(name, 'Please enter your name.');
      if (!business.value.trim()) bad(business, 'Please enter your business name.');
      if (!text.value.trim()) bad(text, 'Please write a few words about your experience.');
      if (firstBad) { firstBad.focus(); return; }

      const rating = Number((form.querySelector('input[name="rating"]:checked') || {}).value || 5);
      const btn = $('button[type="submit"]', form);
      if (!client) { setStatus(form, 'error', 'Reviews can’t be submitted right now. Please try again later.'); return; }

      setBusy(btn, true, 'Submitting…');
      const { error } = await client.from('testimonials').insert([{
        name: name.value.trim(),
        business: business.value.trim(),
        rating,
        text: text.value.trim(),
        approved: false,
        created_at: new Date().toISOString(),
      }]);
      setBusy(btn, false);

      if (error) {
        console.error(error);
        setStatus(form, 'error', 'Your review couldn’t be submitted. Please try again in a moment.');
        return;
      }
      form.reset();
      setStatus(form, 'ok', 'Thank you. Your review has been submitted and will appear once it’s approved.');
    });
  }

  /* Service links pre-select the matching option in the contact form. */
  function initServiceLinks() {
    const select = $('#service');
    if (!select) return;
    $$('[data-service]').forEach((link) => {
      link.addEventListener('click', () => {
        const wanted = link.dataset.service;
        const opt = Array.from(select.options).find((o) => o.value === wanted || o.text === wanted);
        if (opt) select.value = opt.value;
      });
    });
  }

  /* ── Init ────────────────────────────────────────────────────────────── */
  const year = $('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());

  initNav();
  initReveal();
  initPortfolio();
  initProject();
  initReviews();
  initContactForm();
  initReviewForm();
  initServiceLinks();
})();
