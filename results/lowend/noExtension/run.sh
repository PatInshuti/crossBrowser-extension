#!/bin/bash

allThreads=(
    
        "https://www.tmall.com/"
        "https://www.qq.com/"
        "http://sohu.com/"
        "https://yandex.ru/"
        "https://Taobao.com/"
        "https://Wikipedia.org/"
        "https://yahoo.com/"
        "https://Jd.com/"
        "https://amazon.com/"
        "https://www.weibo.com/"
        "https://www.bilibili.com/"
        "https://www.reddit.com/"
        "https://outlook.live.com/owa/"
        "https://vk.com/"
        "https://www.netflix.com/ae-en/"
        "https://www.okezone.com/"
        "https://www.alipay.com/"
        "https://www.csdn.net/"
        "https://mail.ru/"
        "https://www.office.com/"
        "https://www.aliexpress.com/"
        "http://xinhuanet.com/"
        "https://yahoo.co.jp/"
        "https://Bing.com/"
        "https://www.microsoft.com/"
        "https://babytree.com/"
        "https://stackoverflow.com/"
        "https://www.naver.com/"
        "https://www.twitch.tv/"
        "https://www.ebay.com/"
        "https://github.com/"
        "https://www.tribunnews.com/"
        "https://www.apple.com/"
        "https://www.msn.com/"
        "https://wordpress.com/"
        "https://www.imdb.com/"
        "https://www.fandom.com/"
        "https://imgur.com/"
        "https://www.hao123.com/"
        "https://ok.ru/"
        "https://www.adobe.com/"
        "https://www.cnblogs.com/"
        "https://www.douban.com/"
        "https://www.rakuten.co.jp/"
        "https://www.pixnet.net/"
        "https://www.bbc.com/"
        "https://www.popads.net/"
        "https://www.nicovideo.jp/"
        "https://www.jianshu.com/"
        "https://www.aparat.com/"
        "https://edition.cnn.com/"
    )


for t in ${allThreads[@]}; do
   browsertime --android --browser firefox $t
done
