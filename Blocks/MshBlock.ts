import { read, writeFileSync } from "fs";
import { CompareArrays, CompareBuffers } from "../Utils/CompareBuffers";
import { CustomBuffer } from "../Utils/CustomBuffer"
import { Block } from "./block"

export class MshBlock extends Block {
    Unknown00: number;
    UnknownStringIdOffset: number;
    UnknownStringId: string
    LambertStringOffset: number;
    LambertString: string;
    AlphaLayerStringOffset: number;
    AlphaLayerString: string;
    FirstStrOffsetOffset: number;
    StrOffsets: number[] = [];
    mappedStrings: string[] = []
    UnknownByte1: number
    UnknownByte2: number
    MappedStringCount: number
    UnknownByte4: number


    Deserialize(data: CustomBuffer, srdiPath: string, srdvPath: string) {
        writeFileSync("testData.bin", data.BaseBuffer)
        this.Unknown00 = data.readInt32()
        this.UnknownStringIdOffset = data.readInt16() 
        this.LambertStringOffset = data.readInt16()
        this.AlphaLayerStringOffset = data.readInt16()
        data.readInt16() // Seems like it points to the start of StrOffsets but that is kind of redundant considering I don't think it has anything to do with the amount of them
        data.readInt16() // Unknown short, seems to have some link to the short before it, though unsure what that link is
        data.readInt16() // Unknown short, seems to have some link to the second StrOff or the First string (regardless of number of strOffsets?)
        this.UnknownByte1 = data.readByte() // Handles lightmap or something
        this.UnknownByte2 = data.readByte() // handles 
        this.MappedStringCount = data.readByte() // handles number of 
        this.UnknownByte4 = data.readByte() // Unknown use?

        var strOffCount = 0
        switch(this.UnknownByte1) {
            case 0:
                strOffCount += 0
                break
            case 1:
                strOffCount += 1
                break
            default:
                console.log("FOUND NEW COMBO FOR BYTE1: ", this.UnknownByte1)
        }

        switch(this.UnknownByte2) {
            case 1:
                strOffCount += 0
                break
            case 2:
                strOffCount += 1
                break
            default:
                console.log("FOUND NEW COMBO FOR BYTE2: ", this.UnknownByte2)
        }

        strOffCount += (this.MappedStringCount * 2) + 1

        for (var i = 0; i < strOffCount; i++) {
            var strOffset = data.readInt16()
            this.StrOffsets.push(strOffset)
            var oldPos = data.offset
            data.offset = strOffset
            var readString = data.readString()
            this.mappedStrings.push(readString)
            data.offset = oldPos
        }

        data.offset = this.UnknownStringIdOffset
        this.UnknownStringId = data.readString()
        data.offset = this.LambertStringOffset
        this.LambertString = data.readString()
        data.offset = this.AlphaLayerStringOffset
        this.AlphaLayerString = data.readString()
    }
}