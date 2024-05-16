#include <Arduino.h>
#include "LED.h"
#include <Adafruit_NeoPixel.h>

LED::LED(int pin, int numPixels) {
  this->_numPixels = 0;
  this->_numPixels = numPixels;
  this->strip = Adafruit_NeoPixel(numPixels, pin, NEO_GRB + NEO_KHZ800);
}

void LED::begin() {
  this->strip.begin();
  this->turnOff(); // Initialize all pixels to off
}

void LED::loop() {

  if(this->pattern > 1 && millis() - this->lastUpdate > 20) this->updatePattern();
}

void LED::updatePattern() { 
  switch(pattern) {
      case 2:
        this->rainbow();
        break;
      default:
        break;
    }
}

void LED::setPattern(int ledParams[5]) {
  this->pattern = ledParams[1];
  Serial.print("setPattern:");
  Serial.println(pattern);
  this->wipe();
  this->j = 0;
  switch(pattern) {
      case 0:
        this->turnOff();
        break;
      case 1:
        this->setColor(ledParams[2],  ledParams[3],  ledParams[4]);
        Serial.println("set to new color");
        break;
      case 2:
        this->rainbow();
        break;
      case 3:
        this->rainbowCycle();
        break;
      case 4:
        theaterChaseRainbow(); 
        break;
      case 5:
         this->colorWipe(strip.Color(ledParams[2],  ledParams[3],  ledParams[4])); 
         break;
      default:
        // this->setColor(r, g, b);
        // this->lastUpdate = millis() + 100;
        break;
    }
}

void LED::setColor(int r, int g, int b) {
  Serial.print("setColor");
  Serial.print(this->_numPixels);
  Serial.print(r);
  Serial.print(g);
  Serial.println(b);
  for(int i=0; i < this->_numPixels; i++) {
    this->strip.setPixelColor(i, this->strip.Color(r, g, b));
  }
  this->strip.show();
  // this->lastUpdate = millis() + 100;
}

void LED::turnOff() {
  this->pattern = 0;
  for(int i=0; i < this->_numPixels; i++) {
    this->strip.setPixelColor(i, this->strip.Color(0, 0, 0));
  }
  this->strip.show();
}

void LED::rainbow() {
  // Serial.print("rainbow");
  // Serial.print(this->_numPixels);
  // static uint16_t j=0;
    for(int i=0; i<this->_numPixels; i++) {
      this->strip.setPixelColor(i, this->Wheel((i+this->j) & 255));
    }
    this->strip.show();
     this->j++;
  if(this->j >= 256) this->j=0;
  this->lastUpdate = millis();
}

void LED::rainbowCycle() { // modified from Adafruit example to make it a state machine
  for(int i=0; i< this->strip.numPixels(); i++) {
    this->strip.setPixelColor(i, this->Wheel(((i * 256 / this->strip.numPixels()) + j) & 255));
  }
  this->strip.show();
  this->j++;
  if(this->j >= 256*5) this->j=0;
  this->lastUpdate = millis(); // time for next change to the display
}

void LED::theaterChaseRainbow() { // modified from Adafruit example to make it a state machine
  // static int j=0, q = 0;
  static int q = 0;
  static boolean on = true;
     if(on){
            for (int i=0; i < strip.numPixels(); i=i+3) {
                strip.setPixelColor(i+q, this->Wheel( (i+this->j) % 255));    //turn every third pixel on
             }
     }
      else {
           for (int i=0; i < strip.numPixels(); i=i+3) {
               strip.setPixelColor(i+q, 0);        //turn every third pixel off
                 }
      }
     on = !on; // toggel pixelse on or off for next time
      strip.show(); // display
      q++; // update the q variable
      if(q >=3 ){ // if it overflows reset it and update the J variable
        q=0;
        j++;
        if(this->j >= 256) this->j = 0;
      }
    this->lastUpdate = millis(); // time for next change to the display    
}

void LED::colorWipe(uint32_t c) { // modified from Adafruit example to make it a state machine
  static int i =0;
    strip.setPixelColor(i, c);
    strip.show();
  i++;
  if(i >= strip.numPixels()){
    i = 0;
    this->wipe(); // blank out strip
  }
  this->lastUpdate = millis(); // time for next change to the display
}


void LED::wipe(){ // clear all LEDs
  for(int i=0;i<strip.numPixels();i++){
    strip.setPixelColor(i, strip.Color(0,0,0)); 
  }
}

uint32_t LED::Wheel(byte WheelPos) {
  WheelPos = 255 - WheelPos;
  if(WheelPos < 85) {
    return strip.Color(255 - WheelPos * 3, 0, WheelPos * 3);
  }
  if(WheelPos < 170) {
    WheelPos -= 85;
    return strip.Color(0, WheelPos * 3, 255 - WheelPos * 3);
  }
  WheelPos -= 170;
  return strip.Color(WheelPos * 3, 255 - WheelPos * 3, 0);
}
