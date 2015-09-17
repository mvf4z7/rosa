#include <stdio.h>
#include "prussdrv.h"
#include "pruss_intc_mapping.h"

#include "mpu_types.h"
#include "shared.h"
#include "mpu_util.h"

#define PRU_NUM 0
#define SHR_MEM_OFST  0x00001000
#define INC_INDEX( i, max );     i++; if( i >= max ) i = 0;


shr_print * shr;
uint8       print_buf[ 512 ];

int main( int argc, char *argv[] ) 
{

void * mem;
uint16 idx;
uint32 entry_addr;

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

printf( "PRU Entry Point: 0x%x\n", entry_addr );

/* Initialize PRU 0, load code and map shared memory. */
tpruss_intc_initdata pruss_intc_initdata = PRUSS_INTC_INITDATA;
prussdrv_init();
prussdrv_open( PRU_EVTOUT_0 );
prussdrv_pruintc_init( &pruss_intc_initdata );
prussdrv_load_datafile(PRUSS0_PRU0_DATARAM, "./data.bin");

prussdrv_map_prumem( PRUSS0_PRU0_DATARAM , &mem );
shr = (shr_print *)( (uint32)mem + SHR_MEM_OFST );

prussdrv_exec_program_at(PRU_NUM, "./text.bin", entry_addr);
printf( "Initialized PRU.\n");


while( 1 )
{
    if( shr->read_idx != shr->write_idx )
    {
        printf( "Write Index: %d\n", shr->write_idx );
        printf( "Read Index: %d\n", shr->read_idx );
        printf( "Copying data...\n" );
        idx = 0;
        while( shr->read_idx != shr->write_idx )
        {
            printf( "\tV: 0x%x\n", shr->data[ shr->read_idx ] );
            print_buf[ idx ] = shr->data[ shr->read_idx ];
            idx++;
            INC_INDEX( shr->read_idx, 512 );
            
        }
        if( print_buf[ idx ] != 0 )
        {
            print_buf[ idx ] = 0;
            idx++;
        }
        
    printf( "printing data\n" );    
    printf( print_buf );
    }

    /*if( prussdrv_pru_event_fd( PRU_EVTOUT_0 ) != 0 )
    {
        prussdrv_pru_clear_event ( PRU0_ARM_INTERRUPT, PRU_EVTOUT0 );
        printf( "Received finish event.\nClosing!\n" );
        break;
    }*/
        
}

prussdrv_pru_disable( PRU_NUM );
prussdrv_exit();
return( 0 );
}
