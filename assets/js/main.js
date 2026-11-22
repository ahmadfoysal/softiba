/* Softiba landing — small, dependency-free. */
(() => {
  const doc = document.documentElement;
  doc.classList.remove('no-js');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Dhaka clock (BST, UTC+6) ---------- */
  const clock = document.getElementById('clock');
  if (clock) {
    const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Dhaka' });
    const tick = () => { clock.textContent = fmt.format(new Date()); };
    tick();
    setInterval(tick, 15000);
  }
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- sticky nav + mobile menu ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => nav && nav.classList.toggle('is-stuck', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const burger = document.querySelector('.nav__burger');
  const mnav = document.getElementById('mnav');
  if (burger && mnav) {
    const setOpen = (open) => {
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      mnav.classList.toggle('is-open', open);
    };
    burger.addEventListener('click', () => setOpen(burger.getAttribute('aria-expanded') !== 'true'));
    mnav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  }

  /* ---------- reveal on scroll ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        // stagger siblings that enter together
        const siblings = [...el.parentElement.querySelectorAll(':scope > .reveal')];
        el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 6) * 70}ms`;
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- project brief: opens email or WhatsApp with the form filled in ---------- */
  const brief = document.getElementById('brief');
  if (brief) {
    const note = document.getElementById('briefNote');
    const noteText = note ? note.textContent : '';
    brief.addEventListener('submit', (e) => {
      e.preventDefault();
      const via = (e.submitter && e.submitter.dataset.via) || 'email';
      const data = new FormData(brief);
      let ok = true;
      ['name', 'contact', 'message'].forEach((key) => {
        const input = brief.elements[key];
        const bad = !String(data.get(key) || '').trim();
        input.closest('.field').classList.toggle('is-bad', bad);
        if (bad && ok) { input.focus(); ok = false; }
      });
      if (!ok) {
        if (note) { note.textContent = 'Please fill in your name, how to reach you, and a few words about the project.'; note.classList.add('is-warn'); }
        return;
      }
      if (note) { note.textContent = noteText; note.classList.remove('is-warn'); }
      const types = data.getAll('type');
      const body = [
        `Name: ${data.get('name')}`,
        `Contact: ${data.get('contact')}`,
        `Looking for: ${types.length ? types.join(', ') : 'Not specified'}`,
        '',
        String(data.get('message')).trim(),
      ].join('\n');
      const subject = `New project enquiry from ${data.get('name')}`;
      const url = via === 'whatsapp'
        ? `https://wa.me/8801303705753?text=${encodeURIComponent(`${subject}\n\n${body}`)}`
        : `mailto:info@softiba.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(url, via === 'whatsapp' ? '_blank' : '_self');
    });
    brief.addEventListener('input', (e) => {
      const f = e.target.closest('.field');
      if (f && String(e.target.value).trim()) f.classList.remove('is-bad');
    });
  }

  /* ---------- constellation: client project hub + capability nodes ---------- */
  const svg = document.getElementById('constellation');
  const readout = document.getElementById('readout');
  if (!svg) return;

  const NS = 'http://www.w3.org/2000/svg';
  const el = (name, attrs = {}, parent = svg) => {
    const n = document.createElementNS(NS, name);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    parent.appendChild(n);
    return n;
  };

  const HUB = { x: 260, y: 228 };
  // the hub is the client's project; nodes are what we build around it
  const products = [
    { id: 'Web apps & SaaS', target: 'svc-web', sub: 'portals · dashboards', x: 122, y: 110, warm: false,
      text: 'Customer portals, dashboards and SaaS platforms with roles, billing and an admin panel.' },
    { id: 'Business systems', target: 'svc-biz', sub: 'erp · crm · stock', x: 400, y: 102, warm: false,
      text: 'ERP, CRM, inventory and HR tools shaped around your exact workflow.' },
    { id: 'Integrations', target: 'svc-api', sub: 'payments · apis', x: 448, y: 262, warm: true,
      text: 'bKash, Nagad, SSLCommerz, couriers, SMS and any service with an API.' },
    { id: 'WhatsApp', target: 'svc-wa', sub: 'alerts · otp · chat', x: 380, y: 392, warm: true,
      text: 'Order updates, reminders, login codes and two-way chat on WhatsApp.' },
    { id: 'ISP & network', target: 'svc-net', sub: 'mikrotik · radius', x: 132, y: 384, warm: false,
      text: 'MikroTik automation, RADIUS and hotspot billing, remote access.' },
    { id: 'Websites', target: 'svc-wp', sub: 'wordpress · woo', x: 74, y: 246, warm: true,
      text: 'Company websites, WooCommerce stores and custom WordPress plugins.' },
  ];

  const defs = el('defs');
  const g = el('linearGradient', { id: 'cg', x1: '0', y1: '0', x2: '1', y2: '1' }, defs);
  el('stop', { offset: '0', 'stop-color': '#1EF0D8' }, g);
  el('stop', { offset: '1', 'stop-color': '#0A9BEA' }, g);

  el('circle', { class: 'orbit', cx: HUB.x, cy: HUB.y, r: 118 });
  el('circle', { class: 'orbit', cx: HUB.x, cy: HUB.y, r: 196 });

  const linkLayer = el('g');
  const packetLayer = el('g');
  const nodeLayer = el('g');

  // links: gentle curves from the hub's edge to each node's edge
  products.forEach((p, i) => {
    const dx = p.x - HUB.x, dy = p.y - HUB.y;
    const len = Math.hypot(dx, dy);
    const ux = dx / len, uy = dy / len;
    const sx = HUB.x + ux * 44, sy = HUB.y + uy * 44;
    const ex = p.x - ux * 13, ey = p.y - uy * 13;
    const bend = (i % 2 ? 1 : -1) * 18;
    const cx = (sx + ex) / 2 - uy * bend, cy = (sy + ey) / 2 + ux * bend;
    p.path = el('path', { class: 'link', d: `M${sx},${sy} Q${cx},${cy} ${ex},${ey}` }, linkLayer);
    p.len = p.path.getTotalLength();
  });

  // hub
  el('circle', { class: 'hub-pulse', cx: HUB.x, cy: HUB.y, r: 34 });
  el('circle', { class: 'hub-ring', cx: HUB.x, cy: HUB.y, r: 30 });
  const hubLabel = el('text', { class: 'hub-label', x: HUB.x, y: HUB.y + 64, 'text-anchor': 'middle' });
  hubLabel.textContent = 'your project';

  // nodes
  const setActive = (p) => {
    products.forEach((q) => {
      q.path.classList.toggle('is-on', q === p);
      q.node.classList.toggle('is-on', q === p);
    });
    if (!readout) return;
    readout.querySelector('.panel__k').textContent = p ? p.id : 'your project';
    readout.querySelector('.panel__v').textContent = p
      ? p.text
      : 'One team handles the whole build: design, code, hosting and support. Hover a node to see what each part covers.';
  };

  products.forEach((p) => {
    const node = el('g', { class: 'node', tabindex: '0', role: 'button', 'aria-label': `${p.id}: ${p.text}` }, nodeLayer);
    el('circle', { class: 'halo', cx: p.x, cy: p.y, r: 30 }, node);
    el('circle', { class: 'ring', cx: p.x, cy: p.y, r: 10 }, node);
    // labels sit on the side away from the hub so links never cross them
    const below = p.y > HUB.y + 40;
    const ty = below ? p.y + 32 : p.y - 34;
    const t = el('text', { x: p.x, y: ty, 'text-anchor': 'middle' }, node);
    t.textContent = p.id;
    const s = el('text', { class: 'sub', x: p.x, y: ty + 14, 'text-anchor': 'middle' }, node);
    s.textContent = p.sub;
    p.node = node;

    node.addEventListener('mouseenter', () => setActive(p));
    node.addEventListener('focus', () => setActive(p));
    node.addEventListener('mouseleave', () => setActive(null));
    node.addEventListener('blur', () => setActive(null));
    const go = () => {
      const card = document.getElementById(p.target);
      if (!card) return;
      card.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      card.classList.add('is-on');
      setTimeout(() => card.classList.remove('is-on'), 1800);
    };
    node.addEventListener('click', go);
    node.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
  });

  if (reduceMotion) return;

  // packets: small dots running between hub and nodes, both ways
  const packets = [];
  const spawn = (now) => {
    const p = products[Math.floor(Math.random() * products.length)];
    const dot = el('circle', { class: `packet${p.warm && Math.random() > .45 ? ' warm' : ''}`, r: 2.6 }, packetLayer);
    packets.push({ p, dot, start: now, dur: 1400 + Math.random() * 1200, out: Math.random() > .4 });
  };

  let last = 0;
  let visible = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 }).observe(svg);
  }

  const frame = (now) => {
    if (visible) {
      if (now - last > 360 && packets.length < 14) { spawn(now); last = now; }
      for (let i = packets.length - 1; i >= 0; i--) {
        const k = packets[i];
        let t = (now - k.start) / k.dur;
        if (t >= 1) { k.dot.remove(); packets.splice(i, 1); continue; }
        t = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; // ease in-out
        const pt = k.p.path.getPointAtLength((k.out ? t : 1 - t) * k.p.len);
        k.dot.setAttribute('cx', pt.x);
        k.dot.setAttribute('cy', pt.y);
        k.dot.setAttribute('opacity', Math.sin(Math.PI * t).toFixed(2));
      }
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
})();
