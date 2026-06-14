

const el = (id) => document.getElementById(id);


const ICONS = {
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  settings:
    '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  "map-pin": '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  bell:
    '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
  volume:
    '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  smile:
    '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>',
  waves:
    '<path d="M3 7c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2"/><path d="M3 13c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2"/><path d="M3 19c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2"/>',
  magnet:
    '<path d="M18 3v9a6 6 0 0 1-12 0V3"/><line x1="6" y1="3" x2="9" y2="3"/><line x1="15" y1="3" x2="18" y2="3"/>',
  edit:
    '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
  trash:
    '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  "alert-triangle":
    '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  "arrow-left": '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
  power: '<path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/>',
};

function svg(name) {
  return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ""}</svg>`;
}


function hydrateIcons(root = document) {
  root.querySelectorAll("[data-icon]").forEach((node) => {
    if (!node.dataset.hydrated) {
      node.innerHTML = svg(node.dataset.icon);
      node.dataset.hydrated = "1";
    }
  });
}


const VIEWS = ["splash", "login", "home", "zones", "zone-edit", "activity", "settings", "alert"];

function show(view) {
  VIEWS.forEach((v) => (el("view-" + v).hidden = v !== view));
  const sc = el("view-" + view).querySelector(".scroll");
  if (sc) sc.scrollTop = 0;
}


document.querySelectorAll("[data-back]").forEach((btn) => {
  btn.addEventListener("click", () => show(btn.dataset.back));
});


el("nav-zones").addEventListener("click", openZones);
el("nav-activity").addEventListener("click", openActivity);
el("nav-settings").addEventListener("click", openSettings);
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const t = tab.dataset.tab;
    if (t === "home") show("home");
    else if (t === "zones") openZones();
    else if (t === "activity") openActivity();
  });
});


let authMode = "login"; // "login" | "register"


el("auth-switch").addEventListener("click", () => {
  authMode = authMode === "login" ? "register" : "login";
  const reg = authMode === "register";
  el("login-sub").textContent = reg ? "Erstelle ein neues Konto" : "Melde dich an, um fortzufahren";
  el("login-submit").textContent = reg ? "Registrieren" : "Anmelden";
  el("auth-switch").innerHTML = reg
    ? "Bereits ein Konto? <strong>Anmelden</strong>"
    : "Noch kein Konto? <strong>Registrieren</strong>";
  el("login-password").setAttribute("autocomplete", reg ? "new-password" : "current-password");
  el("login-error").dataset.show = "0";
});

el("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = el("login-email").value.trim();
  const password = el("login-password").value;
  const errorBox = el("login-error");
  const submit = el("login-submit");
  const reg = authMode === "register";

  errorBox.dataset.show = "0";
  submit.disabled = true;
  submit.textContent = reg ? "Registrieren…" : "Anmelden…";

  const res = reg ? await API.register(email, password) : await API.login(email, password);

  submit.disabled = false;
  submit.textContent = reg ? "Registrieren" : "Anmelden";

  if (res.success) {
    await openHome();
  } else {
    el("login-error-text").textContent =
      res.message || (reg ? "Registrierung fehlgeschlagen." : "Anmeldung fehlgeschlagen.");
    errorBox.dataset.show = "1";
  }
});


async function openHome() {
  show("home");
  await refreshHome();
  startPolling();   
}


let pollTimer = null;
let alarmWarAktiv = false;
function startPolling() {
  if (pollTimer) return;
  pollTimer = setInterval(pollState, 4000);
}


async function pollState() {
  if (!el("view-alert").hidden) return;           
  let s;
  try { s = await API.getSystemState(); } catch (e) { return; }

  if (!el("view-home").hidden) renderHome(s);      

  if (s.alert && !alarmWarAktiv) openAlert(s.alert);
}

async function refreshHome() {
  const s = await API.getSystemState();
  renderHome(s);
  alarmWarAktiv = !!s.alert; 
}

function renderHome(s) {

  const banner = el("home-banner");
  if (s.alert) {
    banner.innerHTML = `
      <div class="banner banner--alert">
        <span class="banner__dot"></span>
        <div class="banner__body">
          <div class="banner__title">Alarm aktiv</div>
          <div class="banner__sub">Bewegung erkannt: ${escapeHtml(s.alert.zone)}</div>
        </div>
        <button class="banner__view" id="banner-view">Ansehen</button>
      </div>`;
    el("banner-view").addEventListener("click", () => openAlert(s.alert));
  } else {
    banner.innerHTML = `
      <div class="banner banner--ok">
        <span class="banner__dot"></span>
        <div class="banner__body">
          <div class="banner__title">Kein Alarm aktiv</div>
          <div class="banner__sub">${s.armed ? "Alle Zonen werden überwacht" : "Überwachung pausiert"}</div>
        </div>
      </div>`;
  }

  
  const card = el("system-card");
  card.classList.toggle("system-card--armed", s.armed);
  card.classList.toggle("system-card--off", !s.armed);
  card.querySelector(".tile [data-icon]")?.removeAttribute("data-hydrated");
  card.querySelector(".tile [data-icon]").dataset.icon = s.armed ? "shield" : "power";
  hydrateIcons(card);
  el("system-title").textContent = s.armed
    ? `${s.zonesCount} ${s.zonesCount === 1 ? "Zone" : "Zonen"} aktiv`
    : "System deaktiviert";
  el("system-sub").textContent = s.armed
    ? "Alle Sensoren sind verbunden und überwachen"
    : "Tippen, um die Überwachung zu aktivieren";
}


el("system-card").addEventListener("click", async () => {
  const s = await API.getSystemState();
  await API.setArmed(!s.armed);
  await refreshHome();
});


function openAlert(alertData) {
  el("alert-zone").textContent = "in: " + alertData.zone;
  el("alert-time").textContent = alertData.timestamp || "gerade eben";
  show("alert");
}

el("alert-dismiss").addEventListener("click", async () => {
  await API.dismissAlert();
  await openHome();
});

el("view-alert").querySelector("[data-back]").addEventListener("click", async () => {
  await API.dismissAlert();
  await refreshHome();
});


const SENSOR_LABEL = { motion: "Bewegung", sound: "Ton", magnetic: "Magnetisch" };
const SENSOR_ICON = { motion: "waves", sound: "volume", magnetic: "magnet" };

async function openZones() {
  show("zones");
  await refreshZones();
}

async function refreshZones() {
  const zones = await API.getZones();
  const list = el("zone-list");
  list.innerHTML = "";

  zones.forEach((z) => {
    const card = document.createElement("div");
    card.className = "zone-card";
    card.innerHTML = `
      <div class="zone-card__head">
        <span class="zone-card__name">${escapeHtml(z.name)}</span>
        <button class="zone-card__act" data-edit="${z.id}" aria-label="Bearbeiten"><span data-icon="edit"></span></button>
        <button class="zone-card__act zone-card__act--del" data-del="${z.id}" aria-label="Löschen"><span data-icon="trash"></span></button>
      </div>`;
    list.appendChild(card);
  });


  const add = document.createElement("button");
  add.className = "add-zone-btn";
  add.innerHTML = '<span data-icon="plus"></span> Neue Zone';
  add.addEventListener("click", () => openZoneEdit(null));
  list.appendChild(add);

  hydrateIcons(list);

 
  list.querySelectorAll("[data-edit]").forEach((b) =>
    b.addEventListener("click", () => openZoneEdit(Number(b.dataset.edit), zones))
  );
  list.querySelectorAll("[data-del]").forEach((b) =>
    b.addEventListener("click", async () => {
      const z = zones.find((z) => z.id === Number(b.dataset.del));
      if (confirm(`Zone „${z ? z.name : ""}" wirklich löschen?`)) {
        await API.deleteZone(Number(b.dataset.del));
        await refreshZones();
      }
    })
  );
}


