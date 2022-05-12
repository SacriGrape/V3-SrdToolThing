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
    ResourceSubData: CustomBuffer[] = []
    Location: "SRDI" | "SRDV";
    TempResourceInfoCount: number

    Deserialize(data: CustomBuffer, srdiPath: string, srdvPath: string) {
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
            for(let i = 0; i < size; i++) { 
                info.push(data.readInt32())
            }

            this.ResourceInfo.push(info)
        }

        let dataLength = (resourceStringListOffset - data.offset)
        this.ResourceData = data.readBuffer(dataLength)
        console.log(dataLength)

        while(data.offset < this.DataSize) {
            this.ResourceStringList.push(data.readShiftJisString())
        }

        for (let info of this.ResourceInfo) {
            // CaptainSwag101's work with DRV3-Sharp has helped tremendosly with this code, 
            // and this part specifically is something I know I would have never figured out without the help from his code, shoutout to him
            let maskedOffset = info[0] & 0x1FFFFFFF
            let location = info[0] & ~0x1FFFFFFF

            let data = null
            switch (location) {
                case 0x20000000:    // Data is in SRDI
                    this.Location = "SRDI"
                    data = readDataFromSrdx(srdiPath, maskedOffset, info[1])
                    break;
                case 0x40000000: // Data is in SRDV
                    this.Location = "SRDV"
                    data = readDataFromSrdx(srdvPath, maskedOffset, info[1])
                    break;
            }

            this.ResourceSubData.push(data)
        }
    }

    UpdateSize() {
        this.DataSize = 16

        for (let info of this.ResourceInfo) {
            for (let i = 0; i < info.length; i++) {
                this.DataSize += 4
            }
        }

        this.DataSize += this.ResourceData.BaseBuffer.length
        console.log(this.ResourceData.BaseBuffer.length)
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