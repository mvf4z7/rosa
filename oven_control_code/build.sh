#!/bin/bash

if [ $# == 0 ]
then
    echo "Arguments include: 'init' 'clean' 'pru' 'mpu' 'run'"
fi

for ARGS in $@
do
    if [ $ARGS == "clean" ]
    then
    rm *.obj *.map *.elf *.bin
    fi

    if [ $ARGS == "pru" ]
    then
        clpru --silicon_version=2 -Ooff --multibyte_chars --printf_support=minimal pru0_main.c pru_print.c -z PRU_lnk.cmd -o pru_prog.elf -m pru_test.map
        hexpru bin.cmd pru_prog.elf
    fi

    if [ $ARGS == "mpu" ]
    then
        gcc mpu_main.c -o mpu_prog.elf -lpthread -lprussdrv
    fi

    if [ $ARGS == "init" ]
    then
        echo EBB-PRU-Example > /sys/devices/bone_capemgr.*/slots
    fi

    if [ $ARGS == "run" ]
    then
        ENTRY="$( dispru pru_prog.elf | grep _c_int00 | cut -f1 -d' ' )" 
        HEX="0x"
        echo Entry Point: $HEX$ENTRY
        ENTRY_ADDR=$HEX$ENTRY
        ./mpu_prog.elf $ENTRY_ADDR
    fi
done
