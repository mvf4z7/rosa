
#include <stdio.h>
#include <string.h>
#include <unistd.h>

#include "mpu_types.h"
#include "mpu_util.h"
#include "mpu_cJSON.h"

#define MAX_ADC_VAL        ( 0xFFF0 )
#define MAX_ADC_VOLT       ( 1.8f   )
#define VOLTAGE_DIV_CONST  ( 2.0f   )
#define AMP_VOLTAGE_OFST   ( 1.25f  )
#define VOLTS_PER_DEG      ( 0.005f )


void util_print_point(uint32 time, float target, float temperature)
{
    cJSON *root;
    char *tmpMessage;
    sint32 tmp_targ;
    sint32 tmp_temp;
    
    tmp_targ = (sint32)( target + 0.5 );
    tmp_temp = (sint32)( temperature + 0.5 );

    root = cJSON_CreateObject();
    cJSON_AddNumberToObject( root, "type", POINT );
    cJSON_AddNumberToObject( root, "time", time );
    cJSON_AddNumberToObject( root, "target", tmp_targ );
    cJSON_AddNumberToObject( root, "temp", tmp_temp );
    tmpMessage = cJSON_Print( root );
    printf( "%s", tmpMessage );
    fflush( stdout );
    cJSON_Delete(root);

    return;
}

void util_print_temp( float temp )
{
    cJSON *root;
    char *tmpMessage;

    root = cJSON_CreateObject();
    cJSON_AddNumberToObject( root, "type", TEMP );
    cJSON_AddNumberToObject( root, "temp", temp );
    tmpMessage = cJSON_Print( root );
    printf( "%s", tmpMessage );
    fflush( stdout );
    cJSON_Delete(root);
    
    return;
}

void util_print_debug( const char * string )
{
    cJSON * root;
    char * tmpMessage;
    
    root = cJSON_CreateObject();
    cJSON_AddNumberToObject( root, "type", DEBUG_MSG );
    cJSON_AddStringToObject( root, "msg", string );
    
    tmpMessage = cJSON_Print( root );
    printf( "%s", tmpMessage );
    fflush( stdout );
    cJSON_Delete(root);
    
    return;   
}

float util_calc_temp( uint16 adc_val )
{
    float temp;
    float voltage;
    float amp_voltage;

    voltage = (float)( adc_val ) / MAX_ADC_VAL * MAX_ADC_VOLT;
    amp_voltage = VOLTAGE_DIV_CONST * voltage;
    temp = ( amp_voltage - AMP_VOLTAGE_OFST ) / VOLTS_PER_DEG;
    
    return( temp );
}

void util_print_procId()
{
    cJSON * root;
    char * tmpMessage;
    
    root = cJSON_CreateObject();
    cJSON_AddNumberToObject( root, "type", PROC_ID );
    cJSON_AddNumberToObject( root, "PID", (uint32)getpid() );
    
    tmpMessage = cJSON_Print( root );
    printf( "%s", tmpMessage );
    fflush( stdout );
    cJSON_Delete(root);
    return;
}
