#!/bin/bash

#Script for building the MPU:
gcc mpu_main.c -o mpu_test.out -lpthread -lprussdrv
