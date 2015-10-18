
#include <stdio.h>
#include <string.h>

#include "mpu_types.h"
#include "mpu_util.h"
#include "mpu_cJSON.h"

#define CHAR_0     0x30
#define CHAR_9     0x39
#define CHAR_A     0x41
#define CHAR_F     0x46
#define CHAR_a     0x61
#define CHAR_f     0x66

#define MAX_JSON_SZ 2500  //Maximum size of the JSON object.

static char json_string[ MAX_JSON_SZ ];

boolean util_str_to_hex( const char * str, uint32 * ret_val )
{
    uint8  idx;
    uint32 value;

    idx = 2;
    value = 0;
    while( str[ idx ] != 0 )
    {
        value = value << 4;

        if( idx >= 10 )
        {
            printf( "Address must be a hex value, no more than eight characters long.\n" );
            return( FALSE );
        }


        if( str[ idx ] >= CHAR_0 && str[ idx ] <= CHAR_9 )
        {
            value = value + ( str[ idx ] - CHAR_0 );
        }
        else if( str[ idx ] >= CHAR_A && str[ idx ] <= CHAR_F )
        {
            value = value + ( str[ idx ] - CHAR_A + 10 );
        }
        else if( str[ idx ] >= CHAR_a && str[ idx ] <= CHAR_f )
        {
            value = value + ( str[ idx ] - CHAR_a + 10 );
        }
        else
        {
            printf( "Invalid character specified in input argument.\n" );
            return( FALSE );
        }
        idx++;
    }

    *ret_val = value;
    return( TRUE );
}

boolean util_load_profile( const char * path, profile * mem )
{
    boolean done;
    FILE * fp;
    uint16 idx;
    char cur_char;
    cJSON * json;
    cJSON * line;
    cJSON * point;
    uint8 num_lines;

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

    printf( "%s profile loaded.\n", cJSON_GetObjectItem( json, "name" )->valuestring );

    json = cJSON_GetObjectItem( json, "lines" );
    num_lines = cJSON_GetArraySize( json );
    if( num_lines > MAX_LINES )
    {
        printf( "Error: Too many lines. %d lines found.\n", num_lines );
        return( FALSE );
    }

    mem->num_lines = num_lines;

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
        mem->lines[ idx ].pts[ START ].time = (uint32) ( cJSON_GetObjectItem( point, "x" )->valueint );
        mem->lines[ idx ].pts[ START ].temp = (float) cJSON_GetObjectItem( point, "y" )->valuedouble;

        //Read in the ending point data:
        point = cJSON_GetObjectItem( line, "stop" );
        mem->lines[ idx ].pts[ START ].time = (uint32) ( cJSON_GetObjectItem( point, "x" )->valueint );
        mem->lines[ idx ].pts[ START ].temp = (float) cJSON_GetObjectItem( point, "y" )->valuedouble;

        //Read in the slope of the line:
        mem->lines[ idx ].m = (float) ( cJSON_GetObjectItem( line, "m" )->valuedouble );

        //Read in the y-intercept of the line:
        mem->lines[ idx ].b = (float) ( cJSON_GetObjectItem( line, "b" )->valuedouble );

    }

    cJSON_Delete( json );
    return( TRUE );
}

char* util_get_json_string(uint32 time, float target, float temperature)
{
    cJSON *root;
    
    root = cJSON_CreateObject();
    cJSON_AddNumberToObject(root, "time", time);
    cJSON_AddNumberToObject(root, "target", target);
    cJSON_AddNumberToObject(root, "temp", temperature);

    return cJSON_Print(root);
}
