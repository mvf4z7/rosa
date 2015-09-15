#include "pru_types.h"
#include "shared.h"
#include "pru_mem.h"


#define LF 0x0A

#define INC_INDEX( i, max );     i++; if( i >= max ) i = 0;

//volatile shr_print print_mem __attribute__((cregister("PRINTMEM")));
#pragma LOCATION( print_mem, 0x00001000 )
volatile shr_print print_mem;

void print_msg( const char * msg )
{
    uint8 cnt;
    boolean done;
    
    done = FALSE;
    cnt = 0;
    
    //Store message in shared print memory:
    while( !done )
    {
        if( msg[ cnt ] != NULL )
        {
            print_mem.data[ print_mem.write_idx ] = msg[ cnt ];
            cnt++;
            INC_INDEX( print_mem.write_idx, PRINT_MEM_SZ ); 
        }
        else
        {
            done = TRUE;
        }
    }
    
    print_mem.data[ print_mem.write_idx ] = LF;
    INC_INDEX( print_mem.write_idx, PRINT_MEM_SZ ); 
    print_mem.data[ print_mem.write_idx ] = NULL;
    INC_INDEX( print_mem.write_idx, PRINT_MEM_SZ ); 
    
    return;
}

void init_print()
{
print_mem.write_idx = 0;
print_mem.read_idx = 0;

}
