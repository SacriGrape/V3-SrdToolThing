import { writeFileSync } from "fs";
import { SrdFile } from "./SrdFile";


var srdFile = new SrdFile
srdFile.loadFromPath("C:\\Users\\evan6\\Downloads\\DRV3-Sharp_overhaul2_Release_2021-12-18\\model.srd", "", "")
var data = srdFile.writeBlocks("", "")
writeFileSync("model.srd", data.BaseBuffer)