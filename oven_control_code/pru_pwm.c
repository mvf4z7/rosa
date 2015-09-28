

#include "pru_types.h"
#include "pru_pwm.h"
#include "pru_timer.h"
#include "pru_util.h"

#define PWM_PERIOD  ( 3 * CLKS_PER_S )  /* The PWM module uses the s/w ms timer. */

volatile register uint32 __R30; 

static float    s_pwm_setting;  /* Current PWM setting. */
static uint32   s_flip_val;     /* Indicates how long the pin should be on in ms. */
static uint32   s_pwm_start;    /* The last time the pin was flipped.       */
static uint32   s_next_start;   /* The next time the pin should be flipped. */
static boolean  s_pwm_on;       /* Indicates if the PWM has been set.       */

void pwm_init()
{
    s_pwm_setting = 0;
    s_flip_val = 0;
    s_pwm_start = 0;
    s_next_start = 0;
    s_pwm_on = FALSE;
    __R30 = clrbit( __R30, 5 ); // Initialize PWM output to off.

    return;
}

float pwm_get()
{
    return( s_pwm_setting );
}

void pwm_off()
{
    pwm_init();
    return;
}

void pwm_set( float val )
{
    s_pwm_on = TRUE;
    s_pwm_setting = val;
    
    s_flip_val = (uint32)( s_pwm_setting * PWM_PERIOD );
    s_pwm_start = tmr_get_time();
    s_next_start = s_pwm_start + (uint32)PWM_PERIOD;
    __R30 = setbit( __R30, 5 );
    
    return;
}

void pwm_update()
{
    uint32 cur_time;
    
    if( s_pwm_on )
    {
        cur_time = tmr_get_time();
        
        if( cur_time >= s_next_start )
        {
            s_pwm_start = cur_time;
            s_next_start = cur_time + (uint32)PWM_PERIOD;
        }
        
        if( cur_time < s_pwm_start + s_flip_val )
        {
            __R30 = setbit( __R30, 5 );
        }
        else
        {
            __R30 = clrbit( __R30, 5 );
        }
    }
    return; 
}
