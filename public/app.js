/* 登记管理系统 前端逻辑（模板驱动版） */
(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);

  const TYPE_NAMES = {
    text: '文本',
    number: '数字',
    date: '日期',
    select: '下拉选项',
    image: '图片上传',
    product: '产品选择',
    dealer: '经销商选择',
    manager: '经理名'
  };

  /* 预置字段库（管理员添加字段时可选） */
  const FIELD_LIB = [
    { key: 'reg_date', label: '登记日期', type: 'date', default_today: true },
    { key: 'product_name', label: '产品名称', type: 'product', target: 'unit_price' },
    { key: 'quantity', label: '数量', type: 'number' },
    { key: 'unit_price', label: '单价（元）', type: 'number' },
    { key: 'payable_amount', label: '应付金额（元）', type: 'number' },
    { key: 'refund_amount', label: '退款金额（元）', type: 'number' },
    { key: 'aftersale_type', label: '售后类型', type: 'select', options: ['退货退款', '仅退款', '运费'] },
    { key: 'reason', label: '售后原因', type: 'text' },
    { key: 'original_tracking', label: '原快递单号', type: 'text' },
    { key: 'return_tracking', label: '退回快递单号', type: 'text' },
    { key: 'return_location', label: '货物退回地点', type: 'text' },
    { key: 'dealer', label: '经销商', type: 'dealer', targets: { name: 'payee_name', card: 'card_no', bank: 'bank' } },
    { key: 'payee_name', label: '银行卡姓名', type: 'text' },
    { key: 'card_no', label: '卡号', type: 'text' },
    { key: 'bank', label: '开户行', type: 'text' },
    { key: 'manager', label: '经理名', type: 'manager' },
    { key: 'screenshots', label: '截图（可上传多张图片）', type: 'image' }
  ];

  const state = {
    user: null,
    templates: [],
    currentTemplate: null,
    currentTplId: null,
    fields: [],
    formValues: {},
    suggest: {},
    products: [],
    allDealers: [],
    editingFields: [],
    editingTplId: null
  };

  /* ---------------- 工具 ---------------- */
  function todayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function money(n) {
    return (Number(n) || 0).toFixed(2);
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function urlOf(u) {
    return u.startsWith('http') ? u : window.location.origin + u;
  }

  let toastTimer = null;
  function toast(msg, isError) {
    const t = $('toast');
    t.textContent = msg;
    t.className = 'toast' + (isError ? ' error' : '');
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, 2600);
  }

  async function api(url, options) {
    const res = await fetch(url, options);
    if (res.status === 401 && url.indexOf('/api/login') === -1) {
      showLogin();
      throw new Error('登录已过期，请重新登录');
    }
    if (!res.ok) {
      let msg = '请求失败 (' + res.status + ')';
      try { const j = await res.json(); if (j.error) msg = j.error; } catch (e) { /* ignore */ }
      throw new Error(msg);
    }
    const ct = res.headers.get('content-type') || '';
    return ct.includes('application/json') ? res.json() : res;
  }

  /* ---------------- 认证 ---------------- */
  function showApp() {
    $('loginMask').hidden = true;
    $('mainApp').hidden = false;
  }

  function showLogin() {
    $('loginMask').hidden = false;
    $('mainApp').hidden = true;
    $('btnImportVoucher').hidden = true;
    closeDrawer();
  }

  function updateUserChip() {
    const chip = $('userChip');
    chip.hidden = false;
    chip.innerHTML = '';
    const name = document.createElement('span');
    name.textContent = state.user.manager_name || state.user.username;
    const role = document.createElement('span');
    role.className = 'role-tag';
    role.textContent = state.user.role === 'admin' ? '管理员' : '经理';
    chip.appendChild(name);
    chip.appendChild(role);
  }

  function afterLoginInit() {
    loadTemplates().then(() => {
      if (state.templates.length > 0) {
        openTemplate(state.templates[0].id);
      } else {
        renderForm();
        renderRecordHead([]);
        renderRows([]);
      }
    });
  }
  async function initAuth() {
    try {
      const res = await fetch('/api/me');
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.user) { showLogin(); return; }
      state.user = data.user;
      updateUserChip();
      renderMenu();
      showApp();
      afterLoginInit();
    } catch (e) {
      showLogin();
    }
  }

  async function doLogin() {
    const username = $('loginUsername').value.trim();
    const password = $('loginPassword').value;
    const err = $('loginError');
    err.hidden = true;
    if (!username || !password) { err.textContent = '请输入用户名和密码'; err.hidden = false; return; }
    const btn = $('btnLogin');
    btn.disabled = true;
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || '登录失败');
      state.user = data.user;
      $('loginPassword').value = '';
      $('loginUsername').value = '';
      updateUserChip();
      renderMenu();
      showApp();
      afterLoginInit();
      toast('登录成功');
    } catch (e) {
      err.textContent = e.message;
      err.hidden = false;
    } finally {
      btn.disabled = false;
    }
  }

  $('btnLogin').addEventListener('click', doLogin);
  $('loginPassword').addEventListener('keydown', (e) => { if (e.key === 'Enter') doLogin(); });
  $('loginUsername').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('loginPassword').focus(); });

  $('btnLogout').addEventListener('click', async () => {
    try { await fetch('/api/logout', { method: 'POST' }); } catch (e) { /* ignore */ }
    state.user = null;
    state.templates = [];
    showLogin();
  });

  /* ---------------- 右侧抽屉菜单 ---------------- */
  const drawer = $('drawer');
  const drawerMask = $('drawerMask');

  function openDrawer() {
    renderMenu();
    drawer.hidden = false;
    drawerMask.hidden = false;
    requestAnimationFrame(() => drawer.classList.add('open'));
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    drawerMask.hidden = true;
    setTimeout(() => { drawer.hidden = true; }, 200);
  }

  function renderMenu() {
    $('menuAdminArea').hidden = state.user.role !== 'admin';
    const du = $('drawerUser');
    du.innerHTML = '';
    const n = document.createElement('strong');
    n.textContent = state.user.manager_name || state.user.username;
    const r = document.createElement('span');
    r.className = 'role-tag';
    r.textContent = state.user.role === 'admin' ? '管理员' : '经理';
    du.appendChild(n);
    du.appendChild(r);

    const ul = $('menuTemplates');
    ul.innerHTML = '';
    if (state.templates.length === 0) {
      const li = document.createElement('li');
      const span = document.createElement('span');
      span.className = 'drawer-empty';
      span.textContent = '暂无模板';
      li.appendChild(span);
      ul.appendChild(li);
      return;
    }
    state.templates.forEach((t) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'drawer-item' + (state.currentTplId === t.id ? ' active' : '');
      btn.textContent = t.name;
      btn.addEventListener('click', () => {
        openTemplate(t.id);
        closeDrawer();
      });
      li.appendChild(btn);
      ul.appendChild(li);
    });
  }

  $('btnMenu').addEventListener('click', openDrawer);
  $('btnCloseDrawer').addEventListener('click', closeDrawer);
  drawerMask.addEventListener('click', closeDrawer);

  /* ---------------- 模板加载与切换 ---------------- */
  async function loadTemplates() {
    state.templates = await api('/api/templates');
    renderMenu();
    return state.templates;
  }

  async function openTemplate(id) {
    let t = state.templates.find((x) => x.id === id);
    if (!t) {
      try {
        t = await api('/api/templates/' + id);
        state.templates.push(t);
      } catch (e) { return; }
    }
    if (!t || !t.fields) return;
    state.currentTemplate = t;
    state.currentTplId = Number(id);
    state.fields = t.fields.slice().sort((a, b) => a.sort - b.sort);
    state.formValues = {};
    state.suggest = {};
    $('formTitle').textContent = t.name + '信息登记';
    $('listTitle').textContent = t.name + '记录';
    renderForm();
    if (state.fields.some((f) => f.type === 'date')) {
      $('startDate').value = todayStr();
      $('endDate').value = todayStr();
    } else {
      $('startDate').value = '';
      $('endDate').value = '';
    }
    $('keyword').value = '';
    renderMenu();
    await loadRecords();
  }

  /* ---------------- 动态表单 ---------------- */
  function makeInput(f, attrs) {
    const input = document.createElement('input');
    input.type = f.type === 'number' ? 'number' : 'text';
    input.dataset.key = f.key;
    if (f.type === 'number') { input.min = '0'; input.step = '0.01'; input.placeholder = '0.00'; }
    if (attrs && attrs.placeholder) input.placeholder = attrs.placeholder;
    return input;
  }

  function buildLabel(f) {
    const label = document.createElement('label');
    label.textContent = f.label + ' ';
    if (f.required) {
      const em = document.createElement('em');
      em.className = 'req';
      em.textContent = '*';
      label.appendChild(em);
    }
    return label;
  }

  function createSuggestList() {
    const ul = document.createElement('ul');
    ul.className = 'suggest-list';
    ul.hidden = true;
    return ul;
  }

  function createFieldEl(f) {
    const wrap = document.createElement('div');
    wrap.className = f.type === 'image' ? 'field field-full' : 'field';
    wrap.dataset.key = f.key;

    if (f.type === 'image') {
      wrap.appendChild(buildLabel(f));
      const area = document.createElement('div');
      area.className = 'upload-area';
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.multiple = true;
      input.hidden = true;
      const hint = document.createElement('div');
      hint.className = 'upload-hint';
      hint.textContent = '点击或拖拽图片到此处上传';
      const thumbs = document.createElement('div');
      thumbs.className = 'thumb-list';
      area.appendChild(input);
      area.appendChild(hint);
      area.appendChild(thumbs);
      area.addEventListener('click', (e) => {
        if (e.target.closest('.remove')) return;
        input.click();
      });
      area.addEventListener('dragover', (e) => { e.preventDefault(); area.classList.add('dragover'); });
      area.addEventListener('dragleave', () => area.classList.remove('dragover'));
      area.addEventListener('drop', (e) => {
        e.preventDefault();
        area.classList.remove('dragover');
        uploadImages(f, e.dataTransfer.files);
      });
      input.addEventListener('change', () => uploadImages(f, input.files));
      wrap.appendChild(area);
      state.formValues[f.key] = [];
      return wrap;
    }

    if (f.type === 'date') {
      wrap.appendChild(buildLabel(f));
      const input = document.createElement('input');
      input.type = 'date';
      input.dataset.key = f.key;
      input.value = f.default_today ? todayStr() : '';
      wrap.appendChild(input);
      return wrap;
    }

    if (f.type === 'select') {
      wrap.appendChild(buildLabel(f));
      const sel = document.createElement('select');
      sel.dataset.key = f.key;
      const ph = document.createElement('option');
      ph.value = '';
      ph.disabled = true;
      ph.selected = true;
      ph.hidden = true;
      ph.textContent = '请选择' + f.label;
      sel.appendChild(ph);
      (f.options || []).forEach((o) => {
        const opt = document.createElement('option');
        opt.value = o;
        opt.textContent = o;
        sel.appendChild(opt);
      });
      wrap.appendChild(sel);
      return wrap;
    }

    if (f.type === 'product' || f.type === 'dealer') {
      wrap.appendChild(buildLabel(f));
      const sw = document.createElement('div');
      sw.className = 'suggest-wrap';
      const input = document.createElement('input');
      input.type = 'text';
      input.dataset.key = f.key;
      input.autocomplete = 'off';
      input.placeholder = f.type === 'product' ? '输入关键词选择产品' : '输入关键字选择，或手动输入';
      const list = createSuggestList();
      sw.appendChild(input);
      sw.appendChild(list);
      wrap.appendChild(sw);
      bindSuggestInput(f, input, list);
      return wrap;
    }

    wrap.appendChild(buildLabel(f));
    const input = makeInput(f, { placeholder: f.type === 'manager' ? '请输入经理名' : '请输入' + f.label });
    if (f.type === 'manager' && state.user) input.value = state.user.manager_name || '';
    wrap.appendChild(input);
    return wrap;
  }

  function renderForm() {
    const grid = $('formGrid');
    grid.innerHTML = '';
    state.formValues = {};
    state.suggest = {};
    state.fields.forEach((f) => {
      grid.appendChild(createFieldEl(f));
    });
    bindComputedFields();
  }

  function fieldInput(key) {
    const el = $('formGrid').querySelector(`.field[data-key="${key}"]`);
    return el && el.querySelector('input, select');
  }

  function recalcPayable() {
    if (!state.fields.some((f) => f.key === 'payable_amount')) return;
    const outEl = fieldInput('payable_amount');
    if (!outEl) return;
    const priceEl = fieldInput('unit_price');
    const qtyEl = fieldInput('quantity');
    const priceRaw = priceEl ? String(priceEl.value).trim() : '';
    const qtyRaw = qtyEl ? String(qtyEl.value).trim() : '';
    const price = Number(priceRaw);
    const qty = Number(qtyRaw);
    if (priceRaw !== '' && qtyRaw !== '' && Number.isFinite(price) && Number.isFinite(qty)) {
      outEl.value = (price * qty).toFixed(2);
    } else {
      outEl.value = '';
    }
  }

  function bindComputedFields() {
    const payable = state.fields.find((f) => f.key === 'payable_amount');
    if (!payable) return;
    const outEl = fieldInput('payable_amount');
    if (outEl) {
      outEl.readOnly = true;
      outEl.tabIndex = -1;
      outEl.placeholder = '单价 × 数量';
    }
    ['unit_price', 'quantity'].forEach((k) => {
      const el = fieldInput(k);
      if (el) el.addEventListener('input', recalcPayable);
    });
    recalcPayable();
  }

  function renderImageThumbs(f) {
    const wrap = $('formGrid').querySelector(`.field[data-key="${f.key}"]`);
    if (!wrap) return;
    const thumbs = wrap.querySelector('.thumb-list');
    const hint = wrap.querySelector('.upload-hint');
    thumbs.innerHTML = '';
    const urls = state.formValues[f.key] || [];
    urls.forEach((url, idx) => {
      const item = document.createElement('div');
      item.className = 'thumb-item';
      const img = document.createElement('img');
      img.src = url;
      img.alt = '截图';
      const rm = document.createElement('button');
      rm.type = 'button';
      rm.className = 'remove';
      rm.textContent = '×';
      rm.addEventListener('click', () => {
        state.formValues[f.key].splice(idx, 1);
        renderImageThumbs(f);
      });
      item.appendChild(img);
      item.appendChild(rm);
      thumbs.appendChild(item);
    });
    if (hint) hint.hidden = urls.length > 0;
  }

  async function uploadImages(f, files) {
    const imgs = [...files].filter((x) => x.type.startsWith('image/'));
    if (imgs.length === 0) return;
    const wrap = $('formGrid').querySelector(`.field[data-key="${f.key}"]`);
    const thumbs = wrap.querySelector('.thumb-list');
    const fd = new FormData();
    imgs.forEach((x) => fd.append('images', x));
    const holder = document.createElement('div');
    holder.className = 'thumb-item uploading';
    thumbs.appendChild(holder);
    try {
      const data = await api('/api/upload', { method: 'POST', body: fd });
      state.formValues[f.key].push(...data.urls);
      renderImageThumbs(f);
      toast('图片上传成功');
    } catch (e) {
      toast('图片上传失败：' + e.message, true);
    } finally {
      holder.remove();
      wrap.querySelector('input[type="file"]').value = '';
    }
  }

  /* 产品 / 经销商联想 */
  function bindSuggestInput(f, input, list) {
    state.suggest[f.key] = { matches: [], index: -1, list };
    const loadProducts = async () => {
      try { state.products = await api('/api/products'); } catch (e) { /* ignore */ }
    };
    if (state.products.length === 0) loadProducts();

    input.addEventListener('input', () => {
      if (f.type === 'product') showProductSuggest(f, input);
      else showDealerSuggest(f, input);
    });
    input.addEventListener('focus', () => {
      if (f.type === 'product') {
        if (state.products.length === 0) loadProducts();
        showProductSuggest(f, input);
      } else if (input.value.trim()) {
        showDealerSuggest(f, input);
      }
    });
    input.addEventListener('keydown', (e) => {
      const st = state.suggest[f.key];
      const items = [...list.querySelectorAll('li:not(.empty)')];
      if (items.length === 0) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        st.index = (st.index + 1) % items.length;
        highlightSuggest(list, st.index);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        st.index = (st.index - 1 + items.length) % items.length;
        highlightSuggest(list, st.index);
      } else if (e.key === 'Enter') {
        if (st.index >= 0 && st.matches[st.index]) {
          e.preventDefault();
          selectSuggestValue(f, input, st.matches[st.index]);
        }
      } else if (e.key === 'Escape') {
        hideSuggest(f);
      }
    });
  }

  function highlightSuggest(list, idx) {
    [...list.querySelectorAll('li:not(.empty)')].forEach((li, i) => li.classList.toggle('active', i === idx));
  }

  function hideSuggest(f) {
    const st = state.suggest[f.key];
    if (!st) return;
    st.list.hidden = true;
    st.list.innerHTML = '';
    st.matches = [];
    st.index = -1;
  }

  function selectSuggestValue(f, input, item) {
    if (f.type === 'product') {
      input.value = item.name;
      const tf = state.fields.find((x) => x.key === f.target);
      if (tf) {
        const el = $('formGrid').querySelector(`.field[data-key="${tf.key}"]`);
        const targetInput = el && el.querySelector('input');
        if (targetInput) targetInput.value = money(item.price);
      }
      recalcPayable();
    } else {
      input.value = item.dealer_name;
      const tg = f.targets || {};
      if (tg.name) setFieldValue(tg.name, item.card_holder || '');
      if (tg.card) setFieldValue(tg.card, item.card_no || '');
      if (tg.bank) setFieldValue(tg.bank, item.bank || '');
    }
    hideSuggest(f);
  }

  function setFieldValue(key, val) {
    const el = $('formGrid').querySelector(`.field[data-key="${key}"]`);
    const input = el && el.querySelector('input');
    if (input) input.value = val;
  }

  function showProductSuggest(f, input) {
    const st = state.suggest[f.key];
    const kw = input.value.trim().toLowerCase();
    const matched = kw ? state.products.filter((p) => p.name.toLowerCase().includes(kw)) : state.products;
    st.list.innerHTML = '';
    st.index = -1;
    if (matched.length === 0) {
      const li = document.createElement('li');
      li.className = 'empty';
      li.textContent = kw ? '无匹配产品，可直接输入自定义名称' : '暂无产品，请先在「管理产品」中添加';
      st.list.appendChild(li);
      st.list.hidden = false;
      return;
    }
    matched.slice(0, 12).forEach((p) => {
      const li = document.createElement('li');
      li.dataset.id = p.id;
      const name = document.createElement('span');
      name.textContent = p.name;
      const price = document.createElement('span');
      price.className = 'price';
      price.textContent = '¥' + money(p.price);
      li.appendChild(name);
      li.appendChild(price);
      li.addEventListener('mousedown', (e) => { e.preventDefault(); selectSuggestValue(f, input, p); });
      st.list.appendChild(li);
    });
    st.matches = matched.slice(0, 12);
    st.list.hidden = false;
  }

  function showDealerSuggest(f, input) {
    const st = state.suggest[f.key];
    const kw = input.value.trim();
    if (!kw) { hideSuggest(f); return; }
    fetch('/api/dealers?q=' + encodeURIComponent(kw))
      .then(async (res) => {
        if (res.status === 401) { showLogin(); return []; }
        if (!res.ok) return [];
        return res.json();
      })
      .then((rows) => {
        st.list.innerHTML = '';
        st.index = -1;
        if (rows.length === 0) {
          const li = document.createElement('li');
          li.className = 'empty';
          li.textContent = '无匹配经销商，可手动输入';
          st.list.appendChild(li);
          st.list.hidden = false;
          return;
        }
        rows.forEach((d) => {
          const li = document.createElement('li');
          li.dataset.id = d.id;
          const name = document.createElement('span');
          name.textContent = d.dealer_name;
          const info = document.createElement('span');
          info.className = 'price';
          info.textContent = (d.card_holder ? d.card_holder + ' ' : '') + (d.card_no ? '尾号' + d.card_no.slice(-4) : '');
          li.appendChild(name);
          li.appendChild(info);
          li.addEventListener('mousedown', (e) => { e.preventDefault(); selectSuggestValue(f, input, d); });
          st.list.appendChild(li);
        });
        st.matches = rows;
        st.list.hidden = false;
      })
      .catch(() => { /* ignore */ });
  }

  document.addEventListener('click', (e) => {
    Object.keys(state.suggest).forEach((k) => {
      const st = state.suggest[k];
      if (st && st.list && !st.list.closest('.field')?.contains(e.target)) hideSuggest({ key: k });
    });
  });

  /* ---------------- 表单提交 ---------------- */
  function collectForm() {
    const data = {};
    state.fields.forEach((f) => {
      if (f.type === 'image') {
        data[f.key] = state.formValues[f.key] || [];
      } else {
        const el = $('formGrid').querySelector(`.field[data-key="${f.key}"]`);
        const input = el && el.querySelector('input, select');
        data[f.key] = input ? input.value.trim() : '';
      }
    });
    return data;
  }

  function validateRequired(data) {
    for (const f of state.fields) {
      if (!f.required) continue;
      const v = f.type === 'image' ? (data[f.key] || []) : String(data[f.key] || '');
      const empty = f.type === 'image' ? v.length === 0 : v.trim() === '';
      if (empty) return '请填写' + f.label;
    }
    return null;
  }

  $('recordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!state.currentTemplate) return;
    const btn = $('btnSubmit');
    const data = collectForm();
    const err = validateRequired(data);
    if (err) return toast(err, true);
    btn.disabled = true;
    try {
      await api('/api/templates/' + state.currentTplId + '/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      toast('登记成功');
      resetForm();
      await loadRecords();
    } catch (err2) {
      toast('保存失败：' + err2.message, true);
    } finally {
      btn.disabled = false;
    }
  });

  function resetForm() {
    renderForm();
  }

  $('btnReset').addEventListener('click', resetForm);

  /* ---------------- 记录列表 ---------------- */
  function listFields() {
    return state.fields.filter((f) => f.in_list);
  }

  function renderRecordHead() {
    const thead = $('tableHead');
    thead.innerHTML = '';
    const tr = document.createElement('tr');
    listFields().forEach((c) => {
      const th = document.createElement('th');
      th.textContent = c.label;
      tr.appendChild(th);
    });
    const thV = document.createElement('th');
    thV.textContent = '付款凭证';
    tr.appendChild(thV);
    const thA = document.createElement('th');
    thA.textContent = '操作';
    tr.appendChild(thA);
    thead.appendChild(tr);
  }

  function renderRows(rows) {
    const tbody = $('tableBody');
    const empty = $('emptyState');
    tbody.innerHTML = '';
    $('recordCount').textContent = `共 ${rows.length} 条记录`;
    if (rows.length === 0) {
      empty.hidden = false;
      return;
    }
    empty.hidden = true;
    const cols = listFields();

    rows.forEach((r) => {
      const tr = document.createElement('tr');
      const data = r.data || {};
      cols.forEach((c) => {
        const td = document.createElement('td');
        if (c.type === 'number') td.className = 'td-num';
        else if (c.type === 'select' || c.type === 'date' || c.type === 'manager') td.className = 'td-center';
        if (c.type === 'image') {
          const shots = Array.isArray(data[c.key]) ? data[c.key] : [];
          if (shots.length === 0) {
            td.textContent = '-';
          } else {
            const wrap2 = document.createElement('div');
            wrap2.className = 'shots';
            shots.slice(0, 3).forEach((url) => {
              const img = document.createElement('img');
              img.className = 'shot-thumb';
              img.src = url;
              img.alt = '截图';
              img.addEventListener('click', () => openPreview(url));
              wrap2.appendChild(img);
            });
            const link = document.createElement('a');
            link.className = 'shot-link';
            link.href = urlOf(shots[0]);
            link.target = '_blank';
            link.rel = 'noopener';
            link.textContent = '查看原图';
            wrap2.appendChild(link);
            td.appendChild(wrap2);
          }
        } else {
          const v = data[c.key];
          if (c.type === 'number') {
            td.textContent = v === '' || v == null ? '-' : money(v);
          } else {
            td.innerHTML = esc(v) || '-';
          }
        }
        tr.appendChild(td);
      });
      const tdA = document.createElement('td');
      tdA.className = 'td-center';
      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'btn-del';
      del.textContent = '删除';
      del.addEventListener('click', () => deleteRecord(r.id));
      tdA.appendChild(del);
      const tdV = document.createElement('td');
      tdV.className = 'td-center';
      const vc = r.voucher_count || 0;
      if (vc > 0) {
        const vb = document.createElement('button');
        vb.type = 'button';
        vb.className = 'btn-voucher';
        vb.textContent = '凭证 ' + vc;
        vb.addEventListener('click', () => openVoucherList(r.id));
        tdV.appendChild(vb);
      } else {
        tdV.textContent = '-';
      }
      tr.appendChild(tdV);
      tr.appendChild(tdA);
      tbody.appendChild(tr);
    });
  }

  async function loadRecords() {
    if (!state.currentTemplate) return;
    try {
      const rows = await api('/api/templates/' + state.currentTplId + '/records' + filterParams());
      renderRecordHead();
      renderRows(rows);
    } catch (e) {
      toast('加载记录失败：' + e.message, true);
    }
  }

  function filterParams() {
    const start = $('startDate').value;
    const end = $('endDate').value;
    const kw = $('keyword').value.trim();
    const qs = new URLSearchParams();
    if (start) qs.set('start', start);
    if (end) qs.set('end', end);
    if (kw) qs.set('q', kw);
    const s = qs.toString();
    return s ? '?' + s : '';
  }

  function doSearch() {
    loadRecords();
  }

  async function deleteRecord(id) {
    if (!confirm('确定删除该条登记记录吗？')) return;
    try {
      await api('/api/templates/' + state.currentTplId + '/records/' + id, { method: 'DELETE' });
      toast('已删除');
      loadRecords();
    } catch (e) {
      toast('删除失败：' + e.message, true);
    }
  }

  $('startDate').addEventListener('change', loadRecords);
  $('endDate').addEventListener('change', loadRecords);
  $('btnRefresh').addEventListener('click', loadRecords);
  $('btnSearch').addEventListener('click', doSearch);
  $('keyword').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); doSearch(); }
  });
  $('btnAll').addEventListener('click', () => {
    $('startDate').value = '';
    $('endDate').value = '';
    $('keyword').value = '';
    loadRecords();
  });

  /* ---------------- 图片预览 ---------------- */
  function openPreview(url) {
    $('previewImg').src = urlOf(url);
    $('previewModal').hidden = false;
  }

  $('btnClosePreview').addEventListener('click', () => { $('previewModal').hidden = true; });
  $('previewModal').addEventListener('click', () => { $('previewModal').hidden = true; });

  /* ---------------- Excel 导出 ---------------- */
  function exportExcel(queryString) {
    if (!state.currentTemplate) return;
    const a = document.createElement('a');
    a.href = '/api/templates/' + state.currentTplId + '/export' + (queryString !== undefined ? queryString : filterParams());
    a.download = '';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  $('btnExportFilter').addEventListener('click', () => { exportExcel(); });
  $('btnExportAll').addEventListener('click', () => exportExcel(''));

  /* ---------------- 付款凭证 ---------------- */
  function afterLoginInit() {
    $('btnImportVoucher').hidden = !(state.user && state.user.role === 'admin');
    loadTemplates().then(() => {
      if (state.templates.length > 0) {
        openTemplate(state.templates[0].id);
      } else {
        renderForm();
        renderRecordHead([]);
        renderRows([]);
      }
    });
  }

  async function openVoucherList(recordId) {
    $('voucherListEmpty').hidden = true;
    $('voucherList').innerHTML = '';
    $('voucherListModal').hidden = false;
    try {
      const items = await api('/api/vouchers?template_id=' + state.currentTplId + '&record_id=' + recordId);
      if (items.length === 0) { $('voucherListEmpty').hidden = false; return; }
      items.forEach((v) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = urlOf(v.file_url);
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = '回执 ' + v.order_no + (v.amount ? '（' + v.amount + ' 元）' : '');
        li.appendChild(a);
        $('voucherList').appendChild(li);
      });
    } catch (e) {
      toast('加载凭证失败：' + e.message, true);
    }
  }

  let pickedZip = null;
  $('btnVoucherPick').addEventListener('click', () => $('voucherZip').click());
  $('voucherZip').addEventListener('change', (e) => {
    pickedZip = e.target.files[0] || null;
    $('voucherFileName').textContent = pickedZip ? pickedZip.name : '';
    $('btnVoucherUpload').disabled = !pickedZip;
  });
  $('btnVoucherUpload').addEventListener('click', async () => {
    if (!pickedZip || !state.currentTplId) return;
    const btn = $('btnVoucherUpload');
    btn.disabled = true;
    btn.textContent = '导入中…';
    try {
      const fd = new FormData();
      fd.append('zip', pickedZip);
      const res = await api('/api/vouchers/import?template_id=' + state.currentTplId, { method: 'POST', body: fd });
      const box = $('voucherImportResult');
      box.hidden = false;
      box.innerHTML = '';
      const p = document.createElement('p');
      p.textContent = res.message;
      box.appendChild(p);
      if (res.pending > 0 || res.unmatched > 0) {
        const b = document.createElement('button');
        b.className = 'btn btn-primary';
        b.type = 'button';
        b.textContent = '去处理待确认/未匹配凭证';
        b.addEventListener('click', () => openPending());
        box.appendChild(b);
      }
      loadRecords();
    } catch (e) {
      toast('导入失败：' + e.message, true);
    }
    btn.disabled = false;
    btn.textContent = '开始导入';
  });

  $('btnImportVoucher').addEventListener('click', () => {
    $('voucherImportResult').hidden = true;
    $('voucherFileName').textContent = '';
    $('voucherZip').value = '';
    pickedZip = null;
    $('btnVoucherUpload').disabled = true;
    $('voucherImportModal').hidden = false;
  });
  $('btnCloseVoucherImport').addEventListener('click', () => { $('voucherImportModal').hidden = true; });
  $('btnOpenPending').addEventListener('click', openPending);
  $('btnCloseVoucherList').addEventListener('click', () => { $('voucherListModal').hidden = true; });
  $('btnCloseVoucherPending').addEventListener('click', () => { $('voucherPendingModal').hidden = true; });
  ['voucherImportModal', 'voucherListModal', 'voucherPendingModal'].forEach((id) => {
    $(id).addEventListener('click', (e) => { if (e.target === $(id)) $(id).hidden = true; });
  });

  async function openPending() {
    $('voucherPendingModal').hidden = false;
    $('voucherPendingEmpty').hidden = true;
    $('voucherPendingList').innerHTML = '';
    try {
      const items = await api('/api/vouchers/pending?template_id=' + state.currentTplId);
      if (items.length === 0) { $('voucherPendingEmpty').hidden = false; return; }
      items.forEach((v) => {
        const li = document.createElement('li');
        li.className = 'voucher-pending-item';

        const head = document.createElement('div');
        head.className = 'vp-head';
        const info = document.createElement('span');
        info.textContent = '回执 ' + v.order_no + (v.name ? '｜' + v.name : '') + (v.card_no ? '｜' + v.card_no : '') + (v.amount ? '｜' + v.amount + ' 元' : '');
        head.appendChild(info);
        const st = document.createElement('span');
        st.className = 'vp-status ' + v.status;
        st.textContent = v.status === 'pending' ? '待确认' : '未匹配';
        head.appendChild(st);
        const a = document.createElement('a');
        a.href = urlOf(v.file_url);
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = '查看回执';
        head.appendChild(a);
        li.appendChild(head);

        if (v.status === 'pending' && v.candidates && v.candidates.length) {
          const cand = document.createElement('div');
          cand.className = 'vp-candidates';
          v.candidates.forEach((c) => {
            const row = document.createElement('div');
            row.className = 'vp-cand-row';
            const text = document.createElement('span');
            text.textContent = '记录#' + c.id + '：' + Object.entries(c.info).map(([k, val]) => k + '=' + val).join('，');
            row.appendChild(text);
            const pick = document.createElement('button');
            pick.className = 'btn btn-ghost';
            pick.type = 'button';
            pick.textContent = '归属该记录';
            pick.addEventListener('click', () => linkVoucher(v.id, c.id));
            row.appendChild(pick);
            cand.appendChild(row);
          });
          li.appendChild(cand);
        }

        const ops = document.createElement('div');
        ops.className = 'vp-ops';
        const inp = document.createElement('input');
        inp.type = 'number';
        inp.placeholder = '记录ID';
        inp.className = 'toolbar-search';
        inp.style.width = '90px';
        const go = document.createElement('button');
        go.className = 'btn btn-ghost';
        go.type = 'button';
        go.textContent = '指定归属';
        go.addEventListener('click', () => {
          const rid = inp.value.trim();
          if (!rid) { toast('请输入记录ID'); return; }
          linkVoucher(v.id, Number(rid));
        });
        const keep = document.createElement('button');
        keep.className = 'btn btn-ghost';
        keep.type = 'button';
        keep.textContent = '保留未关联';
        keep.addEventListener('click', () => linkVoucher(v.id, null));
        const del = document.createElement('button');
        del.className = 'btn-del';
        del.type = 'button';
        del.textContent = '移除';
        del.addEventListener('click', () => removeVoucherItem(v.id));
        ops.appendChild(inp); ops.appendChild(go); ops.appendChild(keep); ops.appendChild(del);
        li.appendChild(ops);
        $('voucherPendingList').appendChild(li);
      });
    } catch (e) {
      toast('加载待处理失败：' + e.message, true);
    }
  }

  async function linkVoucher(vid, rid) {
    try {
      await api('/api/vouchers/' + vid + '/link?template_id=' + state.currentTplId, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ record_id: rid })
      });
      toast('已更新归属');
      loadPending();
      loadRecords();
    } catch (e) {
      toast('操作失败：' + e.message, true);
    }
  }

  async function loadPending() {
    if ($('voucherPendingModal').hidden) return;
    await openPending();
  }

  async function removeVoucherItem(vid) {
    if (!confirm('确定移除该凭证吗？将删除对应的回执文件。')) return;
    try {
      await api('/api/vouchers/' + vid + '?template_id=' + state.currentTplId, { method: 'DELETE' });
      toast('已移除');
      loadPending();
      loadRecords();
    } catch (e) {
      toast('移除失败：' + e.message, true);
    }
  }

  /* ---------------- 模板管理（管理员） ---------------- */
  const tplModal = $('tplModal');
  const tplEditModal = $('tplEditModal');
  let allTemplates = [];

  async function openTplModal() {
    tplModal.hidden = false;
    try {
      allTemplates = await api('/api/templates/all');
      renderTplList();
    } catch (e) {
      toast('加载模板失败：' + e.message, true);
    }
  }

  function renderTplList() {
    const list = $('tplList');
    list.innerHTML = '';
    if (allTemplates.length === 0) {
      const li = document.createElement('li');
      li.textContent = '暂无模板，点击「新建模板」创建';
      list.appendChild(li);
      return;
    }
    allTemplates.forEach((t) => {
      const li = document.createElement('li');
      const name = document.createElement('span');
      name.className = 'tpl-name';
      name.textContent = t.name;
      const meta = document.createElement('span');
      meta.className = 'tpl-meta';
      meta.textContent = `${t.fields.length} 个字段 · ${t.enabled ? '启用' : '停用'}`;
      const ops = document.createElement('span');
      ops.className = 'tpl-ops';

      const edit = document.createElement('button');
      edit.type = 'button';
      edit.className = 'mini-btn';
      edit.textContent = '编辑';
      edit.addEventListener('click', () => openTplEdit(t));

      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'mini-btn';
      toggle.textContent = t.enabled ? '停用' : '启用';
      toggle.addEventListener('click', async () => {
        try {
          await api('/api/templates/' + t.id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ enabled: !t.enabled })
          });
          toast(t.enabled ? '已停用' : '已启用');
          allTemplates = await api('/api/templates/all');
          renderTplList();
          await loadTemplates();
        } catch (e) {
          toast('操作失败：' + e.message, true);
        }
      });

      const copy = document.createElement('button');
      copy.type = 'button';
      copy.className = 'mini-btn';
      copy.textContent = '复制';
      copy.addEventListener('click', async () => {
        try {
          await api('/api/templates/' + t.id + '/copy', { method: 'POST' });
          toast('已复制为停用模板，可在编辑中修改');
          allTemplates = await api('/api/templates/all');
          renderTplList();
        } catch (e) {
          toast('复制失败：' + e.message, true);
        }
      });

      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'mini-btn danger';
      del.textContent = '删除';
      del.addEventListener('click', async () => {
        if (!confirm(`确定删除模板「${t.name}」吗？`)) return;
        try {
          await api('/api/templates/' + t.id, { method: 'DELETE' });
          toast('模板已删除');
          allTemplates = await api('/api/templates/all');
          renderTplList();
          await loadTemplates();
          if (state.currentTplId === t.id && state.templates.length) {
            openTemplate(state.templates[0].id);
          }
        } catch (e) {
          toast('删除失败：' + e.message, true);
        }
      });

      ops.appendChild(edit);
      ops.appendChild(toggle);
      ops.appendChild(copy);
      ops.appendChild(del);
      li.appendChild(name);
      li.appendChild(meta);
      li.appendChild(ops);
      list.appendChild(li);
    });
  }

  $('btnTplManage').addEventListener('click', () => { closeDrawer(); openTplModal(); });
  $('btnCloseTplModal').addEventListener('click', () => { tplModal.hidden = true; });
  tplModal.addEventListener('click', (e) => { if (e.target === tplModal) tplModal.hidden = true; });

  $('btnNewTpl').addEventListener('click', () => {
    state.editingTplId = null;
    state.editingFields = [cloneField(FIELD_LIB[0])];
    $('tplEditName').value = '';
    $('tplEditEnabled').checked = true;
    $('tplEditTitle').textContent = '新建模板';
    renderFieldList();
    tplEditModal.hidden = false;
  });

  function openTplEdit(t) {
    state.editingTplId = Number(t.id);
    state.editingFields = t.fields.slice().sort((a, b) => a.sort - b.sort).map(cloneField);
    $('tplEditName').value = t.name;
    $('tplEditEnabled').checked = !!t.enabled;
    $('tplEditTitle').textContent = '编辑模板';
    renderFieldList();
    tplEditModal.hidden = false;
  }

  function cloneField(f) {
    return JSON.parse(JSON.stringify(f));
  }

  function nextFieldKey() {
    const used = new Set(state.editingFields.map((f) => f.key));
    let i = 1;
    while (used.has('field' + i)) i++;
    return 'field' + i;
  }

  /* 字段编辑器 */
  function renderFieldList() {
    const list = $('fieldList');
    list.innerHTML = '';
    state.editingFields.forEach((f, i) => {
      list.appendChild(buildFieldItem(f, i));
    });
  }

  function buildFieldItem(f, i) {
    const item = document.createElement('div');
    item.className = 'tpl-field-item';
    item.dataset.key = f.key;

    const head = document.createElement('div');
    head.className = 'ff-head';
    const order = document.createElement('span');
    order.className = 'ff-order';
    order.textContent = (i + 1) + '.';

    const labelInput = document.createElement('input');
    labelInput.className = 'ff-label';
    labelInput.value = f.label;
    labelInput.placeholder = '字段名称';
    labelInput.addEventListener('input', () => { state.editingFields[i].label = labelInput.value.trim(); });

    const typeTag = document.createElement('span');
    typeTag.className = 'ff-type';
    typeTag.textContent = TYPE_NAMES[f.type] || f.type;

    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'mini-btn danger';
    del.textContent = '删除';
    del.addEventListener('click', () => {
      state.editingFields.splice(i, 1);
      renderFieldList();
    });

    head.appendChild(order);
    head.appendChild(labelInput);
    head.appendChild(typeTag);
    head.appendChild(del);

    const opts = document.createElement('div');
    opts.className = 'ff-opts';

    const chkWrap = (labelText, cls, def) => {
      const lab = document.createElement('label');
      lab.className = 'chk';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.className = cls;
      cb.checked = def;
      cb.addEventListener('change', () => {
        state.editingFields[i][cls === 'ff-required' ? 'required' : cls === 'ff-dup' ? 'dup_check' : 'in_list'] = cb.checked;
      });
      lab.appendChild(cb);
      lab.appendChild(document.createTextNode(labelText));
      return lab;
    };

    const reqChk = chkWrap('必填', 'ff-required', !!f.required);
    const dupChk = chkWrap('重复值禁止登记', 'ff-dup', !!f.dup_check);
    const inListChk = chkWrap('在记录列表显示', 'ff-inlist', f.in_list !== false);
    opts.appendChild(reqChk);
    opts.appendChild(dupChk);
    opts.appendChild(inListChk);

    if (f.type === 'select') {
      const optLine = document.createElement('div');
      optLine.className = 'ff-opt-line';
      const optLabel = document.createElement('span');
      optLabel.textContent = '下拉选项';
      const optInput = document.createElement('input');
      optInput.className = 'ff-options';
      optInput.value = (f.options || []).join('，');
      optInput.placeholder = '用逗号分隔，如：选项1，选项2';
      optInput.addEventListener('input', () => {
        state.editingFields[i].options = optInput.value.split(/[,，]/).map((s) => s.trim()).filter(Boolean);
      });
      optLine.appendChild(optLabel);
      optLine.appendChild(optInput);
      opts.appendChild(optLine);
    }

    const condBlock = document.createElement('div');
    condBlock.className = 'ff-conds';
    const condTitle = document.createElement('span');
    condTitle.className = 'ff-cond-title';
    condTitle.textContent = '条件必填';
    condBlock.appendChild(condTitle);
    const condAdd = document.createElement('button');
    condAdd.type = 'button';
    condAdd.className = 'mini-btn';
    condAdd.textContent = '+ 添加条件';
    condAdd.addEventListener('click', () => {
      state.editingFields[i].condition_required = (state.editingFields[i].condition_required || []).concat([{ field: '', value: '' }]);
      renderFieldList();
    });
    condBlock.appendChild(condAdd);
    (f.condition_required || []).forEach((c) => {
      condBlock.appendChild(buildCondRow(i, c));
    });
    opts.appendChild(condBlock);

    const move = document.createElement('div');
    move.className = 'ff-move';
    if (i > 0) {
      const up = document.createElement('button');
      up.type = 'button';
      up.className = 'mini-btn';
      up.textContent = '↑';
      up.addEventListener('click', () => {
        const arr = state.editingFields;
        [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
        renderFieldList();
      });
      move.appendChild(up);
    }
    if (i < state.editingFields.length - 1) {
      const down = document.createElement('button');
      down.type = 'button';
      down.className = 'mini-btn';
      down.textContent = '↓';
      down.addEventListener('click', () => {
        const arr = state.editingFields;
        [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]];
        renderFieldList();
      });
      move.appendChild(down);
    }

    item.appendChild(head);
    item.appendChild(opts);
    item.appendChild(move);
    return item;
  }

  function buildCondRow(fieldIdx, cond) {
    const row = document.createElement('div');
    row.className = 'ff-cond-row';
    const sel = document.createElement('select');
    sel.className = 'ff-cond-field';
    const ph = document.createElement('option');
    ph.value = '';
    ph.textContent = '选择字段';
    sel.appendChild(ph);
    state.editingFields.forEach((ff, j) => {
      if (j === fieldIdx) return;
      const opt = document.createElement('option');
      opt.value = ff.key;
      opt.textContent = ff.label || ff.key;
      sel.appendChild(opt);
    });
    sel.value = cond.field || '';
    sel.addEventListener('change', () => {
      state.editingFields[fieldIdx].condition_required = (state.editingFields[fieldIdx].condition_required || []).map((c) => c === cond ? { ...c, field: sel.value } : c);
    });
    const eq = document.createElement('span');
    eq.textContent = '=';
    const val = document.createElement('input');
    val.className = 'ff-cond-value';
    val.value = cond.value || '';
    val.placeholder = '值';
    val.addEventListener('input', () => {
      state.editingFields[fieldIdx].condition_required = (state.editingFields[fieldIdx].condition_required || []).map((c) => c === cond ? { ...c, value: val.value } : c);
    });
    const rm = document.createElement('button');
    rm.type = 'button';
    rm.className = 'mini-btn danger';
    rm.textContent = '×';
    rm.addEventListener('click', () => {
      state.editingFields[fieldIdx].condition_required = (state.editingFields[fieldIdx].condition_required || []).filter((c) => c !== cond);
      renderFieldList();
    });
    row.appendChild(sel);
    row.appendChild(eq);
    row.appendChild(val);
    row.appendChild(rm);
    return row;
  }

  /* 添加字段面板 */
  let fieldLibVisible = false;

  $('btnAddField').addEventListener('click', () => {
    const picker = $('fieldLibPicker');
    if (!picker) {
      const div = document.createElement('div');
      div.id = 'fieldLibPicker';
      div.className = 'field-lib';
      div.innerHTML = '<p class="ff-lib-title">从预置字段中选择（点击添加）：</p>';
      const libRow = document.createElement('div');
      libRow.className = 'ff-lib-row';
      FIELD_LIB.forEach((lib) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'mini-btn';
        b.textContent = lib.label;
        b.title = TYPE_NAMES[lib.type];
        b.addEventListener('click', () => {
          const f = cloneField(lib);
          if (state.editingFields.some((x) => x.key === f.key)) {
            toast('该字段已存在：' + f.label, true);
            return;
          }
          state.editingFields.push(f);
          renderFieldList();
        });
        libRow.appendChild(b);
      });
      div.appendChild(libRow);
      div.appendChild(document.createElement('hr'));
      div.appendChild(customFieldBuilder());
      $('btnAddField').insertAdjacentElement('beforebegin', div);
      fieldLibVisible = true;
    } else {
      picker.hidden = !picker.hidden;
      fieldLibVisible = !picker.hidden;
    }
  });

  function customFieldBuilder() {
    const box = document.createElement('div');
    box.className = 'ff-custom';
    box.innerHTML = '<p class="ff-lib-title">自定义新字段：</p>';
    const row = document.createElement('div');
    row.className = 'ff-custom-row';
    const nameInput = document.createElement('input');
    nameInput.className = 'ff-custom-name';
    nameInput.placeholder = '字段名称（如：送货地址）';
    const typeSel = document.createElement('select');
    typeSel.className = 'ff-custom-type';
    ['text', 'number', 'date', 'select', 'image', 'manager'].forEach((t) => {
      const opt = document.createElement('option');
      opt.value = t;
      opt.textContent = TYPE_NAMES[t];
      typeSel.appendChild(opt);
    });
    const optsInput = document.createElement('input');
    optsInput.className = 'ff-custom-opts';
    optsInput.placeholder = '下拉选项（逗号分隔，选下拉类型时填）';
    optsInput.hidden = true;
    typeSel.addEventListener('change', () => { optsInput.hidden = typeSel.value !== 'select'; });
    const add = document.createElement('button');
    add.type = 'button';
    add.className = 'btn btn-primary';
    add.textContent = '添加';
    add.addEventListener('click', () => {
      const label = nameInput.value.trim();
      if (!label) return toast('请输入字段名称', true);
      const type = typeSel.value;
      const f = { key: nextFieldKey(), label, type, required: false, in_list: true, dup_check: false, options: [], condition_required: [], target: '', targets: {} };
      if (type === 'select') {
        f.options = optsInput.value.split(/[,，]/).map((s) => s.trim()).filter(Boolean);
        if (f.options.length === 0) return toast('下拉字段至少需要一个选项', true);
      }
      state.editingFields.push(f);
      renderFieldList();
      nameInput.value = '';
      optsInput.value = '';
    });
    row.appendChild(nameInput);
    row.appendChild(typeSel);
    row.appendChild(optsInput);
    row.appendChild(add);
    box.appendChild(row);
    return box;
  }

  $('btnSaveTpl').addEventListener('click', async () => {
    const name = $('tplEditName').value.trim();
    if (!name) return toast('请填写模板名称', true);
    const fields = state.editingFields.map((f, i) => ({
      ...f,
      sort: i,
      condition_required: (f.condition_required || []).filter((c) => c.field && c.value)
    }));
    if (fields.length === 0) return toast('模板至少需要一个字段', true);
    if (fields.some((f) => !f.label)) return toast('存在未命名的字段', true);
    const body = {
      name,
      enabled: $('tplEditEnabled').checked,
      fields: fields.map(({ sort, ...rest }) => ({ ...rest, sort }))
    };
    const btn = $('btnSaveTpl');
    btn.disabled = true;
    try {
      if (state.editingTplId) {
        await api('/api/templates/' + state.editingTplId, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        toast('模板已保存');
      } else {
        await api('/api/templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        toast('模板已创建');
      }
      tplEditModal.hidden = true;
      allTemplates = await api('/api/templates/all');
      renderTplList();
      await loadTemplates();
    } catch (e) {
      toast('保存失败：' + e.message, true);
    } finally {
      btn.disabled = false;
    }
  });

  $('btnCloseTplEdit').addEventListener('click', () => { tplEditModal.hidden = true; });
  tplEditModal.addEventListener('click', (e) => { if (e.target === tplEditModal) tplEditModal.hidden = true; });

  /* ---------------- 修改密码 ---------------- */
  const pwdModal = $('pwdModal');

  $('btnChangePwd').addEventListener('click', () => {
    closeDrawer();
    $('pwdOld').value = '';
    $('pwdNew').value = '';
    $('pwdNew2').value = '';
    pwdModal.hidden = false;
  });
  $('btnClosePwdModal').addEventListener('click', () => { pwdModal.hidden = true; });
  pwdModal.addEventListener('click', (e) => { if (e.target === pwdModal) pwdModal.hidden = true; });
  $('btnSavePwd').addEventListener('click', async () => {
    const oldP = $('pwdOld').value;
    const np = $('pwdNew').value;
    const np2 = $('pwdNew2').value;
    if (!oldP) return toast('请输入原密码', true);
    if (np.length < 4) return toast('新密码至少 4 位', true);
    if (np !== np2) return toast('两次输入的新密码不一致', true);
    try {
      await api('/api/me/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ old_password: oldP, new_password: np })
      });
      toast('密码修改成功');
      pwdModal.hidden = true;
    } catch (e) {
      toast(e.message, true);
    }
  });

  /* ---------------- 产品管理 ---------------- */
  const modal = $('productModal');
  let editingProductId = null;

  async function loadProducts() {
    try {
      state.products = await api('/api/products');
    } catch (e) {
      toast('加载产品列表失败：' + e.message, true);
    }
  }

  function renderProductList() {
    const list = $('productList');
    list.innerHTML = '';
    if (state.products.length === 0) {
      const li = document.createElement('li');
      li.textContent = '暂无产品';
      list.appendChild(li);
      return;
    }
    state.products.forEach((p) => {
      const li = document.createElement('li');
      const name = document.createElement('span');
      name.className = 'pname';
      name.textContent = p.name;
      const price = document.createElement('span');
      price.className = 'pprice';
      price.textContent = '¥' + money(p.price);
      const ops = document.createElement('span');
      ops.className = 'pops';

      const edit = document.createElement('button');
      edit.type = 'button';
      edit.className = 'mini-btn';
      edit.textContent = '编辑';
      edit.addEventListener('click', () => {
        editingProductId = p.id;
        $('pName').value = p.name;
        $('pPrice').value = p.price;
        $('pName').focus();
        $('btnAddProduct').textContent = '更新产品';
      });

      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'mini-btn danger';
      del.textContent = '删除';
      del.addEventListener('click', async () => {
        if (!confirm(`确定删除产品「${p.name}」吗？`)) return;
        try {
          await api('/api/products/' + p.id, { method: 'DELETE' });
          toast('产品已删除');
          await loadProducts();
          renderProductList();
        } catch (e) {
          toast('删除失败：' + e.message, true);
        }
      });

      ops.appendChild(edit);
      ops.appendChild(del);
      li.appendChild(name);
      li.appendChild(price);
      li.appendChild(ops);
      list.appendChild(li);
    });
  }

  async function openProductModal() {
    closeDrawer();
    modal.hidden = false;
    editingProductId = null;
    $('pName').value = '';
    $('pPrice').value = '';
    $('btnAddProduct').textContent = '添加产品';
    try {
      await loadProducts();
      renderProductList();
    } catch (e) { /* ignore */ }
  }

  $('btnManageProducts').addEventListener('click', openProductModal);
  $('btnCloseModal').addEventListener('click', () => { modal.hidden = true; });
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.hidden = true; });

  function uploadXlsx(fileInputId, url, fieldName) {
    return new Promise((resolve, reject) => {
      const input = $(fileInputId);
      const file = input.files && input.files[0];
      if (!file) { toast('请选择 .xlsx 文件', true); reject(new Error('no file')); return; }
      if (!/\.xlsx$/i.test(file.name)) { toast('仅支持 .xlsx 格式', true); reject(new Error('format')); return; }
      const fd = new FormData();
      fd.append(fieldName, file);
      fetch(url, { method: 'POST', body: fd })
        .then(async (res) => {
          if (res.status === 401) { showLogin(); throw new Error('登录已过期'); }
          const j = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(j.error || '导入失败');
          return j;
        })
        .then((data) => {
          toast(`导入完成：新增 ${data.added} 条，更新 ${data.updated} 条，跳过 ${data.skipped} 条`);
          resolve(data);
        })
        .catch((e) => {
          toast('导入失败：' + e.message, true);
          reject(e);
        })
        .finally(() => {
          input.value = '';
        });
    });
  }

  $('btnProductUpload').addEventListener('click', () => $('productFile').click());
  $('productFile').addEventListener('change', async () => {
    try {
      await uploadXlsx('productFile', '/api/products/import', 'product_file');
      await loadProducts();
      renderProductList();
    } catch (e) { /* ignore */ }
  });

  $('btnCleanup').addEventListener('click', async () => {
    if (!confirm('将删除未被任何登记记录引用、且超过保留期（默认 30 天）的截图文件。\n已引用的截图不受影响。确定继续吗？')) return;
    try {
      const data = await api('/api/cleanup', { method: 'POST' });
      if (data.removed === 0) {
        toast('没有需要清理的过期截图');
      } else {
        toast(`清理完成，已删除 ${data.removed} 个过期截图文件`);
      }
    } catch (e) {
      toast('清理失败：' + e.message, true);
    }
  });

  $('btnCleanupAll').addEventListener('click', async () => {
    const ok = confirm(
      '警告：将删除 30 天以前上传的【全部】截图文件，包括仍被登记记录引用的截图。\n\n' +
      '删除后，这些历史记录的截图将无法查看，导出 Excel 中的截图网址也会失效。\n\n' +
      '建议先执行「导出全部 Excel」备份。确定继续吗？'
    );
    if (!ok) return;
    try {
      const data = await api('/api/cleanup-all?days=30', { method: 'POST' });
      toast(`已删除 30 天前的全部截图共 ${data.removed} 个文件`);
    } catch (e) {
      toast('清理失败：' + e.message, true);
    }
  });

  $('btnAddProduct').addEventListener('click', async () => {
    const name = $('pName').value.trim();
    const price = parseFloat($('pPrice').value);
    if (!name) return toast('请输入产品名称', true);
    if (!Number.isFinite(price) || price < 0) return toast('请输入有效的单价', true);
    try {
      if (editingProductId) {
        await api('/api/products/' + editingProductId, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, price })
        });
        toast('产品已更新');
      } else {
        await api('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, price })
        });
        toast('产品已添加');
      }
      $('pName').value = '';
      $('pPrice').value = '';
      editingProductId = null;
      $('btnAddProduct').textContent = '添加产品';
      await loadProducts();
      renderProductList();
    } catch (e) {
      toast(e.message, true);
    }
  });

  /* ---------------- 经销商管理 ---------------- */
  const dealerModal = $('dealerModal');

  async function loadDealers(q) {
    const qs = q ? '?q=' + encodeURIComponent(q) : '';
    state.allDealers = await api('/api/dealers' + qs);
    return state.allDealers;
  }

  function renderDealerList() {
    const list = $('dealerList');
    list.innerHTML = '';
    $('dealerCount').textContent = `共 ${state.allDealers.length} 个经销商`;
    if (state.allDealers.length === 0) {
      const li = document.createElement('li');
      li.textContent = '暂无经销商，可通过上方「上传 Excel 导入」批量添加';
      list.appendChild(li);
      return;
    }
    state.allDealers.forEach((d) => {
      const li = document.createElement('li');
      const name = document.createElement('span');
      name.className = 'pname';
      name.textContent = d.dealer_name;
      const info = document.createElement('span');
      info.className = 'dealer-card';
      info.textContent = (d.card_holder ? d.card_holder + ' ' : '') + (d.card_no + ' ' + d.bank).trim() || '-';
      const ops = document.createElement('span');
      ops.className = 'pops';
      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'mini-btn danger';
      del.textContent = '删除';
      del.addEventListener('click', async () => {
        if (!confirm(`确定删除经销商「${d.dealer_name}」吗？`)) return;
        try {
          await api('/api/dealers/' + d.id, { method: 'DELETE' });
          toast('已删除');
          await loadDealers($('dealerSearch').value.trim());
          renderDealerList();
        } catch (e) {
          toast('删除失败：' + e.message, true);
        }
      });
      ops.appendChild(del);
      li.appendChild(name);
      li.appendChild(info);
      li.appendChild(ops);
      list.appendChild(li);
    });
  }

  async function openDealerModal() {
    closeDrawer();
    dealerModal.hidden = false;
    $('dealerSearch').value = '';
    try {
      await loadDealers();
      renderDealerList();
    } catch (e) {
      toast('加载经销商失败：' + e.message, true);
    }
  }

  $('btnMyDealers').addEventListener('click', openDealerModal);
  $('btnCloseDealerModal').addEventListener('click', () => { dealerModal.hidden = true; });
  dealerModal.addEventListener('click', (e) => { if (e.target === dealerModal) dealerModal.hidden = true; });
  $('btnDealerRefresh').addEventListener('click', async () => {
    try {
      await loadDealers($('dealerSearch').value.trim());
      renderDealerList();
    } catch (e) {
      toast('加载失败：' + e.message, true);
    }
  });
  $('btnDealerUpload').addEventListener('click', () => $('dealerFile').click());
  $('dealerFile').addEventListener('change', async () => {
    try {
      await uploadXlsx('dealerFile', '/api/dealers/import', 'dealer_file');
      await loadDealers();
      renderDealerList();
    } catch (e) { /* ignore */ }
  });

  /* ---------------- 经理账号管理（管理员） ---------------- */
  const userModal = $('userModal');

  async function loadUsers() {
    return api('/api/users');
  }

  function renderUserList(users) {
    const list = $('userList');
    list.innerHTML = '';
    if (users.length === 0) {
      const li = document.createElement('li');
      li.textContent = '暂无经理账号';
      list.appendChild(li);
      return;
    }
    users.forEach((u) => {
      const li = document.createElement('li');
      const uname = document.createElement('span');
      uname.className = 'uname';
      uname.textContent = u.username;
      const mname = document.createElement('span');
      mname.className = 'mname';
      mname.textContent = u.manager_name || '-';
      const role = document.createElement('span');
      role.className = 'role-tag';
      role.textContent = u.role === 'admin' ? '管理员' : '经理';
      const ops = document.createElement('span');
      ops.className = 'uops';
      if (u.role !== 'admin') {
        const reset = document.createElement('button');
        reset.type = 'button';
        reset.className = 'mini-btn';
        reset.textContent = '重置密码';
        reset.addEventListener('click', () => resetPassword(u));
        const del = document.createElement('button');
        del.type = 'button';
        del.className = 'mini-btn danger';
        del.textContent = '删除';
        del.addEventListener('click', async () => {
          if (!confirm(`确定删除经理账号「${u.username}（${u.manager_name}）」吗？\n该经理名下的经销商信息将一并删除。`)) return;
          try {
            await api('/api/users/' + u.id, { method: 'DELETE' });
            toast('账号已删除');
            openUserModal();
          } catch (e) {
            toast('删除失败：' + e.message, true);
          }
        });
        ops.appendChild(reset);
        ops.appendChild(del);
      }
      li.appendChild(uname);
      li.appendChild(mname);
      li.appendChild(role);
      li.appendChild(ops);
      list.appendChild(li);
    });
  }

  async function openUserModal() {
    closeDrawer();
    userModal.hidden = false;
    try {
      const users = await loadUsers();
      renderUserList(users);
    } catch (e) {
      toast('加载账号失败：' + e.message, true);
    }
  }

  $('btnUsers').addEventListener('click', openUserModal);
  $('btnCloseUserModal').addEventListener('click', () => { userModal.hidden = true; });
  userModal.addEventListener('click', (e) => { if (e.target === userModal) userModal.hidden = true; });

  async function resetPassword(u) {
    const pw = prompt(`为账号「${u.username}（${u.manager_name}）」设置新密码（至少4位）：`);
    if (pw === null) return;
    if (pw.length < 4) { toast('密码至少 4 位', true); return; }
    try {
      await api('/api/users/' + u.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw })
      });
      toast('密码已重置');
    } catch (e) {
      toast('重置失败：' + e.message, true);
    }
  }

  $('btnAddUser').addEventListener('click', async () => {
    const username = $('uUsername').value.trim();
    const managerName = $('uManagerName').value.trim();
    const password = $('uPassword').value;
    if (!username) return toast('请输入用户名', true);
    if (!managerName) return toast('请输入经理姓名', true);
    if (password.length < 4) return toast('密码至少 4 位', true);
    try {
      await api('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, manager_name: managerName })
      });
      toast('经理账号已创建');
      $('uUsername').value = '';
      $('uManagerName').value = '';
      $('uPassword').value = '';
      const users = await loadUsers();
      renderUserList(users);
    } catch (e) {
      toast(e.message, true);
    }
  });

  /* ---------------- 初始化 ---------------- */
  initAuth();
})();
