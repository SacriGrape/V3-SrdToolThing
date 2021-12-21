"use strict";
exports.__esModule = true;
exports.CompareBlocks = void 0;
function CompareBlocks(block1, block2) {
    var hasDifference = false;
    for (var property in block1) {
        if (block1[property] != block2[property]) {
            console.log("-----------------------------------------------------");
            console.log("Property " + property + " is different!!!");
            console.log("Block 1: " + block1[property]);
            console.log("Block 2: " + block2[property]);
            console.log("-----------------------------------------------------");
            hasDifference = true;
        }
    }
    if (!hasDifference) {
        console.log("No difference found.");
    }
    else {
        console.log("Differences found!");
    }
}
exports.CompareBlocks = CompareBlocks;
