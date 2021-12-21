import { Block } from "../Blocks/block";

export function CloneBlock(block: Block): Block {
    let clone = new Block();
    for (let property in block) {
        clone[property] = block[property];
    }
    return clone;
}