#include <WiFi.h>
#include <aREST.h>
#include <IRremote.h>
 
// variables
const char* ssid = "";
const char* password = "";

// services
aREST rest = aREST();
WiFiClient wifi
IRsend irSender
WiFiServer server(80);

void setup() {
  Serial.begin(115200);

  pinMode(relay_pin, OUTPUT);

  // REST
  rest.function("ir", handleIR);

  // WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  server.begin();
  Serial.println("Server started");
  Serial.println(WiFi.localIP());
}

void loop() {
  WiFiClient client = server.available();
  if (!client) {
    return;
  }
  while(!client.available()){
    delay(1);
  }
  rest.handle(client);
}

int handleIR(String command) {
  protocol = Serial.parseInt ();
  unsigned long codeValue = 0;         // @todo
  int codeLen = 0;                     // @todo
  irsend.sendNEC(codeValue, codeLen);
  return 1;
}