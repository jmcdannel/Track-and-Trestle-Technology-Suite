#include <TurnoutPulser.h>

#define DEVICE_ID "tj-payette-sub-arduino"
#define ENABLE_PWM false
#define ENABLE_OUTPUTS true
#define ENABLE_SIGNALS true
#define ENABLE_TURNOUTS true
#define ENABLE_SENSORS true

#define SERVOMIN 150 // This is the 'minimum' pulse length count (out of 4096)
#define SERVOMAX 600 // This is the 'maximum' pulse length count (out of 4096)
#define MIN_PULSE_WIDTH 650
#define MAX_PULSE_WIDTH 2350
#define USMIN 600     // This is the rounded 'minimum' microsecond length based on the minimum pulse of 150
#define USMAX 2400    // This is the rounded 'maximum' microsecond length based on the maximum pulse of 600
#define SERVO_FREQ 50 // Analog servos run at ~50 Hz updates
#define SERVO_COUNT 16

int OUTPINS[] = {18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53};
int SIGNALPINS[] = {};
int SENSORPINS[] = {A0, A1, A2, A3, A4, A5};

TurnoutPulser turnouts[] = {
    TurnoutPulser(18, 19), // 0-
    TurnoutPulser(20, 21), // 1-
    TurnoutPulser(22, 23), // 2-
    TurnoutPulser(24, 25), // 3-
    TurnoutPulser(26, 27), // 4-
    TurnoutPulser(28, 29), // 5-
    TurnoutPulser(30, 31), // 6-
    TurnoutPulser(32, 33), // 7-
    TurnoutPulser(34, 36), // 8*
    TurnoutPulser(35, 37), // 9*
    TurnoutPulser(38, 40), // 10*
    TurnoutPulser(39, 41), // 11*
    TurnoutPulser(42, 44), // 12*
    TurnoutPulser(43, 45), // 13*
    TurnoutPulser(46, 48), // 14-
    TurnoutPulser(47, 49), // 15*
    TurnoutPulser(50, 52), // 16-
    TurnoutPulser(51, 53), // 17*
};