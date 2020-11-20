# Riley's Converter Script

import math
import argparse
import os
import os.path as osp
import pandas as pd


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

    index = 0

    range = pd.date_range(pd.to_datetime('Mar 22, 2020'),periods=250)


    print(range)

    #skipped = False

    for line in infile:
        #if (skipped == False):
         #   skipped = True
          #  continue
        day = int((index - (index % 1000))/1000)
        print(int(day))
        dateString = ",{}\n".format(range[day])
        newLine = line[:-1] + dateString
        outfile.write(newLine)
        index = index + 1


# main invoked here    
main()