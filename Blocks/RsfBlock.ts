import { CustomBuffer } from "../Utils/CustomBuffer";
import { Block } from "./block";

export class RsfBlock extends Block {
    Unknown10: number
    Unknown14: number
    Unknown18: number
    Unknown1C: number
    FolderName: string

    Deserialize(data: CustomBuffer, srdiPath: string, srdvPath: string) {
        this.Unknown10 = data.readInt32()
        this.Unknown14 = data.readInt32()
        this.Unknown18 = data.readInt32()
        this.Unknown1C = data.readInt32()
        this.FolderName = data.readString()
    }

    Serialize(size: number, srdi: string, srdv: string): CustomBuffer {
        var buffer = new CustomBuffer(size)
        buffer.writeInt32(this.Unknown10)
        buffer.writeInt32(this.Unknown14)
        buffer.writeInt32(this.Unknown18)
        buffer.writeInt32(this.Unknown1C)
        buffer.writeString(this.FolderName)
        buffer.offset = 0
        return buffer
    }

    GetInfo(): String {
        return `Block Type ${this.blockType}\nFolder Name: ${this.FolderName}\n`
    }
}