# Riley's Converter Script

import math
import argparse
import os
import os.path as osp
import TwitterSearch as tw
import csv
import json

allTweetStrings = []

def searchTwitter(keywords):
    try:
        tso = tw.TwitterSearchOrder() # create TwitterSearchOrder
        tso.set_keywords(keywords) # all words to search
        tso.set_language('en') # English tweets only
        tso.set_include_entities(False) # no entity info`

        # Twitter credentials
        ts = tw.TwitterSearch(
            consumer_key = 'w8xDxzVeKgw7dKLmZLgzsmKD4',
            consumer_secret = 'qXg4b6B4loG1wTLrXCinmzILQyK3HFg8EP8mDhXQATb8PGhNIA',
            access_token = '1112704711-Lp9k0REFZmzI4ODBa6dVhyIYfrREqLjOb15dUDh',
            access_token_secret = 'kBVXbCqKPnYvJWduRUQ2Q5H0gRFocZ4duWcoDrx8DqGLb'
        )

        #allTweetStrings = []
        # this is where the fun actually starts :)
        count = 0
        for tweet in ts.search_tweets_iterable(tso):
            time.sleep(4)
            if (count >= 2):
                break
            myString = '@%s tweeted: %s' % ( tweet['user']['screen_name'], tweet['text'] )
            #print( '@%s tweeted: %s' % ( tweet['user']['screen_name'], tweet['text'] ) )
            print(myString)
            count += 1
            allTweetStrings.append(myString);

    except tw.TwitterSearchException as e: # take care of all those ugly errors if there are some
        print(e)

    return allTweetStrings
    
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

    allWordToTweetMaps = {}

    termIndex = 0;
    reader = csv.reader(infile, delimiter=',')
    for row in reader:
        if (termIndex >= 200):
            break
        word = row[0]

        if word in allWordToTweetMaps:
            #nothing
        else:
            tweetStrings = searchTwitter([word]); 
            allWordToTweetMaps[word] = tweetStrings
        
        termIndex += 1


    outfile.write(str(allWordToTweetMaps))


# main invoked here    
main()




