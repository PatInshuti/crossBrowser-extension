#!/bin/bash

allThreads=(

        "https://360.cn/"
        "https://www.sina.com.cn/"
        "https://www.tianya.cn/"
    )


for t in ${allThreads[@]}; do
   browsertime --android --browser firefox $t
done
