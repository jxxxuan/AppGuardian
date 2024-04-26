import json
import requests
from fuzzywuzzy import fuzz
from google_play_scraper import search,app
from scraping import google_play_scraper2 as gps2

ratio_threshold = 60
partial_ratio_threshold = 80
token_sort_ratio_threshold = 80
def retrieve_app_store_info(product_name,developer_name,product_id):
    results = app_store_search(product_name)

    apps_data = []
    for result in results:
        compare_with_dev_app(result,product_name,developer_name)

        if (result['app_name_ratio'] > ratio_threshold or
            result['dev_name_ratio'] > ratio_threshold or
            result['app_name_token_sort_ratio'] > token_sort_ratio_threshold or
            result['dev_name_token_sort_ratio'] > token_sort_ratio_threshold or
            result['app_name_partial_ratio'] > partial_ratio_threshold or
            result['dev_name_partial_ratio'] > partial_ratio_threshold):

            result['app_name_similarity'] = max([result['app_name_ratio'],result['app_name_token_sort_ratio'],result['app_name_partial_ratio']])
            result['dev_name_similarity'] = max([result['dev_name_ratio'],result['dev_name_token_sort_ratio'],result['dev_name_partial_ratio']])
            result['platform'] = 'app store'
            result['compare_with'] = product_id

            apps_data.append(result)
    return apps_data

def retrieve_play_store_info(product_name,developer_name,product_id):
    gps2.get(product_name)
    results = gps2.search(product_name)

    apps_data = []
    for result in results:
        compare_with_dev_app(result,product_name,developer_name)

        if (result['app_name_ratio'] > ratio_threshold or
            result['dev_name_ratio'] > ratio_threshold or
            result['app_name_token_sort_ratio'] > token_sort_ratio_threshold or
            result['dev_name_token_sort_ratio'] > token_sort_ratio_threshold or
            result['app_name_partial_ratio'] > partial_ratio_threshold or
            result['dev_name_partial_ratio'] > partial_ratio_threshold):

            result['app_name_similarity'] = max([result['app_name_ratio'], result['app_name_token_sort_ratio'], result['app_name_partial_ratio']])
            result['dev_name_similarity'] = max([result['dev_name_ratio'], result['dev_name_token_sort_ratio'], result['dev_name_partial_ratio']])

            result['platform'] = 'google play'
            result['compare_with'] = product_id
            apps_data.append(result)
    return apps_data
def google_play_search(key):
    gps2.get(key)
    results = gps2.search(key)
    return results

def app_store_search(key):
    res = requests.get('https://itunes.apple.com/search?term='+key+'&media=software'+'&country=MY'+'&limit=200'+'&lang=en').text
    results = []
    for result in json.loads(res)['results']:
        app_details = dict()
        app_details['app_id'] = str(result['trackId'])
        app_details['app_name'] = result['trackCensoredName']
        app_details['dev_name'] = result['artistName']
        app_details['app_link'] = result['trackViewUrl']
        app_details['dev_link'] = result['artistViewUrl'] if 'artistViewUrl' in result.keys() else ''
        app_details['dev_email'] = ''
        results.append(app_details)
    return results

def compare_with_dev_app(app_details,app_name,dev_name):
    result = compare(app_name,app_details['app_name'])
    app_details['app_name_ratio'] = result['ratio']
    app_details['app_name_token_sort_ratio'] = result['token_sort_ratio']
    app_details['app_name_partial_ratio'] = result['partial_ratio']
    compare(dev_name,app_details['dev_name'])
    app_details['dev_name_ratio'] = result['ratio']
    app_details['dev_name_token_sort_ratio'] = result['token_sort_ratio']
    app_details['dev_name_partial_ratio'] = result['partial_ratio']

def compare(key1,key2):
    return {'ratio':fuzz.ratio(key1.lower(), key2.lower()),
    'token_sort_ratio':fuzz.token_sort_ratio(key1.lower(),key2.lower()),
    'partial_ratio':fuzz.partial_ratio(key1.lower(),key2.lower())}

def sort(apps_data):
    apps_data.sort(key=lambda x: x['similarity_result'], reverse=True)
    return apps_data