


#include "pru_types.h"
#include "shared.h"
#include "pru_timer.h"
#include "pru_util.h"
#include "pru_pwm.h"
#include "pru_dbg.h"

#pragma LOCATION( g_state_var, 0x00001000 )
uint8 g_state_var;

#pragma LOCATION( g_profile, 0x00001005 );
profile_shr_mem g_profile;

volatile register uint32 __R31, __R30;  


int main()
{
    boolean done;
    
    done = FALSE;
    g_state_var = RUNNING;
    tmr_init();
    pwm_init();
    dbg_init();
    
    dbg_set( g_profile.num_lines );
    pwm_set( .50f ); // Set the PWM duty cycle to 50% for 10s.
    while( !done )
    {
        switch( g_state_var )
        {
        case IDLE:
            g_state_var = DONE_ERR;
            done = TRUE;
            break;
        case FORCE_STOP:
            g_state_var = DONE_NO_ERR;
            pwm_off();
            done = TRUE;
            break;
        case DONE_ERR:
            done = TRUE;
            pwm_off();
            break;
        case DONE_NO_ERR:
            done = TRUE;
            pwm_off();
            break;
        case RUNNING:
            pwm_update();
            break;
        }
        
    }
    
    pwm_off();
    
    /* Trigger the interrupt to halt the MPU program. */
    __R31 = 35;
    g_state_var = DONE_NO_ERR;
    __halt();
}
