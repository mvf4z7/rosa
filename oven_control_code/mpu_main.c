#include <stdio.h>
#include <signal.h>
#include "prussdrv.h"
#include "pruss_intc_mapping.h"

#include "mpu_types.h"
#include "shared.h"
#include "mpu_util.h"

#define PRU_NUM 0
#define INC_INDEX( i, max );     i++; if( i >= max ) i = 0;


uint8 * g_state_var;
uint8   g_state_var_last;
uint32 * g_dbg_var;
uint32   g_dbg_var_last;

static void signalHandler( int signal );

int main( int argc, char *argv[] ) 
{

void * mem;
uint16 idx;
uint32 entry_addr;

//Set up signal handler:
if( signal( SIGINT, signalHandler ) == SIG_ERR )
{
    printf( "MPU: Error setting up ctrl-c interrupt.\n" );
}

if( argc != 2 )
{
    printf( "Incorrect number of arguments.\nOnly pass the entry point for the PRU program.\n" );
    return( 0 );
}

if( argv[ 1 ][ 0 ] != '0' || argv[ 1 ][ 1 ] != 'x' )
{
    printf( "Invalid format.\n Argument must start with '0x'\n" );
    return( 0 );
}

if( !util_str_to_hex( argv[ 1 ], &entry_addr ) )
{
    printf( "Error: There was an error parsing the entry point for the application." );
    return( 0 );
}

//printf( "PRU Entry Point: 0x%x\n", entry_addr );

/* Initialize PRU 0, load code and map shared memory. */
tpruss_intc_initdata pruss_intc_initdata = PRUSS_INTC_INITDATA;
prussdrv_init();
prussdrv_open( PRU_EVTOUT_0 );
prussdrv_pruintc_init( &pruss_intc_initdata );
prussdrv_load_datafile(PRUSS0_PRU0_DATARAM, "./data.bin");

prussdrv_map_prumem( PRUSS0_PRU0_DATARAM , &mem );
g_state_var = ( uint8 * )( ( (uint32)mem ) + STATE_VAR_OFST );
g_dbg_var = (uint32 * )( ( (uint32)mem ) + DBG_VAR_OFST );

*g_dbg_var = 0;
g_dbg_var_last = 0;
*g_state_var = 0;
g_state_var_last = 0;

prussdrv_exec_program_at(PRU_NUM, "./text.bin", entry_addr);


while( 1 )
{
    if( *g_dbg_var != g_dbg_var_last )
    {
        g_dbg_var_last = *g_dbg_var;
        printf( "Debug var: = %d\n", *g_dbg_var );
        fflush( stdout );
    }
    
    if( *g_state_var != g_state_var_last )
    {
        g_state_var_last = *g_state_var;
        printf( "State var = %x\n", *g_state_var );
        fflush( stdout );
        if( ( *g_state_var == DONE_NO_ERR ) || ( *g_state_var == DONE_ERR ) )
        {
            break;
        }
    }
    
        
}

prussdrv_pru_disable( PRU_NUM );
prussdrv_exit();
return( 0 );
}


static void signalHandler( int signal )
{
    prussdrv_pru_disable( PRU_NUM );
    prussdrv_exit();
    return;
}
