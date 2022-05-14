import { statSync, writeFileSync } from "fs";
import { createInterface, Interface } from "readline";
import { Block } from "../Blocks/block";
import { RsiBlock } from "../Blocks/RsiBlock";
import { VtxBlock } from "../Blocks/VtxBlock";
import { SrdFile } from "../SrdFile";
import { CustomBuffer } from "../Utils/CustomBuffer";
var rl: Interface = createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompting user for SRD file
rl.question("Path to SRD? (Drag SRD File over Console Window)\n", function(srdPath) {
    if (srdPath.endsWith("/") || srdPath.endsWith("\\")) { // Removing any potential trailing slash
        srdPath = srdPath.slice(0, srdPath.length - 1);
    }

    let srdiPath: string = srdPath + "i"
    let srdvPath: string = srdPath + "v"

    // Making sure files actually exist
    let fileExists: boolean = statSync(srdPath).isFile();
    if (!fileExists) {
        throw "ERROR: FAILED TO READ SRD FILE, FILE DOESN'T EXIST";
    }

    fileExists = statSync(srdiPath).isFile();
    if (!fileExists) {
        throw "ERROR: FAILED TO READ SRDI FILE, FILE DOESN'T EXIST. ARE YOU SURE YOU HAVE IT IN THE SAME FOLDER AS THE SRD?";
    }

    fileExists = statSync(srdvPath).isFile();
    if (!fileExists) {
        throw "ERROR: FAILED TO READ SRDV FILE, FILE DOESN'T EXIST. ARE YOU SURE YOU HAVE IT IN THE SAME FOLDER AS THE SRD?";
    }

    // Reading files
    let srdFile: SrdFile = new SrdFile()
    srdFile.loadFromPath(srdPath, srdiPath, srdvPath)
    let srdiData: CustomBuffer = CustomBuffer.readFromFile(srdiPath);
    let srdvData: CustomBuffer = CustomBuffer.readFromFile(srdvPath);

    
    // Searching for VTX block indexs in the SRD File
    let vtxBlockIndexs: number[] = []
    for (let i = 0; i < srdFile.blocks.length; i++) {
        let block = srdFile.blocks[i]
        if (block.BlockType == "$VTX") {
            vtxBlockIndexs.push(i)
        }
    }

    // Looping through VTX Files, grabbing the SRDV data for each one
    for (let index of vtxBlockIndexs) {
        let vtxBlock: VtxBlock = srdFile.blocks[index]
        for (let child of vtxBlock.Children) {
            if (child.BlockType == "$RSI") {
                //console.log((child as RsiBlock).ResourceSubData)
            }
        }
    }

    rl.close()
});