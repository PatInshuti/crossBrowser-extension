from data import *  
import chromedriver_binary,time,os
from seleniumwire import webdriver
import numpy as np
from PIL import Image, ImageFile
from webdriver_manager.chrome import ChromeDriverManager
import sys
from selenium.webdriver.common.action_chains import ActionChains

ImageFile.LOAD_TRUNCATED_IMAGES = True
HEIGHT = 1920
WIDTH = 1080
verbose = 1

mobile_emulation = { "deviceName": "iPhone X" }
chrome_options = webdriver.ChromeOptions()

chrome_options.add_argument('ignore-certificate-errors')
chrome_options.add_experimental_option("mobileEmulation", mobile_emulation)
chrome_options.add_argument("--disable-notifications")
chrome_options.add_argument("--disable-popup-window")
chrome_options.add_argument("load-extension=../extension/")

driver = webdriver.Chrome(ChromeDriverManager().install(), options=chrome_options)
driver.execute_cdp_cmd('Network.setCacheDisabled', {'cacheDisabled': True})
driver.set_window_size(1125, 2436)
# driver.request_interceptor = interceptor

# print(topPk)
topPk = ["https://facebook.com","https://betteraudition.com"]
for counter in range(len(topPk)):
    driver.get(topPk[counter])

    js = 'return Math.max( document.body.scrollHeight, document.body.offsetHeight,  document.documentElement.clientHeight,  document.documentElement.scrollHeight,  document.documentElement.offsetHeight);'

    try:
        scrollheight = driver.execute_script(js)
    except:
        scrollheight = 8000

    slices = []
    offset = 0
    totalSize = 0

    factor = float(0.3)

    while offset < scrollheight:
        driver.execute_script("window.scrollTo(0, %s);" % offset)
        time.sleep(5)
        driver.save_screenshot("tmp.png")

        img = Image.open("tmp.png")
        print (offset, scrollheight)
        # os.system("mv tmp.png tmp_{0}.png".format(offset))
        os.system("rm tmp.png")
        offset += int(img.size[1]*factor)
        totalSize += int(img.size[1])
        slices.append(img)

        if verbose > 0:
            driver.get_screenshot_as_file('%s/screen_%s.png' % ('/tmp', offset))
            print (offset, scrollheight)
        
    screenshot = Image.new('RGB', (slices[0].size[0], scrollheight*int(1/factor)))
    offset = 0
    cnt = 0
    for img in slices:
        cnt += 1
        print (offset, scrollheight*int(1/factor), scrollheight*int(1/factor)-offset)
        screenshot.paste(img, (0, offset))
        offset += img.size[1]

        if cnt == len(slices)-1:
            offset = scrollheight*int(1/factor) - img.size[1]

    name = topPk[counter].replace("http://","").replace("https://","")

    new_width  = 800
    new_height = int(new_width * screenshot.size[1] / screenshot.size[0])

    print("width")
    print(new_width)
    print()
    print("height")
    print(new_height)
    print()
    print("screenshot size")
    print(screenshot.size)
    screenshot = screenshot.resize((new_width, new_height), Image.ANTIALIAS)
    name = name.replace("/","_")
    screenshot.save(f"screenshots/{name}.png")

driver.close()
