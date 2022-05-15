import { info } from "console";
import { existsSync, readFileSync, writeFileSync } from "fs"
import { CustomBuffer } from "../Utils/CustomBuffer";
import { handlePadding } from "../Utils/HandlePadding";
import { Block } from "./block";

let tempBool = true

interface ExternalResourceInfo {
    address: number
    length: number
    Unknown08: number
    Unknown0C: number
}

interface ExternalResourceData {
    location: ResourceDataLocation
    data: CustomBuffer
    Unknown08: number
    Unknown0C: number
}

interface LocalResourceInfo {
    nameOffset: number
    dataOffset: number
    length: number
    Unknown0C: number
}

interface LocalResourceData {
    name: string
    data: CustomBuffer
    Unknown0C: number
}

enum ResourceDataLocation {
    Srdi = 0x20000000,
    Srdv = 0x40000000
}

export class RsiBlock extends Block {
    UnknownByte00: number
    UnknownByte01: number
    UnknownByte02: number
    UnknownShort0A: number
    ExternalResourceInfo: ExternalResourceInfo[] = []
    ExternalResourceData: ExternalResourceData[] = []
    LocalResourceInfo: LocalResourceInfo[] = []
    LocalResourceData: LocalResourceData[] = []
    UnknownIntList: number[] = []
    ResourceStringList: string[] = []

    Deserialize(blockData: CustomBuffer, srdiPath: string, srdvPath: string) {
        // Reading the blocks "Header" (Any data that isn't dynamic)
        this.UnknownByte00 = blockData.readByte()
        this.UnknownByte01 = blockData.readByte()
        this.UnknownByte02 = blockData.readByte()
        let externalResourceCount = blockData.readByte()
        let localResourceInfoCount = blockData.readInt16()
        this.UnknownShort0A = blockData.readInt16()
        let localResourceInfoOffset = blockData.readInt16()
        let unknownIntListOffset = blockData.readInt16()
        let resourceStringListOffset = blockData.readInt32()
        
        // Reading the external resource info
        for (let i = 0; i < externalResourceCount; i++) {
            let externalResourceInfo: ExternalResourceInfo = {
                address: blockData.readInt32(),
                length: blockData.readInt32(),
                Unknown08: blockData.readInt32(),
                Unknown0C: blockData.readInt32()
            }
            this.ExternalResourceInfo.push(externalResourceInfo)
        }

        // Reading the external resource data
        for (let info of this.ExternalResourceInfo) {
            let location: ResourceDataLocation = info.address & 0xF0000000
            let offset: number = info.address & 0x0FFFFFFF

            let isSrdi = location == ResourceDataLocation.Srdi

            let path = isSrdi ? srdiPath : srdvPath
            let data = readDataFromSrdx(path, offset, info.length)

            let externalData: ExternalResourceData = {
                location: location,
                data: data,
                Unknown08: info.Unknown08,
                Unknown0C: info.Unknown0C
            }

            this.ExternalResourceData.push(externalData)
        }

        // Reading local resource info
        let smallestNameOffset
        for (let i = 0; i < localResourceInfoCount; i++) {
            let nameOffset = blockData.readInt32()
            if (nameOffset < smallestNameOffset || smallestNameOffset == null) {
                smallestNameOffset = nameOffset
            }
            let localResourceInfo: LocalResourceInfo = {
                nameOffset: nameOffset,
                dataOffset: blockData.readInt32(),
                length: blockData.readInt32(),
                Unknown0C: blockData.readInt32()
            }
            this.LocalResourceInfo.push(localResourceInfo)
        }

        // Reading Local Resource Data
        for (let info of this.LocalResourceInfo) {
            // Reading the name of the data
            blockData.offset = info.nameOffset
            let name = blockData.readString()

            // Grabbing the data
            blockData.offset = info.dataOffset
            let data = blockData.readBuffer(info.length)

            // Creating the local resource data
            let localResourceData = {
                name: name,
                data: data,
                Unknown0C: info.Unknown0C
            }
            this.LocalResourceData.push(localResourceData)
        }

        // Reading the Unknown Int List
        if (unknownIntListOffset != 0) {
            blockData.offset = unknownIntListOffset
            while (blockData.offset < resourceStringListOffset) {
                this.UnknownIntList.push(blockData.readInt32())
            }
        }

        // Read Resource Strings
        if (smallestNameOffset == null) {
            smallestNameOffset = blockData.BaseBuffer.length
        }
        blockData.offset = resourceStringListOffset
        while (blockData.offset < smallestNameOffset) {
            this.ResourceStringList.push(blockData.readShiftJisString())
        }
    }

