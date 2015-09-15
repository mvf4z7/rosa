/******************************************************************************/
/*  AM3359_PRU.cmd                                                            */
/*    Description: This file is a sample linker command file that can be      */
/*    used for linking programs built with the PRU C compiler and running the */
/*    resulting .out file on an AM3359 PRU0. Use it as a guideline.  You will */
/*    want to change the memory layout to match your specific target system.  */
/*    You may want to change the allocation scheme according to the size of   */
/*    your program.                                                           */
/******************************************************************************/

-cr
-stack 0x100
-heap 0x100


MEMORY
{
    PAGE 0:
      PRUIMEM:   o = 0x00000000  l = 0x00001000  /* 4kB PRU0 Instruction RAM */
    PAGE 1:
      PRUDMEM:   o = 0x00000000  l = 0x00001000  /* 4kB PRU Data RAM 0 */
      PRINTMEM   origin = 0x00001000  length = 0x00001000 cregister=4 fill = 0x00   /* 4kB shared print memory */
}

SECTIONS
{
    .text          >  PRUIMEM, PAGE 0
    .stack         >  PRUDMEM, PAGE 1
    .bss           >  PRUDMEM, PAGE 1
    .cio           >  PRUDMEM, PAGE 1
    .const         >  PRUDMEM, PAGE 1
    .data          >  PRUDMEM, PAGE 1
    .switch        >  PRUDMEM, PAGE 1
    .sysmem        >  PRUDMEM, PAGE 1

}