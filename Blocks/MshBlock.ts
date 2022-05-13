import { read, writeFileSync } from "fs";
import { CompareArrays, CompareBuffers } from "../Utils/CompareBuffers";
import { CustomBuffer } from "../Utils/CustomBuffer"
import { Block } from "./block"

export class MshBlock extends Block {
    Unknown00: number; // Unknown, possibly refers to number of 
    ResourceNameOffset: number; // Points to string
    ResourceName: string // Seems to be some kind of ID
    LambertStringOffset: number; // Points to lambert
    LambertString: string; // Usually lambert though I have seen it as other things
    AlphaLayerStringOffset: number; // Points to a string
    AlphaLayerString: string; // Seems to always have something to do with Alpha or None or Layer, etc.
    FirstStrOffsetOffset: number; // Offset to the first Str offset, redundant
    FirstMap1OffsetOffset: number; // Offset to the first Map1 offset, likely useful for sorting the array of strings
    FirstMappedStringOffsetOffset: number; //  Offset to the first Mapped string offset, likely used for sorting the array of strings
    StrOffsets: number[] = []; // Offsets to the mapped stuff
    MappedStrings: string[] = [] // Not just the mapped strings, all of them because brain too tiny to figure out order stuff
    HasColorSet: number // 0 for no, 1 for yes
    HasLightMap: number // 1 for no, 2 for yes
    MappedStringCount: number // Count of the mapped ones that actually matter?
    Unknown13: number // Unknown


    Deserialize(data: CustomBuffer, srdiPath: string, srdvPath: string) {
        this.Unknown00 = data.readInt32()
        this.ResourceNameOffset = data.readInt16()
        this.LambertStringOffset = data.readInt16()
        this.AlphaLayerStringOffset = data.readInt16()
        this.FirstStrOffsetOffset = data.readInt16()
        this.FirstMap1OffsetOffset = data.readInt16()
        this.FirstMappedStringOffsetOffset = data.readInt16()
        this.HasColorSet = data.readByte()
        this.HasLightMap = data.readByte()
        this.MappedStringCount = data.readByte()
        this.Unknown13 = data.readByte()

        var strOffCount = 0
        switch(this.HasColorSet) {
            case 0:
                strOffCount += 0
                break
            case 1:
                strOffCount += 1
                break
            default:
                console.log("FOUND NEW COMBO FOR BYTE1: ", this.HasColorSet, " TELL SACRI IN THE SPIRAL SERVER!!!!")
        }

        switch(this.HasLightMap) {
            case 1:
                strOffCount += 0
                break
            case 2:
                strOffCount += 1
                break
            default:
                console.log("FOUND NEW COMBO FOR BYTE2: ", this.HasLightMap, " TELL SACRI IN THE SPIRAL SERVER!!!! (File)")
        }

        strOffCount += (this.MappedStringCount * 2) + 1

        for (var i = 0; i < strOffCount; i++) {
            var strOffset = data.readInt16()
            this.StrOffsets.push(strOffset)
            var oldPos = data.offset
            data.offset = strOffset
            var readString = data.readString()
            this.MappedStrings.push(readString)
            data.offset = oldPos
        }

        data.offset = this.ResourceNameOffset
        this.ResourceName = data.readString()
        data.offset = this.LambertStringOffset
        this.LambertString = data.readString()
        data.offset = this.AlphaLayerStringOffset
        this.AlphaLayerString = data.readString()
    }

    Serialize(srdiData: CustomBuffer, srdvData: CustomBuffer): {blockData: CustomBuffer, srdiData: CustomBuffer, srdvData: CustomBuffer} {
        var checkedStrs: string[] = []

        var re: RegExp = /([A-Z])+([0-9]+)/g
        
        this.HasColorSet = 0
        this.HasLightMap = 1
        this.MappedStringCount = 0

        var i = 0
        for (var i = 0; i < this.MappedStrings.length; i++) { // Looping over strings and gathering info
            var str = this.MappedStrings[i]
            if (str.includes("colorSet")) {
                this.HasColorSet = 1
            }

            if (str.includes("lightmap") || str.includes("map2")) {
                this.HasLightMap = 2
            }

            if (str.match(re)) {
                this.MappedStringCount += 1
            }

            if(checkedStrs.includes(str)) {
                continue
            }
        
            checkedStrs.push(str)
        }

        this.UpdateSize()
        var data = new CustomBuffer(this.DataSize)
        data.writeInt32(3)
        data.offset += 12
        data.writeByte(this.HasColorSet)
        data.writeByte(this.HasLightMap)
        data.writeByte(this.MappedStringCount)
        data.writeByte(this.Unknown13)
        
        var strOffCount = 0
        switch(this.HasColorSet) {
            case 0:
                strOffCount += 0
                break
            case 1:
                strOffCount += 1
                break
        }

        switch(this.HasLightMap) {
            case 1:
                strOffCount += 0
                break
            case 2:
                strOffCount += 1
                break
        }

        strOffCount += (this.MappedStringCount * 2) + 1
        data.offset += strOffCount * 2
        
        this.ResourceNameOffset = data.offset
        data.writeString(this.ResourceName)
        this.LambertStringOffset = data.offset
        data.writeString(this.LambertString)
        this.AlphaLayerStringOffset = data.offset
        data.writeString(this.AlphaLayerString)

        var mappedOffsets = []
        for (var str of checkedStrs) {
            mappedOffsets.push(data.offset)
            data.writeString(str)
        }

        data.offset = 4
        data.writeInt16(this.ResourceNameOffset)
        data.writeInt16(this.LambertStringOffset)
        data.writeInt16(this.AlphaLayerStringOffset)
        data.writeInt16(20)
        data.offset += 8

        var map1OffsetOffset = data.offset
        var map1Index
        var lightmapIndex
        var index = 0
        data.writeInt16(mappedOffsets[index])
        map1Index = index
        index++
        if (this.HasColorSet == 1) {
            map1OffsetOffset = data.offset
            data.writeInt16(mappedOffsets[index])
            map1Index = index
            index++
        }
        if (this.HasLightMap == 2) {
            data.writeInt16(mappedOffsets[index])
            lightmapIndex = index
            index++
        }
        var firstMappedStringOffsetOffset = data.offset
        for (var i = 0; i < this.MappedStringCount; i++) {
            data.writeInt16(mappedOffsets[index])
            data.writeInt16(mappedOffsets[map1Index])
            index++
        }

        data.offset = 12
        data.writeInt16(map1OffsetOffset)
        if (this.MappedStringCount <= 0) {
            data.writeInt16(this.ResourceNameOffset)
        } else {
            data.writeInt16(firstMappedStringOffsetOffset)
        }

        data.offset = 0
        return {blockData: data, srdiData: srdiData, srdvData: srdvData}
    }

    UpdateSize() {
        this.DataSize = 20
        this.DataSize += this.MappedStrings.length * 2
        this.DataSize += (this.ResourceName.length + 1) + (this.LambertString.length + 1) +  (this.AlphaLayerString.length + 1)

        let checkedStrings = []
        for (let string of this.MappedStrings) {
            if (!checkedStrings.includes(string)) {
                this.DataSize += string.length + 1
                checkedStrings.push(string)
            }
        }
    }
}