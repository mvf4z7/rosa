#ifndef MPU_TIMER_H
#define MPU_TIMER_H

void timer_init();

//This function returns the current time via the uint32 * .
//A return value of FALSE indicates an error.
boolean timer_get( uint32 * time );




#endif