let editingZoneId = null;

function openZoneEdit(id, zones) {
  editingZoneId = id;
  const zone = id && zones ? zones.find((z) => z.id === id) : null;

  el("zone-edit-title").textContent = zone ? "Zone bearbeiten" : "Neue Zone";
  el("zone-name").value = zone ? zone.name : "";

  show("zone-edit");
}

el("zone-save").addEventListener("click", async () => {
  const name = el("zone-name").value.trim();
  if (!name) { alert("Bitte einen Zonennamen eingeben."); return; }

  await API.saveZone({ id: editingZoneId || undefined, name, sensors: [] });
  await openZones();
});


const ACTIVITY_META = {
  motion:      { icon: "alert-triangle", title: "Bewegung erkannt" },
  armed:       { icon: "shield",         title: "Scharf gestellt" },
  deactivated: { icon: "power",          title: "Deaktiviert" },
  safe:        { icon: "shield",         title: "Als sicher markiert" },
};

function renderActivityChart(data) {
  const wrap = el("activity-chart");
  if (!data || data.length === 0) { wrap.innerHTML = ""; return; }

  const max = Math.max(1, ...data.map((d) => d.count));
  wrap.innerHTML = data
    .map((d) => {
      const h = Math.round((d.count / max) * 100);
      return `
        <div class="chart__col">
          <div class="chart__count">${d.count}</div>
          <div class="chart__track">
            <div class="chart__bar${d.count === 0 ? " chart__bar--empty" : ""}" style="height:${h}%"></div>
          </div>
          <div class="chart__label">${escapeHtml(d.label)}</div>
        </div>`;
    })
    .join("");
}

