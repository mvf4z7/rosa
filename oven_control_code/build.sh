#!/bin/bash

echo "-------------------------------"
echo "Build Script Starting!"

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
        clpru --silicon_version=2 -Ooff --define=PRU_BLD --printf_support=minimal pru_*.c -z PRU_lnk.cmd -o pru_prog.elf -m pru_test.map
        hexpru bin.cmd pru_prog.elf
    fi

    if [ $ARGS == "mpu" ]
    then
        gcc -D MPU_BLD mpu_*.c -o mpu_prog.elf -lpthread -lprussdrv
    fi

    if [ $ARGS == "init" ]
    then
        echo EBB-PRU-Example > /sys/devices/bone_capemgr.*/slots
    fi

    if [ $ARGS == "run" ]
    then
        ENTRY="$( dispru pru_prog.elf | grep _c_int00 | cut -f1 -d' ' )" 
        HEX="0x"
        ENTRY_ADDR=$HEX$ENTRY
        echo "Executing Program..."
        echo "-------------------------------"       
        ./mpu_prog.elf $ENTRY_ADDR
    fi
done

echo "Build Script Finished!"
echo "-------------------------------"
