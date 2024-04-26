from scraping import app_data_scraper as ads

if __name__ == '__main__':
    results = []
    results.extend(ads.google_play_search('facebook'))
    results.extend(ads.app_store_search('facebook'))
    print(results)