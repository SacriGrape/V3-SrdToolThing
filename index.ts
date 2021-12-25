import { exec } from "child_process";
import { existsSync, lstatSync, readdirSync, readFile, readFileSync, writeFileSync } from "fs";
import { buffer } from "stream/consumers";
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

var srdFile = new SrdFile
srdFile.loadFromPath("C:\\Users\\evan6\\Downloads\\DRV3-Sharp_overhaul2_Release_2021-12-18 (1)\\model.srd", "", "")
var data = srdFile.writeBlocks("", "")
writeFileSync("model.srd", data.BaseBuffer)
