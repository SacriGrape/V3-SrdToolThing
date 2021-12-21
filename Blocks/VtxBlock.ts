import { Block } from "./block"
import { CustomBuffer } from "../Utils/CustomBuffer";

class VertexDataSection {
    StartOffset: number
    SizePerVertex: number

    constructor(startOffset: number, sizePerVertex: number) {
        this.StartOffset = startOffset
        this.SizePerVertex = sizePerVertex
    }
}


export class VtxBlock extends Block {
    VectorCount: number
    Unknown14: number
    MeshType: number
    VertexCount: number
    Unknown1C: number
    Unknown1E: number
    Unknown28: number
    UnknownShortList: number[] = []
    VertexDataSections: VertexDataSection[] = []
    BindBoneRoot: number
    BindBoneList: string[] = []
    UnknownFloatList: number[] = []
    vertexSubBlockCount: number
    bindBoneRootOffset: number
    vertexSubBlockListOffset: number
    unknownFloatListOffset: number
    bindBoneListOffset: number
    unknown28: number
    unknownShortList: number[] = []
    boneNameOffsets: number[] = []
    unknownFloatList: number[] = []

    Deserialize(data: CustomBuffer, srdiPath: string, srdvPath: string) {
        this.VectorCount = data.readInt32()
        this.Unknown14 = data.readInt16()
        this.MeshType = data.readInt16()
        this.VertexCount = data.readInt32()
        this.Unknown1C = data.readInt16()
        this.Unknown1E = data.readByte()
        this.vertexSubBlockCount = data.readByte()
        this.bindBoneRootOffset = data.readUInt16()
        this.vertexSubBlockListOffset = data.readUInt16()
        this.unknownFloatListOffset = data.readUInt16()
        this.bindBoneListOffset = data.readUInt16()
        this.unknown28 = data.readUInt32()
        data.readPadding(16)

        while (data.offset < this.vertexSubBlockListOffset) {
            this.unknownShortList.push(data.readInt16())
        }

        data.offset = this.vertexSubBlockListOffset
        for (var i = 0; i < this.vertexSubBlockCount; ++i) {
            this.VertexDataSections.push(new VertexDataSection(data.readUInt32(), data.readUInt32()))
        }

        data.offset = this.bindBoneRootOffset
        this.BindBoneRoot = data.readInt16()

        if (this.bindBoneListOffset != 0) {
            data.offset = this.bindBoneListOffset
        }

        this.BindBoneList = []
        while (data.offset < this.unknownFloatListOffset) {
            var boneNameOffset = data.readUInt16()
            this.boneNameOffsets.push(boneNameOffset)
            console.log(data.offset)

            if (boneNameOffset == 0) {
                console.log("BREAKING")
                break;
            }

            var oldPos = data.offset
            data.offset = boneNameOffset
            var readString = data.readString()
            console.log(readString)
            this.BindBoneList.push(readString)
            data.offset = oldPos
        }

        data.offset = this.unknownFloatListOffset
        for (var i = 0; i < this.VectorCount / 2; ++i) {
            this.unknownFloatList.push(data.readFloat32())
            this.unknownFloatList.push(data.readFloat32())
            this.unknownFloatList.push(data.readFloat32())
        }
    }

    Serialize(size: number, srdiPath: string, srdvPath: string): CustomBuffer {
        var buffer = new CustomBuffer(size)

        buffer.writeInt32(this.VectorCount)
        buffer.writeInt16(this.Unknown14)
        buffer.writeInt16(this.MeshType)
        buffer.writeInt32(this.VertexCount)
        buffer.writeInt16(this.Unknown1C)
        buffer.writeByte(this.Unknown1E)
        buffer.writeByte(this.vertexSubBlockCount)
        buffer.writeUInt16(this.bindBoneRootOffset)
        buffer.writeUInt16(this.vertexSubBlockListOffset)
        buffer.writeUInt16(this.unknownFloatListOffset)
        buffer.writeUInt16(this.bindBoneListOffset)
        buffer.writeUInt32(this.unknown28)
        buffer.readPadding(16)

        var index = 0
        while (buffer.offset < this.vertexSubBlockListOffset) {
            buffer.writeInt16(this.unknownShortList[index])
            index++
        }

        buffer.offset = this.vertexSubBlockListOffset
        for (var i = 0; i < this.vertexSubBlockCount; ++i) {
            buffer.writeUInt32(this.VertexDataSections[i].StartOffset)
            buffer.writeUInt32(this.VertexDataSections[i].SizePerVertex)
        }

        buffer.offset = this.bindBoneRootOffset
        buffer.writeInt16(this.BindBoneRoot)

        if (this.bindBoneListOffset != 0) {
            buffer.offset = this.bindBoneListOffset
        }

        index = 0
        while (buffer.offset < this.unknownFloatListOffset) {
            buffer.writeUInt16(this.boneNameOffsets[index])

            if (this.boneNameOffsets[index] == 0) {
                break;
            }

            var oldPos = buffer.offset
            buffer.offset = this.boneNameOffsets[index]
            buffer.writeString(this.BindBoneList[index])
            buffer.offset = oldPos
            index++
        }

        buffer.offset = this.unknownFloatListOffset
        for (var float of this.unknownFloatList) {
            buffer.writeFloat32(float)
        }

        buffer.offset = 0
        return buffer
    }

    GetInfo() {
        var info = `Block Type ${this.blockType}\n`
        info += `Vector Count: ${this.VectorCount}\n`
        info += `Mesh Type: ${this.MeshType}\n`
        info += `Vertex Count: ${this.VertexCount}\n`
        info += `Vertex Data Sections: ${this.VertexDataSections.length}\n`
        info += `Bind Bone Root: ${this.BindBoneRoot}\n`
        info += `Bind Bone List: ${this.BindBoneList}\n`
        return info
    }
}
