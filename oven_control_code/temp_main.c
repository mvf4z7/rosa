#include <stdio.h>
#include <signal.h>
#include <time.h>
#include <unistd.h>
#include "stdio.h"
#include "pruio.h" // include header
#include "pruio_pins.h"

#include "mpu_types.h"
#include "mpu_util.h"
#include "mpu_timer.h"
#include "mpu_cJSON.h"

#define WAIT_TIME 2000

static boolean s_force_stop;

static void signalHandler( int signal );

int main( int argc, char *argv[] ) 
{
    uint32 cur_time;
    uint32 start_time;
    float temp;
    char print_string[ 500 ];
    
    s_force_stop = FALSE;
    cur_time = 0;
    start_time = 0;
    
    timer_init();
    
    //Set up signal handler:
    if( signal( SIGINT, signalHandler ) == SIG_ERR )
    {
        util_print_debug( "MPU: Error setting up ctrl-c interrupt.\n" );
        return( -1 );
    }
    
    pruIo *io = pruio_new(PRUIO_DEF_ACTIVE, 0x98, 0, 1); 
    
    if( pruio_config( io, 1, 0x1FE, 0, 4 ) ) 
    {       
        sprintf( print_string, "config failed (%s)\n", io->Errr );
        util_print_debug( print_string ); 
        return( -1 );
    }
    
    
    while( !s_force_stop )
    {
        
        temp = util_calc_temp( io->Adc->Value[ 1 ] );
        
        util_print_temp( temp );
        
        //block for 2 seconds.
        while( ( cur_time - start_time <= WAIT_TIME ) && !s_force_stop )
        {
            if( !timer_get( &cur_time ) )
            {
                printf( "There was an error with the timer.\n" );
                return( 0 );
            }
        }
        
        start_time = start_time + WAIT_TIME;
    }
    
    
    return( 0 );
}


static void signalHandler( int signal )
{  
    s_force_stop = TRUE;
    util_print_debug( "Received kill code." );
    return;
}