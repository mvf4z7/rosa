#include "pru_types.h"
#include "pru_timer.h"
#include "pru_cfg.h"
#include "pru_ctrl.h"
#include "pru_util.h"
#include "pru_print.h"

#define CLK_ENABLE 2
#define PRU0_CTRL_REG_ADDR  0x00022000

/* Mapping Constant table register to variable */
volatile pruCfg cfg __attribute__((cregister("PRU_CFG", near), peripheral));
volatile pruCtrl * pru0_ctrl;

uint32 g_cur_time;            /* The current time in ms. Overflows every 49 days. */
uint32 g_last_cnt;           /* The last time the clock cycle count was checked. */


void tmr_init()
{
    g_cur_time = 0;
    g_last_cnt = 0;
    pru0_ctrl = (volatile pruCtrl * )PRU0_CTRL_REG_ADDR;
    pru0_ctrl->CYCLE = 0;
    cfg.CGR_bit.PRU0_CLK_EN = TRUE;
    pru0_ctrl->CONTROL_bit.CTR_EN = TRUE;
    
    /* Clock reset and enable: */
    tmr_reset_cntr();
    
}

uint32 tmr_get_clks_since( uint32 cur_time, uint32 last_time )
{
    /* The count overflows every ~21 seconds. This should give a correct result
       as long as the last_time was less than 21 seconds ago.
    */
    tmr_reset_cntr();
    return( cur_time - last_time );    
}

uint32 tmr_get_cnt()
{
    tmr_update_time();
    tmr_reset_cntr();
    return( pru0_ctrl->CYCLE );
}

uint32 tmr_get_time()
{
    tmr_update_time();
    return( g_cur_time );  
}

void tmr_reset_cntr()
{
    /* The clock is disabled upon overflow, so re-enable it. */
    if( pru0_ctrl->CONTROL_bit.CTR_EN == FALSE )
    {
        pru0_ctrl->CYCLE = 0;
        cfg.CGR_bit.PRU0_CLK_EN = TRUE;
        pru0_ctrl->CONTROL_bit.CTR_EN = TRUE;
    }
}

void tmr_update_time()
{
    uint32 cur_cnt;
    uint32 ms_since_last;
    
    cur_cnt = pru0_ctrl->CYCLE;
    ms_since_last = ( cur_cnt - g_last_cnt ) / ( CYCLES_PER_MS );
    
    if( ms_since_last >= 1 )
    {
        g_cur_time = g_cur_time + ms_since_last;        
        g_last_cnt = cur_cnt;
    }
    tmr_reset_cntr();
    
}
