#!/bin/bash

if [ $# == 0 ]
then
    echo "Arguments include: 'init' 'clean' 'pru' 'mpu' 'run' 'kill' 'temp'"
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
    
    if [ $ARGS == "temp" ]
    then
        echo "Building..."
        gcc -Wall -lrt temp_main.c mpu_util.c mpu_cJSON.c mpu_timer.c -o temp_measure.elf -lpthread -lpruio
    fi

    if [ $ARGS == "init" ]
    then
        echo "Initializing Pins..."
        echo 3 > /sys/class/gpio/export
        echo out > /sys/class/gpio/gpio3/direction
        echo 0 > /sys/class/gpio/gpio3/value
        echo "Initializing overlay..."
        echo libpruio > /sys/devices/bone_capemgr.9/slots
        echo "Changing working directory..."
        cd /root/desktop/git/rosa/server_and_app
        echo "Starting server..."
        nohup npm start &
        echo "done!"
    fi

    if [ $ARGS == "run" ]
    then     
        ./mpu_prog.elf ../server_and_app/profile.json
    fi

    if [ $ARGS == "kill" ]
    then
        echo 3 > /sys/class/gpio/export
        echo out > /sys/class/gpio/gpio3/direction
        echo 0 > /sys/class/gpio/gpio3/value
        pid=$(ps -acefl | grep npm | grep -v grep | awk '{ print $4; }')
        
        if [ $pid != "" ]
        then
             kill $pid
        fi
        fuser 8001/tcp -k
    fi
done

