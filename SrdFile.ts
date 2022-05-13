import { readFileSync } from 'fs'
import { CustomBuffer } from './Utils/CustomBuffer'
import { Block } from './Blocks/block'

export class SrdFile {
    blocks: any[] = []

    loadFromPath(path: string, srdiPath: string, srdvPath: string) {
        var buffer = readFileSync(path)
        var data = new CustomBuffer(buffer.length, buffer)
        this.blocks = this.readBlocks(data, srdiPath, srdvPath)
    }

    readBlocks(data: CustomBuffer, srdiPath: string, srdvPath: string): Block[] {
        let blocks: Block[] = []
        while (data.offset != data.BaseBuffer.length) {
            // Gathering block data from SrdFile
            let block = new Block()
            block.BlockType = data.readArrayAsString(4)
            block.DataSize = data.readInt32BE()
            block.SubDataSize = data.readInt32BE()
            block.Unknown0C = data.readInt32BE()
            let blockData = data.readBuffer(block.DataSize)
            data.readPadding(16)
            let blockSubData = data.readBuffer(block.SubDataSize)
            data.readPadding(16)

            // Handling block data
            block.Deserialize(blockData, srdiPath, srdvPath)
            if (block.SubDataSize != 0) { // Checking if block has kids then saving them
                block.Children = this.readBlocks(blockSubData, srdiPath, srdvPath)
            }

            blocks.push(block)
        }
        return blocks
    }

    writeBlocks(srdiData: CustomBuffer, srdvData: CustomBuffer, blocks?: Block[]): {blockData: CustomBuffer, srdiData: CustomBuffer, srdvData: CustomBuffer} {
        // Determining what block list to use
        if (blocks == null) {
            blocks = this.blocks
        }

        // Creating the srdData buffer
        let blockData = new CustomBuffer(this.getBlocksSize(blocks));

        // Looping over every block
        for (let block of blocks) {
            blockData.writeArrayAsString(block.BlockType) // BlockType doesn't have a null terminator so this method is used
            blockData.writeInt32BE(block.GetDataSize())
            blockData.writeInt32BE(block.GetSubDataSize())
            blockData.writeInt32BE(block.Unknown0C) // I just rewrite the value that it was when it was read though this could cause issues once size/data changes if the value is relavent
            blockData.writeBuffer(block.Serialize(srdiData, srdvData).blockData) // Writes the main block data
            blockData.readPadding(16)
            if (block.hasChildren()) {
                let subData = this.writeBlocks(srdiData, srdvData, block.Children).blockData
                blockData.writeBuffer(subData)
                blockData.readPadding(16)
            }
        }

        return {blockData: blockData, srdiData: srdiData, srdvData: srdvData}
    }

    getBlocksSize(blocks?: Block[]): number {
        // Determining block list
        if (blocks == null) {
            blocks = this.blocks
        }

        var size = 0
        for (var block of blocks) { // Looping over blocks and adding up their data sizes (making sure to remember to also include padding size)
            size += 16 // Every block has a 16 byte header

            block.UpdateSize() // Unsafe but shouldn't ever 
            size += block.DataSize
            if (size % 16 != 0) {
                var remainder = size % 16
                while (remainder != 0) {
                    size++
                    remainder = size % 16
                }
            }

            if (block.Children.length != 0) {
                size += this.getBlocksSize(block.Children)
            }
            // Reading padding again probably isn't needed but I want to be as safe as possible
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
}