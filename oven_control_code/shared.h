#ifndef SHARED_H
#define SHARED_H

#include "pru_types.h"



#define PRINT_MEM_SZ 512

typedef volatile struct
{
    uint32  read_idx;
    uint32  write_idx;
    uint8   data[ PRINT_MEM_SZ ];  
} shr_print;







#endif
