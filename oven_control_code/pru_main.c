


#include "pru_types.h"
#include "shared.h"
#include "pru_print.h"
#include "pru_timer.h"
#include "pru_util.h"


volatile register uint32 __R31, __R30;  


int main()
{
    uint32 last_flip;
    
    init_print();
    tmr_init();
    
    
    last_flip = tmr_get_time();
    
    while( tmr_get_time() < 10 * CLKS_PER_S )
    {
        
        if( tmr_get_time() - last_flip > 2 * CLKS_PER_S )
        {
            print_msg( "Hello World!" );
            __R30 ^= setbit( 5 );
            last_flip = tmr_get_time();
        }
 
    }
    print_msg( "Hello World!" ); 
    /* Trigger the interrupt to halt the MPU program. */
    __R31 = 35;
    __halt();
}
