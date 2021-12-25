import {readFile, readFileSync, writeFileSync} from 'fs'
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

export class SrdFile {
    blocks = []
    writingInfo: any[] = []
    size: number = 0

    loadFromPath(path: string, srdiPath: string, srdvPath: string) {
        var buffer = readFileSync(path)
        var data = new CustomBuffer(buffer.length, buffer)
        this.size = buffer.length
        this.readBlocks(data, srdiPath, srdvPath)
    }

    readBlocks(data: CustomBuffer, srdiPath: string, srdvPath: string) {
        while (data.offset < data.BaseBuffer.length) {
            var BlockType = data.readArrayAsString(4)
            var blockSize = data.readInt32BE()
            var subdataSize = data.readInt32BE()
            var unknown0C = data.readInt32BE()

            if (BlockType != "$MSH") {
                var block = new Block()
                block.BlockType = BlockType
                block.Unknown0C = unknown0C
                block.Data = data.readBuffer(blockSize)
                data.readPadding(16)
                block.SubData = data.readBuffer(subdataSize)
                data.readPadding(16)
                this.blocks.push(block)
                continue
            }
            var mshBlock = new MshBlock()
            mshBlock.BlockType = BlockType
            mshBlock.Size = blockSize
            mshBlock.Unknown0C = unknown0C
            var blockData = data.readBuffer(blockSize)
            mshBlock.Deserialize(blockData, srdiPath, srdvPath)
            mshBlock.Data = blockData
            data.readPadding(16)
            mshBlock.SubData = data.readBuffer(subdataSize)
            data.readPadding(16)
            this.blocks.push(mshBlock)
            continue
        }
    }

    writeBlocks(srdiPath: string, srdvPath: string) {
        var size = 0
        var data = new CustomBuffer(6144)
        for (var block of this.blocks) {
            data.writeArrayAsString(block.BlockType)
            data.writeInt32BE(block.Data.BaseBuffer.length)
            data.writeInt32BE(block.SubData.BaseBuffer.length)
            data.writeInt32BE(block.Unknown0C)

            if (block.BlockType != "$MSH") {
                data.writeBuffer(block.Data)
                data.readPadding(16)
                data.writeBuffer(block.SubData)
                data.readPadding(16)
                continue
            }

            data.writeBuffer(block.Serialize("", ""))
            data.readPadding(16)
            data.writeBuffer(block.SubData)
            data.readPadding(16)
        }
        data.offset = 0
        return data
    }
}