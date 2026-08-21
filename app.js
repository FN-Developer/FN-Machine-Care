/* =============================================================
   FN MACHINE CARE — Application
   Machine Inspection & Service Management System
   F N Technology

   No build step, no framework, no server. Everything runs in the
   browser and persists to localStorage. Records are keyed by
   WORK NO + MACHINE SERIAL, so one machine's whole life —
   Build → PDI → Delivery → Service — reads as a single history.
   ============================================================= */

(function () {
  'use strict';

  /* ---------------- Storage ---------------- */

  const STORAGE_KEY = 'fn-machine-care.v1';

  const DEFAULT_DB = { records: [], meta: { version: 1, counters: {} } };

  function loadDB() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return structuredClone(DEFAULT_DB);
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.records)) return structuredClone(DEFAULT_DB);
      parsed.meta = parsed.meta || { version: 1, counters: {} };
      parsed.meta.counters = parsed.meta.counters || {};
      return parsed;
    } catch (e) {
      console.error('[FN] Could not read saved data:', e);
      return structuredClone(DEFAULT_DB);
    }
  }

  function saveDB() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
      return true;
    } catch (e) {
      console.error('[FN] Save failed:', e);
      toast(
        lang === 'th'
          ? 'บันทึกไม่สำเร็จ — พื้นที่จัดเก็บอาจเต็ม (รูปภาพใช้พื้นที่มาก)'
          : 'Save failed — storage may be full (photos use a lot of space)',
        true
      );
      return false;
    }
  }

  let db = loadDB();
  let lang = localStorage.getItem('fn-machine-care.lang') || 'both';

  /* ---------------- Small helpers ---------------- */

  const $ = (sel, root) => (root || document).querySelector(sel);

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        const v = attrs[k];
        if (v === null || v === undefined || v === false) continue;
        if (k === 'class') node.className = v;
        else if (k === 'html') node.innerHTML = v;
        else if (k === 'text') node.textContent = v;
        else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
        else node.setAttribute(k, v);
      }
    }
    (Array.isArray(children) ? children : children ? [children] : [])
      .filter((c) => c !== null && c !== undefined && c !== false)
      .forEach((c) => node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
    return node;
  }

  /* Bilingual label — renders EN and TH lines; CSS hides one when
     the user picks a single language. */
  function L(obj, cls) {
    if (!obj) return el('span');
    if (typeof obj === 'string') return el('span', { text: obj });
    return el('span', { class: cls || '' }, [
      el('span', { class: 'label-en', text: obj.en || '' }),
      el('span', { class: 'label-th th', text: obj.th || '' }),
    ]);
  }

  /* Plain string in the active language — for titles, toasts, values. */
  function T(obj) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    if (lang === 'th') return obj.th || obj.en || '';
    return obj.en || obj.th || '';
  }

  function todayISO() {
    const d = new Date();
    return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
  }

  function fmtDate(iso) {
    if (!iso) return '—';
    const parts = String(iso).split('-');
    if (parts.length !== 3) return iso;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  function uid() {
    return 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  /* Document numbers: PDI-2026-00125 */
  function nextDocNo(formDef) {
    const year = new Date().getFullYear();
    const key = `${formDef.prefix}-${year}`;
    const used = db.records
      .filter((r) => r.docNo && r.docNo.startsWith(key))
      .map((r) => parseInt(r.docNo.slice(key.length + 1), 10))
      .filter((n) => !isNaN(n));
    const next = (used.length ? Math.max(...used) : 0) + 1;
    return `${key}-${String(next).padStart(5, '0')}`;
  }

  let toastTimer = null;
  function toast(msg, isError) {
    const t = $('#toast');
    t.textContent = msg;
    t.className = 'toast show' + (isError ? ' err' : '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.className = 'toast'; }, 2600);
  }

  /* ---------------- Record model ---------------- */

  function newRecord(type) {
    const def = FORM_BY_TYPE[type];
    return {
      id: uid(),
      type,
      docNo: nextDocNo(def),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft',
      fields: { inspectionDate: todayISO(), serviceDate: todayISO(), buildDate: todayISO(), commissionDate: todayISO() },
      checks: {},      // sectionId -> { code: {value, remark} }
      measures: {},    // sectionId -> { key: value }
      perf: {},        // sectionId -> { key: actual }
      docs: {},        // sectionId -> { code: bool }
      photos: {},      // sectionId -> { code|freeIndex: dataURL }
      tables: {},      // sectionId -> [ {col: val} ]
      notes: {},       // sectionId -> string
      rootcause: {},   // sectionId -> { selected: [], text: '' }
      priority: {},    // sectionId -> value
      beforeAfter: { before: [], after: [] },
      result: null,
      signatures: {},  // roleKey -> { data, name, date }
    };
  }

  /* Identity used to group a machine's history */
  function machineKey(r) {
    const w = (r.fields.workNo || '').trim().toUpperCase();
    const s = (r.fields.serialNo || '').trim().toUpperCase();
    return w || s ? `${w}|${s}` : null;
  }

  function machineList() {
    const map = new Map();
    db.records.forEach((r) => {
      const key = machineKey(r);
      if (!key) return;
      if (!map.has(key)) {
        map.set(key, {
          key,
          workNo: r.fields.workNo || '',
          serialNo: r.fields.serialNo || '',
          machineName: r.fields.machineName || '',
          customer: r.fields.customer || '',
          records: [],
        });
      }
      const m = map.get(key);
      m.records.push(r);
      // Latest non-empty descriptive fields win
      if (r.fields.machineName) m.machineName = r.fields.machineName;
      if (r.fields.customer) m.customer = r.fields.customer;
    });
    map.forEach((m) => m.records.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1)));
    return Array.from(map.values()).sort((a, b) => a.workNo.localeCompare(b.workNo));
  }

  /* Completion: how many check items have an answer */
  function sectionProgress(record, section) {
    if (section.type !== 'checklist' && section.type !== 'condition') return null;
    const answers = record.checks[section.id] || {};
    const done = section.items.filter((it) => answers[it.code] && answers[it.code].value).length;
    return { done, total: section.items.length };
  }

  function recordProgress(record) {
    const def = FORM_BY_TYPE[record.type];
    let done = 0, total = 0;
    def.sections.forEach((s) => {
      const p = sectionProgress(record, s);
      if (p) { done += p.done; total += p.total; }
    });
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
  }

  /* Safety gate — a failed safety item blocks a READY result */
  function hasSafetyFail(record) {
    const def = FORM_BY_TYPE[record.type];
    if (!def.safetyGate) return false;
    return def.sections.some((s) => {
      if (s.type !== 'checklist' || !s.critical) return false;
      const answers = record.checks[s.id] || {};
      return s.items.some((it) => answers[it.code] && answers[it.code].value === 'FAIL');
    });
  }

  function failedItems(record) {
    const def = FORM_BY_TYPE[record.type];
    const out = [];
    def.sections.forEach((s) => {
      if (s.type !== 'checklist' && s.type !== 'condition') return;
      const answers = record.checks[s.id] || {};
      s.items.forEach((it) => {
        const a = answers[it.code];
        if (a && (a.value === 'FAIL' || a.value === 'ABNORMAL')) {
          out.push({ section: s, item: it, remark: a.remark || '' });
        }
      });
    });
    return out;
  }

  function resultMeta(record) {
    const def = FORM_BY_TYPE[record.type];
    const section = def.sections.find((s) => s.type === 'result');
    if (!section || !record.result) return null;
    return section.options.find((o) => o.value === record.result) || null;
  }

  function pillClassFor(record) {
    if (record.status === 'draft') return 'draft';
    const m = resultMeta(record);
    if (!m) return 'draft';
    if (m.color === '#22c55e') return 'green';
    if (m.color === '#eab308') return 'yellow';
    return 'red';
  }

  /* ---------------- Router ---------------- */

  const state = { view: 'dashboard', recordId: null, machineKey: null, search: '' };

  /* The URL hash carries the current view so a tablet refresh — or a
     browser crash mid-inspection — returns to the same form. */
  function writeHash() {
    const parts = [state.view];
    if (state.recordId) parts.push(state.recordId);
    else if (state.machineKey) parts.push(encodeURIComponent(state.machineKey));
    const hash = '#/' + parts.join('/');
    if (window.location.hash !== hash) {
      suppressHashChange = true;
      window.location.hash = hash;
    }
  }

  let suppressHashChange = false;

  function readHash() {
    const raw = (window.location.hash || '').replace(/^#\/?/, '');
    if (!raw) return false;
    const [view, arg] = raw.split('/');
    if (!view) return false;
    state.view = view;
    state.recordId = null;
    state.machineKey = null;
    if (view === 'form' && arg) {
      if (!db.records.some((r) => r.id === arg)) { state.view = 'records'; return true; }
      state.recordId = arg;
    } else if (view === 'machine' && arg) {
      state.machineKey = decodeURIComponent(arg);
    }
    return true;
  }

  function go(view, opts) {
    state.view = view;
    state.recordId = (opts && opts.recordId) || null;
    state.machineKey = (opts && opts.machineKey) || null;
    writeHash();
    window.scrollTo(0, 0);
    render();
  }

  /* ---------------- Render: shell ---------------- */

  function render() {
    document.body.className = 'lang-' + lang;
    renderNav();
    const main = $('#main');
    main.innerHTML = '';
    const views = {
      dashboard: viewDashboard,
      machines: viewMachines,
      records: viewRecords,
      newform: viewNewForm,
      form: viewForm,
      machine: viewMachine,
      data: viewData,
    };
    (views[state.view] || viewDashboard)(main);
  }

  function renderNav() {
    const nav = $('#nav');
    nav.innerHTML = '';
    const items = [
      ['dashboard', '📊', UI.nav_dashboard],
      ['machines', '🏭', UI.nav_machines],
      ['records', '📄', UI.nav_records],
      ['newform', '➕', UI.nav_new],
      ['data', '💾', UI.nav_data],
    ];
    items.forEach(([view, icon, label]) => {
      const active = state.view === view || (view === 'records' && state.view === 'form') || (view === 'machines' && state.view === 'machine');
      nav.appendChild(
        el('button', { class: active ? 'active' : '', onclick: () => go(view) }, [
          el('span', { class: 'nav-icon', text: icon }),
          el('span', { class: 'nav-text' }, [L(label)]),
        ])
      );
    });

    const ls = $('#langSwitch');
    ls.innerHTML = '';
    [['both', 'TH+EN'], ['en', 'EN'], ['th', 'ไทย']].forEach(([v, t]) => {
      ls.appendChild(
        el('button', {
          class: lang === v ? 'active' : '',
          text: t,
          onclick: () => {
            lang = v;
            localStorage.setItem('fn-machine-care.lang', v);
            render();
          },
        })
      );
    });
  }

  /* ---------------- View: Dashboard ---------------- */

  function viewDashboard(root) {
    const machines = machineList();
    const recs = db.records;
    const openIssues = recs.filter((r) => r.status !== 'draft' && ['notready', 'rejected', 'further'].includes(r.result)).length;
    const drafts = recs.filter((r) => r.status === 'draft').length;

    root.appendChild(
      el('div', { class: 'page-head' }, [
        el('div', {}, [
          el('h1', { class: 'page-title', text: T(UI.appName) }),
          el('div', { class: 'page-sub', text: T(UI.tagline) + ' · ' + T(UI.company) }),
        ]),
        el('div', { class: 'btn-row' }, [
          el('button', { class: 'btn btn-primary', onclick: () => go('newform') }, [L(UI.nav_new)]),
        ]),
      ])
    );

    const stats = [
      [machines.length, { en: 'Machines tracked', th: 'เครื่องจักรในระบบ' }, '#2f81f7'],
      [recs.length, { en: 'Total records', th: 'เอกสารทั้งหมด' }, '#8b5cf6'],
      [drafts, { en: 'Drafts in progress', th: 'ฉบับร่างที่ค้างอยู่' }, '#eab308'],
      [openIssues, { en: 'Needs attention', th: 'ต้องติดตาม' }, '#ef4444'],
    ];
    const grid = el('div', { class: 'stat-grid' });
    stats.forEach(([v, label, color]) => {
      grid.appendChild(
        el('div', { class: 'stat', style: `border-left-color:${color}` }, [
          el('div', { class: 'stat-value', text: String(v) }),
          el('div', { class: 'stat-label' }, [L(label)]),
        ])
      );
    });
    root.appendChild(grid);

    /* Quick start */
    root.appendChild(el('h2', { style: 'font-size:16px;margin:22px 0 12px' }, [L({ en: 'Start a new form', th: 'เริ่มเอกสารใหม่' })]));
    root.appendChild(typeCards());

    /* Recent */
    root.appendChild(el('h2', { style: 'font-size:16px;margin:26px 0 12px' }, [L({ en: 'Recent activity', th: 'ความเคลื่อนไหวล่าสุด' })]));
    const recent = recs.slice().sort((a, b) => (b.updatedAt > a.updatedAt ? 1 : -1)).slice(0, 8);
    root.appendChild(recent.length ? recordTable(recent) : el('div', { class: 'empty' }, [L(UI.noRecords)]));
  }

  function typeCards() {
    const grid = el('div', { class: 'type-grid' });
    FORM_TYPES.forEach((def) => {
      grid.appendChild(
        el('button', { class: 'type-card', style: `--accent:${def.accent}`, onclick: () => createAndOpen(def.type) }, [
          el('div', { class: 'tc-icon', text: def.icon }),
          el('div', { class: 'tc-code', text: def.code + ' · ' + def.prefix }),
          el('div', { class: 'tc-name', text: def.name.en }),
          el('div', { class: 'tc-name-th', text: def.name.th }),
        ])
      );
    });
    return grid;
  }

  function createAndOpen(type, prefill) {
    const rec = newRecord(type);
    if (prefill) Object.assign(rec.fields, prefill);
    db.records.push(rec);
    saveDB();
    go('form', { recordId: rec.id });
  }

  /* ---------------- View: New form picker ---------------- */

  function viewNewForm(root) {
    root.appendChild(
      el('div', { class: 'page-head' }, [
        el('div', {}, [
          el('h1', { class: 'page-title' }, [L({ en: 'New Form', th: 'สร้างเอกสารใหม่' })]),
          el('div', { class: 'page-sub' }, [
            L({
              en: 'Machine lifecycle: Build → PDI → Delivery → Service',
              th: 'วงจรชีวิตเครื่องจักร: ประกอบ → ตรวจก่อนส่ง → ส่งมอบ → บริการ',
            }),
          ]),
        ]),
      ])
    );
    root.appendChild(typeCards());
  }

  /* ---------------- View: Records ---------------- */

  function viewRecords(root) {
    root.appendChild(
      el('div', { class: 'page-head' }, [
        el('div', {}, [
          el('h1', { class: 'page-title' }, [L({ en: 'All Records', th: 'เอกสารทั้งหมด' })]),
          el('div', { class: 'page-sub', text: db.records.length + ' total' }),
        ]),
        el('input', {
          class: 'search-input',
          placeholder: T(UI.search),
          value: state.search,
          oninput: (e) => {
            state.search = e.target.value;
            const holder = $('#recordsHolder');
            holder.innerHTML = '';
            holder.appendChild(filteredTable());
          },
        }),
      ])
    );
    const holder = el('div', { id: 'recordsHolder' });
    holder.appendChild(filteredTable());
    root.appendChild(holder);

    function filteredTable() {
      const q = state.search.trim().toLowerCase();
      let list = db.records.slice().sort((a, b) => (b.updatedAt > a.updatedAt ? 1 : -1));
      if (q) {
        list = list.filter((r) => {
          const hay = [r.docNo, r.fields.workNo, r.fields.serialNo, r.fields.customer, r.fields.machineName, T(FORM_BY_TYPE[r.type].name)]
            .join(' ').toLowerCase();
          return hay.includes(q);
        });
      }
      return list.length ? recordTable(list) : el('div', { class: 'empty' }, [L(UI.noRecords)]);
    }
  }

  function recordTable(list) {
    const wrap = el('div', { class: 'table-wrap' });
    const table = el('table');
    table.appendChild(
      el('thead', {}, el('tr', {}, [
        el('th', { text: 'Doc No.' }),
        el('th', { text: 'Type' }),
        el('th', { text: 'Work No.' }),
        el('th', { text: 'Machine / Customer' }),
        el('th', { text: 'Date' }),
        el('th', { text: 'Progress' }),
        el('th', { text: 'Status' }),
      ]))
    );
    const tbody = el('tbody');
    list.forEach((r) => {
      const def = FORM_BY_TYPE[r.type];
      const p = recordProgress(r);
      const meta = resultMeta(r);
      tbody.appendChild(
        el('tr', { class: 'clickable', onclick: () => go('form', { recordId: r.id }) }, [
          el('td', { html: `<strong>${escapeHTML(r.docNo)}</strong>` }),
          el('td', {}, el('span', { class: 'type-badge', style: `--accent:${def.accent}`, text: def.icon + ' ' + def.prefix })),
          el('td', { text: r.fields.workNo || '—' }),
          el('td', {
            html:
              escapeHTML(r.fields.machineName || '—') +
              `<div style="font-size:12px;color:var(--text-dim)">${escapeHTML(r.fields.customer || '')}</div>`,
          }),
          el('td', { text: fmtDate(primaryDate(r)) }),
          el('td', { html: p.total ? `${p.done}/${p.total}` : '—' }),
          el('td', {}, el('span', { class: 'pill ' + pillClassFor(r), text: meta ? T(meta.label) : T(UI.draft) })),
        ])
      );
    });
    table.appendChild(tbody);
    wrap.appendChild(table);
    return wrap;
  }

  function primaryDate(r) {
    return r.fields.inspectionDate || r.fields.serviceDate || r.fields.commissionDate || r.fields.buildDate || r.createdAt.slice(0, 10);
  }

  function escapeHTML(s) {
    return String(s === null || s === undefined ? '' : s).replace(/[&<>"']/g, (c) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
  }

  /* ---------------- View: Machines ---------------- */

  function viewMachines(root) {
    const machines = machineList();
    root.appendChild(
      el('div', { class: 'page-head' }, [
        el('div', {}, [
          el('h1', { class: 'page-title' }, [L({ en: 'Machines', th: 'เครื่องจักร' })]),
          el('div', { class: 'page-sub' }, [
            L({ en: 'Grouped by Work No. + Serial No.', th: 'จัดกลุ่มตามเลขที่งาน + หมายเลขเครื่อง' }),
          ]),
        ]),
      ])
    );

    if (!machines.length) {
      root.appendChild(
        el('div', { class: 'empty' }, [
          L({ en: 'No machines yet. Create a form and fill in Work No. + Serial No.', th: 'ยังไม่มีเครื่องจักร สร้างเอกสารและกรอกเลขที่งาน + หมายเลขเครื่อง' }),
        ])
      );
      return;
    }

    const wrap = el('div', { class: 'table-wrap' });
    const table = el('table');
    table.appendChild(
      el('thead', {}, el('tr', {}, [
        el('th', { text: 'Work No.' }),
        el('th', { text: 'Serial No.' }),
        el('th', { text: 'Machine' }),
        el('th', { text: 'Customer' }),
        el('th', { text: 'Records' }),
        el('th', { text: 'Last activity' }),
      ]))
    );
    const tbody = el('tbody');
    machines.forEach((m) => {
      const counts = {};
      m.records.forEach((r) => { counts[r.type] = (counts[r.type] || 0) + 1; });
      const badges = el('div', { style: 'display:flex;gap:5px;flex-wrap:wrap' });
      FORM_TYPES.forEach((def) => {
        if (!counts[def.type]) return;
        badges.appendChild(el('span', { class: 'type-badge', style: `--accent:${def.accent}`, text: `${def.icon} ${counts[def.type]}` }));
      });
      tbody.appendChild(
        el('tr', { class: 'clickable', onclick: () => go('machine', { machineKey: m.key }) }, [
          el('td', { html: `<strong>${escapeHTML(m.workNo || '—')}</strong>` }),
          el('td', { text: m.serialNo || '—' }),
          el('td', { text: m.machineName || '—' }),
          el('td', { text: m.customer || '—' }),
          el('td', {}, badges),
          el('td', { text: fmtDate(primaryDate(m.records[0])) }),
        ])
      );
    });
    table.appendChild(tbody);
    wrap.appendChild(table);
    root.appendChild(wrap);
  }

  /* ---------------- View: One machine's history ---------------- */

  function viewMachine(root) {
    const m = machineList().find((x) => x.key === state.machineKey);
    if (!m) return go('machines');

    root.appendChild(
      el('div', { class: 'page-head' }, [
        el('div', {}, [
          el('h1', { class: 'page-title', text: m.workNo || m.serialNo }),
          el('div', { class: 'page-sub', text: [m.machineName, m.serialNo, m.customer].filter(Boolean).join(' · ') }),
        ]),
        el('div', { class: 'btn-row' }, [
          el('button', { class: 'btn', onclick: () => go('machines') }, [L({ en: '← All machines', th: '← เครื่องจักรทั้งหมด' })]),
          el('button', {
            class: 'btn btn-primary',
            onclick: () =>
              createAndOpen('SERVICE', {
                workNo: m.workNo, serialNo: m.serialNo, machineName: m.machineName, customer: m.customer,
              }),
          }, [L({ en: '+ Service Report', th: '+ รายงานบริการ' })]),
        ]),
      ])
    );

    root.appendChild(el('h2', { style: 'font-size:16px;margin:0 0 14px' }, [L(UI.history)]));

    const tl = el('div', { class: 'timeline' });
    m.records.forEach((r) => {
      const def = FORM_BY_TYPE[r.type];
      const meta = resultMeta(r);
      const fails = failedItems(r);
      tl.appendChild(
        el('div', { class: 'tl-item', style: `--accent:${def.accent}` }, [
          el('div', { class: 'card', style: 'cursor:pointer', onclick: () => go('form', { recordId: r.id }) }, [
            el('div', { style: 'display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:center' }, [
              el('div', {}, [
                el('span', { class: 'type-badge', style: `--accent:${def.accent}`, text: def.icon + ' ' + T(def.short) }),
                el('strong', { style: 'margin-left:9px', text: r.docNo }),
              ]),
              el('span', { class: 'pill ' + pillClassFor(r), text: meta ? T(meta.label) : T(UI.draft) }),
            ]),
            el('div', { style: 'font-size:13px;color:var(--text-dim);margin-top:7px' , text:
              fmtDate(primaryDate(r)) + ' · ' + (r.fields.inspector || r.fields.technician || r.fields.engineer || r.fields.checkedBy || '—') }),
            fails.length
              ? el('div', { style: 'margin-top:9px;font-size:13px;color:#fca5a5' , text:
                  (lang === 'th' ? 'พบปัญหา ' : 'Issues: ') + fails.map((f) => f.item.code).join(', ') })
              : null,
          ]),
        ])
      );
    });
    root.appendChild(tl);
  }

  /* ---------------- View: Backup ---------------- */

  function viewData(root) {
    root.appendChild(
      el('div', { class: 'page-head' }, [
        el('div', {}, [
          el('h1', { class: 'page-title' }, [L({ en: 'Backup & Restore', th: 'สำรองและกู้คืนข้อมูล' })]),
          el('div', { class: 'page-sub' }, [
            L({
              en: 'Data lives in this browser only. Export regularly and keep the file on a company drive.',
              th: 'ข้อมูลเก็บอยู่ในเบราว์เซอร์นี้เท่านั้น ควรส่งออกเป็นไฟล์และเก็บไว้ในไดรฟ์ของบริษัทอย่างสม่ำเสมอ',
            }),
          ]),
        ]),
      ])
    );

    const sizeKB = Math.round((localStorage.getItem(STORAGE_KEY) || '').length / 1024);

    root.appendChild(
      el('div', { class: 'card' }, [
        el('div', { class: 'stat-grid', style: 'margin-bottom:16px' }, [
          el('div', { class: 'stat' }, [
            el('div', { class: 'stat-value', text: String(db.records.length) }),
            el('div', { class: 'stat-label' }, [L({ en: 'Records stored', th: 'เอกสารที่เก็บไว้' })]),
          ]),
          el('div', { class: 'stat' }, [
            el('div', { class: 'stat-value', text: sizeKB + ' KB' }),
            el('div', { class: 'stat-label' }, [L({ en: 'Storage used', th: 'พื้นที่ที่ใช้' })]),
          ]),
        ]),
        el('div', { class: 'btn-row' }, [
          el('button', { class: 'btn btn-primary', onclick: exportJSON }, [L({ en: '⬇ Export backup (.json)', th: '⬇ ส่งออกไฟล์สำรอง (.json)' })]),
          el('label', { class: 'btn' }, [
            L({ en: '⬆ Import backup', th: '⬆ นำเข้าไฟล์สำรอง' }),
            el('input', { type: 'file', accept: '.json,application/json', style: 'display:none', onchange: importJSON }),
          ]),
          el('button', { class: 'btn', onclick: exportCSV }, [L({ en: '⬇ Export summary (.csv)', th: '⬇ ส่งออกสรุป (.csv)' })]),
          el('button', { class: 'btn btn-danger', onclick: wipeAll }, [L({ en: '⚠ Erase all data', th: '⚠ ลบข้อมูลทั้งหมด' })]),
        ]),
      ])
    );
  }

  function download(filename, content, mime) {
    const blob = new Blob([content], { type: mime || 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = el('a', { href: url, download: filename });
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  function exportJSON() {
    download(`fn-machine-care-backup-${todayISO()}.json`, JSON.stringify(db, null, 2), 'application/json');
    toast(lang === 'th' ? 'ส่งออกไฟล์สำรองแล้ว' : 'Backup exported');
  }

  function exportCSV() {
    const rows = [['Doc No', 'Type', 'Work No', 'Serial No', 'Machine', 'Customer', 'Date', 'Status', 'Result', 'Failed items']];
    db.records.forEach((r) => {
      const meta = resultMeta(r);
      rows.push([
        r.docNo, FORM_BY_TYPE[r.type].prefix, r.fields.workNo || '', r.fields.serialNo || '',
        r.fields.machineName || '', r.fields.customer || '', primaryDate(r), r.status,
        meta ? meta.label.en : '', failedItems(r).map((f) => f.item.code).join(' '),
      ]);
    });
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\r\n');
    download(`fn-machine-care-summary-${todayISO()}.csv`, '﻿' + csv, 'text/csv;charset=utf-8');
  }

  function importJSON(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!data || !Array.isArray(data.records)) throw new Error('bad format');
        const existing = new Set(db.records.map((r) => r.id));
        let added = 0;
        data.records.forEach((r) => {
          if (!existing.has(r.id)) { db.records.push(r); added++; }
        });
        saveDB();
        toast((lang === 'th' ? 'นำเข้าแล้ว ' : 'Imported ') + added + (lang === 'th' ? ' รายการ' : ' records'));
        render();
      } catch (err) {
        toast(lang === 'th' ? 'ไฟล์ไม่ถูกต้อง' : 'Invalid backup file', true);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function wipeAll() {
    const msg = lang === 'th'
      ? 'ลบข้อมูลทั้งหมดถาวร? ควรส่งออกไฟล์สำรองก่อน'
      : 'Permanently erase all data? Export a backup first.';
    if (!confirm(msg)) return;
    if (!confirm(lang === 'th' ? 'ยืนยันอีกครั้ง — ข้อมูลจะหายถาวร' : 'Confirm again — this cannot be undone.')) return;
    db = structuredClone(DEFAULT_DB);
    saveDB();
    go('dashboard');
  }

  /* ---------------- View: The form itself ---------------- */

  function viewForm(root) {
    const rec = db.records.find((r) => r.id === state.recordId);
    if (!rec) return go('records');
    const def = FORM_BY_TYPE[rec.type];

    /* Toolbar */
    root.appendChild(
      el('div', { class: 'toolbar no-print' }, [
        el('div', {}, [
          el('div', { class: 'tb-title', text: `${def.icon}  ${rec.docNo}` }),
          el('div', { class: 'tb-sub', text: T(def.name) }),
        ]),
        el('div', { class: 'btn-row' }, [
          el('button', { class: 'btn', onclick: () => go('records') }, [L({ en: '← Back', th: '← กลับ' })]),
          el('button', { class: 'btn', onclick: () => window.print() }, [L(UI.print)]),
          el('button', { class: 'btn btn-danger', onclick: () => deleteRecord(rec) }, [L(UI.delete)]),
          el('button', { class: 'btn btn-primary', onclick: () => { touch(rec); toast(T(UI.saved)); } }, [L(UI.save)]),
        ]),
      ])
    );

    /* Print-only header */
    root.appendChild(
      el('div', { class: 'print-head' }, [
        el('h1', { text: `${T(UI.company)} — ${def.name.en} / ${def.name.th}` }),
        el('div', { class: 'ph-meta', text: `${rec.docNo}   |   Work No: ${rec.fields.workNo || '—'}   |   S/N: ${rec.fields.serialNo || '—'}   |   ${fmtDate(primaryDate(rec))}` }),
      ])
    );

    const shell = el('div', { class: 'form-shell' });
    def.sections.forEach((section) => shell.appendChild(renderSection(rec, def, section)));
    root.appendChild(shell);

    root.appendChild(
      el('div', { class: 'btn-row no-print', style: 'margin-top:22px;justify-content:flex-end' }, [
        el('button', { class: 'btn', onclick: () => window.print() }, [L(UI.print)]),
        el('button', { class: 'btn btn-primary', onclick: () => { touch(rec); toast(T(UI.saved)); } }, [L(UI.save)]),
      ])
    );
  }

  function touch(rec) {
    rec.updatedAt = new Date().toISOString();
    saveDB();
  }

  function deleteRecord(rec) {
    if (!confirm(T(UI.confirmDelete))) return;
    db.records = db.records.filter((r) => r.id !== rec.id);
    saveDB();
    go('records');
  }

  /* ---- Section dispatcher ---- */

  function renderSection(rec, def, section) {
    const box = el('section', { class: 'section' + (section.critical ? ' critical' : ''), id: 'sec-' + section.id });

    const head = el('header', {}, [
      el('div', { class: 'section-title' }, [
        el('div', { class: 'label-en', text: section.title.en }),
        el('div', { class: 'label-th th', text: section.title.th }),
      ]),
    ]);
    const prog = sectionProgress(rec, section);
    if (prog) {
      const bar = el('div', { class: 'progress-bar' }, el('div', {
        class: 'progress-fill',
        style: `width:${prog.total ? (prog.done / prog.total) * 100 : 0}%`,
      }));
      head.appendChild(el('div', { class: 'section-progress' }, [el('span', { text: `${prog.done}/${prog.total}` }), bar]));
    }
    box.appendChild(head);

    const body = el('div', { class: 'section-body' });
    if (section.hint) body.appendChild(el('div', { class: 'hint' }, [L(section.hint)]));

    const renderers = {
      fields: renderFields,
      checklist: renderChecklist,
      condition: renderChecklist,
      measurements: renderMeasurements,
      performance: renderPerformance,
      documents: renderDocuments,
      photos: renderPhotos,
      beforeafter: renderBeforeAfter,
      table: renderTable,
      costtable: renderCostTable,
      notes: renderNotes,
      problem: renderProblem,
      rootcause: renderRootCause,
      result: renderResult,
      signoff: renderSignoff,
    };
    (renderers[section.type] || renderNotes)(body, rec, def, section);
    box.appendChild(body);
    return box;
  }

  /* ---- fields ---- */

  function renderFields(body, rec, def, section) {
    const grid = el('div', { class: 'field-grid' });
    section.fields.forEach((f) => {
      const wrap = el('div', { class: 'field' });
      const lab = el('label', {}, [
        L(f.label),
        f.required ? el('span', { class: 'req', text: ' *' }) : null,
        f.unit ? el('span', { class: 'unit', text: '(' + f.unit + ')' }) : null,
      ]);
      wrap.appendChild(lab);

      let input;
      if (f.type === 'select') {
        input = el('select', {
          onchange: (e) => { rec.fields[f.key] = e.target.value; touch(rec); },
        });
        input.appendChild(el('option', { value: '', text: '—' }));
        f.options.forEach((o) => {
          const opt = el('option', { value: o.value, text: lang === 'th' ? o.label.th : `${o.label.en}${lang === 'both' ? ' / ' + o.label.th : ''}` });
          if (rec.fields[f.key] === o.value) opt.selected = true;
          input.appendChild(opt);
        });
      } else {
        input = el('input', {
          type: f.type || 'text',
          placeholder: f.placeholder || '',
          value: rec.fields[f.key] || '',
          step: f.type === 'number' ? 'any' : null,
          oninput: (e) => { rec.fields[f.key] = e.target.value; },
          onchange: (e) => { rec.fields[f.key] = e.target.value; touch(rec); },
        });
      }
      wrap.appendChild(input);
      grid.appendChild(wrap);
    });
    body.appendChild(grid);
  }

  /* ---- checklist / condition ---- */

  function renderChecklist(body, rec, def, section) {
    const isCondition = section.type === 'condition';
    const choices = isCondition
      ? [['NORMAL', UI.normal], ['ABNORMAL', UI.abnormal]]
      : [['PASS', UI.pass], ['FAIL', UI.fail], ['NA', UI.na]];

    if (!rec.checks[section.id]) rec.checks[section.id] = {};
    const answers = rec.checks[section.id];

    /* Bulk action — mark everything unanswered as PASS */
    if (!isCondition) {
      body.appendChild(
        el('div', { class: 'btn-row no-print', style: 'margin-bottom:12px' }, [
          el('button', {
            class: 'btn btn-sm',
            onclick: () => {
              section.items.forEach((it) => {
                if (!answers[it.code] || !answers[it.code].value) {
                  answers[it.code] = Object.assign({ remark: '' }, answers[it.code], { value: 'PASS' });
                }
              });
              touch(rec);
              render();
            },
          }, [L({ en: 'Mark remaining as PASS', th: 'ตั้งรายการที่เหลือเป็น “ผ่าน”' })]),
          el('button', {
            class: 'btn btn-sm',
            onclick: () => {
              section.items.forEach((it) => { delete answers[it.code]; });
              touch(rec);
              render();
            },
          }, [L(UI.clear)]),
        ])
      );
    }

    section.items.forEach((it) => {
      const a = answers[it.code] || (answers[it.code] = { value: '', remark: '' });
      const row = el('div', { class: 'check-row' + (a.value === 'FAIL' || a.value === 'ABNORMAL' ? ' is-fail' : '') });
      row.appendChild(el('div', { class: 'check-code', text: it.code }));
      row.appendChild(el('div', { class: 'check-label' }, [
        el('div', { class: 'label-en', text: it.label.en }),
        el('div', { class: 'label-th th', text: it.label.th }),
      ]));

      const pfn = el('div', { class: 'pfn' });
      choices.forEach(([val, label]) => {
        pfn.appendChild(
          el('button', {
            'data-v': val,
            class: a.value === val ? 'on' : '',
            text: T(label),
            onclick: () => {
              a.value = a.value === val ? '' : val;
              touch(rec);
              render();
            },
          })
        );
      });
      row.appendChild(pfn);

      row.appendChild(
        el('input', {
          class: 'cell-input',
          placeholder: T(UI.remark),
          value: a.remark || '',
          oninput: (e) => { a.remark = e.target.value; },
          onchange: (e) => { a.remark = e.target.value; touch(rec); },
        })
      );
      body.appendChild(row);
    });
  }

  /* ---- measurements ---- */

  function renderMeasurements(body, rec, def, section) {
    if (!rec.measures[section.id]) rec.measures[section.id] = {};
    const vals = rec.measures[section.id];
    section.items.forEach((m) => {
      body.appendChild(
        el('div', { class: 'measure-row' }, [
          el('div', {}, [
            el('div', { class: 'label-en', text: m.label.en }),
            el('div', { class: 'label-th th', text: m.label.th }),
          ]),
          el('input', {
            class: 'cell-input',
            type: 'number',
            step: 'any',
            placeholder: m.placeholder || '',
            value: vals[m.key] || '',
            oninput: (e) => { vals[m.key] = e.target.value; },
            onchange: (e) => { vals[m.key] = e.target.value; touch(rec); },
          }),
          el('div', { style: 'color:var(--text-dim);font-size:13px', text: m.unit }),
        ])
      );
    });
  }

  /* ---- performance (target vs actual, auto verdict) ---- */

  function renderPerformance(body, rec, def, section) {
    if (!rec.perf[section.id]) rec.perf[section.id] = {};
    const vals = rec.perf[section.id];

    body.appendChild(
      el('div', { class: 'perf-row', style: 'font-size:11.5px;letter-spacing:.5px;color:var(--text-faint);text-transform:uppercase' }, [
        el('div', { text: 'Test' }),
        el('div', { text: T(UI.target) }),
        el('div', { text: T(UI.actual) }),
        el('div', { text: T(UI.result) }),
      ])
    );

    section.items.forEach((p) => {
      const verdict = el('div', { class: 'verdict none', text: '—' });
      const updateVerdict = () => {
        const v = parseFloat(vals[p.key]);
        const limit = parseFloat(String(p.target).replace(/[^0-9.]/g, ''));
        if (isNaN(v) || isNaN(limit)) {
          verdict.className = 'verdict none';
          verdict.textContent = '—';
          return;
        }
        const ok = p.better === 'lower' ? v <= limit : v >= limit;
        verdict.className = 'verdict ' + (ok ? 'pass' : 'fail');
        verdict.textContent = ok ? T(UI.pass) : T(UI.fail);
      };

      body.appendChild(
        el('div', { class: 'perf-row' }, [
          el('div', {}, [
            el('div', { class: 'label-en', text: p.label.en }),
            el('div', { class: 'label-th th', text: p.label.th }),
          ]),
          el('div', { class: 'perf-target', text: p.target }),
          el('input', {
            class: 'cell-input',
            type: 'number',
            step: 'any',
            placeholder: p.unit,
            value: vals[p.key] || '',
            oninput: (e) => { vals[p.key] = e.target.value; updateVerdict(); },
            onchange: (e) => { vals[p.key] = e.target.value; updateVerdict(); touch(rec); },
          }),
          verdict,
        ])
      );
      updateVerdict();
    });
  }

  /* ---- documents ---- */

  function renderDocuments(body, rec, def, section) {
    if (!rec.docs[section.id]) rec.docs[section.id] = {};
    const vals = rec.docs[section.id];
    const grid = el('div', { class: 'doc-grid' });
    section.items.forEach((it) => {
      const item = el('label', { class: 'doc-item' + (vals[it.code] ? ' on' : '') });
      const cb = el('input', {
        type: 'checkbox',
        onchange: (e) => {
          vals[it.code] = e.target.checked;
          item.className = 'doc-item' + (e.target.checked ? ' on' : '');
          touch(rec);
        },
      });
      cb.checked = !!vals[it.code];
      item.appendChild(cb);
      item.appendChild(el('div', {}, [
        el('div', { class: 'label-en', text: it.label.en }),
        el('div', { class: 'label-th th', style: 'font-size:11.5px;color:var(--text-dim)', text: it.label.th }),
      ]));
      grid.appendChild(item);
    });
    body.appendChild(grid);
  }

  /* ---- photos ---- */

  function compressImage(file, maxDim, quality) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
          const w = Math.round(img.width * scale);
          const h = Math.round(img.height * scale);
          const canvas = el('canvas');
          canvas.width = w;
          canvas.height = h;
          canvas.getContext('2d').drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = reject;
        img.src = reader.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function photoSlot(rec, store, key, label, onRemove) {
    const slot = el('div', { class: 'photo-slot' });
    if (label) {
      slot.appendChild(el('div', { class: 'ps-head' }, [
        el('div', { class: 'label-en', text: label.en }),
        el('div', { class: 'label-th th', text: label.th }),
      ]));
    }

    const fileInput = el('input', {
      type: 'file',
      accept: 'image/*',
      capture: 'environment',
      style: 'display:none',
      onchange: async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        try {
          store[key] = await compressImage(file, 1200, 0.72);
          touch(rec);
          render();
        } catch (err) {
          toast(lang === 'th' ? 'อ่านรูปไม่สำเร็จ' : 'Could not read image', true);
        }
        e.target.value = '';
      },
    });
    slot.appendChild(fileInput);

    if (store[key]) {
      slot.appendChild(el('img', { src: store[key], alt: label ? label.en : 'photo' }));
      slot.appendChild(
        el('div', { class: 'photo-actions no-print' }, [
          el('button', { class: 'btn btn-sm', onclick: () => fileInput.click() }, [L({ en: 'Replace', th: 'เปลี่ยนรูป' })]),
          el('button', {
            class: 'btn btn-sm btn-danger',
            onclick: () => {
              if (onRemove) onRemove();
              else delete store[key];
              touch(rec);
              render();
            },
          }, [L(UI.remove)]),
        ])
      );
    } else {
      slot.appendChild(
        el('div', { class: 'photo-drop', onclick: () => fileInput.click() }, [
          el('div', {}, [
            el('div', { style: 'font-size:22px', text: '📷' }),
            el('div', { text: lang === 'th' ? 'แตะเพื่อถ่าย / เลือกรูป' : 'Tap to take / choose photo' }),
          ]),
        ])
      );
    }
    return slot;
  }

  function renderPhotos(body, rec, def, section) {
    if (!rec.photos[section.id]) rec.photos[section.id] = {};
    const store = rec.photos[section.id];
    const grid = el('div', { class: 'photo-grid' });

    (section.items || []).forEach((it) => {
      grid.appendChild(photoSlot(rec, store, it.code, it.label));
    });

    /* Free-form extra photos */
    if (section.allowFree) {
      Object.keys(store)
        .filter((k) => k.startsWith('EX'))
        .sort()
        .forEach((k) => {
          grid.appendChild(photoSlot(rec, store, k, { en: 'Additional', th: 'รูปเพิ่มเติม' }, () => { delete store[k]; }));
        });
    }
    body.appendChild(grid);

    if (section.allowFree) {
      body.appendChild(
        el('div', { class: 'btn-row no-print', style: 'margin-top:13px' }, [
          el('button', {
            class: 'btn btn-sm',
            onclick: () => {
              const n = Object.keys(store).filter((k) => k.startsWith('EX')).length;
              store['EX' + String(n + 1).padStart(2, '0')] = '';
              touch(rec);
              render();
            },
          }, [L(UI.addPhoto)]),
        ])
      );
    }
  }

  function renderBeforeAfter(body, rec) {
    if (!rec.beforeAfter) rec.beforeAfter = { before: [], after: [] };
    const ba = rec.beforeAfter;

    const grid = el('div', { class: 'ba-grid' });
    [['before', UI.before], ['after', UI.after]].forEach(([side, label]) => {
      const col = el('div', { class: 'ba-col' });
      col.appendChild(el('h4', { text: T(label) }));
      const store = {};
      ba[side].forEach((src, i) => { store[i] = src; });

      const inner = el('div', { style: 'display:flex;flex-direction:column;gap:11px' });
      ba[side].forEach((src, i) => {
        inner.appendChild(
          photoSlot(rec, {
            get [i]() { return ba[side][i]; },
            set [i](v) { ba[side][i] = v; },
          }, i, null, () => { ba[side].splice(i, 1); })
        );
      });
      inner.appendChild(
        el('button', {
          class: 'btn btn-sm no-print',
          onclick: () => { ba[side].push(''); touch(rec); render(); },
        }, [L(UI.addPhoto)])
      );
      col.appendChild(inner);
      grid.appendChild(col);
    });
    body.appendChild(grid);
  }

  /* ---- generic table ---- */

  function renderTable(body, rec, def, section) {
    if (!rec.tables[section.id]) rec.tables[section.id] = [];
    const rows = rec.tables[section.id];
    if (!rows.length) rows.push({});

    const wrap = el('div', { class: 'table-wrap' });
    const table = el('table');
    table.appendChild(
      el('thead', {}, el('tr', {}, [
        ...section.columns.map((c) => el('th', { style: c.width ? `width:${c.width}` : null }, [L(c.label)])),
        el('th', { class: 'no-print', style: 'width:46px' }),
      ]))
    );
    const tbody = el('tbody');
    rows.forEach((row, idx) => {
      tbody.appendChild(
        el('tr', {}, [
          ...section.columns.map((c) =>
            el('td', {}, el('input', {
              class: 'cell-input',
              type: c.type || 'text',
              step: c.type === 'number' ? 'any' : null,
              value: row[c.key] || '',
              oninput: (e) => { row[c.key] = e.target.value; },
              onchange: (e) => { row[c.key] = e.target.value; touch(rec); },
            }))
          ),
          el('td', { class: 'no-print' }, el('button', {
            class: 'btn btn-sm btn-danger',
            text: '✕',
            onclick: () => { rows.splice(idx, 1); touch(rec); render(); },
          })),
        ])
      );
    });
    table.appendChild(tbody);
    wrap.appendChild(table);
    body.appendChild(wrap);

    body.appendChild(
      el('div', { class: 'btn-row no-print', style: 'margin-top:11px' }, [
        el('button', { class: 'btn btn-sm', onclick: () => { rows.push({}); touch(rec); render(); } }, [L(UI.addRow)]),
      ])
    );
  }

  /* ---- cost table (auto total) ---- */

  function renderCostTable(body, rec, def, section) {
    if (!rec.tables[section.id]) rec.tables[section.id] = [];
    const rows = rec.tables[section.id];
    if (!rows.length) rows.push({});

    const totalCell = el('td', { style: 'font-weight:700;text-align:right' });
    const recalc = () => {
      const sum = rows.reduce((acc, r) => acc + (parseFloat(r.qty) || 0) * (parseFloat(r.unitPrice) || 0), 0);
      totalCell.textContent = '฿' + sum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      Array.from(body.querySelectorAll('[data-line-total]')).forEach((cell, i) => {
        const r = rows[i];
        if (!r) return;
        const line = (parseFloat(r.qty) || 0) * (parseFloat(r.unitPrice) || 0);
        cell.textContent = line ? '฿' + line.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—';
      });
    };

    const wrap = el('div', { class: 'table-wrap' });
    const table = el('table');
    table.appendChild(
      el('thead', {}, el('tr', {}, [
        ...section.columns.map((c) => el('th', { style: c.width ? `width:${c.width}` : null }, [L(c.label)])),
        el('th', { style: 'text-align:right' }, [L({ en: 'Total', th: 'รวม' })]),
        el('th', { class: 'no-print', style: 'width:46px' }),
      ]))
    );
    const tbody = el('tbody');
    rows.forEach((row, idx) => {
      tbody.appendChild(
        el('tr', {}, [
          ...section.columns.map((c) =>
            el('td', {}, el('input', {
              class: 'cell-input',
              type: c.type || 'text',
              step: c.type === 'number' ? 'any' : null,
              value: row[c.key] || '',
              oninput: (e) => { row[c.key] = e.target.value; recalc(); },
              onchange: (e) => { row[c.key] = e.target.value; touch(rec); },
            }))
          ),
          el('td', { 'data-line-total': '1', style: 'text-align:right;color:var(--text-dim)' }),
          el('td', { class: 'no-print' }, el('button', {
            class: 'btn btn-sm btn-danger',
            text: '✕',
            onclick: () => { rows.splice(idx, 1); touch(rec); render(); },
          })),
        ])
      );
    });
    tbody.appendChild(
      el('tr', {}, [
        el('td', { colspan: String(section.columns.length), style: 'text-align:right;font-weight:700' }, [L(UI.total)]),
        totalCell,
        el('td', { class: 'no-print' }),
      ])
    );
    table.appendChild(tbody);
    wrap.appendChild(table);
    body.appendChild(wrap);
    body.appendChild(
      el('div', { class: 'btn-row no-print', style: 'margin-top:11px' }, [
        el('button', { class: 'btn btn-sm', onclick: () => { rows.push({}); touch(rec); render(); } }, [L(UI.addRow)]),
      ])
    );
    recalc();
  }

  /* ---- notes ---- */

  function renderNotes(body, rec, def, section) {
    body.appendChild(
      el('div', { class: 'field' }, [
        el('textarea', {
          placeholder: section.placeholder ? T(section.placeholder) : '',
          oninput: (e) => { rec.notes[section.id] = e.target.value; },
          onchange: (e) => { rec.notes[section.id] = e.target.value; touch(rec); },
        }, rec.notes[section.id] || ''),
      ])
    );
  }

  /* ---- problem + priority ---- */

  function renderProblem(body, rec, def, section) {
    renderNotes(body, rec, def, section);
    const row = el('div', { class: 'priority-row' });
    section.priorities.forEach((p) => {
      const on = rec.priority[section.id] === p.value;
      row.appendChild(
        el('button', {
          class: on ? 'on' : '',
          style: on ? `background:${p.color};border-color:${p.color}` : '',
          text: '● ' + T(p.label),
          onclick: () => {
            rec.priority[section.id] = on ? null : p.value;
            touch(rec);
            render();
          },
        })
      );
    });
    body.appendChild(el('div', { style: 'font-size:12.5px;color:var(--text-dim);margin-top:14px' }, [
      L({ en: "Customer's Priority", th: 'ระดับความเร่งด่วนจากลูกค้า' }),
    ]));
    body.appendChild(row);
  }

  /* ---- root cause ---- */

  function renderRootCause(body, rec, def, section) {
    if (!rec.rootcause[section.id]) rec.rootcause[section.id] = { selected: [], text: '' };
    const rc = rec.rootcause[section.id];

    const grid = el('div', { class: 'rc-grid' });
    section.categories.forEach((c) => {
      const on = rc.selected.includes(c.code);
      const item = el('label', { class: 'doc-item' + (on ? ' on' : '') });
      const cb = el('input', {
        type: 'checkbox',
        onchange: (e) => {
          if (e.target.checked) { if (!rc.selected.includes(c.code)) rc.selected.push(c.code); }
          else rc.selected = rc.selected.filter((x) => x !== c.code);
          item.className = 'doc-item' + (e.target.checked ? ' on' : '');
          touch(rec);
        },
      });
      cb.checked = on;
      item.appendChild(cb);
      item.appendChild(el('div', {}, [
        el('div', { class: 'label-en', text: c.label.en }),
        el('div', { class: 'label-th th', style: 'font-size:11.5px;color:var(--text-dim)', text: c.label.th }),
      ]));
      grid.appendChild(item);
    });
    body.appendChild(grid);

    body.appendChild(
      el('div', { class: 'field' }, [
        el('label', {}, [L({ en: 'Root cause description', th: 'คำอธิบายสาเหตุที่แท้จริง' })]),
        el('textarea', {
          placeholder: section.placeholder ? T(section.placeholder) : '',
          oninput: (e) => { rc.text = e.target.value; },
          onchange: (e) => { rc.text = e.target.value; touch(rec); },
        }, rc.text || ''),
      ])
    );
  }

  /* ---- result (with safety gate) ---- */

  function renderResult(body, rec, def, section) {
    const blocked = hasSafetyFail(rec);
    if (blocked) body.appendChild(el('div', { class: 'alert-danger' }, [L(UI.safetyBlock)]));

    const fails = failedItems(rec);
    if (fails.length) {
      const list = el('div', { style: 'margin-bottom:15px;font-size:13px' }, [
        el('div', { style: 'color:var(--text-dim);margin-bottom:7px' }, [
          L({ en: 'Items not passed:', th: 'รายการที่ไม่ผ่าน:' }),
        ]),
      ]);
      fails.forEach((f) => {
        list.appendChild(
          el('div', { style: 'padding:5px 0;border-bottom:1px solid var(--line-soft)' , text:
            `${f.item.code} — ${T(f.item.label)}${f.remark ? '  ·  ' + f.remark : ''}` })
        );
      });
      body.appendChild(list);
    }

    const row = el('div', { class: 'result-row' });
    section.options.forEach((o) => {
      /* A failed safety item blocks only the "all clear" option */
      const isBlocked = blocked && o.color === '#22c55e';
      const on = rec.result === o.value;
      row.appendChild(
        el('button', {
          class: (on ? 'on ' : '') + (isBlocked ? 'blocked' : ''),
          style: on ? `border-color:${o.color};background:${o.color}22;color:${o.color}` : '',
          onclick: () => {
            if (isBlocked) { toast(T(UI.safetyBlock), true); return; }
            rec.result = on ? null : o.value;
            rec.status = rec.result ? 'completed' : 'draft';
            touch(rec);
            render();
          },
        }, [
          el('span', { class: 'dot', style: `background:${o.color}` }),
          el('span', {}, [
            el('span', { class: 'label-en', text: o.label.en }),
            el('span', { class: 'label-th th', text: o.label.th }),
          ]),
        ])
      );
    });
    body.appendChild(row);
  }

  /* ---- signatures ---- */

  function renderSignoff(body, rec, def, section) {
    const grid = el('div', { class: 'sign-grid' });
    section.roles.forEach((role) => {
      if (!rec.signatures[role.key]) rec.signatures[role.key] = { data: '', name: '', date: '' };
      const sig = rec.signatures[role.key];

      const canvas = el('canvas', { class: 'sign-pad', width: 520, height: 130 });
      const card = el('div', { class: 'sign-card' }, [
        el('h4', {}, [
          el('span', { class: 'label-en', text: role.label.en }),
          el('span', { class: 'label-th th', text: ' ' + role.label.th }),
        ]),
        canvas,
        el('div', { class: 'sign-meta' }, [
          el('input', {
            class: 'cell-input',
            placeholder: T(UI.name),
            value: sig.name || '',
            oninput: (e) => { sig.name = e.target.value; },
            onchange: (e) => { sig.name = e.target.value; touch(rec); },
          }),
          el('input', {
            class: 'cell-input',
            type: 'date',
            value: sig.date || '',
            onchange: (e) => { sig.date = e.target.value; touch(rec); },
          }),
        ]),
        el('div', { class: 'sign-foot no-print' }, [
          el('button', {
            class: 'btn btn-sm',
            onclick: () => {
              sig.data = '';
              const ctx = canvas.getContext('2d');
              ctx.fillStyle = '#fff';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              touch(rec);
            },
          }, [L(UI.clear)]),
        ]),
      ]);
      grid.appendChild(card);
      setupSignaturePad(canvas, sig, rec);
    });
    body.appendChild(grid);
  }

  function setupSignaturePad(canvas, sig, rec) {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#111';

    if (sig.data) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      img.src = sig.data;
    }

    let drawing = false;

    function pos(e) {
      const rect = canvas.getBoundingClientRect();
      const point = e.touches ? e.touches[0] : e;
      return {
        x: (point.clientX - rect.left) * (canvas.width / rect.width),
        y: (point.clientY - rect.top) * (canvas.height / rect.height),
      };
    }

    function start(e) {
      e.preventDefault();
      drawing = true;
      const p = pos(e);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
    }
    function move(e) {
      if (!drawing) return;
      e.preventDefault();
      const p = pos(e);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
    function end() {
      if (!drawing) return;
      drawing = false;
      sig.data = canvas.toDataURL('image/png');
      touch(rec);
    }

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);
    canvas.addEventListener('touchstart', start, { passive: false });
    canvas.addEventListener('touchmove', move, { passive: false });
    canvas.addEventListener('touchend', end);
  }

  /* ---------------- Boot ---------------- */

  function boot() {
    $('#appName').textContent = 'FN Machine Care';
    readHash();
    render();

    window.addEventListener('hashchange', () => {
      if (suppressHashChange) { suppressHashChange = false; return; }
      readHash();
      render();
    });
    window.addEventListener('beforeunload', () => saveDB());
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  /* Expose a little surface for debugging in the console */
  window.FNMachineCare = {
    get db() { return db; },
    save: saveDB,
    reset: () => { db = structuredClone(DEFAULT_DB); saveDB(); render(); },
  };
})();
