#!/bin/bash

if [ $# == 0 ]
then
    echo "Arguments include: 'init' 'clean' 'pru' 'mpu' 'run'"
fi

for ARGS in $@
do
    if [ $ARGS == "clean" ]
    then
    rm *.elf
    fi

    if [ $ARGS == "mpu" ]
    then
        echo "Building..."
        gcc -Wall -lrt mpu_*.c -o mpu_prog.elf -lpthread -lpruio
    fi

    if [ $ARGS == "init" ]
    then
        echo "Initializing overlay..."
        echo libpruio > /sys/devices/bone_capemgr.9/slots
    fi

    if [ $ARGS == "run" ]
    then     
        ./mpu_prog.elf ../server_and_app/profile.json
    fi
done

