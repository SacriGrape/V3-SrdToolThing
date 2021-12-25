import { CustomBuffer } from "../Utils/CustomBuffer"

export class Block {
    BlockType: string
    Unknown0C: number
    Children: Block[] = []
    Size: number
    Data: CustomBuffer
    SubData: CustomBuffer
}