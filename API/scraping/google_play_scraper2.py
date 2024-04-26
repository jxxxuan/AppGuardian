import requests
from bs4 import BeautifulSoup
from google_play_scraper import search,app
import re

def scrape_app_details(content):
    app_details = []
    soup = BeautifulSoup(content, 'html.parser')
    app_names = [target.text for target in soup.findAll('span', class_='DdYX5')]
    dev_names = [target.text for target in soup.findAll('span', class_='wMUdtb')]
    app_ids = [re.search(r'id=(\S+)', target.get('href')).group(1) for target in soup.findAll('a', class_='Si6A0c Gy4nib')]
    for i in range(len(app_names)):
        app_detail = {
            'app_name': app_names[i],
            'dev_name': dev_names[i],
            'app_id': app_ids[i]
        }

        details = app(
            app_ids[i],
            lang='',  # defaults to 'en'
            country='MY'
        )
        app_detail['app_link'] = details['url']
        app_detail['dev_link'] = details['developerWebsite']
        app_detail['dev_email'] = details['developerEmail']
        app_details.append(app_detail)
    return app_details

def get(app_name):
    app_name = app_name.replace(' ', '+')
    headers = {'Referer':'https://play.google.com/',
              'Sec-Ch-Ua':'"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
              'Sec-Ch-Ua-Platform':'"Windows"',
              'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'}
    return requests.get(r'https://play.google.com/store/search?q=' + app_name + '&c=apps&gl=MY',headers = headers)

def search(app_name):
    res = get(app_name)
    return scrape_app_details(res.content)