import { CustomBuffer } from "../Utils/CustomBuffer"
import { Block } from "./block"

export class MshBlock extends Block {
    Unknown10: number
    VertexBlockNameOffset: number
    MaterialNameOffset: number
    unknownStringOffset: number
    Unknown1A: number
    Unknown1C: number
    StringMapDataAlmostEndOffset: number
    Unknown20: number
    Unknown21: number
    Unknown22: number
    Unknown23: number
    VertexBlockName: string
    MaterialName: string
    UnknownString: string
    MappedStrings: string[] = []
    strOff: number


    Deserialize(data: CustomBuffer, srdiPath: string, srdvPath: string) {
        this.Unknown10 = data.readUInt32()
        this.VertexBlockNameOffset = data.readUInt16()
        this.MaterialNameOffset = data.readUInt16()
        this.unknownStringOffset = data.readUInt16()
        this.Unknown1A = data.readUInt16()
        this.Unknown1C = data.readUInt16()
        this.StringMapDataAlmostEndOffset = data.readUInt16()
        this.Unknown20 = data.readByte()
        this.Unknown21 = data.readByte()
        this.Unknown22 = data.readByte()
        this.Unknown23 = data.readByte()

        while (data.offset < (this.StringMapDataAlmostEndOffset + 4)) {
            this.strOff = data.readUInt16()
            var oldPos = data.offset
            data.offset = this.strOff
            this.MappedStrings.push(data.readString())
            data.offset = oldPos
        }

        data.offset = this.VertexBlockNameOffset
        this.VertexBlockName = data.readString()
        data.offset = this.MaterialNameOffset
        this.MaterialName = data.readString()
        data.offset = this.unknownStringOffset
        this.UnknownString = data.readString()
    }

    Serialize(size: number, srdi: string, srdv: string): CustomBuffer {
        var buffer = new CustomBuffer(size)
        buffer.writeInt32(this.Unknown10)
        buffer.writeUInt16(this.VertexBlockNameOffset)
        buffer.writeUInt16(this.MaterialNameOffset)
        buffer.writeUInt16(this.unknownStringOffset)
        buffer.writeUInt16(this.Unknown1A)
        buffer.writeUInt16(this.Unknown1C)
        buffer.writeUInt16(this.StringMapDataAlmostEndOffset)
        buffer.writeByte(this.Unknown20)
        buffer.writeByte(this.Unknown21)
        buffer.writeByte(this.Unknown22)
        buffer.writeByte(this.Unknown23)

        for (var i = 0; i < this.MappedStrings.length; i++) {
            buffer.writeUInt16(this.strOff)
            var oldPos = buffer.offset
            buffer.offset = this.strOff
            buffer.writeString(this.MappedStrings[i])
            buffer.offset = oldPos
        }

        buffer.offset = this.VertexBlockNameOffset
        buffer.writeString(this.VertexBlockName)
        buffer.offset = this.MaterialNameOffset
        buffer.writeString(this.MaterialName)
        buffer.offset = this.unknownStringOffset
        buffer.writeString(this.UnknownString)

        buffer.offset = 0
        return buffer
    }

    GetInfo(): String {
        return `Block Type ${this.blockType}\n` + 
            `Vertex Block Name: ${this.VertexBlockName}\n` +
            `Material Name: ${this.MaterialName}\n` +
            `Unknown String: ${this.UnknownString}\n` +
            `Mapped Strings: ${this.MappedStrings}\n`
    }
}