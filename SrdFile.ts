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

var tempNumber = 0

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
            var writingInfoData: any = {}
            var blockType = data.readArrayAsString(4)
            writingInfoData.blockType = blockType
            var block;
            switch(blockType) {
                case "$CFH":
                    block = new CfhBlock()
                    break
                case "$RSF":
                    block = new RsfBlock()
                    break
                case "$TXR":
                    block = new TxrBlock()
                    break
                case "$RSI":
                    block = new RsiBlock()
                    break
                case "$CT0":
                    block = new Ct0Block()
                    break
                case "$TXI":
                    block = new TxiBlock()
                    break
                case "$VTX":
                    block = new VtxBlock()
                    break
                case "$SCN":
                    block = new ScnBlock()
                    break
                case "$MAT":
                    block = new MatBlock()
                    break
                case "$MSH":
                    block = new MshBlock()
                    break
                case "$TRE":
                    block = new TreBlock()
                    break
                default:
                    console.log("I DON'T EXIST")
                    break
            }

            block.blockType = blockType
            var dataLength = data.readInt32BE()
            writingInfoData.dataLength = dataLength
            var subdataLength = data.readInt32BE()
            writingInfoData.subdataLength = subdataLength
            block.Unknown0C = data.readInt32BE()
            
            var rawData = data.readBuffer(dataLength)
            writingInfoData.rawData = rawData
            block.Deserialize(rawData, srdiPath, srdvPath)
            data.readPadding(16)

            var rawSubData = data.readBuffer(subdataLength)
            writingInfoData.rawSubData = new CustomBuffer(subdataLength, rawSubData.BaseBuffer)
            this.writingInfo.push(writingInfoData)
            var tempFile = new SrdFile()
            block.Children = tempFile.readBlocks(rawSubData, srdiPath, srdvPath)
            data.readPadding(16)
            
            this.blocks.push(block)
            data.readPadding(16)

            for (var writingData of tempFile.writingInfo) {
                this.writingInfo.push(writingData)
            }
            writeFileSync("writingInfo.json", JSON.stringify(this.writingInfo, null, 4))
        }
        return this.blocks
    }

    writeBlocks(size: number, srdv: string, srdi: string, writingInfo: any[], writingIndex: number): CustomBuffer {
        tempNumber++

        var buffer = new CustomBuffer(size)

        var blockNumber: number = 0
        for (var i = 0; i < this.blocks.length; i++) {
            var block = this.blocks[i]
            var data = writingInfo[writingIndex]
            writingIndex++
            blockNumber++
            buffer.writeArrayAsString(block.blockType)
            buffer.writeInt32BE(data.dataLength)
            buffer.writeInt32BE(data.subdataLength)
            buffer.writeInt32BE(block.Unknown0C)

            var moddedBlockBuffer = block.Serialize(data.dataLength, srdi, srdv)
            buffer.writeBuffer(moddedBlockBuffer)
            buffer.readPadding(16)
            
            var tempSrd = new SrdFile()
            tempSrd.blocks = block.Children
            var tempBuffer = tempSrd.writeBlocks(data.subdataLength, srdv, srdi, writingInfo, writingIndex)
            writingIndex += tempSrd.blocks.length
            buffer.writeBuffer(tempBuffer)
            buffer.readPadding(16)
        }
        buffer.offset = 0
        return buffer
    }
}