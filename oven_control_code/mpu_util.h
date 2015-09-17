#ifndef MPU_UTIL_H
#define MPU_UTIL_H

#include "mpu_types.h"

//This function will convert the string parameter with the format: "0xdddddddd"
//into its integer representation.
boolean util_str_to_hex( const char * str, uint32 * ret_val );



#endif
