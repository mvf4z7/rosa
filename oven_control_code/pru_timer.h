#ifndef PRU_TIMER_H
#define PRU_TIMER_H

#define CLK_SPD         ( 200000000 )           /* clock speed is 200 MHz */
#define CLKS_PER_MS     ( 1 )                   /* global clock resolution        */
#define CLKS_PER_S      ( 1000 )                /* timer counts per second        */
#define CYCLES_PER_MS   ( CLK_SPD / CLKS_PER_S )/* clock cycles per ms.           */
  

//Initializes timer globals and sets register values.
void tmr_init();

//Gets the number of clocks since an event.
uint32 tmr_get_clks_since( uint32 time, uint32 last_time );

//Gets the current clock cycle count. Counter overflows every ~20 seconds.
uint32 tmr_get_cnt();

//This function will return the current time in milliseconds.
uint32 tmr_get_time();

//The cycle counter overflows every 21 seconds. When it overflows it stops counting.
//This function will re-enable the counter if it has overflowed and should be called
//regularly to ensure an accurate clock.
void tmr_reset_cntr();

//This function updates the current time on the timer.
void tmr_update_time();

#endif
