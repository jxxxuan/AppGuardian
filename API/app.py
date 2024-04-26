from flask import Flask, jsonify
from scraping import app_data_scraper as ads
import json
app = Flask(__name__)

@app.route('/api/search/<key>', methods=['GET'])
def search(key):
    results = []
    gp_results = ads.google_play_search(key)
    for result in gp_results:
        result['platform'] = 'google play'
        result['similarity_result'] = max([max(ads.compare(result[field], key).values()) for field in ['app_name', 'dev_name']])
        print(result['app_name'])
    results.extend(gp_results)

    as_results = ads.app_store_search(key)
    for result in as_results:
        result['platform'] = 'app store'
        result['similarity_result'] = max([max(ads.compare(result[field], key).values()) for field in ['app_name', 'dev_name']])

    results.extend(as_results)
    results = ads.sort(results)
    return jsonify(json.dumps(results))

if __name__ == '__main__':
    app.run(debug=True,port=5000)
