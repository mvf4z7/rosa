#include <stdio.h>
#include <signal.h>
#include <time.h>
#include <unistd.h>
#include "stdio.h"
#include "pruio.h" // include header

#include "mpu_types.h"
#include "mpu_util.h"
#include "mpu_timer.h"

#define INC_INDEX( i, max );     i++; if( i >= max ) i = 0;

boolean force_stop;

static void signalHandler( int signal );

int main( int argc, char *argv[] ) 
{
    uint16 adc_val;
    float temp;
    float voltage;
    float amp_voltage;
    profile prf;
    uint32 cur_time;
    uint32 start_time;
    
    force_stop = FALSE;
    
    timer_init();
    
    if( argc != 2 )
    {
        printf( "Error: The only argument is the path to the JSON file.\n" );
        return( -1 );
    }
    
    //Set up signal handler:
    if( signal( SIGINT, signalHandler ) == SIG_ERR )
    {
        printf( "MPU: Error setting up ctrl-c interrupt.\n" );
        return( -1 );
    }
    
    if( !util_load_profile( argv[ 1 ], &prf ) )
    {
        printf( "Error: There was an error loading the profile.\n" );
        return( -1 );
    }
   
    pruIo *io = pruio_new(PRUIO_DEF_ACTIVE, 0x98, 0, 1); 
    if (pruio_config(io, 1, 0x1FE, 0, 4))
    { 
        printf("config failed (%s)\n", io->Errr);
        return( -1 );
    }

    start_time = 0;
    cur_time = 0;
    
    while( !force_stop )
    {
        
        printf( "%s\n\n", util_get_json_string( cur_time, temp, temp - 1 ) );
        fflush( stdout );
        adc_val = io->Adc->Value[ 1 ];
        voltage = (float)( adc_val ) / 0xFFF0 * 1.8;
        amp_voltage = 2 * voltage;
        temp = ( amp_voltage - 1.25 ) / 0.005;
        
        //block for 1 second.
        while( cur_time - start_time <= 1000 )
        {
            if( !timer_get( &cur_time ) )
            {
                printf( "There was an error with the timer.\n" );
                return( 0 );
            }
        }
        
        start_time = start_time + 1000;
    }   
    
    pruio_destroy(io);        /* destroy driver structure */
    
    return 0;
}


static void signalHandler( int signal )
{  
    force_stop = TRUE;
    return;
}
