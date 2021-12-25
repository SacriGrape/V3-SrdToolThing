import { Block } from "./block";
import { CustomBuffer } from "../Utils/CustomBuffer";

export class Ct0Block extends Block {
    Deserialize(data: CustomBuffer, srdiPath: string, srdvPath: string) {
        return
    }

    Serialize(): CustomBuffer {
        return new CustomBuffer(0)
    }

    GetInfo(): String {
        return `Block Type: ${this.BlockType}\n`
    }
}