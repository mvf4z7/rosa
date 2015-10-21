#ifndef MPU_UTIL_H
#define MPU_UTIL_H

#include "mpu_types.h"

enum
{
    POINT,
    DEBUG_MSG
};

//Function for generating a JSON string, based on the given parameter values.
//Returns a readable string in JSON format.
void util_print_point(uint32 time, float target, float temperature);

void util_print_debug( const char * string );

float util_calc_temp( uint16 adc_val );

#endif
