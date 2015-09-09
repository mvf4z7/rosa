/*
This file contains data that will be shared with the main processor.
Any structs used here should be declared in shared.h
*/

#ifndef PRU_MEM_H
#define PRU_MEM_H

#include "shared.h"

/* PRU address of memory shared between PRUs.
    Size is 12KB.
*/
#define SHR_MEM 0x00010000


//shr_print * print_mem = SHR_MEM;



#endif
