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
#define DBG_VAR_SZ      4

/* Line shared memory variable is not yet defined in the PRU. */
#define LINE_MEM_OFST   ( DBG_VAR_OFST + DBG_VAR_SZ ) 
        //Offset was added to align the memory to a 4-byte boundary  
#define LINE_MEM_SZ     484
        //Determined via experiment.

#define MAX_LINES       20    

enum
{
    IDLE = 0,
    FORCE_STOP,
    RUNNING,
    DONE_NO_ERR, 
    DONE_ERR
};

enum
{
    START = 0,
    STOP
};

typedef struct
{
    uint32 time;    //Time in ms.
    float temp;     //Temp in Celsius.
} point;

typedef struct
{
    point pts[ 2 ]; //Starting point and ending point.
    float m;        //Slope between the lines.
    float b;        //Y-intercept.
} line;

typedef struct
{
    line lines[ 20 ];
    uint32 num_lines;
} profile_shr_mem;

#endif
