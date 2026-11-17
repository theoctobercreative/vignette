/* Vignette by Thryft · Vignette Stories
   Serial stories in the journal. Loads after journal.js, which shows a
   Stories tab when this file is here; the tab opens the shelf over the journal.
   Talks to the HUD Stories script (who's reading, where, what they touched)
   and to the narrator's desk (the Worker). Never holds a secret. */
(function () {
  'use strict';

  var V = window.VIGNETTE || {};
  var DEMO = window.FEUIL_DEMO || null;
  if (!V.feuil && !DEMO) return;          // a HUD without the HUD Stories script: stay out of the way

  // ============================================================
  //  WORDS (edit freely)
  // ============================================================
  var W = {
    eyebrow: 'Vignette · Stories',
    title: 'Vignette Stories',
    sub: 'stories in installments',
    shelfIntro: 'Choose a story. Each turn, write what you do, and the next installment arrives in your journal.',
    inkNote: 'Every installment uses one drop of ink. Pots of Story Ink from Thryft refill your inkwell.',
    locked: 'Comes in its own story book, at Thryft',
    begin: 'Begin', cont: 'Continue', again: 'Read it again',
    placeholder: 'Write what you do…',
    write: 'Write it',
    drying: 'The ink is drying…',
    soFar: 'The story so far',
    restart: 'Begin again',
    restartAsk: 'Start this story over from the first page? Your diary keeps every chapter you’ve finished.',
    dry: 'Your inkwell is dry. A pot of Story Ink from Thryft will fill it.',
    chapterDone: 'Written into your diary',
    fin: 'The End',
    finSub: 'Your chapters, as your diary keeps them:',
    back: 'Back to the shelf',
    close: 'Close',
    stuck: 'The pages are stuck. Close and reopen your journal.',
  };
  var ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

  // ============================================================
  //  STATE
  // ============================================================
  var T = null;          // { t, s, api } ticket from the HUD
  var ctx = {}, near = [], pendingProps = [];
  var ink = null, shelf = null, book = null;
  var view = 'shelf', busy = false, showRecap = false, notice = '';
  var root = null;

  // ============================================================
  //  HELPERS
  // ============================================================
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function bar(s) { return String(s == null ? '' : s).replace(/[|~\n\r]/g, ' ').trim(); }
  function paras(s) { return String(s || '').split(/\n\s*\n/).map(function (p) { return '<p>' + esc(p.trim()) + '</p>'; }).join(''); }

  function hud(extra) { return V.feuil + '/?k=' + encodeURIComponent(V.k) + (extra || ''); }

  function hudGet(extra) {
    if (DEMO) return DEMO('hud', extra);
    return fetch(hud(extra), { cache: 'no-store' }).then(function (r) { if (!r.ok) throw r.status; return r.json(); });
  }
  function hudPost(body) {
    if (DEMO) return DEMO('hudpost', body);
    return fetch(hud(), { method: 'POST', body: body, headers: { 'Content-Type': 'text/plain' } }).then(function (r) { return r.json(); }).catch(function () { return { ok: 0 }; });
  }

  function ticket() {
    return hudGet('').then(function (r) {
      T = { t: r.t, s: r.s, api: r.api };
      ctx = r.ctx || {}; near = r.near || [];
      pendingProps = pendingProps.concat(r.props || []).slice(-3);
      return T;
    });
  }

  // the narrator's desk; retries once with a fresh ticket if it expired
  function desk(path, body, retried) {
    var go = T ? Promise.resolve(T) : ticket();
    return go.then(function () {
      var b = Object.assign({ t: T.t, s: T.s, name: V.name || '' }, body || {});
      if (DEMO) return DEMO(path, b);
      return fetch(T.api + path, { method: 'POST', body: JSON.stringify(b), headers: { 'Content-Type': 'text/plain' } })
        .then(function (r) { return r.json(); });
    }).then(function (res) {
      if (res && res.expired && !retried) { T = null; return desk(path, body, true); }
      if (res && res.ink != null) ink = res.ink;
      return res;
    });
  }

  function say(msg) { notice = msg || ''; render(); }

  // ============================================================
  //  ACTIONS
  // ============================================================
  function openShelf() {
    view = 'shelf'; book = null; notice = '';
    render();
    desk('/shelf').then(function (r) {
      if (!r || !r.ok) return say(r && r.msg ? r.msg : W.stuck);
      shelf = r.shelf; render();
    }).catch(function () { say(W.stuck); });
  }

  function openBook(id) {
    busy = true; notice = ''; render();
    desk('/open', { story: id }).then(function (r) {
      busy = false;
      if (!r || !r.ok) return say(r && r.msg ? r.msg : W.stuck);
      book = r; view = 'book'; showRecap = false; render(true);
    }).catch(function () { busy = false; say(W.stuck); });
  }

  function restart() {
    confirmBox(W.restartAsk, function () {
      busy = true; render();
      desk('/restart', { story: book.story.id }).then(function (r) {
        busy = false;
        if (r && r.ok) { book = r; render(true); } else say(r && r.msg ? r.msg : W.stuck);
      }).catch(function () { busy = false; say(W.stuck); });
    });
  }

  function writeTurn(action) {
    action = String(action || '').replace(/\s+/g, ' ').trim().slice(0, 400);
    if (!action || busy || !book) return;
    busy = true; notice = '';
    var typed = document.getElementById('fl-input');
    if (typed) typed.value = '';
    book.log.push({ a: action, n: '', c: book.chapter - 1, pending: true });
    render(true);

    var fresh = DEMO ? Promise.resolve({}) : hudGet('&p=1').catch(function () { return {}; });
    fresh.then(function (h) {
      if (h.ctx) ctx = h.ctx;
      var props = pendingProps.concat(h.props || []).slice(-3);
      pendingProps = [];
      return desk('/turn', { story: book.story.id, action: action, ctx: { region: ctx.region, parcel: ctx.parcel, slt: ctx.slt, near: near }, props: props });
    }).then(function (r) {
      busy = false;
      var last = book.log[book.log.length - 1];
      if (!r || !r.ok) {
        book.log.pop();
        say(r && r.msg ? r.msg : W.stuck);
        var back = document.getElementById('fl-input');
        if (back) back.value = action;          // give them their words back
        return;
      }
      last.n = r.passage; last.pending = false;
      book.sugg = r.sugg || [];
      (r.events || []).forEach(function (ev) {
        if (ev.kind === 'chap') {
          book.lines.push(ev.line);
          last.chapterDone = { n: ev.n, title: ev.title, english: ev.english, line: ev.line };
          hudPost(['chap', book.story.id, ev.n, 'chap', bar(ev.line), ev.receipt, 0].join('|'));
        } else if (ev.kind === 'done') {
          hudPost(['chap', book.story.id, ev.n, 'done', bar(ev.title), ev.receipt, ev.trouvaille].join('|'));
        }
      });
      book.chapter = r.chapter; book.chapterTitle = r.chapterTitle; book.chapterEnglish = r.chapterEnglish;
      book.done = !!r.done;
      render(true);
    }).catch(function () {
      busy = false; book.log.pop(); say(W.stuck);
      var back = document.getElementById('fl-input');
      if (back) back.value = action;
    });
  }

  // ============================================================
  //  RENDER
  // ============================================================
  function confirmBox(q, yes) {
    var v = document.createElement('div');
    v.className = 'fl-veil';
    v.innerHTML = '<div class="fl-ask"><p>' + esc(q) + '</p><div class="fl-row"><button class="btn" data-y>Yes</button><button class="btn ghost" data-n>Not now</button></div></div>';
    root.appendChild(v);
    v.querySelector('[data-y]').onclick = function () { v.remove(); yes(); };
    v.querySelector('[data-n]').onclick = function () { v.remove(); };
  }

  function inkHtml() {
    if (ink == null) return '';
    return '<div class="fl-ink' + (ink <= 0 ? ' dry' : '') + '"><span class="fl-well"></span>Story Ink · ' + esc(ink) + (ink === 1 ? ' drop' : ' drops') + '</div>';
  }

  function shelfHtml() {
    var out = '<p class="fl-intro">' + esc(W.shelfIntro) + '</p>';
    if (!shelf) return out + '<p class="fl-wait">' + esc(W.drying) + '</p>';
    out += '<div class="fl-shelf">';
    shelf.forEach(function (s) {
      var status = !s.owned ? W.locked : (s.done ? 'Finished · ' + s.chapters + ' chapters' : (s.started ? 'Chapter ' + (ROMAN[s.chapter - 1] || s.chapter) + ' of ' + s.chapters : s.chapters + ' chapters'));
      var btn = !s.owned ? '' : '<button class="btn" data-open="' + esc(s.id) + '">' + esc(s.done ? W.again : (s.started ? W.cont : W.begin)) + '</button>';
      out += '<div class="fl-volume ' + (s.owned ? '' : 'locked') + '"><div class="fl-spine c-' + esc(s.cover || 'cream') + '"><span>' + esc(s.title) + '</span></div>'
        + '<div class="fl-about"><h3>' + esc(s.title) + '</h3>' + (s.english && s.english !== s.title ? '<div class="fl-en">' + esc(s.english) + '</div>' : '')
        + '<p>' + esc(s.blurb) + '</p><div class="fl-status">' + esc(status) + '</div>' + btn + '</div></div>';
    });
    return out + '</div><p class="fl-foot">' + esc(W.inkNote) + '</p>';
  }

  function chapterHead(i) {
    var c = book.story.chapters[i] || {};
    return '<div class="fl-chapter"><span class="fl-orn">✦</span> Chapter ' + (ROMAN[i] || (i + 1)) + ' · ' + esc(c.title) + (c.english && c.english !== c.title ? ' <i>(' + esc(c.english) + ')</i>' : '') + ' <span class="fl-orn">✦</span></div>';
  }

  function bookHtml() {
    var out = '<div class="fl-bookhead"><button class="link" data-shelf>‹ ' + esc(W.back) + '</button>'
      + '<div class="fl-booktitle"><h2>' + esc(book.story.title) + '</h2>' + (book.story.english && book.story.english !== book.story.title ? '<span>' + esc(book.story.english) + '</span>' : '') + '</div>'
      + '<div class="fl-tools"><button class="link" data-recap>' + esc(W.soFar) + '</button><button class="link" data-restart>' + esc(W.restart) + '</button></div></div>';
    if (showRecap) out += '<div class="fl-recap"><div class="label">' + esc(W.soFar) + '</div><p>' + esc(book.recap || 'Only the first page so far.') + '</p></div>';

    out += '<div class="fl-pages" id="fl-pages">';
    var lastC = -1;
    book.log.forEach(function (e) {
      if (e.c !== lastC) { out += chapterHead(e.c); lastC = e.c; }
      if (e.a) out += '<div class="fl-you">' + esc(e.a) + '</div>';
      if (e.pending) out += '<div class="fl-wait"><span class="fl-quill"></span>' + esc(W.drying) + '</div>';
      else out += '<div class="fl-text">' + paras(e.n) + '</div>';
      if (e.chapterDone) out += '<div class="fl-chapdone"><div class="label">Chapter ' + (ROMAN[e.chapterDone.n - 1] || e.chapterDone.n) + ' · ' + esc(W.chapterDone) + '</div><p>' + esc(e.chapterDone.line) + '</p></div>';
    });
    if (book.done && !busy) {
      out += '<div class="fl-fin"><div class="fl-fin-word">' + esc(W.fin) + '</div><div class="label">' + esc(W.finSub) + '</div>'
        + (book.lines || []).map(function (l, i) { return '<p><b>' + (ROMAN[i] || (i + 1)) + '.</b> ' + esc(l) + '</p>'; }).join('')
        + '<button class="btn" data-shelf>' + esc(W.back) + '</button></div>';
    }
    out += '</div>';

    if (!book.done) {
      var dry = ink != null && ink <= 0;
      out += '<div class="fl-write">';
      if (book.sugg && book.sugg.length && !busy && !dry) {
        out += '<div class="fl-sugg">' + book.sugg.map(function (s) { return '<button class="fl-chip" data-sugg="' + esc(s) + '">' + esc(s) + '</button>'; }).join('') + '</div>';
      }
      if (dry) out += '<p class="fl-dry">' + esc(W.dry) + '</p>';
      else out += '<div class="fl-row"><textarea class="field" id="fl-input" maxlength="400" placeholder="' + esc(W.placeholder) + '"' + (busy ? ' disabled' : '') + '></textarea>'
        + '<button class="btn" data-write' + (busy ? ' disabled' : '') + '>' + esc(W.write) + '</button></div>';
      out += '</div>';
    }
    return out;
  }

  function render(scroll) {
    if (!root) return;
    var html = '<div class="fl-book"><header class="fl-top"><div class="titles"><div class="eyebrow">' + esc(W.eyebrow) + '</div>'
      + '<h1>' + esc(W.title) + '<em>' + esc(W.sub) + '</em></h1></div>' + inkHtml()
      + '<button class="link fl-close" data-close>' + esc(W.close) + '</button></header>'
      + (notice ? '<div class="fl-notice">' + esc(notice) + '</div>' : '')
      + '<main class="fl-main">' + (view === 'book' && book ? bookHtml() : shelfHtml()) + '</main></div>';
    var keep = document.getElementById('fl-input');
    var draft = keep ? keep.value : '';
    root.innerHTML = html;
    var box = document.getElementById('fl-input');
    if (box && draft) box.value = draft;
    wire();
    if (scroll) { var p = document.getElementById('fl-pages'); if (p) p.scrollTop = p.scrollHeight; }
  }

  function wire() {
    var q = function (sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); };
    q('[data-close]').forEach(function (b) { b.onclick = hide; });
    q('[data-shelf]').forEach(function (b) { b.onclick = openShelf; });
    q('[data-open]').forEach(function (b) { b.onclick = function () { openBook(b.getAttribute('data-open')); }; });
    q('[data-recap]').forEach(function (b) { b.onclick = function () { showRecap = !showRecap; render(); }; });
    q('[data-restart]').forEach(function (b) { b.onclick = restart; });
    q('[data-sugg]').forEach(function (b) {
      b.onclick = function () { var box = document.getElementById('fl-input'); if (box) { box.value = b.getAttribute('data-sugg'); box.focus(); } };
    });
    q('[data-write]').forEach(function (b) { b.onclick = function () { var box = document.getElementById('fl-input'); if (box) writeTurn(box.value); }; });
    var box = document.getElementById('fl-input');
    if (box) box.onkeydown = function (ev) { if (ev.key === 'Enter' && !ev.shiftKey) { ev.preventDefault(); writeTurn(box.value); } };
  }

  // ============================================================
  //  OPEN / CLOSE
  // ============================================================
  function show() {
    if (!root) { root = document.createElement('div'); root.id = 'vg-stories'; document.body.appendChild(root); }
    root.style.display = 'block';
    document.body.classList.add('fl-on');
    if (view === 'book' && book) render(true); else openShelf();
  }
  function hide() {
    if (root) root.style.display = 'none';
    document.body.classList.remove('fl-on');
  }

  // the journal's Stories tab calls this
  window.VignetteStories = { open: show, close: hide };

  // warm up quietly: fetch the ticket so the first story opens fast
  ticket().catch(function () { /* the HUD may still be waking; we'll try again on open */ });
})();
