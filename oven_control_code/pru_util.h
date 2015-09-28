#ifndef PRU_UTIL_H
#define PRU_UTIL_H

#define setbit( val, i )     ( val | ( 1 << i ) )
#define clrbit( val, i )     ( val & ( ~( 1 << i ) ) )

#define INC_INDEX( i, max );     i++; if( i >= max ) i = 0;

#endif
