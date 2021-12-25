import { writeFile, writeFileSync } from "fs"
import { Block } from "./Blocks/block"
import { MatBlock } from "./Blocks/MatBlock"
import { MshBlock } from "./Blocks/MshBlock"
import { RsiBlock } from "./Blocks/RsiBlock"
import { TxiBlock } from "./Blocks/TxiBlock"
import { VtxBlock } from "./Blocks/VtxBlock"
import { SrdFile } from "./SrdFile"

enum TextureType {
    Lightmap,
    Diffuse,
    Normals,
    Specular,
    Opacity,
    Reflection
}

export class Material {
    name: String
    textureSlots: TextureSlot[] = []
}

export class TextureSlot {
    filePath: string
    type: TextureType
    index: number
}

export class MeshData {
    Vertices: {x: number, y: number, z: number}[]
    Normals: {x: number, y: number, z: number}[]
    Texcoords: {x: number, y: number}[]
    Indices: number[][]
    bones: String[]
    weights: number[]

    constructor(Vertices: {x: number, y: number, z: number}[], normals: {x: number, y: number, z: number}[], texcoords: {x: number, y: number}[], indices: number[][], bones: String[], weights: number[]) {
        this.Vertices = Vertices
        this.Normals = normals
        this.Texcoords = texcoords
        this.Indices = indices
        this.bones = bones
        this.weights = weights
    }
}

export class Mesh {}

export function GetMaterials(srd: SrdFile) {
    var materialList: Material[] = []

    var matBlocks: MatBlock[] = []
    var txiBlocks: TxiBlock[] = []
    for (var block of srd.blocks) {
        if (block.BlockType == "$MAT") {
            matBlocks.push(block)
        } else if (block.BlockType == "$TXI") {
            txiBlocks.push(block)
        }
    }

    for (var mat of matBlocks) {
        var matResources = mat.Children[0] as RsiBlock

        var material = new Material
        material.name = matResources.ResourceStringList[0]

        var matchingTxi = new TxiBlock
        for (var pair of mat.MapTexturePairs) {
            for (var txi of txiBlocks) {
                var txiResources = txi.Children[0] as RsiBlock
                if (txiResources.ResourceStringList[0] == pair[1]) {
                    matchingTxi = txi
                    break
                }
            }
        
        var texSlot = new TextureSlot
        texSlot.filePath = matchingTxi.TextureFilename
        if (pair[0].startsWith("COLORMAP")) {
            if (matchingTxi.TextureFilename.startsWith("lm")) {
                texSlot.type = TextureType.Lightmap
            } else {
                texSlot.type = TextureType.Diffuse
            }
        } else if (pair[0].startsWith("NORMALMAP")) {
            texSlot.type = TextureType.Normals
        } else if (pair[0].startsWith("SPECULARMAP")) {
            texSlot.type = TextureType.Specular
        } else if (pair[0].startsWith("TRANSPARENCYMAP")) {
            texSlot.type = TextureType.Opacity
        } else if (pair[0].startsWith("REFLECTIONMAP")) {
            texSlot.type = TextureType.Reflection
        } else {
            throw new Error("Unknown texture type")
        }

            texSlot.index = parseInt(pair[0][pair[0].length - 1]) // Potentially the incorrect way of doing this.

            material.textureSlots.push(texSlot)
        }
        materialList.push(material)
    }
    return materialList

}

