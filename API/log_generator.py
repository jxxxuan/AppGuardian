from scraping.app_data_scraper import retrieve_app_store_info, retrieve_play_store_info
from firebase_config import initialize_firestore
from datetime import datetime,timezone
import string
import re

def exclude_exact_product(results, app_id):
    filtered_results = []
    for result in results:
        if result['app_id'] != app_id:
            filtered_results.append(result)
    return filtered_results


if __name__ == "__main__":
    db = initialize_firestore(r'appguardian-65d05-firebase-adminsdk-cy4xw-d727c99463.json')
    docs = db.collection('products').stream()
    products = []

    for doc in docs:
        product = doc.to_dict()
        product['id'] = doc.id
        products.append(product)

    apps_data = []
    log = dict()
    log['google_play_hits'] = 0
    log['app_store_hits'] = 0
    log['compare_with'] = {}
    log['app_docs'] = {}

    for product in products:
        log['compare_with'][product['product_name']] = {}
        results = retrieve_app_store_info(product['product_name'], product['app_dev'], product['id'])
        results = exclude_exact_product(results, product['app_id'])
        log['app_store_hits'] += len(results)
        log['compare_with'][product['product_name']]['app store hits'] = len(results)
        log['compare_with'][product['product_name']]['product id'] = product['id']
        apps_data.extend(results)

        results = retrieve_play_store_info(product['product_name'], product['play_dev'], product['id'])
        results = exclude_exact_product(results, product['play_id'])
        log['google_play_hits'] += len(results)
        log['compare_with'][product['product_name']]['google play hits'] = len(results)
        log['compare_with'][product['product_name']]['product id'] = product['id']
        apps_data.extend(results)

    log['app_docs'] = {}
    # Add data to a Firestore collection
    collection_ref = db.collection('apps')
    for app_data in apps_data:
        collection_ref.add(app_data)
    
    for data in apps_data:
        ref = collection_ref.document(data['app_id'])
        ref.set(data)
        if data['compare_with'] not in log['app_docs'].keys():
            log['app_docs'][data['compare_with']] = [ref]
        else:
            log['app_docs'][data['compare_with']].append(ref)

    log['executed_datetime'] = datetime.now(timezone.utc)
    
    collection_ref = db.collection('logs')
    collection_ref.add(log)
    print('done')
