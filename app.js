/* ===========================================================
   Planty Care — app logic
   Pure client-side app (works on GitHub Pages).
   Data persists in localStorage. Plant photos/descriptions
   are fetched from the Wikipedia REST API (CORS-enabled,
   no API key required).
   =========================================================== */

(function () {
  "use strict";

  // ---------- Storage ----------
  var STORE_KEY = "plantycare.v1";
  var db = loadDB();

  function loadDB() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore corrupt data */ }
    return { plants: [], history: [], xlText: false };
  }
  function saveDB() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(db)); }
    catch (e) { console.warn("Could not save data", e); }
  }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

  // ---------- Preset plants ----------
  // wikiTitle drives the photo lookup; intervalDays is a sensible default.
  var PRESETS = [
    { name: "Pothos",            emoji: "🌿", species: "Epipremnum aureum",   wikiTitle: "Epipremnum aureum",    intervalDays: 7 },
    { name: "Sansevieria",       emoji: "🪴", species: "Dracaena trifasciata", wikiTitle: "Sansevieria",          intervalDays: 14 },
    { name: "Bird of Paradise",  emoji: "🌸", species: "Strelitzia",          wikiTitle: "Strelitzia",           intervalDays: 7 },
    { name: "Monstera",          emoji: "🍃", species: "Monstera deliciosa",  wikiTitle: "Monstera deliciosa",   intervalDays: 7 }
  ];

  var DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // ---------- Element refs ----------
  var $ = function (sel) { return document.querySelector(sel); };
  var plantList = $("#plantList");
  var plantsEmpty = $("#plantsEmpty");
  var presetList = $("#presetList");
  var lookupForm = $("#lookupForm");
  var lookupInput = $("#lookupInput");
  var lookupResult = $("#lookupResult");
  var historyList = $("#historyList");
  var historyEmpty = $("#historyEmpty");
  var notifyStatus = $("#notifyStatus");
  var enableNotifyBtn = $("#enableNotifyBtn");
  var dialog = $("#scheduleDialog");
  var scheduleForm = $("#scheduleForm");
  var intervalInput = $("#intervalInput");
  var timeInput = $("#timeInput");
  var daysRow = $("#daysRow");
  var dialogTitle = $("#dialogTitle");

  // ===========================================================
  //  Tabs
  // ===========================================================
  document.querySelectorAll(".tab-btn").forEach(function (btn) {
    btn.addEventListener("click", function () { switchTab(btn.dataset.tab); });
  });
  function switchTab(name) {
    document.querySelectorAll(".tab-btn").forEach(function (b) {
      var active = b.dataset.tab === name;
      b.classList.toggle("is-active", active);
      if (active) { b.setAttribute("aria-current", "page"); }
      else { b.removeAttribute("aria-current"); }
    });
    document.querySelectorAll(".tab-panel").forEach(function (p) {
      var active = p.id === "tab-" + name;
      p.classList.toggle("is-active", active);
      p.hidden = !active;
    });
    if (name === "history") renderHistory();
    if (name === "plants") renderPlants();
  }

  // ===========================================================
  //  Text size toggle (accessibility)
  // ===========================================================
  var textBtn = $("#textSizeToggle");
  function applyTextSize() {
    document.documentElement.classList.toggle("xl-text", !!db.xlText);
    textBtn.setAttribute("aria-pressed", db.xlText ? "true" : "false");
  }
  textBtn.addEventListener("click", function () {
    db.xlText = !db.xlText;
    saveDB();
    applyTextSize();
  });
  applyTextSize();

  // ===========================================================
  //  Watering math
  // ===========================================================
  var DAY_MS = 24 * 60 * 60 * 1000;

  function daysUntilDue(plant) {
    if (!plant.lastWatered) return 0; // never watered => due now
    var elapsed = (Date.now() - plant.lastWatered) / DAY_MS;
    return Math.ceil(plant.intervalDays - elapsed);
  }

  function statusFor(plant) {
    var d = daysUntilDue(plant);
    if (d > 1) return { cls: "badge-ok", card: "", text: "Water in " + d + " days" };
    if (d === 1) return { cls: "badge-due", card: "due-now", text: "Water tomorrow" };
    if (d === 0) return { cls: "badge-due", card: "due-now", text: "Water today 💧" };
    return { cls: "badge-overdue", card: "overdue", text: "Overdue by " + Math.abs(d) + " day" + (Math.abs(d) === 1 ? "" : "s") + " ⚠️" };
  }

  function formatDate(ts) {
    if (!ts) return "Never";
    return new Date(ts).toLocaleString(undefined, {
      weekday: "short", month: "short", day: "numeric",
      hour: "numeric", minute: "2-digit"
    });
  }

  // ===========================================================
  //  Render: My Plants
  // ===========================================================
  function renderPlants() {
    plantList.innerHTML = "";
    if (!db.plants.length) {
      plantsEmpty.classList.remove("hidden");
      return;
    }
    plantsEmpty.classList.add("hidden");

    // Sort: most urgent first.
    var sorted = db.plants.slice().sort(function (a, b) {
      return daysUntilDue(a) - daysUntilDue(b);
    });

    sorted.forEach(function (plant) {
      var st = statusFor(plant);
      var card = document.createElement("article");
      card.className = "plant-card " + st.card;

      var photo = plant.image
        ? '<img class="plant-photo" src="' + escapeAttr(plant.image) + '" alt="Photo of ' + escapeAttr(plant.name) + '" loading="lazy" />'
        : '<div class="plant-photo-fallback" aria-hidden="true">' + (plant.emoji || "🪴") + '</div>';

      var reminder = (plant.reminderDays && plant.reminderDays.length)
        ? "🔔 " + plant.reminderDays.map(function (i) { return DAYS[i]; }).join(", ") +
          (plant.reminderTime ? " at " + plant.reminderTime : "")
        : "No reminder set";

      card.innerHTML =
        photo +
        '<div class="plant-body">' +
          '<h3 class="plant-name">' + escapeHtml(plant.name) + '</h3>' +
          (plant.species ? '<p class="plant-species">' + escapeHtml(plant.species) + '</p>' : '') +
          '<span class="water-badge ' + st.cls + '">' + st.text + '</span>' +
          '<p class="plant-meta">💧 Every ' + plant.intervalDays + ' days · Last: ' + formatDate(plant.lastWatered) + '</p>' +
          '<p class="plant-meta">' + escapeHtml(reminder) + '</p>' +
          '<div class="plant-actions">' +
            '<button class="btn btn-water" data-act="water">💧 Water now</button>' +
            '<button class="icon-btn" data-act="edit" title="Edit schedule" aria-label="Edit schedule for ' + escapeAttr(plant.name) + '">⚙️</button>' +
            '<button class="icon-btn" data-act="delete" title="Remove plant" aria-label="Remove ' + escapeAttr(plant.name) + '">🗑️</button>' +
          '</div>' +
        '</div>';

      card.querySelector('[data-act="water"]').addEventListener("click", function () { waterPlant(plant.id); });
      card.querySelector('[data-act="edit"]').addEventListener("click", function () { openSchedule(plant.id); });
      card.querySelector('[data-act="delete"]').addEventListener("click", function () { deletePlant(plant.id); });

      plantList.appendChild(card);
    });
  }

  function waterPlant(id) {
    var p = findPlant(id);
    if (!p) return;
    p.lastWatered = Date.now();
    db.history.unshift({ id: uid(), plantName: p.name, emoji: p.emoji, at: p.lastWatered });
    saveDB();
    renderPlants();
    toast("Watered " + p.name + " 💧");
  }

  function deletePlant(id) {
    var p = findPlant(id);
    if (!p) return;
    if (!confirm("Remove “" + p.name + "” from your plants?")) return;
    db.plants = db.plants.filter(function (x) { return x.id !== id; });
    saveDB();
    renderPlants();
    scheduleAllReminders();
  }

  function findPlant(id) {
    return db.plants.filter(function (x) { return x.id === id; })[0];
  }

  // ===========================================================
  //  Render: presets
  // ===========================================================
  function renderPresets() {
    presetList.innerHTML = "";
    PRESETS.forEach(function (preset) {
      var already = db.plants.some(function (p) { return p.name === preset.name; });
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "preset-btn";
      btn.disabled = already;
      btn.innerHTML = '<span class="emoji" aria-hidden="true">' + preset.emoji + '</span>' +
                      '<span>' + escapeHtml(preset.name) + '</span>' +
                      '<span class="help" style="margin:0">' + (already ? "Added ✓" : "every " + preset.intervalDays + " days") + '</span>';
      btn.addEventListener("click", function () { addPreset(preset); });
      presetList.appendChild(btn);
    });
  }

  function addPreset(preset) {
    var plant = {
      id: uid(),
      name: preset.name,
      species: preset.species,
      emoji: preset.emoji,
      intervalDays: preset.intervalDays,
      lastWatered: null,
      image: null,
      reminderDays: [],
      reminderTime: "09:00"
    };
    db.plants.push(plant);
    saveDB();
    renderPresets();
    renderPlants();
    toast(preset.name + " added 🌱");
    // Fetch a photo in the background.
    fetchWiki(preset.wikiTitle).then(function (info) {
      if (info && info.image) {
        plant.image = info.image;
        if (!plant.species && info.description) plant.species = info.description;
        saveDB();
        renderPlants();
      }
    });
    switchTab("plants");
  }

  // ===========================================================
  //  Lookup (Wikipedia)
  // ===========================================================
  lookupForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var term = lookupInput.value.trim();
    if (!term) return;
    lookupResult.innerHTML = '<p class="loader">🔎 Searching for “' + escapeHtml(term) + '”…</p>';
    fetchWiki(term).then(function (info) {
      if (!info) {
        lookupResult.innerHTML = '<p class="empty-state">No results for “' + escapeHtml(term) +
          '”. Try another name, or add it anyway below.</p>' +
          buildAddAnyway(term, "", "");
        wireAddAnyway(term, "", "");
        return;
      }
      var imgHtml = info.image
        ? '<img src="' + escapeAttr(info.image) + '" alt="Photo of ' + escapeAttr(info.title) + '" />'
        : '<div class="plant-photo-fallback" style="width:140px;height:140px;border-radius:10px" aria-hidden="true">🪴</div>';
      lookupResult.innerHTML =
        '<div class="result-card">' +
          imgHtml +
          '<div class="result-info">' +
            '<h3>' + escapeHtml(info.title) + '</h3>' +
            '<p>' + escapeHtml(info.extract || "No description found.") + '</p>' +
            '<button class="btn btn-primary" id="addLookupBtn">➕ Add to my plants</button>' +
          '</div>' +
        '</div>';
      $("#addLookupBtn").addEventListener("click", function () {
        addCustomPlant(info.title, info.description || "", info.image || null);
      });
    });
  });

  function buildAddAnyway(name) {
    return '<div style="margin-top:1rem"><button class="btn btn-secondary" id="addAnywayBtn">➕ Add “' +
      escapeHtml(name) + '” anyway</button></div>';
  }
  function wireAddAnyway(name) {
    var b = $("#addAnywayBtn");
    if (b) b.addEventListener("click", function () { addCustomPlant(name, "", null); });
  }

  function addCustomPlant(name, species, image) {
    if (db.plants.some(function (p) { return p.name.toLowerCase() === name.toLowerCase(); })) {
      toast(name + " is already in your list");
      switchTab("plants");
      return;
    }
    db.plants.push({
      id: uid(),
      name: name,
      species: species,
      emoji: "🪴",
      intervalDays: 7,
      lastWatered: null,
      image: image,
      reminderDays: [],
      reminderTime: "09:00"
    });
    saveDB();
    renderPlants();
    renderPresets();
    lookupResult.innerHTML = "";
    lookupInput.value = "";
    toast(name + " added 🌱");
    switchTab("plants");
  }

  // Wikipedia REST summary API — CORS friendly, no key needed.
  function fetchWiki(title) {
    var url = "https://en.wikipedia.org/api/rest_v1/page/summary/" +
              encodeURIComponent(title) + "?redirect=true";
    return fetch(url, { headers: { "Accept": "application/json" } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data || data.type === "https://mediawiki.org/wiki/HyperSwitch/errors/not_found") return null;
        var image = (data.thumbnail && data.thumbnail.source) ||
                    (data.originalimage && data.originalimage.source) || null;
        return {
          title: data.title || title,
          extract: data.extract || "",
          description: data.description || "",
          image: image
        };
      })
      .catch(function () { return null; });
  }

  // ===========================================================
  //  Schedule dialog
  // ===========================================================
  var editingId = null;

  function buildDaysRow() {
    daysRow.innerHTML = "";
    DAYS.forEach(function (label, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "day-toggle";
      b.textContent = label;
      b.setAttribute("aria-pressed", "false");
      b.dataset.day = i;
      b.addEventListener("click", function () {
        var on = b.getAttribute("aria-pressed") === "true";
        b.setAttribute("aria-pressed", on ? "false" : "true");
      });
      daysRow.appendChild(b);
    });
  }
  buildDaysRow();

  function openSchedule(id) {
    var p = findPlant(id);
    if (!p) return;
    editingId = id;
    dialogTitle.textContent = "Schedule for " + p.name;
    intervalInput.value = p.intervalDays;
    timeInput.value = p.reminderTime || "09:00";
    daysRow.querySelectorAll(".day-toggle").forEach(function (b) {
      var on = (p.reminderDays || []).indexOf(Number(b.dataset.day)) !== -1;
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }

  scheduleForm.addEventListener("submit", function (e) {
    // dialog form: returnValue tells us which button.
    if (dialog.returnValue === "save" || (e.submitter && e.submitter.value === "save")) {
      var p = findPlant(editingId);
      if (p) {
        var iv = parseInt(intervalInput.value, 10);
        p.intervalDays = (iv > 0 && iv < 366) ? iv : p.intervalDays;
        p.reminderTime = timeInput.value || "09:00";
        var days = [];
        daysRow.querySelectorAll(".day-toggle").forEach(function (b) {
          if (b.getAttribute("aria-pressed") === "true") days.push(Number(b.dataset.day));
        });
        p.reminderDays = days;
        saveDB();
        renderPlants();
        scheduleAllReminders();
        toast("Schedule saved for " + p.name);
      }
    }
    editingId = null;
  });

  // ===========================================================
  //  History
  // ===========================================================
  function renderHistory() {
    historyList.innerHTML = "";
    if (!db.history.length) {
      historyEmpty.classList.remove("hidden");
      return;
    }
    historyEmpty.classList.add("hidden");
    db.history.forEach(function (h) {
      var li = document.createElement("li");
      li.className = "history-item";
      li.innerHTML =
        '<span class="history-emoji" aria-hidden="true">' + (h.emoji || "💧") + '</span>' +
        '<span class="history-text">' +
          '<span class="history-plant">' + escapeHtml(h.plantName) + '</span><br>' +
          '<span class="history-date">Watered ' + formatDate(h.at) + '</span>' +
        '</span>';
      historyList.appendChild(li);
    });
  }

  $("#clearHistoryBtn").addEventListener("click", function () {
    if (!db.history.length) { toast("History is already empty"); return; }
    if (!confirm("Clear the entire watering history?")) return;
    db.history = [];
    saveDB();
    renderHistory();
  });

  // ===========================================================
  //  Reminders / notifications
  // ===========================================================
  var reminderTimers = [];

  function updateNotifyUI() {
    if (!("Notification" in window)) {
      notifyStatus.textContent = "Reminders not supported on this browser.";
      enableNotifyBtn.classList.add("hidden");
      return;
    }
    if (Notification.permission === "granted") {
      notifyStatus.textContent = "🔔 Reminders are on. Keep this page open to get alerts.";
      enableNotifyBtn.classList.add("hidden");
    } else if (Notification.permission === "denied") {
      notifyStatus.textContent = "Reminders are blocked in your browser settings.";
      enableNotifyBtn.classList.add("hidden");
    } else {
      notifyStatus.textContent = "Turn on reminders to get watering alerts.";
      enableNotifyBtn.classList.remove("hidden");
    }
  }

  enableNotifyBtn.addEventListener("click", function () {
    if (!("Notification" in window)) return;
    Notification.requestPermission().then(function () {
      updateNotifyUI();
      scheduleAllReminders();
    });
  });

  // Schedule the next occurrence of each plant's reminder day/time.
  function scheduleAllReminders() {
    reminderTimers.forEach(clearTimeout);
    reminderTimers = [];
    if (!("Notification" in window) || Notification.permission !== "granted") return;

    db.plants.forEach(function (p) {
      if (!p.reminderDays || !p.reminderDays.length || !p.reminderTime) return;
      var next = nextReminderTime(p.reminderDays, p.reminderTime);
      if (!next) return;
      var delay = next - Date.now();
      // setTimeout caps around 24.8 days; our windows are always < 7 days.
      var t = setTimeout(function () {
        fireReminder(p);
        scheduleAllReminders(); // reschedule for the following week
      }, delay);
      reminderTimers.push(t);
    });
  }

  function nextReminderTime(days, timeStr) {
    var parts = timeStr.split(":");
    var hh = parseInt(parts[0], 10), mm = parseInt(parts[1], 10);
    var now = new Date();
    for (var add = 0; add <= 7; add++) {
      var cand = new Date(now.getFullYear(), now.getMonth(), now.getDate() + add, hh, mm, 0, 0);
      if (days.indexOf(cand.getDay()) !== -1 && cand.getTime() > now.getTime()) {
        return cand.getTime();
      }
    }
    return null;
  }

  function fireReminder(plant) {
    try {
      new Notification("🌱 Time to water " + plant.name + "!", {
        body: "Planty Care reminder · water every " + plant.intervalDays + " days.",
        icon: plant.image || undefined,
        tag: "plantycare-" + plant.id
      });
    } catch (e) { /* ignore */ }
  }

  // ===========================================================
  //  Tiny toast
  // ===========================================================
  var toastTimer = null;
  function toast(msg) {
    var el = document.getElementById("toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast";
      el.setAttribute("role", "status");
      el.style.cssText = "position:fixed;left:50%;bottom:calc(84px + env(safe-area-inset-bottom));transform:translateX(-50%);" +
        "background:#1b5e20;color:#fff;padding:0.9rem 1.4rem;border-radius:12px;" +
        "font-weight:700;font-size:1.05rem;box-shadow:0 4px 20px rgba(0,0,0,.3);z-index:200;" +
        "max-width:90%;text-align:center;";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.opacity = "1";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.style.opacity = "0"; el.style.transition = "opacity .4s"; }, 2600);
  }

  // ===========================================================
  //  Helpers
  // ===========================================================
  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function escapeAttr(s) { return escapeHtml(s); }

  // ===========================================================
  //  Init
  // ===========================================================
  renderPresets();
  renderPlants();
  updateNotifyUI();
  scheduleAllReminders();

  // Re-render periodically so "days until due" stays fresh.
  setInterval(function () {
    if (document.getElementById("tab-plants").classList.contains("is-active")) renderPlants();
  }, 60 * 1000);

})();
