


#include "pru_types.h"
#include "shared.h"
#include "pru_timer.h"
#include "pru_util.h"
#include "pru_pwm.h"

#pragma LOCATION( g_state_var, 0x00001000 )
uint8 g_state_var;

volatile register uint32 __R31, __R30;  


int main()
{
    
    g_state_var = RUNNING;
    tmr_init();
    pwm_init();
    
    pwm_set( .50f ); // Set the PWM duty cycle to 50% for 10s.
    while( tmr_get_time() < 10 * CLKS_PER_S )
        pwm_update();
    
    pwm_off(); //Turn off the PWM for 5 seconds.
    while( tmr_get_time() < 15 * CLKS_PER_S )
        pwm_update();
    
    pwm_set( .33f ); // Set the PWM duty cycle to 33% for 6 seconds.
    while( tmr_get_time() < 21 * CLKS_PER_S )
        pwm_update();
    
    pwm_set( .66f ); // Set the PWM duty cycle to 66% for 6 seconds.
    while( tmr_get_time() < 27 * CLKS_PER_S )
        pwm_update();
    
    pwm_off();
    
    /* Trigger the interrupt to halt the MPU program. */
    __R31 = 35;
    g_state_var = DONE_NO_ERR;
    __halt();
}
