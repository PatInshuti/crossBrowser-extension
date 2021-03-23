#!/bin/bash

COUNTER=0


#!/bin/bash
while IFS= read -r url; do

    browsertime --android --extension ../../../../extension/web-ext-artifacts/capstone_noBlock.xpi --browser firefox $url
    
    COUNTER=$((COUNTER+1))
    
    if (( COUNTER %30 == 0 ))
    then
        sleep 300 #5 minutes
    fi
        
done < "$1"