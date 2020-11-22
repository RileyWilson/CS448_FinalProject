# Riley's Converter Script

import math
import argparse
import os
import os.path as osp
import TwitterSearch as tw
import csv
import json
import time


def searchTwitter(keywords):
    myReturnString = ""
    try:
        tso = tw.TwitterSearchOrder() 
        tso.set_keywords(keywords) 
        tso.set_language('en') 
        tso.set_include_entities(False) 

        # Twitter credentials
        ts = tw.TwitterSearch(
            consumer_key = 'w8xDxzVeKgw7dKLmZLgzsmKD4',
            consumer_secret = 'qXg4b6B4loG1wTLrXCinmzILQyK3HFg8EP8mDhXQATb8PGhNIA',
            access_token = '1112704711-Lp9k0REFZmzI4ODBa6dVhyIYfrREqLjOb15dUDh',
            access_token_secret = 'kBVXbCqKPnYvJWduRUQ2Q5H0gRFocZ4duWcoDrx8DqGLb'
        )

        count = 0
        for tweet in ts.search_tweets_iterable(tso):
            #time.sleep(3)
            if (count >= 1):
                break
            myString = '@%s tweeted: %s' % ( tweet['user']['screen_name'], tweet['text'] )
            print(myString)
            count += 1
            myReturnString += myString

    except tw.TwitterSearchException as e:
        print(e)

    return myReturnString
    
def main():
    
        
    parser = argparse.ArgumentParser()
    parser.add_argument("-o", "--outputfile", help="Output file name with extension")
    parser.add_argument("-i", "--inputfile", help="Input file name with extension")

    args = parser.parse_args()
    if args.inputfile is None or args.outputfile is None:
        parser.error("please add necessary arguments")

    
    output_file = args.outputfile
    input_file = args.inputfile

    outfile = open(output_file, 'w')
    infile = open(input_file, 'r')

    termIndex = 0
    reader = csv.reader(infile, delimiter=',')
    for row in reader:
        if (termIndex >= 150):
            break
        word = row[0]
        tweetStrings = searchTwitter([word])
        outfile.write(str({'term': word, 'tweets': tweetStrings, 'index': termIndex}))
        termIndex += 1

main()
