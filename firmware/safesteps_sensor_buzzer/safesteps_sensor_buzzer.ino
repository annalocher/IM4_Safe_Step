

const int PIR_PIN    = 7;    
const int BUZZER_PIN = 10;   

const unsigned long PIEP_DAUER = 2000;   // 2 s Warnton
const unsigned long COOLDOWN   = 5000;   // 5 s Pause gegen Dauer-Alarm

int letzterZustand = LOW;          
unsigned long letzterHeartbeat = 0; 

void setup() {
  Serial.begin(115200);
  delay(300);

  pinMode(PIR_PIN, INPUT_PULLDOWN);
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);   

  Serial.println();
  Serial.println("=== SafeSteps bereit ===");
  Serial.println("Warte auf Bewegung...");
}

void loop() {
  int zustand = digitalRead(PIR_PIN);

  
  if (millis() - letzterHeartbeat > 2000) {
    letzterHeartbeat = millis();
    Serial.print("laeuft... PIR = ");
    Serial.println(zustand);
  }

  // Flanke LOW -> HIGH bedeutet: eine NEUE Bewegung beginnt
  if (zustand == HIGH && letzterZustand == LOW) {
    Serial.println(">>> Bewegung erkannt! -> Buzzer EIN");

    digitalWrite(BUZZER_PIN, HIGH);   
    delay(PIEP_DAUER);
    digitalWrite(BUZZER_PIN, LOW);    

    Serial.println("Warnung beendet -> Cooldown");
    delay(COOLDOWN);
    Serial.println("Bereit fuer naechste Bewegung.");
  }

  letzterZustand = zustand;
  delay(50);   
}
