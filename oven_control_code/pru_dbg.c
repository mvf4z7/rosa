
#include "pru_types.h"
#include "shared.h"
#include "pru_dbg.h"

#pragma LOCATION( g_dbg_var, 0x00001001 )
volatile uint32 g_dbg_var;

void dbg_init()
{
    g_dbg_var = 0; 
}


void dbg_set( uint32 val )
{
    g_dbg_var = val;   
}

uint32 dbg_get()
{
    return( g_dbg_var );
}
