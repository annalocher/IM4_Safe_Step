

#include <WiFi.h>
#include <WebServer.h>
#include <DNSServer.h>
#include <Preferences.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>

const char* API_KEY    = "d81d96af9d80a754c75e7beab78b3d90"; 
const char* ZONE       = "Treppe";                            
const char* DETECT_URL = "https://safe-step.ch/detect.php";
const char* SETUP_AP   = "SafeSteps-Setup";                  


const int PIR_PIN    = 7;
const int BUZZER_PIN = 10;
const int BTN_BOOT   = 9;     
const unsigned long PIEP_DAUER = 2000;
const unsigned long COOLDOWN   = 5000;

int letzterZustand = LOW;
unsigned long letzterHeartbeat = 0;
bool online = false;         

Preferences prefs;
WebServer server(80);
DNSServer dns;
const byte DNS_PORT = 53;


String portalSeite() {

  String opts;
  int n = WiFi.scanNetworks();
  for (int i = 0; i < n; i++) {
    opts += "<option value=\"" + WiFi.SSID(i) + "\">" + WiFi.SSID(i) + "</option>";
  }

  String css =
    "*{box-sizing:border-box;margin:0;padding:0}"
    "body{font-family:system-ui,-apple-system,sans-serif;background:#F4F7FB;color:#1F2430;"
    "min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}"
    ".card{background:#fff;border-radius:20px;box-shadow:0 10px 30px rgba(31,36,48,.12);"
    "padding:28px 24px;width:100%;max-width:380px}"
    ".logo{width:64px;height:64px;border-radius:18px;background:#2563EB;color:#fff;"
    "display:flex;align-items:center;justify-content:center;font-size:32px;margin:0 auto 14px}"
    "h1{text-align:center;font-size:26px;font-weight:800;letter-spacing:-.5px}"
    ".sub{text-align:center;color:#8A94A6;margin:2px 0 6px;font-weight:600}"
    ".info{text-align:center;color:#8A94A6;font-size:13px;margin-bottom:20px}"
    "label{display:block;font-size:14px;font-weight:700;margin:14px 0 6px}"
    "select,input{width:100%;padding:13px 14px;font-size:16px;border:1.5px solid #E8ECF2;"
    "border-radius:12px;background:#F7F9FC;font-family:inherit;color:#1F2430}"
    "select:focus,input:focus{outline:none;border-color:#2563EB;background:#fff}"
    "button{width:100%;margin-top:22px;padding:15px;font-size:16px;font-weight:800;color:#fff;"
    "background:#2563EB;border:none;border-radius:14px;cursor:pointer}"
    "button:active{transform:scale(.98)}"
    ".foot{text-align:center;color:#8A94A6;font-size:12px;margin-top:20px}";

  String html = "<!DOCTYPE html><html lang=\"de\"><head><meta charset=\"UTF-8\">"
    "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">"
    "<title>SafeSteps WLAN-Setup</title><style>" + css + "</style></head><body>"
    "<div class=\"card\">"
    "<div class=\"logo\">&#128737;</div>"
    "<h1>SafeSteps</h1>"
    "<div class=\"sub\">WLAN einrichten</div>"
    "<div class=\"info\">Waehle dein WLAN (2,4&nbsp;GHz) und gib das Passwort ein.</div>"
    "<form method=\"POST\" action=\"/save\">"
    "<label>WLAN-Netzwerk</label>"
    "<select name=\"ssid\">" + opts + "</select>"
    "<label>Passwort</label>"
    "<input type=\"password\" name=\"pass\" placeholder=\"WLAN-Passwort\">"
    "<button type=\"submit\">Verbinden</button>"
    "</form>"
    "<div class=\"foot\">Intelligentes Kindersicherheits-System</div>"
    "</div></body></html>";
  return html;
}

void handleRoot() { server.send(200, "text/html", portalSeite()); }

void handleSave() {
  String ssid = server.arg("ssid");
  String pass = server.arg("pass");
  prefs.putString("ssid", ssid);
  prefs.putString("pass", pass);

  String html = "<!DOCTYPE html><html lang=\"de\"><head><meta charset=\"UTF-8\">"
    "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">"
    "<style>body{font-family:system-ui,sans-serif;background:#F4F7FB;color:#1F2430;"
    "text-align:center;padding:48px 24px}.c{background:#fff;border-radius:20px;max-width:360px;"
    "margin:0 auto;padding:32px;box-shadow:0 10px 30px rgba(31,36,48,.12)}"
    "h1{color:#16A34A;font-size:24px}p{color:#8A94A6;margin-top:10px;line-height:1.5}</style>"
    "</head><body><div class=\"c\"><h1>Gespeichert &#10003;</h1>"
    "<p>SafeSteps verbindet sich jetzt mit<br><b>" + ssid + "</b>.<br>Das Ger&auml;t startet neu&hellip;</p>"
    "</div></body></html>";
  server.send(200, "text/html", html);
  delay(1500);
  ESP.restart();  
}