async function openActivity() {
  show("activity");
  const [items, stats] = await Promise.all([API.getActivity(), API.getStats()]);
  renderActivityChart(stats);

  const list = el("activity-list");
  list.innerHTML = "";

  if (items.length === 0) {
    list.innerHTML = '<p style="color:var(--muted);font-weight:600">Noch keine Ereignisse.</p>';
    return;
  }

  items.forEach((a) => {
    const meta = ACTIVITY_META[a.type] || { icon: "activity", title: a.type };
    const row = document.createElement("div");
    row.className = "tl-item";
    row.innerHTML = `
      <div class="tl-rail">
        <div class="tl-dot tl-dot--${a.type}"><span data-icon="${meta.icon}"></span></div>
        <div class="tl-line"></div>
      </div>
      <div class="tl-card">
        <div>
          <div class="tl-card__title">${meta.title}</div>
          <div class="tl-card__zone">${escapeHtml(a.zone)}</div>
        </div>
        <div class="tl-card__time">${escapeHtml(a.timestamp)}</div>
      </div>`;
    list.appendChild(row);
  });

  hydrateIcons(list);
}


async function openSettings() {
  show("settings");
  const s = await API.getSettings();
  el("set-parent").value = s.parentName || "";
  el("set-child").value = s.childName || "";
  el("set-sensitivity").value = s.motionSensitivity;
  el("sens-val").textContent = s.motionSensitivity + "%";
  el("set-push").checked = !!s.pushNotifications;
  el("set-sound").checked = !!s.soundAlerts;
}


el("set-sensitivity").addEventListener("input", (e) => {
  el("sens-val").textContent = e.target.value + "%";
});
el("set-sensitivity").addEventListener("change", (e) =>
  API.saveSettings({ motionSensitivity: Number(e.target.value) })
);
el("set-parent").addEventListener("change", (e) => API.saveSettings({ parentName: e.target.value }));
el("set-child").addEventListener("change", (e) => API.saveSettings({ childName: e.target.value }));
el("set-push").addEventListener("change", (e) => API.saveSettings({ pushNotifications: e.target.checked }));
el("set-sound").addEventListener("change", (e) => API.saveSettings({ soundAlerts: e.target.checked }));


function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}


hydrateIcons();
show("splash");
setTimeout(() => show("login"), 1900);
