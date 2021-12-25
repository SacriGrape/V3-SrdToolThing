import { CustomBuffer } from "../Utils/CustomBuffer"
import { MapToArray } from "../Utils/MapToArray"
import { Block } from "./block"

export class MatBlock extends Block {
    Unknown10: number
    Unknown14: number
    Unknown18: number
    Unknown1C: number
    Unknown20: number
    Unknown22: number
    MapTexturePairs: Map<string, string> = new Map()
    StringMapStart: number
    TextureNameOffsets: number[] = []
    MapNameOffsets: number[] = []
    stringMapCount: number

    Deserialize(data: CustomBuffer, srdiPath: string, srdvPath: string) {
        this.Unknown10 = data.readInt32()
        this.Unknown14 = data.readFloat32()
        this.Unknown18 = data.readFloat32()
        this.Unknown1C = data.readFloat32()
        this.Unknown20 = data.readUInt16()
        this.Unknown22 = data.readUInt16()
        this.StringMapStart = data.readUInt16()
        this.stringMapCount = data.readUInt16()

        data.offset = this.StringMapStart
        for (var i = 0; i < this.stringMapCount; ++i) {
            var textureNameOffset = data.readUInt16()
            this.TextureNameOffsets.push(textureNameOffset)
            var mapNameOffset = data.readUInt16()
            this.MapNameOffsets.push(mapNameOffset)

            var oldPos = data.offset
            data.offset = textureNameOffset
            var textureName = data.readString()
            data.offset = mapNameOffset
            var mapName = data.readString()
            data.offset = oldPos
            this.MapTexturePairs.set(mapName, textureName)
        }
    }

    Serialize(size: number, srdi: string, srdv: string): CustomBuffer {
        var buffer = new CustomBuffer(size)
        buffer.writeInt32(this.Unknown10)
        buffer.writeFloat32(this.Unknown14)
        buffer.writeFloat32(this.Unknown18)
        buffer.writeFloat32(this.Unknown1C)
        buffer.writeUInt16(this.Unknown20)
        buffer.writeUInt16(this.Unknown22)
        buffer.writeUInt16(this.StringMapStart)
        buffer.writeUInt16(this.stringMapCount)

        buffer.offset = this.StringMapStart
        for (var i = 0; i < this.stringMapCount; ++i) {
            buffer.writeUInt16(this.TextureNameOffsets[i])
            buffer.writeUInt16(this.MapNameOffsets[i])

            var oldPos = buffer.offset
            buffer.offset = this.TextureNameOffsets[i]
            var mapValues = MapToArray<string, string>(this.MapTexturePairs)
            buffer.writeString(mapValues[i][1])
            buffer.offset = this.MapNameOffsets[i]
            buffer.writeString(mapValues[i][0])
            buffer.offset = oldPos
        }

        buffer.offset = 0
        return buffer
    }

    GetInfo(): String {
        return `Block Type ${this.BlockType}\nMap Texture Pairs: ${this.MapTexturePairs}\n`
    }
}