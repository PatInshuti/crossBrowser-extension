#!/bin/bash

COUNTER=0


#!/bin/bash
while IFS= read -r url; do

    browsertime --android --browser firefox $url
    
    COUNTER=$((COUNTER+1))
    
    if (( COUNTER %20 == 0 ))
    then
        sleep 300 #5 minutes
    fi
    
done < "$1"