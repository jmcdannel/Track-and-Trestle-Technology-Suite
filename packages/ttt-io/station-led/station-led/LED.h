
#ifndef LED_h
#define LED_h
// MARK: Libraries
#include "Arduino.h"
#include <Adafruit_NeoPixel.h>
// MARK: Class / Functions / Variables
class LED {
  public:
    LED(int pin, int numPixels);
    // MARK: Lifecycle
    void begin();
    void loop();
    void setPattern(int ledParams[5]);
    void turnOff();
    void setBrightness(uint8_t brightness);
  private:
    // MARK: Variables
    Adafruit_NeoPixel strip;
    int _numPixels;
    int pattern;
    int r;
    int g;
    int b;
    uint16_t j;
    unsigned long lastUpdate; // for millis() when last update occoured
    unsigned long intervals[]; // speed for each pattern
    uint32_t Wheel(byte WheelPos);
    void updatePattern();
    void setColor(int r, int g, int b);
    void rainbow();
    void wipe();
    void rainbowCycle();
    void theaterChaseRainbow();
    void colorWipe(uint32_t c);
    // Debuging Identifier

    // Private constructor to prevent direct instantiation
    
};

#endif
