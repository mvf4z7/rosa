#ifndef MPU_UTIL_H
#define MPU_UTIL_H

#include "mpu_types.h"

enum
{
    POINT,
    DEBUG_MSG
};

//This function will convert the string parameter with the format: "0xdddddddd"
//into its integer representation.
boolean util_str_to_hex( const char * str, uint32 * ret_val );

//This function will open the .json file at path and load the object into shared
//memory allocated specifically for this purpose. If it returns false there was
//an error.
boolean util_load_profile( const char * path, profile * mem );

//Function for generating a JSON string, based on the given parameter values.
//Returns a readable string in JSON format.
char* util_get_json_string(uint32 time, float target, float temperature);

char * util_print_debug( const char * string );

#endif
