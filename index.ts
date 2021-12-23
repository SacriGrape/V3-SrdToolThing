import { appendFileSync, readFileSync, writeFile, writeFileSync } from "fs";
import { Block } from "./Blocks/block";
import { MatBlock } from "./Blocks/MatBlock";
import { MshBlock } from "./Blocks/MshBlock";
import { RsfBlock } from "./Blocks/RsfBlock";
import { RsiBlock } from "./Blocks/RsiBlock";
import { ScnBlock } from "./Blocks/ScnBlock";
import { TreBlock } from "./Blocks/TreBlock";
import { TxiBlock } from "./Blocks/TxiBlock";
import { VtxBlock } from "./Blocks/VtxBlock";
import { SrdFile } from "./SrdFile";
import { CloneBlock } from "./Utils/CloneBlock";
import { CompareBlocks } from "./Utils/CompareBlocks";
import { CustomBuffer } from "./Utils/CustomBuffer";
import { ChangeMeshes, GetMaterials, GetMeshes } from "./VertexReader";

var srdDataOld = readFileSync("C:\\Users\\evan6\\Downloads\\DRV3-Sharp_overhaul2_Release_2021-12-18 (1)\\model.srd")
var newSrdFile = new SrdFile();
var srdData = new CustomBuffer(srdDataOld.length, srdDataOld);
newSrdFile.readBlocks(srdData, "", "")

for (var block of newSrdFile.blocks) {
    if (block.blockType == "$MSH") {
        appendFileSync(`./BlockJsons/${block.UnknownByte1}${block.UnknownByte2}${block.UnknownByte3}${block.UnknownByte4}.json`, JSON.stringify(block, null, 4) + ",\n")
    }
}