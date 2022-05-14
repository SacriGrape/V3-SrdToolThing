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
    Deserialize(data, srdiPath, srdvPath) {
        this.Data = data
    }

    Serialize(srdiData: CustomBuffer, srdvData: CustomBuffer): {blockData: CustomBuffer, srdiData: CustomBuffer, srdvData: CustomBuffer} {
        return {blockData: this.Data, srdiData: srdiData, srdvData: srdvData}
    }
}