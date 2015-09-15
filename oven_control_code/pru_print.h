#ifndef PRU_PRINT_H
#define PRU_PRINT_H





//This function will store msg in the shared memory for the main processor to print.
void print_msg( const char * msg );

void init_print();




#endif
