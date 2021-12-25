import { CustomBuffer } from "../Utils/CustomBuffer";
import { Block } from "./block";

export class TxiBlock extends Block {
    Unknown10: number
    Unknown14: number
    Unknown18: number
    Unknown1C: number
    Unknown1D: number
    Unknown1E: number
    Unknown1F: number
    Unknown20: number
    TextureFilename: string

    Deserialize(data: CustomBuffer, srdiPath: string, srdvPath: string) {
        this.Unknown10 = data.readInt32()
        this.Unknown14 = data.readInt32()
        this.Unknown18 = data.readFloat32()
        this.Unknown1C = data.readByte()
        this.Unknown1D = data.readByte()
        this.Unknown1E = data.readByte()
        this.Unknown1F = data.readByte()
        this.Unknown20 = data.readInt32()
        this.TextureFilename = data.readShiftJisString().toString()
    }

    Serialize(size: number, srdi: string, srdv: string): CustomBuffer {
        var buffer = new CustomBuffer(size)
        buffer.writeInt32(this.Unknown10)
        buffer.writeInt32(this.Unknown14)
        buffer.writeFloat32(this.Unknown18)
        buffer.writeByte(this.Unknown1C)
        buffer.writeByte(this.Unknown1D)
        buffer.writeByte(this.Unknown1E)
        buffer.writeByte(this.Unknown1F)
        buffer.writeInt32(this.Unknown20)
        buffer.writeShiftJisString(this.TextureFilename)
        buffer.offset = 0
        return buffer
    }

    GetInfo(): String {
        return `Block Type ${this.BlockType}\nTexture Filename: ${this.TextureFilename}\n`
    }
}