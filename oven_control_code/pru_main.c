


#include "pru_types.h"
#include "shared.h"
#include "pru_timer.h"
#include "pru_util.h"
#include "pru_dbg.h"

#pragma LOCATION( g_state_var, 0x00001000 )
uint8 g_state_var;

volatile register uint32 __R31, __R30;  


int main()
{
    uint32 last_flip;
    
    g_state_var = RUNNING;
    tmr_init();
    dbg_init();
    
    dbg_set( ( __R30 >> 5 ) & 0x01 );
    last_flip = tmr_get_time();
    
    while( tmr_get_time() < 240 * CLKS_PER_S )
    {
        
        if( tmr_get_time() - last_flip > 3 * CLKS_PER_S )
        {
            __R30 ^= setbit( 5 );
            dbg_set( ( __R30 >> 5 ) & 0x01 );
            last_flip = tmr_get_time();
        }
 
    }
    /* Trigger the interrupt to halt the MPU program. */
    __R31 = 35;
    __R30 = __R30 & ( ~setbit( 5 ) );
    g_state_var = DONE_NO_ERR;
    __halt();
}
