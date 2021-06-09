from data import *  
import chromedriver_binary,time,os
from seleniumwire import webdriver
import numpy as np
from PIL import Image, ImageFile
from selenium import webdriver
from webdriver_manager.firefox import GeckoDriverManager

import sys
from selenium.webdriver.common.action_chains import ActionChains

ImageFile.LOAD_TRUNCATED_IMAGES = True
HEIGHT = 1920
WIDTH = 1080
verbose = 1

user_agent = "Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_0 like Mac OS X; en-us) AppleWebKit/528.18 (KHTML, like Gecko) Version/4.0 Mobile/7A341 Safari/528.16"
profile = webdriver.FirefoxProfile() 
profile.set_preference("general.useragent.override", user_agent)


driver = webdriver.Firefox(firefox_profile=profile,executable_path=GeckoDriverManager().install())
driver.install_addon('/Users/patrickinshuti/Documents/GitHub/crossBrowser-extension/extension/web-ext-artifacts/capstone.xpi', temporary=True)
driver.set_window_size(360,640)


for website in (topPk):

    try:

        driver.get(website)

        js = 'return Math.max( document.body.scrollHeight, document.body.offsetHeight,  document.documentElement.clientHeight,  document.documentElement.scrollHeight,  document.documentElement.offsetHeight);'

        try:
            # scrollheight = driver.execute_script(js)
            scrollheight = 160
        except:
            scrollheight = 0

        slices = []
        offset = 0
        totalSize = 0

        factor = float(0.3)

        while offset < scrollheight:
            driver.execute_script("window.scrollTo(0, %s);" % offset)
            time.sleep(5)
            driver.save_screenshot("tmp.png")

            img = Image.open("tmp.png")
            # print (offset, scrollheight)
            # os.system("mv tmp.png tmp_{0}.png".format(offset))
            os.system("rm tmp.png")
            offset += int(img.size[1]*factor)
            totalSize += int(img.size[1])
            slices.append(img)

            if verbose > 0:
                driver.get_screenshot_as_file('%s/screen_%s.png' % ('/tmp', offset))
                # print (offset, scrollheight)
            
        screenshot = Image.new('RGB', (slices[0].size[0], scrollheight*int(1/factor)))
        offset = 0
        cnt = 0
        for img in slices:
            cnt += 1
            # print (offset, scrollheight*int(1/factor), scrollheight*int(1/factor)-offset)
            screenshot.paste(img, (0, offset))
            offset += img.size[1]

            if cnt == len(slices)-1:
                offset = scrollheight*int(1/factor) - img.size[1]

        name = website.replace("http://","").replace("https://","")

        new_width  = 360
        new_height = int(new_width * screenshot.size[1] / screenshot.size[0])

        screenshot = screenshot.resize((new_width, new_height), Image.ANTIALIAS)
        name = name.replace("/","_")
        screenshot.save(f"screenshots/{name}.png")
        print(website)
    
    except:
        continue


# driver.close()
