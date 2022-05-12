import {readFile, readFileSync, writeFile, writeFileSync} from 'fs'
import { CfhBlock } from './Blocks/CfhBlock'
import { Ct0Block } from './Blocks/Ct0Block'
import { CustomBuffer } from './Utils/CustomBuffer'
import { RsfBlock } from './Blocks/RsfBlock'
import { RsiBlock } from './Blocks/RsiBlock'
import { ScnBlock } from './Blocks/ScnBlock'
import { TxiBlock } from './Blocks/TxiBlock'
import { TxrBlock } from './Blocks/TxrBlock'
import { VtxBlock } from './Blocks/VtxBlock'
import { MshBlock } from './Blocks/MshBlock'
import { TreBlock } from './Blocks/TreBlock'
import { MatBlock } from './Blocks/MatBlock'
import { Block } from './Blocks/block'

var tempExemps: string[] = ["$MSH", "$MAT", "$VTX", "$RSI"]

export class SrdFile {
    blocks: any[] = []
    writingInfo: any[] = []
    size: number = 0
    srdiOffset: number
    srdvOffset: number

    loadFromPath(path: string, srdiPath: string, srdvPath: string) {
        var buffer = readFileSync(path)
        var data = new CustomBuffer(buffer.length, buffer)
        this.size = buffer.length
        this.blocks = this.readBlocks(data, srdiPath, srdvPath)
    }

    readBlocks(data: CustomBuffer, srdiPath: string, srdvPath: string): any[] {
        let blocks: Block[] = []
        while (data.offset < data.BaseBuffer.length) {
            var BlockType = data.readArrayAsString(4)
            var blockSize = data.readInt32BE()
            var subdataSize = data.readInt32BE()
            var unknown0C = data.readInt32BE()

            var block
            if (!tempExemps.includes(BlockType)) {
                block = new Block()
                block.BlockType = BlockType
                block.Unknown0C = unknown0C
                block.Data = data.readBuffer(blockSize)
                data.readPadding(16)
                var subData = data.readBuffer(subdataSize)
                block.Children = this.readBlocks(subData, srdiPath, srdvPath)
                block.SubData = subData
                data.readPadding(16)
                block.DataSize = blockSize
                block.SubDataSize = subdataSize
                blocks.push(block)
                continue
            }
            var block;
            switch (BlockType) {
                case "$MAT":
                    block = new MatBlock
                    break
                case "$MSH":
                    block = new MshBlock
                    break
                case "$VTX":
                    block = new VtxBlock
                    break
                case "$RSI":
                    block = new RsiBlock
                    break
            }
            block.BlockType = BlockType
            block.Unknown0C = unknown0C
            var blockData = data.readBuffer(blockSize)
            if (block.BlockType == "$RSI") {
                block.Data = blockData
            }
            block.Deserialize(blockData, srdiPath, srdvPath)
            data.readPadding(16)
            var subData = data.readBuffer(subdataSize)
            block.Children = this.readBlocks(subData, srdiPath, srdvPath)
            data.readPadding(16)
            block.DataSize = blockSize
            block.SubDataSize = subdataSize
            blocks.push(block)
            continue
        }
        return blocks
    }

    writeBlocks(srdiPath: string, srdvPath: string, data?: CustomBuffer, children?: Block[]): CustomBuffer {
        if (data == null) {
            data = new CustomBuffer(this.getSrdSize())
        }

        let blocks: any[] = this.blocks
        if (children != null) {
            blocks = children
        }
        for (var block of blocks) {
            console.log("Before: ", data.offset)
            console.log(block.BlockType)
            // 24 43 54 30 00 00 00 00 00 00 00 00 00 00 00 00
            data.writeArrayAsString(block.BlockType) // 24 43 54 30
            data.setOffset(data.offset + 8) // 00 00 00 00 00 00 00 00
            data.writeInt32BE(block.Unknown0C) // 00 00 00 00

            if (!tempExemps.includes(block.BlockType) || block.BlockType == "$RSI") {
                if (block.BlockType != "$RSI") {
                    data.setOffset(data.offset - 12)
                    data.writeInt32BE(block.Data.BaseBuffer.length) // 00 00 00 00
                    data.writeInt32BE(block.SubData.BaseBuffer.length) // 00 00 00 00
                    data.setOffset(data.offset + 4)
                    if (block.DataSize != 0) {
                        data.writeBuffer(block.Data)
                    }
                    data.readPadding(16)
                    if (block.SubDataSize != 0) {
                        data.writeBuffer(block.SubData)
                    }
                    data.readPadding(16) // Nothing

                    writeFileSync("block.json", JSON.stringify(block, null, 2))
                    console.log("After: ", data.offset)
                    continue
                }

                let sizePos = data.offset - 12
                data.writeBuffer(block.Data)
                data.readPadding(16)
                let hasSubData = false
                let subData = null
                if (block.Children.length != 0) {
                    subData = this.writeBlocks(srdiPath, srdvPath, data, block.Children)
                    data.writeBuffer(subData)
                    data.readPadding(16)
                    hasSubData = true
                }
    
                let oldPos = data.offset
                data.setOffset(sizePos)
                data.writeInt32BE(block.Data.length)
                if (hasSubData) {
                    data.writeInt32BE(subData.length)
                } else {
                    data.writeInt32BE(0)
                }
    
                data.setOffset(oldPos)
                continue
            }
            let blockData = block.Serialize(srdiPath, srdvPath)
            let sizePos = data.offset - 12
            data.writeBuffer(blockData)
            data.readPadding(16)
            let hasSubData = false
            let subData = null
            if (block.Children.length != 0) {
                subData = this.writeBlocks(srdiPath, srdvPath, data, block.Children)
                data.readPadding(16)
                hasSubData = true
            }
            console.log(data.offset)
            let oldPos = data.offset
            data.setOffset(sizePos)
            data.writeInt32BE(blockData.length)
            if (hasSubData) {
                data.writeInt32BE(subData.length)
            } else {
                data.writeInt32BE(0)
            }

            data.setOffset(oldPos)
        }
        return data
    }

    getSrdSize(children?: Block[]): number {
        let blocks = this.blocks
        if (children != null) {
            blocks = children
        }
        var size = 0
        for (var block of blocks) {
            if (block.Children.length > 0) {
                //this.getSrdSize(block.Children)
            }
            if (tempExemps.includes(block.BlockType) && block.BlockType != "$RSI") {
                //block.UpdateSize()
                //size += 16
            }

            size += 16

            size += block.DataSize
            if (size % 16 != 0) {
                var remainder = size % 16
                while (remainder != 0) {
                    size++
                    remainder = size % 16
                }
            }

            size += block.SubDataSize
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