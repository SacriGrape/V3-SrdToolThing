import { writeFileSync } from "fs"
import { CustomBuffer } from "../Utils/CustomBuffer"

export class Block {
    BlockType: string
    Unknown0C: number
    Children: Block[] = []
    Size: number
    Data: CustomBuffer
    SubData: CustomBuffer

    SaveInfo(fileName: String) {
        writeFileSync(`${fileName}.json`, JSON.stringify(this, null, 2))
    }
}