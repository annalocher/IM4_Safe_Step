# SafeSteps 🛡️

**Intelligentes Kindersicherheits-System** — ein Bewegungssensor überwacht einen
Gefahrenbereich (z. B. eine Treppe) und schlägt in einer Web-App der Eltern Alarm,
sobald sich dort etwas bewegt. IM4-Projekt · ESP32-Firmware + Web-App (PHP/MySQL).

## Idee
Kleine Kinder geraten zu Hause schnell in gefährliche Bereiche. SafeSteps überwacht
so einen Bereich: Erkennt der Sensor Bewegung, **während das System scharf gestellt
ist**, piept ein Buzzer am Gerät und in der App erscheint der Alarm samt Verlauf.

## Wie es funktioniert
1. **Messen** — Der PIR-Sensor erkennt Bewegung; der ESP32 reagiert.
2. **Melden** — Der ESP32 sendet per HTTPS eine JSON-Nachricht mit seinem `api_key` an `detect.php`.
3. **Entscheiden** — Der Server prüft den Key und ob das System scharf gestellt ist.
4. **Speichern** — Wenn ja, schreibt er Alarm + Ereignis in die Datenbank und antwortet `"armed":true`.
5. **Anzeigen** — Der Buzzer piept, die App zeigt Alarm + Aktivitätsverlauf (mit Diagramm).

> Kernprinzip: Hardware *misst* → Server *entscheidet & speichert* → App *zeigt an*.

## Hardware
- **ESP32-C6** als WLAN-Mikrocontroller, **PIR-Bewegungssensor** und **Buzzer**.
- **WLAN-Setup-Portal:** Beim ersten Start öffnet der ESP32 ein eigenes WLAN; das
  Heim-WLAN wird über eine Webseite eingerichtet — **kein hartcodiertes Passwort**.

## Software
Drei sauber getrennte Schichten:
- **Frontend:** HTML/CSS/JavaScript, als PWA zum Home-Bildschirm hinzufügbar.
  `api.js` ist die einzige Stelle, die mit dem Server spricht.
- **Backend:** einzelne **PHP-Endpunkte** (`detect.php`, `login.php`, `zones.php`,
  `activity.php`, `stats.php` …), Antwort immer als JSON.
- **Datenbank:** MySQL/MariaDB mit Tabellen für Benutzer, Gerät, Zonen, Sensoren und Aktivität.

## Sicherheit
Passwörter gehasht (bcrypt), alle Abfragen als prepared statements, Login-Pflicht
(PHP-Sessions), `session_regenerate_id()` beim Login, Geräte-Auth über `api_key`.

## Learnings
- **Trennung Frontend/Backend:** Dank `api.js` als einziger Datenquelle konnten wir
  zuerst mit Mock-Daten entwickeln und das Backend später mit einem Schnitt anbinden.
- **Wo Daten leben:** Zonen gehören in die Datenbank, nicht in die Firmware.
- **Geräte-Authentifizierung:** Ein Mikrocontroller meldet sich per `api_key` an, nicht per Login.
- **PWA-Grenzen auf iOS:** Web-Push geht nur als Home-Bildschirm-App ab iOS 16.4.

## Schwierigkeiten
- **Verbindung ESP32 ↔ WLAN:** Das Gerät stabil ins WLAN zu bringen war anfangs
  schwierig. Statt das Passwort fest zu codieren, haben wir ein eigenes Setup-Portal
  gebaut, über das man das WLAN bequem am Handy einrichtet.
- **Kommunikation Gerät ↔ Server:** Die Meldungen vom ESP32 kamen zuerst nicht beim
  Server an — HTTPS-Aufruf, `api_key` und die JSON-Antwort mussten Schritt für Schritt zusammenspielen.
- **Design mit mehreren Sensoren:** Ursprünglich konnte man pro Zone mehrere Sensoren
  (Bewegung, Ton, Magnetisch) auswählen. Das passte aber nicht zur echten Hardware,
  daher haben wir das Konzept später wieder vereinfacht und umgebaut.


## Reflexion
Das Projekt zeigte, wie viel hinter einem scheinbar einfachen „Sensor piept" steckt:
Gerät, sicherer Server, Datenbank und verständliche App. Am meisten gelernt haben wir
an den **Schnittstellen** zwischen den Teilen — dort lagen auch die kniffligsten Fehler.
Mit Mock-Daten zu starten war goldrichtig. 