void startePortal() {
  WiFi.mode(WIFI_AP);
  WiFi.softAP(SETUP_AP);
  IPAddress ip = WiFi.softAPIP();
  dns.start(DNS_PORT, "*", ip);  

  server.on("/", handleRoot);
  server.on("/save", HTTP_POST, handleSave);
  server.onNotFound([]() { server.sendHeader("Location", "/"); server.send(302, "text/plain", ""); });
  server.begin();

  Serial.println();
  Serial.println("Setup-Portal aktiv:");
  Serial.print("  1) Mit WLAN \""); Serial.print(SETUP_AP); Serial.println("\" verbinden");
  Serial.print("  2) Falls keine Seite aufgeht: Browser -> http://"); Serial.println(ip);
}

bool verbinde(String ssid, String pass) {
  if (ssid.length() == 0) return false;
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid.c_str(), pass.c_str());
  Serial.print("Verbinde mit \""); Serial.print(ssid); Serial.print("\" ");
  int v = 0;
  while (WiFi.status() != WL_CONNECTED && v < 30) { delay(500); Serial.print("."); v++; }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println(" verbunden!");
    Serial.print("IP-Adresse: "); Serial.println(WiFi.localIP());
    return true;
  }
  Serial.println(" fehlgeschlagen.");
  return false;
}

void setup() {
  Serial.begin(115200);
  delay(300);

  pinMode(PIR_PIN, INPUT_PULLDOWN);
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);
  pinMode(BTN_BOOT, INPUT_PULLUP);

  Serial.println();
  Serial.println("=== SafeSteps startet ===");

  prefs.begin("safesteps", false);

 
  if (digitalRead(BTN_BOOT) == LOW) {
    Serial.println("BOOT gedrueckt -> WLAN-Daten geloescht.");
    prefs.clear();
  }

  String ssid = prefs.getString("ssid", "");
  String pass = prefs.getString("pass", "");

  online = verbinde(ssid, pass);
  if (!online) {
    startePortal();
  } else {
    Serial.println("Warte auf Bewegung...");
  }
}


bool meldeAnServer() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("  (kein WLAN -> Server-Meldung uebersprungen)");
    return false;  
  }

  WiFiClientSecure client;
  client.setInsecure();   

  bool scharf = false;
  HTTPClient https;
  if (https.begin(client, DETECT_URL)) {
    https.addHeader("Content-Type", "application/json");
    String body = String("{\"api_key\":\"") + API_KEY + "\",\"zone\":\"" + ZONE + "\"}";

    int code = https.POST(body);
    Serial.print("  detect.php -> HTTP ");
    Serial.println(code);
    if (code > 0) {
      String antwort = https.getString();
      Serial.print("  Antwort: ");
      Serial.println(antwort);
  
      scharf = (antwort.indexOf("\"armed\":true") >= 0);
    }
    https.end();
  } else {
    Serial.println("  HTTPS-Verbindung konnte nicht aufgebaut werden.");
  }
  return scharf;
}

void loop() {
 
  if (!online) {
    dns.processNextRequest();
    server.handleClient();
    return;
  }


  int zustand = digitalRead(PIR_PIN);

  if (millis() - letzterHeartbeat > 2000) {
    letzterHeartbeat = millis();
    Serial.print("laeuft... PIR = ");
    Serial.print(zustand);
    Serial.print("  |  WLAN = ");
    Serial.println(WiFi.status() == WL_CONNECTED ? "OK" : "getrennt");
  }


  if (zustand == HIGH && letzterZustand == LOW) {
    Serial.println(">>> Bewegung erkannt! -> Meldung an Server");

    bool scharf = meldeAnServer();   

    if (scharf) {
      Serial.println("  System ist scharf gestellt -> Buzzer EIN");
      digitalWrite(BUZZER_PIN, HIGH); 
      delay(PIEP_DAUER);
      digitalWrite(BUZZER_PIN, LOW);
    } else {
      Serial.println("  System deaktiviert -> kein Alarm, kein Piepton");
    }

    Serial.println("Cooldown...");
    delay(COOLDOWN);
    Serial.println("Bereit fuer naechste Bewegung.");
  }

  letzterZustand = zustand;
  delay(50);
}
