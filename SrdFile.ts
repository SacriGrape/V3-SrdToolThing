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
            var blockType = data.readArrayAsString(4)
            var blockSize = data.readInt32BE()
            var subdataSize = data.readInt32BE()
            var unknown0C = data.readInt32BE()

            if (blockType != "$MSH") {
                data.offset += blockSize
                data.readPadding(16)
                data.offset += subdataSize
                data.readPadding(16)
                continue
            }
            var mshBlock = new MshBlock()
            mshBlock.blockType = blockType
            var blockData = data.readBuffer(blockSize)
            mshBlock.Deserialize(blockData, srdiPath, srdvPath)
            this.blocks.push(mshBlock)
            data.readPadding(16)
            data.offset += subdataSize
            data.readPadding(16)
            continue
        }
    }
}