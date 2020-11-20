# Riley's Converter Script

import math
import argparse
import os
import os.path as osp
import pandas as pd
import csv
import json

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

    allWordMaps = []

    reader = csv.reader(infile, delimiter=',')
    for row in reader:
        term = row[0]
        count = row[1]

        #allWordMaps[term] = count;
        allWordMaps.append({"term": term, "count": count});

    outfile.write(str(allWordMaps))


# main invoked here    
main()