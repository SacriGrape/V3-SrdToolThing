"use strict";
exports.__esModule = true;
exports.CloneBlock = void 0;
var block_1 = require("../Blocks/block");
function CloneBlock(block) {
    var clone = new block_1.Block();
    for (var property in block) {
        clone[property] = block[property];
    }
    return clone;
}
exports.CloneBlock = CloneBlock;
