#include <stdio.h>
#include <signal.h>
#include <time.h>
#include "stdio.h"
#include "pruio.h" // include header

#include "mpu_types.h"
#include "shared.h"
#include "mpu_util.h"

#define PRU_NUM 0
#define INC_INDEX( i, max );     i++; if( i >= max ) i = 0;

boolean force_stop;
uint8 * g_state_var;
uint8   g_state_var_last;
uint32 * g_dbg_var;
uint32   g_dbg_var_last;

static void signalHandler( int signal );

int main( int argc, char *argv[] ) 
{
    uint16 adc_val;
    float temp;
    float voltage;
    float amp_voltage;
    
    pruIo *io = pruio_new(PRUIO_DEF_ACTIVE, 0x98, 0, 1); 
    if (pruio_config(io, 1, 0x1FE, 0, 4))
    { 
        printf("config failed (%s)\n", io->Errr);
    }
    else 
    {
        adc_val = io->Adc->Value[ 1 ];
        voltage = (float)( adc_val ) / 0xFFF0 * 1.8;
        amp_voltage = 2 * voltage;
        temp = ( amp_voltage - 1.25 ) / 0.005;
        printf( "--------------------------------\n" );
        printf( "ADC value: %x\n", adc_val );
        printf( "ADC voltage: %f\n", voltage );
        printf( "Amp voltage: %f\n", amp_voltage );
        printf( "Current temperature C: %.2f\n", temp );
        printf( "Current temperature F: %.2f\n", ( temp * 1.8 ) + 32 );
        printf( "--------------------------------\n" );
        
    }
    
    pruio_destroy(io);        /* destroy driver structure */
    
    return 0;
}


static void signalHandler( int signal )
{
    time_t timer;
    
    //Get the current time:
    time( &timer );
    
    //Disable PRU:
    *g_state_var = FORCE_STOP;
    
    //Block until the PRU responds or 5 secs have passed:
    while( ( *g_state_var != DONE_NO_ERR ) && (*g_state_var != DONE_ERR ) && ( difftime( timer, time( NULL ) ) < 5 ) );
    
    force_stop = TRUE;
    return;
}
