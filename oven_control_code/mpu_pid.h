#ifndef MPU_PID_H
#define MPU_PID_H

boolean pid_init( const char * path );

float pid_calc( float targ, float cur_temp );

//The time is time in s.
float pid_find_target( float time );

#endif
