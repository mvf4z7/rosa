#!/bin/bash

#Script for automatically getting the PRU entry point and executing the code:
ENTRY="$( dispru pru_test.out | grep _c_int00 | cut -f1 -d' ' )" 
HEX="0x"
echo Entry Point: $HEX$ENTRY
ENTRY_ADDR=$HEX$ENTRY

./mpu_test.out $ENTRY_ADDR
