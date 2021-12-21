import { readFileSync, writeFile, writeFileSync } from "fs"
import { CustomBuffer } from "../Utils/CustomBuffer";
import { Block } from "./block";

class ResourceInfo {
    Values: number[]
}

export class RsiBlock extends Block {
    Unknown10: number
    Unknown11: number
    Unknown12: number
    FallbackResourceInfoCount: number
    ResourceInfoCount: number
    FallbackResourceInfoSize: number
    ResourceInfoSize: number
    Unknown1A: number
    ResourceInfoList: ResourceInfo[] = []
    ResourceData: CustomBuffer
    ResourceStringList: string[]
    ExternalData: CustomBuffer[] = []
    resourceStringListOffset: number
    info: ResourceInfo

    Deserialize(data: CustomBuffer, srdiPath: string, srdvPath: string) {
        this.Unknown10 = data.readByte()
        this.Unknown11 = data.readByte()
        this.Unknown12 = data.readByte()
        this.FallbackResourceInfoCount = data.readByte()
        this.ResourceInfoCount = data.readInt16()
        this.FallbackResourceInfoSize = data.readInt16()
        this.ResourceInfoSize = data.readInt16()
        this.Unknown1A = data.readInt16()
        this.resourceStringListOffset = data.readInt32()

        var resourceInfoCount = (this.ResourceInfoCount != 0 ? this.ResourceInfoCount : this.FallbackResourceInfoCount)
        this.ResourceInfoList = []
        for (var i = 0; i < resourceInfoCount; ++i) {
            var size = 4
            if (this.ResourceInfoSize > 0) {
                size = this.ResourceInfoSize / 4;
            } else if (this.FallbackResourceInfoSize > 0) {
                size = this.FallbackResourceInfoSize / 4;
            }

            var timesRan = 0
            this.info = new ResourceInfo()
            this.info.Values = []
            for (var r = 0; r < size; ++r) {
                this.info.Values.push(data.readInt32())
                timesRan++
            }
            this.ResourceInfoList.push(this.info)
        }

        var dataLength = (this.resourceStringListOffset - data.offset)
        this.ResourceData = data.readBuffer(dataLength)

        this.ResourceStringList = []
        while (data.offset < data.BaseBuffer.length) {
            this.ResourceStringList.push(data.readString())
        }
        
        for (var resourceInfo of this.ResourceInfoList) {
            var maskedOffset = resourceInfo.Values[0] & 0x1FFFFFFF
            var location = resourceInfo.Values[0] & ~0x1FFFFFFF

            switch (location) {
                case 0x20000000:
                    if (srdiPath != null) {
                        var file = readFileSync(srdiPath)
                        var buffer = new CustomBuffer(file.length, file)
                        buffer.offset = maskedOffset
                        var size = resourceInfo.Values[1]
                        data = buffer.readBuffer(size)
                        this.ExternalData.push(data)
                    }
                    break
                
                case 0x40000000:
                    if(srdvPath != null) {
                        var file = readFileSync(srdvPath)
                        var buffer = new CustomBuffer(file.length, file)
                        buffer.offset = maskedOffset
                        var size = resourceInfo.Values[1]
                        data = buffer.readBuffer(size)
                        this.ExternalData.push(data)
                    }
                    break
            }
        }
    }

    Serialize(size: number, srdi: string, srdv: string): CustomBuffer {
        var buffer = new CustomBuffer(size)

        buffer.writeByte(this.Unknown10)
        buffer.writeByte(this.Unknown11)
        buffer.writeByte(this.Unknown12)
        buffer.writeByte(this.FallbackResourceInfoCount)
        buffer.writeInt16(this.ResourceInfoCount)
        buffer.writeInt16(this.FallbackResourceInfoSize)
        buffer.writeInt16(this.ResourceInfoSize)
        buffer.writeInt16(this.Unknown1A)
        buffer.writeInt32(this.resourceStringListOffset)
        var resourceInfoCount = (this.ResourceInfoCount != 0 ? this.ResourceInfoCount : this.FallbackResourceInfoCount)
        var resourceInfoListIndex = 0
        for (var i = 0; i < resourceInfoCount; ++i) {
            var size = 4
            if (this.ResourceInfoSize > 0) {
                size = this.ResourceInfoSize / 4;
            } else if (this.FallbackResourceInfoSize > 0) {
                size = this.FallbackResourceInfoSize / 4;
            }
            var resourceValueIndex = 0
            for (var r = 0; r < size; ++r) {
                buffer.writeInt32(this.ResourceInfoList[resourceInfoListIndex].Values[resourceValueIndex])
                resourceValueIndex++
            }

            resourceInfoListIndex++
        }

        buffer.writeBuffer(this.ResourceData)

        var ResourceStringListIndex = 0
        for (var i = 0; i < this.ResourceStringList.length; ++i) {
            buffer.writeString(this.ResourceStringList[ResourceStringListIndex])
            ResourceStringListIndex++
        }

        for (var i = 0; i < this.ResourceInfoList.length; ++i) {
            var maskedOffset = this.ResourceInfoList[i].Values[0] & 0x1FFFFFFF
            var location = this.ResourceInfoList[i].Values[0] & ~0x1FFFFFFF

            var externalDataIndex = 0
            switch (location) {
                case 0x20000000:
                    if (srdi != null) {
                        var file = readFileSync(srdi)
                        var srdiBuffer = new CustomBuffer(file.length, file)
                        srdiBuffer.offset = maskedOffset
                        var size = this.ResourceInfoList[i].Values[1]
                        srdiBuffer.writeBuffer(this.ExternalData[externalDataIndex])
                        externalDataIndex++
                        writeFileSync(srdi, srdiBuffer.BaseBuffer)
                    }
                    break
                case 0x40000000:
                    if (srdv != null) {
                        var file = readFileSync(srdv)
                        var srdvBuffer = new CustomBuffer(file.length, file)
                        srdvBuffer.offset = maskedOffset
                        var size = this.ResourceInfoList[i].Values[1]
                        srdvBuffer.writeBuffer(this.ExternalData[externalDataIndex])
                        externalDataIndex++
                        writeFileSync(srdv, srdvBuffer.BaseBuffer)
                    }
                    break
            }
        }
        buffer.offset = 0
        return buffer
    }

    GetInfo(): String {
        var info = `Block Type ${this.blockType}\n`
        info += `FallbackResourceInfoCount: ${this.FallbackResourceInfoCount}\n`
        info += `ResourceInfoCount: ${this.ResourceInfoCount}\n`
        info += `FallbackResourceInfoSize: ${this.FallbackResourceInfoSize}\n`
        info += `ResourceInfoSize: ${this.ResourceInfoSize}\n`
        info += `ResourceInfoList: ${this.ResourceInfoList}\n`
        info += `ResourceData: ${this.ResourceData}\n`
        info += `ResourceStringList: ${this.ResourceStringList}\n`
        info += `ExternalData: ${this.ExternalData}\n`
        return info
    }
}