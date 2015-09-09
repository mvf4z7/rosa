#include <stdio.h>
#include "prussdrv.h"
#include "pruss_intc_mapping.h"
#define PRU_NUM 0


void main()
{

tpruss_intc_initdata pruss_intc_initdata = PRUSS_INTC_INITDATA;

prussdrv_init();
printf( "Initialized PRU.\n");
prussdrv_open( PRU_EVTOUT_0 );
printf( "Opened PRU.\n");
prussdrv_pruintc_init( &pruss_intc_initdata );

prussdrv_exec_program( PRU_NUM, "./pru_test.out" );

int n = prussdrv_pru_wait_event( PRU_EVTOUT_0 );
printf( "BBB PRU Program Done.\n" );
//prussdrv_pru_disable( PRU_NUM );
//prussdrv_exit();




}