export function GetMeshes(srd: SrdFile, materials: Material[]) {
    var sklBlocks: Block[] = [] // Don't care about skeleton data, characters don't use it
    var vtxBlocks: VtxBlock[] = [] // Vertex data, NEEDED
    var mshBlocks: MshBlock[] = [] // Mesh data, NEEDED

    for (var block of srd.blocks) {
        if (block.BlockType == "$SKL") {
            sklBlocks.push(block)
        } else if (block.BlockType == "$VTX") {
            vtxBlocks.push(block)
        } else if (block.BlockType == "$MSH") {
            mshBlocks.push(block)
        }
    }
    
    var extractedData: MeshData[] = []
    for (var msh of mshBlocks) {
        var vtx: VtxBlock = vtxBlocks.find(vtx => (vtx.Children[0] as RsiBlock).ResourceStringList[0] == msh.VertexBlockName) as VtxBlock;
        var vtxResources = vtx.Children[0] as RsiBlock

        var externalData = vtxResources.ExternalData[0]
        var curVertexList: {x: number, y: number, z: number}[] = []
        var curNormalList: {x: number, y: number, z: number}[] = []
        var curTexcoordList: {x: number, y: number}[] = []
        var curWeightList: number[] = []
        
        for(var section of vtx.VertexDataSections) {
            externalData.offset = section.StartOffset
            for (var vNum = 0; vNum < vtx.VertexCount; ++vNum) {
                var oldPos = externalData.offset
                switch (vtx.VertexDataSections.indexOf(section)) {
                    case 0:
                        var vertex: {x: number, y: number, z: number} = {x: null, y: null, z: null}
                        vertex.x = externalData.readFloat32() * -1.0
                        vertex.y = externalData.readFloat32()
                        vertex.z = externalData.readFloat32()
                        curVertexList.push(vertex)

                        var normal: {x: number, y: number, z: number} = {x: null, y: null, z: null}
                        normal.x = externalData.readFloat32() * -1.0
                        normal.y = externalData.readFloat32()
                        normal.z = externalData.readFloat32()
                        curNormalList.push(normal)

                        if (vtx.VertexDataSections.length == 1) {
                            var texcoord: {x: number, y: number} = {x: null, y: null}
                            texcoord.x = Infinity
                            texcoord.x = externalData.readFloat32()
                            while (texcoord.x == Infinity || texcoord.x == null) {
                                console.log("I'm in here for some reason?")
                                texcoord.x = externalData.readFloat32();
                            }
                            texcoord.y = externalData.readFloat32()
                            while (texcoord.y == null || texcoord.y == Infinity) {
                                console.log("I'm in here for some reason?")
                                texcoord.y = externalData.readFloat32();
                            }

                            if (texcoord.x == null || texcoord.y == null || Math.abs(texcoord.x) > 1 || Math.abs(texcoord.y) > 1) {
                                console.log("INVALID UVs")
                            }
                            curTexcoordList.push(texcoord)
                        }
                        break;
                }

                var remainingBytes = section.SizePerVertex - (externalData.offset - oldPos)
                externalData.offset += remainingBytes
            }

            externalData = vtxResources.ExternalData[1]
            var curIndexList: number[][] = []
            while (externalData.offset < externalData.BaseBuffer.length) {
                var indices: number[] = []
                for (var i = 0; i < 3; ++i) {
                    var index = externalData.readUInt16()
                    indices[3 - (i + 1)] = index
                }
                curIndexList.push(indices)
            }

            extractedData.push(new MeshData(curVertexList, curNormalList, curTexcoordList, curIndexList, vtx.BindBoneList, curWeightList))
        }
    }
    return extractedData
}

export function ChangeMeshes(oldSrd: SrdFile, meshInfo: MeshData): SrdFile {
    var UpdatedSrd: SrdFile = oldSrd
    
    var vtxBlocks: {VtxBlock, index}[] = []

    for (var block of oldSrd.blocks) {
        if (block.BlockType == "$VTX") {
            vtxBlocks.push({VtxBlock: block, index:oldSrd.blocks.indexOf(block)})
        }
    }

    var vtx = vtxBlocks.find(vtx => (vtx.VtxBlock.VertexCount == meshInfo.Vertices.length))

    var modvtx = vtx.VtxBlock
    var externalData = (modvtx.Children[0] as RsiBlock).ExternalData[0]
    externalData.offset = vtx.VtxBlock.VertexDataSections[0].StartOffset
    for (var i = 0; i < meshInfo.Vertices.length; ++i) {
        externalData.writeFloat32(meshInfo.Vertices[i].x / -1.0)
        externalData.writeFloat32(meshInfo.Vertices[i].y)
        externalData.writeFloat32(meshInfo.Vertices[i].z)

        externalData.writeFloat32(meshInfo.Normals[i].x / -1.0)
        externalData.writeFloat32(meshInfo.Normals[i].y)
        externalData.writeFloat32(meshInfo.Normals[i].z)

        if (vtx.VtxBlock.VertexDataSections.length == 1) {
            externalData.writeFloat32(meshInfo.Texcoords[i].x)
            externalData.writeFloat32(meshInfo.Texcoords[i].y)
        }

        externalData.offset += 16
    }

    (modvtx.Children[0] as RsiBlock).ExternalData[0] = externalData

    UpdatedSrd.blocks[vtx.index] = modvtx

    return UpdatedSrd
}