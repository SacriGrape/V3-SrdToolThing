import { Block } from "../Blocks/block";

export function CompareBlocks(block1: Block, block2: Block): void {
    var hasDifference = false;
    for (var property in block1) {
        if (block1[property] != block2[property]) {
            console.log("-----------------------------------------------------");
            console.log(`Property ${property} is different!!!`);
            console.log(`Block 1: ${block1[property]}`);
            console.log(`Block 2: ${block2[property]}`);
            console.log("-----------------------------------------------------");
            hasDifference = true;
        }
    }

    if (!hasDifference) {
        console.log("No difference found.");
    } else {
        console.log("Differences found!");
    }
}