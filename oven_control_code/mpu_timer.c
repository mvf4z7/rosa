
#include <stdio.h>
#include <inttypes.h>
#include <math.h>
#include <time.h>

#include "mpu_types.h"
#include "mpu_timer.h"

#define CLK_ID CLOCK_MONOTONIC

static struct timespec s_time;
static uint32 s_prev_time;      //The last time the timer was checked.
static uint32 s_start_time;     //The time when the timer was first checked.

static uint32 cvt_time( struct timespec time ); 

void timer_init() 
{
    clock_gettime( CLK_ID, &s_time );
    
    s_start_time = cvt_time( s_time );
    s_prev_time = 0;
    
    return;   
}

boolean timer_get( uint32 * time )
{
    uint32 tmp;
    clock_gettime( CLK_ID, &s_time );
    tmp = cvt_time( s_time );
    if( tmp >= s_start_time )
    {
        tmp = tmp - s_start_time;
    }
    else
    {
        tmp = ( 0xFFFFFFFF - s_start_time ) + tmp + 1;
    }
    
    //If the timer has not been checked in 10 seconds the time was probably changed,
    //and we no longer know what the current time is.
    if( tmp - s_prev_time < 10000 )
    {
        s_prev_time = tmp;
        *time = tmp;
        return( TRUE );
    }
    else
    {
        *time = 0;
        return( FALSE );
    }
    
}

uint32 cvt_time( struct timespec time )
{
    uint32 ret_val;
    
    ret_val = (uint32)time.tv_sec & 0x003FFFFF; // Mask off upper 10 bits.
    ret_val = ret_val * 1000;                   //Multiply secs by 1000 to get ms.
    ret_val = ret_val + (uint32)( (double)time.tv_nsec / ( 1 * 1000 * 1000 ) ); //Add the number of ms
    return( ret_val ); 
}
