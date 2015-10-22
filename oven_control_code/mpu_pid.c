#include <stdio.h>
#include <string.h>

#include "mpu_types.h"
#include "mpu_pid.h"
#include "mpu_cJSON.h"

#define CON_PRO   0.5f       //Proportional constant
#define CON_INT   0.5f       //Integral constant
#define CON_DER   0.125f     //Derivative constant

#define CON_1     ( CON_PRO + CON_INT + CON_DER )
#define CON_2     ( -CON_PRO - ( 2 * CON_DER ) )
#define CON_3     ( CON_DER )

#define MAX_JSON_SZ 2500  //Maximum size of the JSON object.

static char json_string[ MAX_JSON_SZ ];

static profile s_profile;
static float s_error_vals[ 2 ];
static float s_prev_duty;

boolean pid_init( const char * path )
{
    boolean done;
    FILE * fp;
    uint16 idx;
    char cur_char;
    cJSON * json;
    cJSON * line;
    cJSON * point;
    uint8 num_lines;

    s_error_vals[ 0 ] = 0;
    s_error_vals[ 1 ] = 0;
    s_prev_duty = 1.0;
    
    fp = fopen( path, "r" );

    if( fp == NULL )
    {
        printf( "Error opening JSON file.\nPath=%s\n", path );
        return( FALSE );
    }

    //Read the JSON file into a C-string:
    done = FALSE;
    idx = 0;
    while( !done )
    {
        cur_char = fgetc( fp );
        if( !feof( fp ) )
        {
            json_string[ idx ] = cur_char;
            idx++;
            if( idx == MAX_JSON_SZ )
            {
                printf( "Error JSON is too large.\n" );
                return( FALSE );
            }
        }
        else
        {
            done = TRUE;
            json_string[ idx ] = 0;
        }
    }

    //Parse the string representation of the JSON file.
    json = cJSON_Parse( json_string );

    //printf( "%s profile loaded.\n", cJSON_GetObjectItem( json, "name" )->valuestring );

    json = cJSON_GetObjectItem( json, "lines" );
    num_lines = cJSON_GetArraySize( json );
    if( num_lines > MAX_LINES )
    {
        printf( "Error: Too many lines. %d lines found.\n", num_lines );
        return( FALSE );
    }

    s_profile.num_lines = num_lines;

    for( idx = 0; idx < num_lines; idx++ )
    {
        line = cJSON_GetArrayItem( json, idx );
        if( line == NULL )
        {
            printf( "Error retrieving item %d from array of lines.\n", idx );
            fflush( stdout );
            return( FALSE );
        }

        //Read in the starting point data:
        point = cJSON_GetObjectItem( line, "start" );
        s_profile.lines[ idx ].pts[ START ].time = (uint32) ( cJSON_GetObjectItem( point, "x" )->valueint );
        s_profile.lines[ idx ].pts[ START ].temp = (float) cJSON_GetObjectItem( point, "y" )->valuedouble;

        //Read in the ending point data:
        point = cJSON_GetObjectItem( line, "stop" );
        s_profile.lines[ idx ].pts[ STOP ].time = (uint32) ( cJSON_GetObjectItem( point, "x" )->valueint );
        s_profile.lines[ idx ].pts[ STOP ].temp = (float) cJSON_GetObjectItem( point, "y" )->valuedouble;

        //Read in the slope of the line:
        s_profile.lines[ idx ].m = (float) ( cJSON_GetObjectItem( line, "m" )->valuedouble );

        //Read in the y-intercept of the line:
        s_profile.lines[ idx ].b = (float) ( cJSON_GetObjectItem( line, "b" )->valuedouble );
    }

    return( TRUE );
}

float pid_calc( float targ, float cur_temp )
{
    float ret_duty;
    float cur_error;
    
    if( targ == 0 )
    { 
        return( -1 );
    }
    
    cur_error = targ - cur_temp;
    ret_duty = s_prev_duty + ( CON_1 * cur_error ) + ( CON_2 * s_error_vals[ 0 ] ) + ( CON_3 * s_error_vals[ 1 ] );
    
    s_error_vals[ 1 ] = s_error_vals[ 0 ];
    s_error_vals[ 0 ] = cur_error;
    s_prev_duty = ret_duty;
    
    return( ret_duty );
}

float pid_find_target( float time )
{
    uint16 idx;
    float ret_targ;
    
    for( idx = 0; idx < s_profile.num_lines; idx++ )
    {
        if( ( time >= s_profile.lines[ idx ].pts[ START ].time ) && ( time < s_profile.lines[ idx ].pts[ STOP ].time ) )
        {
            break;     
        }   
    }
    
    if( idx == s_profile.num_lines )
    {
        return( -1 );
    }
    
    ret_targ = s_profile.lines[ idx ].m * time + s_profile.lines[ idx ].b;
    
    return( ret_targ );
}