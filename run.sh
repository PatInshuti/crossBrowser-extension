#!/bin/bash

allThreads=(
    
    "https://www.google.com"
    "https://www.facebook.com"

)


for t in ${allThreads[@]}; do
   browsertime --android --browser firefox $t
done