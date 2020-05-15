#!/usr/bin/env node

// From 'node_modules'
const opt = require('../ifopt');

// "Restore" Color Instruction :
let string = `I want to put the ${opt.colors.fg.Magenta}keyword${opt.colors.Restore} is another color`;

// Use as message
opt.log(string, 0, []);

// Use as keyword
opt.log('My sentense is %s containing keyword', 0, [string])

