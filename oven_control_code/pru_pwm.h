#ifndef PRU_PWM_H
#define PRU_PWM_H

/* This module uses pin 9.27 for PWM output. */

//Initializes the PWM module to off.
void pwm_init();

//Returns the current PWM setting.
float pwm_get();

//Turns off the PWM module.
void pwm_off();

//Sets the PWM duty cycle using the float that is passed in.
//val should be in the range of [0, 1]
void pwm_set( float val );

//Updates the PWM module output.
//Should be called frequently to ensure correct PWM operation.
void pwm_update();



#endif