    Serialize(srdiData: CustomBuffer, srdvData: CustomBuffer): {blockData: CustomBuffer, srdiData: CustomBuffer, srdvData: CustomBuffer} {
        // Creating buffers
        let blockData = new CustomBuffer(this.GetSize())
        let localResourceData = new CustomBuffer(this.GetLocalDataSize())

        // Writing the header
        blockData.writeByte(this.UnknownByte00)
        blockData.writeByte(this.UnknownByte01)
        blockData.writeByte(this.UnknownByte02)
        blockData.writeByte(this.ExternalResourceData.length)
        blockData.writeInt16(this.LocalResourceData.length)
        blockData.writeInt16(this.UnknownShort0A)
        blockData.offset += 8 // Skipping offsets

        // Writing External Resource Info/Data
        for (let data of this.ExternalResourceData) {
            // Creating location boolean to make later code prettier
            let isSrdi = data.location == ResourceDataLocation.Srdi
            
            // Figuring out address
            let offset = isSrdi ? srdiData.offset : srdvData.offset
            let address = data.location | offset
            
            // Writing data into block
            blockData.writeInt32(address)
            blockData.writeInt32(data.data.BaseBuffer.length)
            blockData.writeInt32(data.Unknown08)
            blockData.writeInt32(data.Unknown0C)

            // Writing data into SRDX
            isSrdi ? srdiData.writeBuffer(data.data) : srdvData.writeBuffer(data.data)
            isSrdi ? srdiData.readPadding(16) : srdvData.readPadding(16)
        }
        // Writing Local Resource Info/Data
        let localResourceInfoOffset = blockData.offset
        let nameOffsetOffsets = []
        for (let data of this.LocalResourceData) {
            // Writing Resource Info
            nameOffsetOffsets.push(blockData.offset)
            blockData.offset += 4
            let dataOffsetOffset = blockData.offset
            blockData.offset += 4
            blockData.writeInt32(data.data.BaseBuffer.length)
            blockData.writeInt32(data.Unknown0C)

            // Writing Resource Data Into Buffer
            let localDataOffset = localResourceData.offset
            localResourceData.writeBuffer(data.data)
            if (this.LocalResourceData.length > this.LocalResourceData.indexOf(data) + 1) {
                localResourceData.readPadding(16)
            }

            // Writing data offset
            let oldPos = blockData.offset
            blockData.offset = dataOffsetOffset
            blockData.writeInt32(localDataOffset + (this.LocalResourceData.length * 16) + localResourceInfoOffset)
            blockData.offset = oldPos
        }
        blockData.writeBuffer(localResourceData)

        // Writing Unknown Int List if it exists
        let unknownIntListOffset = 0
        if (this.UnknownIntList.length != 0) {
            unknownIntListOffset = blockData.offset
            for (let int of this.UnknownIntList) {
                blockData.writeInt32(int)
            }
        }

        // Writing the Resource Strings
        let resourceStringListOffset = blockData.offset
        for (let string of this.ResourceStringList) {
            blockData.writeString(string)
        }

        // Writing the Name strings and their offsets back in the data list
        for (let i = 0; i < this.LocalResourceData.length; i++) {
            let data = this.LocalResourceData[i]
            let nameOffset = blockData.offset
            let nameOffsetOffset = nameOffsetOffsets[i]
            
            blockData.writeString(data.name)

            let oldPos = blockData.offset
            blockData.offset = nameOffsetOffset
            blockData.writeInt32(nameOffset)
            blockData.offset = oldPos
        }

        let oldPos = blockData.offset
        blockData.offset = 8
        blockData.writeInt16(localResourceInfoOffset)
        blockData.writeInt16(unknownIntListOffset)
        blockData.writeInt32(resourceStringListOffset)
        blockData.offset = oldPos

        if (tempBool) {
            writeFileSync("TESTDATA.bin", blockData.BaseBuffer)
            tempBool = false
        }
        return {blockData: blockData, srdiData: srdiData, srdvData: srdvData}
    }

    GetLocalDataSize(): number {
        let size = 0;
        for (let i = 0; i < this.LocalResourceData.length; i++) {
            let data = this.LocalResourceData[i]
            size += data.data.BaseBuffer.length
            if (i + 1 != this.LocalResourceData.length) {
                size = handlePadding(size)
            }
        }

        return size
    }

    GetSize(): number {
        let size = 16 // Block will always atleast be this much

        // External Resource Info Size Contribution
        size += this.ExternalResourceInfo.length * 16

        // Local Resource Info Size Contribution
        size += this.LocalResourceInfo.length * 16

        // Local Resource Data Name Contribution
        for (let data of this.LocalResourceData) {
            size += data.name.length + 1 // Null terminated string size
        }

        // Local Resource Data Contribution
        size += this.GetLocalDataSize()

        // Unknown Int List size contribution
        size += this.UnknownIntList.length * 4

        // Resource String List Size Contribution
        for (let string of this.ResourceStringList) {
            size += string.length + 1
        }
        this.DataSize = size
        return size
    }
}

function readDataFromSrdx(path: string, offset: number, size: number) {
    // Checking that SRDX is valid
    let fileExists = existsSync(path)
    if (!fileExists) throw "ERROR: SRDX file at given path does not exist"

    // Reading the SRDX file
    let srdxData = CustomBuffer.readFromFile(path)

    // Reading the data from the SRDX file
    srdxData.offset = offset
    let data = srdxData.readBuffer(size)

    return data
}