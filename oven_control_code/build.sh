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
        clpru --silicon_version=2 -Ooff --define=PRU_BLD --float_operations_allowed=32 pru_*.c -z PRU_lnk.cmd -o pru_prog.elf -m pru_test.map
        hexpru bin.cmd pru_prog.elf
    fi

    if [ $ARGS == "mpu" ]
    then
        gcc -Wall mpu_main.c -o mpu_prog.elf -lpthread -lpruio
    fi

    if [ $ARGS == "init" ]
    then
        echo EBB-PRU-Example > /sys/devices/bone_capemgr.*/slots
        echo libpruio > /sys/devices/bone_capemgr.9/slots
    fi

    if [ $ARGS == "run" ]
    then
        echo "Executing Program..."
        echo "-------------------------------"       
        ./mpu_prog.elf 
    fi
done

echo "Build Script Finished!"
echo "-------------------------------"
