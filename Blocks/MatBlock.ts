import { writeFileSync } from "fs"
import { CustomBuffer } from "../Utils/CustomBuffer"
import { MapToArray } from "../Utils/MapToArray"
import { Block } from "./block"

export class MatBlock extends Block {
    Unknown10: number
    Unknown14: number
    Unknown18: number
    Unknown1C: number
    UnknownStringOffset0: number
    UnknownStringOffset1: number
    StringMapStartOffset: number
    StringMapCount: number
    StringMap: [string, string][] = []
    UnknownStrings: [string, string]

    // Data thats used in write
    UnknownIsSame: boolean

    Deserialize(data: CustomBuffer, srdiPath: string, srdvPath: string) {
        this.Unknown10 = data.readInt32()
        this.Unknown14 = data.readFloat32()
        this.Unknown18 = data.readFloat32()
        this.Unknown1C = data.readFloat32()
        this.UnknownStringOffset0 = data.readUInt16()
        this.UnknownStringOffset1 = data.readUInt16()
        this.StringMapStartOffset = data.readUInt16()
        this.StringMapCount = data.readUInt16()

        data.offset = this.StringMapStartOffset
        for (var i = 0; i < this.StringMapCount; i++) {
            var mapNameOffset = data.readUInt16()
            var textureNameOffset = data.readUInt16()

            var oldPos = data.offset
            data.offset = mapNameOffset
            var mapName = data.readString()
            data.offset = textureNameOffset
            var textureName = data.readString()
            data.offset = oldPos

            this.StringMap.push([mapName, textureName])
        }

        var oldPos = data.offset
        data.offset = this.UnknownStringOffset0
        var unknownString1 = data.readString()
        data.offset = this.UnknownStringOffset1
        var unknownString2 = data.readString()

        this.UnknownStrings = [unknownString1, unknownString2]
    }

    Serialize(srdiData: CustomBuffer, srdvData: CustomBuffer): {blockData: CustomBuffer, srdiData: CustomBuffer, srdvData: CustomBuffer} {
        this.UpdateSize()
        var data = new CustomBuffer(this.DataSize)
        data.writeInt32(this.Unknown10)
        data.writeFloat32(this.Unknown14)
        data.writeFloat32(this.Unknown18)
        data.writeFloat32(this.Unknown1C)
        data.offset += 6

        data.writeInt16(this.StringMap.length)
        var stringMapStart = data.offset

        data.offset += 4 * this.StringMap.length

        var mapNameOffsets: number[] = []
        for (var map of this.StringMap) {
            mapNameOffsets.push(data.offset)
            data.writeString(map[0])
        }

        var textureNameOffsets: number[] = []
        for (var map of this.StringMap) {
            textureNameOffsets.push(data.offset)
            data.writeString(map[1])
        }
        var unknownStringOffset0
        var unknownStringOffset1
        if (this.UnknownIsSame) {
            unknownStringOffset0 = data.offset
            data.writeString(this.UnknownStrings[0])
        } else {
            unknownStringOffset0 = data.offset
            data.writeString(this.UnknownStrings[0])
            unknownStringOffset1 = data.offset
            data.writeString(this.UnknownStrings[1])
        }
        
        data.offset = 16
        data.writeInt16(unknownStringOffset0)
        if (this.UnknownIsSame) {
            data.writeInt16(unknownStringOffset0)
        } else {
            data.writeInt16(unknownStringOffset1)
        }
        data.writeInt16(stringMapStart)
        data.offset += 2

        for (var i = 0; i < this.StringMap.length; i++) {
            data.writeInt16(mapNameOffsets[i])
            data.writeInt16(textureNameOffsets[i])
        }

        data.offset = 0
        if (data.BaseBuffer.length == 55) {
            writeFileSync("testMat.bin", data.BaseBuffer)
        }
        return {blockData: data, srdiData: srdiData, srdvData: srdvData}
    }

    UpdateSize() {
        this.DataSize = 24

        for (var i = 0; i < this.StringMap.length; i++) {
            var stringMap = this.StringMap[i]
            this.DataSize += 4 + (stringMap[0].length + 1) + (stringMap[1].length + 1)
        }

        this.UnknownIsSame = false

        if (this.UnknownStrings[0] == this.UnknownStrings[1]) {
            this.DataSize += (this.UnknownStrings[0].length + 1)
            this.UnknownIsSame = true
        } else {
            this.DataSize += (this.UnknownStrings[1].length + 1) + (this.UnknownStrings[0].length + 1)
        }
    }
}