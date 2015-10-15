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

    if [ $ARGS == "mpu" ]
    then
        gcc -Wall -lrt mpu_*.c -o mpu_prog.elf -lpthread -lpruio
    fi

    if [ $ARGS == "init" ]
    then
        #echo EBB-PRU-Example > /sys/devices/bone_capemgr.*/slots
        echo libpruio > /sys/devices/bone_capemgr.9/slots
    fi

    if [ $ARGS == "run" ]
    then
        echo "Executing Program..."
        echo "-------------------------------"       
        ./mpu_prog.elf ../server_and_app/profile.json
    fi
done

echo "Build Script Finished!"
echo "-------------------------------"
