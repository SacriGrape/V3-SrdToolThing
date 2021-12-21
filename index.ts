import { writeFileSync } from "fs";
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
import { ChangeMeshes, GetMaterials, GetMeshes } from "./VertexReader";

var plotly = require('plotly')("SacriPudding", "7hoiRWFuameWaTJMbp4l")

var file = new SrdFile

var path = "C:\\Users\\evan6\\Desktop\\testModel\\model.srd"

file.loadFromPath(path, path + "i", path + "v")
var block = file.blocks.find(b => b.blockType == "$VTX") as VtxBlock

writeFileSync("block.json", JSON.stringify(block, null, 2))

var materials = GetMaterials(file)
var meshes = GetMeshes(file, materials)

var obj = ""
for (var meshData of meshes) {
    for (var vertex of meshData.Vertices) {
        obj += `v ${vertex.x} ${vertex.y} ${vertex.z}\n`
    }
    for (var indice of meshData.Indices) {
        obj += `f ${indice[0] + 1}/${indice[1] + 1}/${indice[2] + 1}`
    }
}

var newFile = file.writeBlocks(file.size, path + "v", path + "i", file.writingInfo, 0)

writeFileSync(path, newFile.BaseBuffer)