import { CustomBuffer } from "../Utils/CustomBuffer"
import { Block } from "./block"

enum TextureFormat {
    Unknown = 0x00,
    ARGB8888 = 0x01,
    BGR565 = 0x02,
    BGRA4444 = 0x05,
    DXT1RGB = 0x0F,
    DXT5 = 0x11,
    BC5 = 0x14,
    BC4 = 0x16,
    Indexed8 = 0x1A,
    BPTC = 0x1C
}

export class TxrBlock extends Block {
    Unknown10: number
    Swizzle: number
    DisplayWidth: number
    DisplayHeight: number
    Scanline: number
    Format: TextureFormat
    Unknown1D: number
    Palette: number
    PaletteId: number

    Deserialize(data: CustomBuffer, srdiPath: string, srdvPath: string) {
        this.Unknown10 = data.readInt32()
        this.Swizzle = data.readUInt16()
        this.DisplayWidth = data.readUInt16()
        this.DisplayHeight = data.readUInt16()
        this.Scanline = data.readUInt16()
        this.Format = data.readByte()
        this.Unknown1D = data.readByte()
        this.Palette = data.readByte()
        this.PaletteId = data.readByte()
    }

    Serialize(size: number, srdi: string, srdv: string): CustomBuffer {
        var buffer = new CustomBuffer(size)
        buffer.writeInt32(this.Unknown10)
        buffer.writeUInt16(this.Swizzle)
        buffer.writeUInt16(this.DisplayWidth)
        buffer.writeUInt16(this.DisplayHeight)
        buffer.writeUInt16(this.Scanline)
        buffer.writeByte(this.Format)
        buffer.writeByte(this.Unknown1D)
        buffer.writeByte(this.Palette)
        buffer.writeByte(this.PaletteId)
        buffer.offset = 0
        return buffer
    }

    GetInfo(): String {
        var info = `Block Type ${this.blockType}\n`
        info += `Swizzle: ${this.Swizzle}\n`
        info += `Display Width: ${this.DisplayWidth}\n`
        info += `Display Height: ${this.DisplayHeight}\n`
        info += `Scanline: ${this.Scanline}\n`
        info += `Format: ${this.Format}\n`
        info += `Palette: ${this.Palette}\n`
        info += `Palette Id: ${this.PaletteId}\n`
        return info    
    }
}