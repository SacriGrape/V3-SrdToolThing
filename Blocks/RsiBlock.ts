import { readFileSync, writeFileSync } from "fs"
import { CustomBuffer } from "../Utils/CustomBuffer";
import { Block } from "./block";

export class RsiBlock extends Block {
    UnknownByte00: number
    UnknownByte01: number
    UnknownByte02: number
    UnknownShort0A: number
    ResourceInfo: number[][]

    Deserialize(data: CustomBuffer, srdiPath: string, srdvPath: string) {
        this.UnknownByte00 = data.readByte()
        this.UnknownByte01 = data.readByte()
        this.UnknownByte02 = data.readByte()
        let fallbackResourceInfoCount = data.readByte()
        let resourceInfoCount = data.readInt16()
        let fallbackResourceInfoSize = data.readInt16()
        let resourceInfoSize = data.readInt16()
        this.UnknownShort0A = data.readInt16()
        let resourceStringListOffset = data.readInt32()

        resourceInfoCount = (resourceInfoCount != 0 ? resourceInfoCount : fallbackResourceInfoCount)
        for (var i = 0; i < resourceInfoCount; i++) {
            let size = 4
            if (resourceInfoSize > 0) {
                size = resourceInfoSize / 4
            } else if (fallbackResourceInfoSize > 0) {
                size = fallbackResourceInfoSize / 4
            }


        }
    }
}