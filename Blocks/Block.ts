import { writeFileSync } from "fs"
import { chdir } from "process"
import { CustomBuffer } from "../Utils/CustomBuffer"
import { tempExemps } from "../Utils/globalVars"
import { TypeBlock } from "../Utils/TypeBlock"

export class Block {
    BlockType: string
    Unknown0C: number
    Children: Block[] = []
    DataSize: number // Updated on Read, Write, and running of UpdateSize()
    SubDataSize: number // Updated on same cases
    Data: CustomBuffer

    hasChildren(): boolean {
        return this.Children.length != 0
    }

    GetDataSize(): number {
        let size = 0;
        if (tempExemps.includes(this.BlockType)) {
            (this as any).UpdateSize()
        }
        return this.DataSize
    }

    GetSubDataSize(): number {
        let size = 0
        for (let block of this.Children) {
            size += 16 // Every block has a 16 byte header
            if (tempExemps.includes(block.BlockType)) {
                (block as any).UpdateSize() // Updates size if its one of the blocks that I have a method for doing that
            }
            size += block.DataSize // Adds the main data

            // Data padding
            if (size % 16 != 0) {
                var remainder = size % 16
                while (remainder != 0) {
                    size++
                    remainder = size % 16
                }
            }
            
            // Adding SubData size if the block has children
            if (block.Children.length != 0) {
                for (let child of block.Children) {
                    size += child.GetSubDataSize()
                }
            }

            // SubData padding
            if (size % 16 != 0) {
                var remainder = size % 16
                while (remainder != 0) {
                    size++
                    remainder = size % 16
                }
            }
        }
        return size
    }

    Clone(): Block { // Shitty clone, returned type isn't actually a Block
        this
        let keys = Object.keys(this)
        let block = {}
        for(let key of keys) {
            block[key] = this[key]
        }

        return block as Block
    }

    UpdateSize() {
        return
    }
}