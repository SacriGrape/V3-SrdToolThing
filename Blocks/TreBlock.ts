import { CustomBuffer } from "../Utils/CustomBuffer"
import { Block } from "./block"

class TreeNode {
    StringValue: string
    Children: TreeNode[] = []

    constructor(value: string) {
        this.StringValue = value
    }
}

export class TreBlock extends Block {
}