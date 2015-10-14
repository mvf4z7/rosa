#ifndef MPU_TYPES_H
#define MPU_TYPES_H

#define FALSE 0
#define TRUE  1

#define MAX_LINES       20   

enum
{
    START = 0,
    STOP
};

/*
These definitions were determined through experimentation.
*/
typedef unsigned char   uint8;
typedef signed char     sint8;
typedef unsigned short  uint16;
typedef signed short    sint16;
typedef unsigned int    uint32;
typedef signed int      sint32;
typedef unsigned char   boolean; 



typedef struct
{
    uint32 time;    //Time in ms.
    float temp;     //Temp in Celsius.
} point;

typedef struct
{
    point pts[ 2 ]; //Starting point and ending point.
    float m;        //Slope between the lines.
    float b;        //Y-intercept.
} line;

typedef struct
{
    line lines[ 20 ];
    uint32 num_lines;
} profile;


#endif
