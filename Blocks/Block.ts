import { writeFileSync } from "fs"
import { CustomBuffer } from "../Utils/CustomBuffer"

export class Block {
    BlockType: string
    Unknown0C: number
    Children: Block[] = []
    DataSize: number // Updated on Read, Write, and running of UpdateSize()
    SubDataSize: number // Updated on same cases
    Data: CustomBuffer
    SubData: CustomBuffer

    SaveInfo(fileName: String) {
        let dataBlock = this.Clone()
        dataBlock.Data = null
        dataBlock.SubData = null
        writeFileSync(`./BlockJsons/${fileName}.json`, JSON.stringify(this, null, 2))
    }

    Clone(): Block {
        this
        let keys = Object.keys(this)
        let block = {}
        for(let key of keys) {
            block[key] = this[key]
        }

        return block as Block
    }
}