
#include <stdio.h>
#include <string.h>

#include "mpu_types.h"
#include "mpu_util.h"
#include "mpu_cJSON.h"


void util_print_point(uint32 time, float target, float temperature)
{
    cJSON *root;
    char *tmpMessage;

    root = cJSON_CreateObject();
    cJSON_AddNumberToObject( root, "type", POINT );
    cJSON_AddNumberToObject(root, "time", time);
    cJSON_AddNumberToObject(root, "target", target);
    cJSON_AddNumberToObject(root, "temp", temperature);
    tmpMessage = cJSON_Print(root);
    printf( "%s\n", tmpMessage );
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
    printf( "%s\n", tmpMessage );
    fflush( stdout );
    cJSON_Delete(root);
    
    return;   
}
