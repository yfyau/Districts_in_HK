#!/usr/bin/env python3

import wget
import os

from selenium import webdriver

# create a folder that contains the quality details if it does not exist
if not os.path.exists("AirQuality"):
    os.makedirs("AirQuality")

driver = webdriver.Chrome()
driver.get("http://www.aqhi.gov.hk/en/aqhi/statistics-of-aqhi/past-aqhi-records.html")

data = driver.find_elements_by_xpath("//td[@class='tdClass']/a")

for f in data:
    href = f.get_attribute('href')
    wget.download(href, out="AirQuality")

driver.close()



