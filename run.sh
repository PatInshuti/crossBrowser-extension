#!/bin/bash

COUNTER=0


#!/bin/bash
while IFS= read -r url; do

    # with extension
    browsertime --android --prettyPrint --browsertime.cacheClearRaw --firefox.preference browser.cache.disk.enable:false --extension ../../../extension/web-ext-artifacts/capstone.xpi --browser firefox $url https://google.com $url --multi --output withExtension.json

    # with no extension
    browsertime --android --prettyPrint --browsertime.cacheClearRaw --firefox.preference browser.cache.disk.enable:false --browser firefox $url --output noExtension.json


    COUNTER=$((COUNTER+1))
   
    if (( COUNTER %30 == 0 ))
    then
        sleep 300 #5 minutes
    fi
    
    
done < "$1"
