import { Block } from "./block"
import { CustomBuffer } from "../Utils/CustomBuffer";


export class VtxBlock extends Block {
    MeshType: number // Still not a clue what this is for, will probably figure it out when I do more research into type
    VertexCount: number // Number of verticies in the SRDV file for this block
    UnknownShort0D: number // On the blocks I've checked this is always 1024, will add a check when going through all blocks for if this changes
    UnknownByte0F: number // This and the short above could potentially be
    UnknownInt3219: number // Unsure use, doesn't seem tied to anything
    UnknownShortList: number[] = [] // Unsure use, Potentially offsets? Some duplicates, 0s, and massive split between many low and many high numbers
    VertexDataSections: {StartOffset: number, SizePerVertex: number}[] = [] // Refering to sizes of data and such in RSI block
    BindBoneRoot: number // Probably some model thing I just don't get
    BindBoneList: string[] = [] // Name of the bones in the model
    UnknownFloatList: {Unknown00: number, Unknown04: number, Unknown08: number}[] = [] // Unsure use yet, sharp doesn't seem to have any guesses
    Unknownstring: string // End of file, Sharp doesn't even read

    Deserialize(data: CustomBuffer, srdiPath: string, srdvPath: string) {
        // Lets are used for values that NEED to be dynamically determined. Doesn't make sense to store block data that wouldn't be written in the Serialize method
        let VectorCount = data.readInt32()
        let PaddingPointer = data.readInt16()
        this.MeshType = data.readInt16()
        this.VertexCount = data.readInt32() 
        this.UnknownShort0D = data.readInt16()
        this.UnknownByte0F = data.readByte()
        let VertexSubBlockCount = data.readByte()
        let BindBoneRootOffset = data.readUInt16()
        let VertexSubBlockListOffset = data.readUInt16()
        let UnknownFloatListOffset = data.readUInt16()
        let BindBoneListOffset = data.readUInt16()
        this.UnknownInt3219 = data.readInt32()

        data.offset = PaddingPointer // Probably pointless but why not
        data.readPadding(16)

        let unknownShortCount = (VertexSubBlockListOffset - data.offset) / 2
        for (let i = 0; i < unknownShortCount; i++) {
            this.UnknownShortList.push(data.readUInt16());
        }

        data.offset = VertexSubBlockListOffset
        for (let i = 0; i < VertexSubBlockCount; i++) {
            let start = data.readUInt32()
            let size = data.readUInt32()
            this.VertexDataSections.push({StartOffset: start, SizePerVertex: size})
        }

        data.offset = BindBoneRootOffset
        this.BindBoneRoot = data.readUInt16()

        if (BindBoneListOffset != 0) {
            data.offset = BindBoneListOffset
        }

        while (data.offset < UnknownFloatListOffset) {
            let boneNameOffset = data.readUInt16()

            if (boneNameOffset == 0) {
                break;
            }

            let oldPos = data.offset
            data.offset = boneNameOffset
            this.BindBoneList.push(data.readString())
            data.offset = oldPos
        }

        data.offset = UnknownFloatListOffset;
        for (let i = 0; i < VectorCount/2; i++) {
            let Unknown00 = data.readFloat32()
            let Unknown04 = data.readFloat32()
            let Unknown08 = data.readFloat32()
            this.UnknownFloatList.push({Unknown00: Unknown00, Unknown04: Unknown04, Unknown08: Unknown08})
        }

        this.Unknownstring = data.readString()
    }

    Serialize(srdiPath: string, srdvPath: string): CustomBuffer {
        var size = 34

        size += (this.UnknownShortList.length * 2)
        
        size += (this.VertexDataSections.length * 8)
        
        if (this.BindBoneList.length > 0) {
            size += this.BindBoneList.length * 2
            for (let string of this.BindBoneList) {
                size += (string.length + 1)
            }
        } else {
            size += 2
        }

        size += (this.UnknownFloatList.length * 12)
        
        size += (this.Unknownstring.length + 1)
        
        let data = new CustomBuffer(size)

        data.writeInt32(this.UnknownFloatList.length * 2)
        data.offset += 2 // Jumping Padding Offset
        data.writeInt16(this.MeshType)
        data.writeInt32(this.VertexCount)
        data.writeInt16(this.UnknownShort0D)
        data.writeByte(this.UnknownByte0F)
        data.writeByte(this.VertexDataSections.length)
        data.offset += 8 // Jumping 4 Offsets
        data.writeInt32(this.UnknownInt3219)

        let paddingOffset = data.offset
        data.readPadding(16)

        for (let short of this.UnknownShortList) {
            data.writeInt16(short)
        }

        let vertexSubBlockOffset = data.offset
        for (let vertexSubDataSection of this.VertexDataSections) {
            data.writeUInt32(vertexSubDataSection.StartOffset)
            data.writeUInt32(vertexSubDataSection.SizePerVertex)
        }

        let bindBoneRootOffset = data.offset
        data.writeUInt16(this.BindBoneRoot)

        let BindBoneListOffset = data.offset

        if (this.BindBoneList.length == 0) {
            data.writeInt16(0)
        } else {
            let BindBoneNameOffsetOffset = data.offset
            data.offset += (this.BindBoneList.length * 2)
            let BindBoneNameOffsets: number[] = []
            for (let BindBoneName of this.BindBoneList) {
                BindBoneNameOffsets.push(data.offset)
                data.writeString(BindBoneName)
            }
            let endBindBoneNamesOffset = data.offset

            data.offset = BindBoneNameOffsetOffset
            for (let offset of BindBoneNameOffsets) {
                data.writeInt16(offset)
            }

            data.offset = endBindBoneNamesOffset
        }

        let UnknownFloatListOffset = data.offset
        for (let floatVector of this.UnknownFloatList) {
            data.writeFloat32(floatVector.Unknown00)
            data.writeFloat32(floatVector.Unknown04)
            data.writeFloat32(floatVector.Unknown08)
        }

        data.writeString(this.Unknownstring)

        // Writing Offsets :O
        data.offset = 4
        data.writeInt16(paddingOffset)

        data.offset = 16
        data.writeInt16(bindBoneRootOffset)
        data.writeInt16(vertexSubBlockOffset)
        data.writeInt16(UnknownFloatListOffset)
        if (this.BindBoneList.length != 0) {
            data.writeInt16(BindBoneListOffset)
        } else {
            data.writeInt16(0)
        }
        
        data.offset = 0;
        return data
    }
}
