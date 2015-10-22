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
#include "mpu_pid.h"

#define INC_INDEX( i, max );     i++; if( i >= max ) i = 0;

#define P_OUT           P9_21
#define PWM_FREQ        0.5f
#define PWM_PERIOD      ( 1 / PWM_FREQ )
#define PWM_PERIOD_MS   ( PWM_PERIOD * 1000 )

boolean force_stop;

static void signalHandler( int signal );

int main( int argc, char *argv[] ) 
{
    float temp;
    uint32 cur_time;
    uint32 start_time;
    float duty_cycle;
    float target_temp;
    char print_string[ 200 ];
    
    force_stop = FALSE;
    
    timer_init();
    
    if( argc != 2 )
    {
        util_print_debug( "Error: The only argument is the path to the JSON file.\n" );
        return( -1 );
    }
    
    //Set up signal handler:
    if( signal( SIGINT, signalHandler ) == SIG_ERR )
    {
        util_print_debug( "MPU: Error setting up ctrl-c interrupt.\n" );
        return( -1 );
    }
    
    if( !pid_init( argv[ 1 ] ) )
    {
        util_print_debug( "Error: There was an error loading the profile.\n" );
        return( -1 );
    }
   
    pruIo *io = pruio_new(PRUIO_DEF_ACTIVE, 0x98, 0, 1); 

    start_time = 0;
    cur_time = 0;
    duty_cycle = 1.0;
    pruio_pwm_setValue( io, P_OUT, PWM_FREQ, duty_cycle );
    
    if( pruio_config( io, 1, 0x1FE, 0, 4 ) ) 
    {       
        sprintf( print_string, "config failed (%s)\n", io->Errr );
        util_print_debug( print_string ); 
        return( -1 );
    }
    
    while( !force_stop )
    {
        temp = util_calc_temp( io->Adc->Value[ 1 ] );
        target_temp = pid_find_target( cur_time / 1000.0 );
        duty_cycle = pid_calc( target_temp, temp );
        
        if( duty_cycle == -1 )
        {
            force_stop = TRUE;
        }
        
        pruio_pwm_setValue( io, P_OUT, -1, duty_cycle );
        
        util_print_point( cur_time / 1000, target_temp, temp );
               
        //block for 2 seconds.
        while( ( cur_time - start_time <= PWM_PERIOD_MS ) && !force_stop )
        {
            if( !timer_get( &cur_time ) )
            {
                printf( "There was an error with the timer.\n" );
                return( 0 );
            }
        }
        
        start_time = start_time + PWM_PERIOD_MS;
    }   
    
    pruio_pwm_setValue( io, P_OUT, -1, 0.0f );
    
    pruio_destroy(io);        /* destroy driver structure */
    
    return 0;
}


static void signalHandler( int signal )
{  
    force_stop = TRUE;
    return;
}
