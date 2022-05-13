import { info } from "console";
import { readFileSync, writeFileSync } from "fs"
import { CustomBuffer } from "../Utils/CustomBuffer";
import { Block } from "./block";

export class RsiBlock extends Block {
    UnknownByte00: number
    UnknownByte01: number
    UnknownByte02: number
    UnknownShort0A: number
    ResourceInfo: number[][] = []
    ResourceData: CustomBuffer
    ResourceStringList: string[] = []
    ResourceSubData: {Data: CustomBuffer, Location: "SRDI" | "SRDV" | "SRD", offset?: number}[] = []
    TempResourceInfoCount: number

    Deserialize(data: CustomBuffer, srdiPath: string, srdvPath: string) {
        writeFileSync("rsiTestRead.dat", data.BaseBuffer)
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

            let info: number[] = []
            for(let j = 0; j < size; j++) { 
                info.push(data.readInt32())
            }

            this.ResourceInfo.push(info)
        }

        let dataLength = (resourceStringListOffset - data.offset)
        this.ResourceData = data.readBuffer(dataLength)

        data.offset = resourceStringListOffset
        while(data.offset < data.BaseBuffer.length) {
            let string = data.readShiftJisString()
            this.ResourceStringList.push(string)
        }

        for (let info of this.ResourceInfo) {
            // CaptainSwag101's work with DRV3-Sharp has helped tremendosly with this code, 
            // and this part specifically is something I know I would have never figured out without the help from his code, shoutout to him
            let maskedOffset = info[0] & 0x1FFFFFFF
            let location = info[0] & ~0x1FFFFFFF

            let data = null
            let locationString = null
            switch (location) {
                case 0x20000000:    // Data is in SRDI
                    locationString = "SRDI"
                    data = readDataFromSrdx(srdiPath, maskedOffset, info[1])
                    break;
                case 0x40000000: // Data is in SRDV
                    locationString = "SRDV"
                    data = readDataFromSrdx(srdvPath, maskedOffset, info[1])
                    break;
                case 0x0000000: // Data is in ResourceData (Maybe?)
                    locationString = "SRD"
                    this.ResourceData.offset = maskedOffset
                    data = this.ResourceData.readBuffer(info[1])
                    this.ResourceSubData.push({Data: data, Location: locationString, offset: maskedOffset})
                    continue;
            }
            this.ResourceSubData.push({Data: data, Location: locationString})
        }
    }

    Serialize(srdiData: CustomBuffer, srdvData: CustomBuffer): {blockData: CustomBuffer, srdiData: CustomBuffer, srdvData: CustomBuffer} {
        this.ResourceData.offset = 0
        this.UpdateSize()
        let data = new CustomBuffer(this.DataSize)
        
        data.writeByte(this.UnknownByte00)
        data.writeByte(this.UnknownByte01)
        data.writeByte(this.UnknownByte02)
        data.writeByte(0)
        data.writeInt16(this.ResourceInfo.length)
        data.writeInt16(0)
        
        let size = 0
        if (this.ResourceInfo.length != 0) {
            size = this.ResourceInfo[0].length * 4
        }
        data.writeInt16(size)
        
        data.writeInt16(this.UnknownShort0A)
        let stringListOffsetOffset = data.offset
        data.offset += 4 // Int32 Offset (StringList)

        for (let i = 0; i < this.ResourceInfo.length; i++) {
            let info = this.ResourceInfo[i]
            let externalData = this.ResourceSubData[i]
            for (let j = 0; j < info.length; j++) {
                let number = info[j]
                if (j == 0) {
                    let maskedValues: number = null
                    switch (externalData.Location) {
                        case "SRDI":
                            maskedValues = srdiData.offset | 0x20000000
                            break;
                        case "SRDV":
                            maskedValues = srdvData.offset | 0x40000000
                            break;
                        case "SRD":
                            maskedValues = externalData.offset | 0x00000000
                            break;
                    }
                    data.writeInt32(maskedValues)
                    continue
                }
                data.writeInt32(number)
            }

            // Writing info in SRDX
            switch (externalData.Location) {
                case "SRDI":
                    srdiData.writeBuffer(externalData.Data)
                    srdiData.readPadding(16)
                    break;
                case "SRDV":
                    srdvData.writeBuffer(externalData.Data)
                    srdvData.readPadding(16)
                    break;
            }
        }

        data.writeBuffer(this.ResourceData)
        let stringListOffset = data.offset
        for(let string of this.ResourceStringList) {
            data.writeShiftJisString(string)
        }

        let oldPos = data.offset
        data.offset = stringListOffsetOffset
        data.writeInt32(stringListOffset)
        data.offset = oldPos

        writeFileSync("RsiTestWrite.dat", data.BaseBuffer)
        return {blockData: data, srdiData: srdiData, srdvData: srdvData}
    }

    UpdateSize() {
        this.DataSize = 16

        if (this.ResourceInfo.length != 0) {
            this.DataSize += this.ResourceInfo.length * this.ResourceInfo[0].length * 4
        }

        this.DataSize += this.ResourceData.BaseBuffer.length
        for (let string of this.ResourceStringList) {
            this.DataSize += string.length + 1
        }
    }
}

function readDataFromSrdx(path: string, offset: number, size: number) {
    let srdxData: CustomBuffer | Buffer = readFileSync(path)
    srdxData = new CustomBuffer(srdxData.length, srdxData)
    srdxData.offset = offset
    let data = srdxData.readBuffer(size)
    return data
}