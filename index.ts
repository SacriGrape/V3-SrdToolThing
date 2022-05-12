import { writeFileSync } from "fs";
import { Block } from "./Blocks/block";
import { SrdFile } from "./SrdFile";

var tempExemps: string[] = ["$MSH", "$MAT", "$VTX", "$RSI"]

let fileNumber = 0
let pathPrefix = "C:\\Users\\evan6\\Downloads\\DRV3-Sharp_overhaul2_Release_2021-12-18\\"
let srdPath = pathPrefix + "model.srd"
let srdiPath = pathPrefix + "model.srdi"
let srdvPath = pathPrefix + "model.srdv"

var srdFile = new SrdFile
srdFile.loadFromPath(srdPath, srdiPath, srdvPath)
//readSaveChildren(srdFile.blocks, "$RSI")
let rsiBlocks = getBlocksOfType(srdFile.blocks, "$RSI")
let rsiBlocksClone = cloneBlockArray(rsiBlocks)
readSaveChildren(srdFile.blocks, "$RSI")
updateSizes(rsiBlocks)
compareSizes(rsiBlocks, rsiBlocksClone, "$RSI")
//readSaveChildren(srdFile.blocks, "$RSI")
//var data = srdFile.writeBlocks("", "")
//writeFileSync("model.srd", data.BaseBuffer)


function readSaveChildren(Children: Block[], filterType: string) {
    for (let child of Children) {
        if (child.Children.length > 0) {
            readSaveChildren(child.Children, filterType)
        }

        if (child.BlockType == filterType) {
            child.SaveInfo(`${filterType}${fileNumber}`)
            fileNumber++
        }
     }
}

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
            console.log("Updating Size")
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
                console.log(`${child.DataSize} VS ${child2.DataSize}`)
            }
        }

        if (child.BlockType == filterType) {
            
        }
    }
}