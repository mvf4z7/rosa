#!/bin/bash

#Script for building the PRU:
clpru --silicon_version=2 -Ooff --multibyte_chars --printf_support=minimal pru0_main.c pru_print.c -z PRU_lnk.cmd -o pru_test.out -m pru_test.map

hexpru bin.cmd pru_test.out
