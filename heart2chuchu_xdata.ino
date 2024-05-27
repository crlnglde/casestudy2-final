#include <Wire.h>
#include "MAX30105.h"
#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

#include "heartRate.h"

const char* ssid = "."; // Your WiFi SSID
const char* wifipassword = "lovejade"; // Your WiFi password
const char* serverUrl = "http://192.168.214.8:3000/bpm/addsensordata"; // Your server URL

MAX30105 particleSensor;

const byte RATE_SIZE = 4; // Increase this for more averaging. 4 is good.
byte rates[RATE_SIZE]; // Array of heart rates
byte rateSpot = 0;
long lastBeat = 0; // Time at which the last beat occurred

float beatsPerMinute;
int beatAvg;
int scannedtime;

const unsigned long DATA_COLLECTION_TIME = 60000; // Data collection time limit in milliseconds (30 seconds)
unsigned long startTime;
unsigned long endTime;
bool fingerDetected = false;
bool timeLimitReached = false;
unsigned long fingerDetectedTime = 0;

const int MAX_READINGS = 60;
struct BpmReading {
  float beats;
  unsigned long bpmtime;
};
BpmReading bpmReadings[MAX_READINGS]; // Array to store BPM readings
int readingIndex = 0;

void setup() {
  Serial.begin(115200);
  Serial.println("Initializing...");

  // Connect to WiFi
  WiFi.begin(ssid, wifipassword);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  // Initialize sensor
  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) { // Use default I2C port, 400kHz speed
    Serial.println("MAX30102 was not found. Please check wiring/power.");
    while (1);
  }
  Serial.println("Place your index finger on the sensor with steady pressure.");

  particleSensor.setup(); // Configure sensor with default settings
  particleSensor.setPulseAmplitudeRed(0x0A); // Turn Red LED to low to indicate sensor is running
  particleSensor.setPulseAmplitudeGreen(0); // Turn off Green LED

  startTime = millis(); // Record the start time
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;

    long irValue = particleSensor.getIR();

    if (millis() - startTime >= DATA_COLLECTION_TIME) {
      timeLimitReached = true;
      endTime = millis(); // Record the end time when 30 seconds is reached
    }

    if (irValue > 50000) { // A finger is detected
      if (!fingerDetected) {
        fingerDetected = true;
        fingerDetectedTime = millis();
        Serial.println("Finger detected. Recording data.");
      }

      if (checkForBeat(irValue) == true) {
        // We sensed a beat!
        long delta = millis() - lastBeat;
        lastBeat = millis();

        beatsPerMinute = 60 / (delta / 1000.0);

        if (beatsPerMinute < 255 && beatsPerMinute > 20) {
          rates[rateSpot++] = (byte)beatsPerMinute; // Store this reading in the array
          rateSpot %= RATE_SIZE; // Wrap variable

          // Take average of readings
          beatAvg = 0;
          for (byte x = 0; x < RATE_SIZE; x++)
            beatAvg += rates[x];
          beatAvg /= RATE_SIZE;

          // Store the BPM reading in bpmReadings array
          if (readingIndex < MAX_READINGS) {
            bpmReadings[readingIndex++] = {beatsPerMinute, millis()};
            Serial.print("Stored BPM reading at index ");
            Serial.print(readingIndex - 1);
            Serial.print(": ");
            Serial.println(beatsPerMinute);
          } else {
            Serial.println("BPM readings array is full.");
          }
        }
      }

      Serial.print(", BPM=");
      Serial.print(beatsPerMinute);

      Serial.println();

    } else { // No finger detected

      if (fingerDetected) {
        // If previously a finger was detected but now it's not, we stop data collection
        fingerDetected = false;
        Serial.println("No finger detected. Data collection stopped.");

        // Print final data and time of detection
        Serial.print("Final Avg BPM (no finger detected)=");
        Serial.println(beatAvg);

        Serial.print("Finger was detected at: ");
        scannedtime = fingerDetectedTime - startTime;
        Serial.println(scannedtime);

        // Stop scanning by halting the loop
        while (1) {
          // Do nothing, effectively stopping the loop
        }
      } else {
        Serial.println("Please place your finger on the sensor.");
      }-
    }

    if (timeLimitReached) {
      Serial.println("Time limit reached. Data collection stopped.");

      // Print final data and time limit reached
      Serial.print("Final Avg BPM (time limit reached)=");
      Serial.println(beatAvg);
      Serial.print("Time limit reached at: ");
      scannedtime = endTime - startTime;
      Serial.println(scannedtime);

      // Construct and send the JSON payload if beatAvg > 0
      if (beatAvg > 0) {
        DynamicJsonDocument jsonDoc(1024);
        jsonDoc["beatAvg"] = beatAvg;
        jsonDoc["scannedTime"] = scannedtime;
        JsonArray bpmArray = jsonDoc.createNestedArray("bpmReadings");
        for (int i = 0; i < readingIndex; i++) {
          JsonObject bpmObject = bpmArray.createNestedObject();
          bpmObject["beats"] = bpmReadings[i].beats;
          bpmObject["bpmtime"] = bpmReadings[i].bpmtime;
        }
        String requestBody;
        serializeJson(jsonDoc, requestBody);
        Serial.println("Constructed JSON payload:");
        Serial.println(requestBody);

        // Send data to server
        http.begin(client, serverUrl);
        http.addHeader("Content-Type", "application/json");
        int httpResponseCode = http.POST(requestBody);

        if (httpResponseCode > 0) {
          String response = http.getString();
          Serial.println("HTTP Response code: " + String(httpResponseCode));
          Serial.println("Response: " + response);
        } else {
          Serial.print("Error sending data to server. HTTP Response code: ");
          Serial.println(httpResponseCode);
        }

        http.end();
      }

      // Stop scanning by halting the loop
      while (1) {
        // Do nothing, effectively stopping the loop
      }
    }
  }
}
