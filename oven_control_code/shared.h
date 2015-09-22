#ifndef SHARED_H
#define SHARED_H

#ifdef PRU_BLD
#include "pru_types.h"
#else
#include "mpu_types.h"
#endif

#define SHR_MEM_OFST  0x00001000

/* State variable is defined in pru_main.c. */
#define STATE_VAR_OFST  ( SHR_MEM_OFST + 0 )
#define STATE_VAR_SZ    1

/* Debug variable is defined in pru_dbg.c */
#define DBG_VAR_OFST    ( STATE_VAR_OFST + STATE_VAR_SZ )
#define DBG_VAR_SZ      1       


enum
{
    IDLE = 0x00,
    RUNNING = 1,
    DONE_NO_ERR = 2,
    DONE_ERR = 3
};




#endif
