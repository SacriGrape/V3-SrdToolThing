import { writeFileSync } from "fs";
import { Block } from "./Blocks/block";
import { SrdFile } from "./SrdFile";
import { CustomBuffer } from "./Utils/CustomBuffer"

var tempExemps: string[] = ["$MSH", "$MAT", "$VTX", "$RSI"]

let fileNumber = 0
let filterType = "$RSI"
let pathPrefix = "C:\\Users\\evan6\\Documents\\DRV3-Sharp_overhaul2_Release_2021-12-18\\"
let srdPath = pathPrefix + "model.srd"
let srdiPath = pathPrefix + "model.srdi"
let srdvPath = pathPrefix + "model.srdv"
let srdiData = CustomBuffer.readFromFile(srdiPath)
let srdvData = CustomBuffer.readFromFile(srdvPath)

var srdFile = new SrdFile
srdFile.loadFromPath(srdPath, srdiPath, srdvPath)
var data = srdFile.writeBlocks(srdiData, srdvData)
writeFileSync("model.srd", data.blockData.BaseBuffer)
writeFileSync("model.srdi", data.srdiData.BaseBuffer)
writeFileSync("model.srdv", data.srdvData.BaseBuffer)

function cloneBlockArray(blocks: Block[]): Block[] {
    let clonedBlocks: Block[] = []
    for (var block of blocks) {
        clonedBlocks.push(block.Clone())
    }
    return clonedBlocks
}

function getBlocksOfType(blocks: Block[], filterType: string): Block[] {
    let foundBlocks: Block[] = []
    for (let block of blocks) {
        if (block.Children.length > 0) {
            for (let block2 of getBlocksOfType(block.Children, filterType)) {
                foundBlocks.push(block2)
            }
        }

        if (block.BlockType == filterType) {
            foundBlocks.push(block)
        }
    }

    return foundBlocks
}

function updateSizes(Children: any[]) {
    for (let child of Children) {
        if (child.Children.length > 0) {
            updateSizes(child.Children)
        }

        if (tempExemps.includes(child.BlockType)) {
            child.UpdateSize()
        }
    }
}

function compareSizes(Children: Block[], Children2: Block[], filterType: string) {
    for (let i = 0; i < Children.length; i++) {
        let child = Children[i]
        let child2 = Children2[i]
        if (child.Children.length > 0) {
            compareSizes(child.Children, child2.Children, filterType)
        }

        if (child.BlockType == filterType) {
            if (child.DataSize != child2.DataSize) {
                console.log(`${child.DataSize} Bytes VS ${child2.DataSize} Bytes`)
            }
        }

        if (child.BlockType == filterType) {
            
        }
    }
}