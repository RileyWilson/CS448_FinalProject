'use strict';
import * as lib2 from './lib/lib2.js'

const main = async(params) => {
    lib2.createPlot();
    lib2.addButtons();
    lib2.addInteraction();
    lib2.displayTitle();
}

main();