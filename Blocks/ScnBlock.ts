import { CustomBuffer } from "../Utils/CustomBuffer";
import { Block } from "./block";

export class ScnBlock extends Block {
    Unknown10: number
    SceneRootNodes: string[] = []
    UnknownStrings: string[] = []
    sceneRootNodeIndexOffset: number
    sceneRootNodeIndexCount: number
    unknownStringIndexOffset: number
    unknownStringIndexCount: number
    stringOffset: number

    Deserialize(data: CustomBuffer, srdiPath: string, srdvPath: string) {
        this.Unknown10 = data.readUInt32()
        this.sceneRootNodeIndexOffset = data.readUInt16()
        this.sceneRootNodeIndexCount = data.readUInt16()
        this.unknownStringIndexOffset = data.readUInt16()
        this.unknownStringIndexCount = data.readUInt16()

        data.offset = this.sceneRootNodeIndexOffset
        for (var i = 0; i < this.sceneRootNodeIndexCount; ++i) {
            this.stringOffset = data.readUInt16()
            var oldPos = data.offset
            data.offset = this.stringOffset
            this.SceneRootNodes.push(data.readString())
            data.offset = oldPos
        }

        data.offset = this.unknownStringIndexOffset
        for (var i = 0; i < this.unknownStringIndexCount; ++i) {
            this.stringOffset = data.readUInt16()
            var oldPos = data.offset
            data.offset = this.stringOffset
            this.UnknownStrings.push(data.readString())
            data.offset = oldPos
        }
    }

    Serialize(size: number, srdi: string, srdv: string): CustomBuffer {
        var buffer = new CustomBuffer(size)
        buffer.writeInt32(this.Unknown10)
        buffer.writeUInt16(this.sceneRootNodeIndexOffset)
        buffer.writeUInt16(this.sceneRootNodeIndexCount)
        buffer.writeUInt16(this.unknownStringIndexOffset)
        buffer.writeUInt16(this.unknownStringIndexCount)

        buffer.offset = this.sceneRootNodeIndexOffset
        for (var i = 0; i < this.sceneRootNodeIndexCount; ++i) {
            buffer.writeUInt16(this.stringOffset)
            var oldPos = buffer.offset
            buffer.offset = this.stringOffset
            buffer.writeString(this.SceneRootNodes[i])
            buffer.offset = oldPos
        }

        buffer.offset = this.unknownStringIndexOffset
        for (var i = 0; i < this.unknownStringIndexCount; ++i) {
            buffer.writeUInt16(this.stringOffset)
            var oldPos = buffer.offset
            buffer.offset = this.stringOffset
            buffer.writeString(this.UnknownStrings[i])
            buffer.offset = oldPos
        }

        buffer.offset = 0
        return buffer
    }

    GetInfo(): String {
        return `Block Type ${this.BlockType}\nScene Root Nodes: ${this.SceneRootNodes}\n`
    }
}