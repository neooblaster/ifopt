#!/usr/bin/env node

// From 'node_modules'
const opt = require('../ifopt');

// "Restore" Color Instruction :
let string = `I want to put the ${opt.colors.fg.Magenta}keyword${opt.colors.Restore} and ${opt.colors.fg.Magenta}keyword2${opt.colors.Restore} is another color`;

// Use as message
opt.log(string, 0, []);

// Use as keyword
opt.log('My sentense is %s containing keyword', 0, [string])


// Get Option - Method 1
let IMPLICITS = {
    INPUT: null,
    OUTPUT: null
}
let OPTS = opt.getopt(
    // Short Options
    "vdi::o::",
    // Long Options
    [
        "verbose",
        "debug",
        "input::",
        "output::"
    ],
    // Implicits
    [
        "INPUT",
        "OUTPUT"
    ],
    // Implicits Handler
    IMPLICITS
);
/*
 ./test.js
 ./test.js file_in
 ./test.js file_in file_out
 ./test.js file_in file_out -i
 ./test.js file_in file_out -i=file_in
 ./test.js file_in file_out -i=file_in -o
 ./test.js file_in file_out -i=file_in -o=file_out
 ./test.js file_in file_out -i=file_in -o=file_out -v
 ./test.js file_in file_out -i=file_in -o=file_out -v -d
 ./test.js file_in file_out -i=file_in -o=file_out --verbose -d
 ./test.js file_in file_out -i=file_in -o=file_out --verbose --debug
 */

console.log(OPTS, IMPLICITS);

// Get Option values using Short and Long
let input1 = opt.getOptValue('i');
let input2 = opt.getOptValue(["input", "i"]);

console.log(input1)
console.log(input2)

let log = opt.log;

log("The following error %s must be in color", 1, ['colorize=true']);
opt.noColor();
log("The following error %s must not be in color", 1, ['colorize=false']);
opt.useColor();
log("The following error %s must be in color", 1, ['colorize=true']);
opt.useColor(false);
log("The following error %s must not be in color", 1, ['colorize=false']);
opt.useColor(true);
log("The following error %s must be in color", 1, ['colorize=true']);



