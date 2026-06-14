

const USE_MOCK = false; 
const API_BASE = "";   


const mockDB = {
  // Test-Login:  mama@safesteps.ch  /  test1234
  user: { email: "mama@safesteps.ch", password: "test1234" },
  system: { armed: true, alert: null }, 
  settings: {
    parentName: "Sarah Johnson",
    childName: "Emma",
    motionSensitivity: 75,
    pushNotifications: false,
    soundAlerts: false,
  },
  zones: [
    { id: 1, name: "Treppe", sensors: ["motion", "sound"] },
    { id: 2, name: "Garten", sensors: ["motion"] },
    { id: 3, name: "Büro", sensors: ["motion", "sound"] },
    { id: 4, name: "Balkon", sensors: ["motion", "magnetic"] },
  ],
  nextZoneId: 5,
  activity: [
    { id: 5, type: "motion",      zone: "Treppe",     timestamp: "vor 2 Min." },
    { id: 4, type: "armed",       zone: "Alle Zonen", timestamp: "vor 10 Min." },
    { id: 3, type: "motion",      zone: "Garten",     timestamp: "vor 15 Min." },
    { id: 2, type: "deactivated", zone: "System",     timestamp: "vor 1 Std." },
    { id: 1, type: "armed",       zone: "Alle Zonen", timestamp: "vor 2 Std." },
  ],
  nextActivityId: 6,
};

function delay(ms = 220) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


function jetztLabel() {
  return "gerade eben";
}

function addActivity(type, zone) {
  mockDB.activity.unshift({
    id: mockDB.nextActivityId++,
    type,
    zone,
    timestamp: jetztLabel(),
  });
}

const API = {

  async login(email, password) {
    if (USE_MOCK) {
      await delay();
      const ok = email === mockDB.user.email && password === mockDB.user.password;
      return { success: ok, message: ok ? "" : "E-Mail oder Passwort ist falsch." };
    }
    const res = await fetch(API_BASE + "login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  async register(email, password) {
    if (USE_MOCK) {
      await delay();
      return { success: true, message: "" };
    }
    const res = await fetch(API_BASE + "register.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },


  async getSystemState() {
    if (USE_MOCK) {
      await delay();
      return {
        armed: mockDB.system.armed,
        alert: mockDB.system.alert ? { ...mockDB.system.alert } : null,
        zonesCount: mockDB.zones.length,
      };
    }
    const res = await fetch(API_BASE + "system.php", { credentials: "include" });
    return res.json();
  },


  async setArmed(armed) {
    if (USE_MOCK) {
      await delay();
      mockDB.system.armed = armed;
      if (armed) {
        addActivity("armed", "Alle Zonen");
      } else {
        mockDB.system.alert = null;
        addActivity("deactivated", "System");
      }
      return { success: true };
    }
    const res = await fetch(API_BASE + "system.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ armed }),
    });
    return res.json();
  },


  async dismissAlert() {
    if (USE_MOCK) {
      await delay();
      if (mockDB.system.alert) {
        addActivity("safe", mockDB.system.alert.zone);
        mockDB.system.alert = null;
      }
      return { success: true };
    }
    const res = await fetch(API_BASE + "system.php?action=dismiss", {
      method: "POST",
      credentials: "include",
    });
    return res.json();
  },

  async getZones() {
    if (USE_MOCK) {
      await delay();
      return mockDB.zones.map((z) => ({ ...z, sensors: [...z.sensors] }));
    }
    const res = await fetch(API_BASE + "zones.php", { credentials: "include" });
    return res.json();
  },

  
  async saveZone(zone) {
    if (USE_MOCK) {
      await delay();
      if (zone.id) {
        const z = mockDB.zones.find((z) => z.id === zone.id);
        if (z) { z.name = zone.name; z.sensors = [...zone.sensors]; }
      } else {
        mockDB.zones.push({ id: mockDB.nextZoneId++, name: zone.name, sensors: [...zone.sensors] });
      }
      return { success: true };
    }
    const res = await fetch(API_BASE + "zones.php", {
      method: zone.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(zone),
    });
    return res.json();
  },

  async deleteZone(id) {
    if (USE_MOCK) {
      await delay();
      mockDB.zones = mockDB.zones.filter((z) => z.id !== id);
      return { success: true };
    }
    const res = await fetch(API_BASE + "zones.php?id=" + encodeURIComponent(id), {
      method: "DELETE",
      credentials: "include",
    });
    return res.json();
  },

  async getActivity() {
    if (USE_MOCK) {
      await delay();
      return mockDB.activity.map((a) => ({ ...a }));
    }
    const res = await fetch(API_BASE + "activity.php", { credentials: "include" });
    return res.json();
  },

  
  async getStats() {
    if (USE_MOCK) {
      await delay();
      const labels = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
      const demo = [1, 0, 2, 1, 3, 0, 1]; 
      const out = [];
      const now = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        out.push({
          date: d.toISOString().slice(0, 10),
          label: labels[d.getDay()],
          count: demo[6 - i],
        });
      }
      return out;
    }
    const res = await fetch(API_BASE + "stats.php", { credentials: "include" });
    return res.json();
  },


  async getSettings() {
    if (USE_MOCK) {
      await delay();
      return { ...mockDB.settings };
    }
    const res = await fetch(API_BASE + "settings.php", { credentials: "include" });
    return res.json();
  },

  async saveSettings(partial) {
    if (USE_MOCK) {
      await delay();
      Object.assign(mockDB.settings, partial);
      return { success: true };
    }
    const res = await fetch(API_BASE + "settings.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(partial),
    });
    return res.json();
  },
};
