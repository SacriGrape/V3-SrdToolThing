import { Block } from "./block";
import { CustomBuffer } from "../Utils/CustomBuffer";

export class Ct0Block extends Block {
    Deserialize(data, srdiPath, srdvPath) {
        this.Data = data
    }

    Serialize(srdiData: CustomBuffer, srdvData: CustomBuffer): {blockData: CustomBuffer, srdiData: CustomBuffer, srdvData: CustomBuffer} {
        return {blockData: this.Data, srdiData: srdiData, srdvData: srdvData}
    }
}