# Riley's Converter Script

import math
import argparse
import os
import os.path as osp
import pandas as pd
import csv
import json
import collections

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

    allDateMaps = {}
    data = json.load(infile)
    substring = "2020-"

    allDatesFinal = []
    allDates = []

    for datum in data:
        #print("datum: " + str(datum))
        date = datum["date"][0:10]
        print(date)



        if substring in date:
            if date in allDates:
                print("nothin")
            else:
                allDates.append(date)

                
            if date in allDateMaps:
                allDateMaps[date].append(json.dumps(datum))
            else:
                allDateMaps[date] = [json.dumps(datum)]

    for dateItem in allDates:
        print("adding data for date: " + dateItem)
        allDatesFinal.append({"date": dateItem, "tweets": allDateMaps[dateItem]})

    #with open(infile) as f:

        
    #od = collections.OrderedDict(sorted(allDateMaps.items()))

    outfile.write(json.dumps(allDatesFinal))


# main invoked here    
main()