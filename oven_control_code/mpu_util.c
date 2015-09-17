
#include <stdio.h>
#include <string.h>

#include "mpu_types.h"
#include "mpu_util.h"

#define CHAR_0     0x30
#define CHAR_9     0x39
#define CHAR_A     0x41
#define CHAR_F     0x46
#define CHAR_a     0x61
#define CHAR_f     0x66

boolean util_str_to_hex( const char * str, uint32 * ret_val )
{
    uint8  idx;
    uint32 value;
    
    idx = 2;
    value = 0;
    while( str[ idx ] != 0 )
    {
        value = value << 4;
        
        if( idx >= 10 )
        {
            printf( "Address must be a hex value, no more than eight characters long.\n" );
            return( FALSE );
        }
      
        
        if( str[ idx ] >= CHAR_0 && str[ idx ] <= CHAR_9 )
        {
            value = value + ( str[ idx ] - CHAR_0 );        
        }
        else if( str[ idx ] >= CHAR_A && str[ idx ] <= CHAR_F )
        {
            value = value + ( str[ idx ] - CHAR_A + 10 );
        }
        else if( str[ idx ] >= CHAR_a && str[ idx ] <= CHAR_f )
        {
            value = value + ( str[ idx ] - CHAR_a + 10 );
        }
        else
        {
            printf( "Invalid character specified in input argument.\n" );
            return( FALSE );
        }
        idx++;
    }

    *ret_val = value;
}