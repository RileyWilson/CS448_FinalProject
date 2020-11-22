# Riley's Converter Script

import math
import argparse
import os
import os.path as osp
import TwitterSearch as tw
import csv
import json
import time
import datetime
import requests

def searchTwitter(outfile):
    try:
    
        tuo = tw.TwitterUserOrder("realdonaldtrump")
        tuo.set_exclude_replies(True)
        tuo.set_count(200)
        tuo.set_include_rts(False)

        print(tuo.create_search_url())


        # Twitter credentials
        ts = tw.TwitterSearch(
            consumer_key = 'w8xDxzVeKgw7dKLmZLgzsmKD4',
            consumer_secret = 'qXg4b6B4loG1wTLrXCinmzILQyK3HFg8EP8mDhXQATb8PGhNIA',
            access_token = '1112704711-Lp9k0REFZmzI4ODBa6dVhyIYfrREqLjOb15dUDh',
            access_token_secret = 'kBVXbCqKPnYvJWduRUQ2Q5H0gRFocZ4duWcoDrx8DqGLb'
        )

        count = 0
        subCount = 0
        for tweet in ts.search_tweets_iterable(tuo):
            #time.sleep(3)
            if (count >= 1000):
                break

            if (subCount >= 74):
                subCount = 0
                time.sleep(900)
            print(tweet)
            outfile.write(str(tweet))


    except tw.TwitterSearchException as e:
        print(e)

def create_url():
    query = "from:realdonaldtrump&max_results=100&start_time=2020-01-01T00:00:00Z"
    tweet_fields = "tweet.fields=author_id,created_at,source,text"
    url = "https://api.twitter.com/2/tweets/search/?query={}&{}".format(
        query, tweet_fields
    )
    return url

def create_headers():
    headers = {"Authorization": "Bearer {}".format("AAAAAAAAAAAAAAAAAAAAAIViJwEAAAAAseGGWTQWjaMgz8%2BXCv%2FnVy1rUXk%3D4nXnAkEk9IQK5nnmUqovw3GQFCE5Hl7vraz3qbWf331LOfqkpJ")}
    return headers


def connect_to_endpoint(url, headers):
    response = requests.request("GET", url, headers=headers)
    print(response.status_code)
    if response.status_code != 200:
        raise Exception(response.status_code, response.text)
    return response.json()
    
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("-o", "--outputfile", help="Output file name with extension")
    # parser.add_argument("-i", "--inputfile", help="Input file name with extension")

    args = parser.parse_args()
    if args.outputfile is None:
        parser.error("please add necessary arguments")
    
    output_file = args.outputfile

    outfile = open(output_file, 'w')
    
    searchTwitter(outfile)

main()
        
