#include <stdio.h>
#include "prussdrv.h"
#include "pruss_intc_mapping.h"

#include "pru_types.h"
#include "shared.h"

#define PRU_NUM 0
#define SHR_MEM_OFST  0x00001000
#define INC_INDEX( i, max );     i++; if( i >= max ) i = 0;
#define CHAR_0     0x30
#define CHAR_9     0x39
#define CHAR_A     0x41
#define CHAR_F     0x46
#define CHAR_a     0x61
#define CHAR_f     0x66

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

idx = 2;
entry_addr = 0;
while( argv[ 1 ][ idx ] != 0 )
{
    entry_addr = entry_addr << 4;
    
    if( idx >= 10 )
    {
        printf( "Address must be a hex value, no more than eight characters long.\n" );
        return( 0 );
    }
  
    
    if( argv[ 1 ][ idx ] >= CHAR_0 && argv[ 1 ][ idx ] <= CHAR_9 )
    {
        entry_addr = entry_addr + ( argv[ 1 ][ idx ] - CHAR_0 );        
    }
    else if( argv[ 1 ][ idx ] >= CHAR_A && argv[ 1 ][ idx ] <= CHAR_F )
    {
        entry_addr = entry_addr + ( argv[ 1 ][ idx ] - CHAR_A );
    }
    else if( argv[ 1 ][ idx ] >= CHAR_a && argv[ 1 ][ idx ] <= CHAR_f )
    {
        entry_addr = entry_addr + ( argv[ 1 ][ idx ] - CHAR_a );
    }
    else
    {
        printf( "Invalid character specified in input argument.\n" );
        return( 0 );
    }
    idx++;
}


tpruss_intc_initdata pruss_intc_initdata = PRUSS_INTC_INITDATA;

prussdrv_init();
printf( "Initialized PRU.\n");

prussdrv_open( PRU_EVTOUT_0 );
printf( "Opened PRU.\n");
//printf( "PRU Version: %s\n", prussdrv_strversion( prussdrv_version() ) );
prussdrv_pruintc_init( &pruss_intc_initdata );
prussdrv_load_datafile(PRUSS0_PRU0_DATARAM, "./data.bin");

prussdrv_map_prumem( PRUSS0_PRU0_DATARAM , &mem );
shr = (shr_print *)( (uint32)mem + SHR_MEM_OFST );

//shr->read_idx = 0;
//shr->write_idx = 0;
//shr->data[ 0 ] = 0;

printf( "Read Idx: %u\n", shr->read_idx );
printf( "Write Idx: %u\n", shr->write_idx );

/*for( idx = 0; idx < 512; idx++ )
{
     if( shr->data[ idx ]  != 0 )
     {
          printf("\tIndex: %u\n\tValue: 0x%x\n\n", idx, shr->data[ idx ] );
          shr->data[ idx ] = 0;
     }


}*/

//prussdrv_exec_program( PRU_NUM, "./text.bin" );
prussdrv_exec_program_at(PRU_NUM, "./text.bin", entry_addr);

printf( "Shared Mem: 0x%x\n", (uint32)shr );

printf( "Finished waiting for initialization.\n" );

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
    
     /*else if( shr->data[ 0 ] != 0 )
     {
          printf( "Writing data...\n" );
           printf( (uint8 *)&shr->data );
     }*/
        
    printf( "printing data\n" );    
    printf( print_buf );
    }    
    
    
    
}

int n = prussdrv_pru_wait_event( PRU_EVTOUT_0 );
printf( "BBB PRU Program Done.\n" );
prussdrv_pru_disable( PRU_NUM );
prussdrv_exit();




}
