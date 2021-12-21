"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
exports.__esModule = true;
exports.ChangeMeshes = exports.GetMeshes = exports.GetMaterials = exports.Mesh = exports.MeshData = exports.TextureSlot = exports.Material = void 0;
var TxiBlock_1 = require("./Blocks/TxiBlock");
var TextureType;
(function (TextureType) {
    TextureType[TextureType["Lightmap"] = 0] = "Lightmap";
    TextureType[TextureType["Diffuse"] = 1] = "Diffuse";
    TextureType[TextureType["Normals"] = 2] = "Normals";
    TextureType[TextureType["Specular"] = 3] = "Specular";
    TextureType[TextureType["Opacity"] = 4] = "Opacity";
    TextureType[TextureType["Reflection"] = 5] = "Reflection";
})(TextureType || (TextureType = {}));
var Material = /** @class */ (function () {
    function Material() {
        this.textureSlots = [];
    }
    return Material;
}());
exports.Material = Material;
var TextureSlot = /** @class */ (function () {
    function TextureSlot() {
    }
    return TextureSlot;
}());
exports.TextureSlot = TextureSlot;
var MeshData = /** @class */ (function () {
    function MeshData(Vertices, normals, texcoords, indices, bones, weights) {
        this.Vertices = Vertices;
        this.Normals = normals;
        this.Texcoords = texcoords;
        this.Indices = indices;
        this.bones = bones;
        this.weights = weights;
    }
    return MeshData;
}());
exports.MeshData = MeshData;
var Mesh = /** @class */ (function () {
    function Mesh() {
    }
    return Mesh;
}());
exports.Mesh = Mesh;
function GetMaterials(srd) {
    var e_1, _a, e_2, _b, e_3, _c, e_4, _d;
    var materialList = [];
    var matBlocks = [];
    var txiBlocks = [];
    try {
        for (var _e = __values(srd.blocks), _f = _e.next(); !_f.done; _f = _e.next()) {
            var block = _f.value;
            if (block.blockType == "$MAT") {
                matBlocks.push(block);
            }
            else if (block.blockType == "$TXI") {
                txiBlocks.push(block);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_f && !_f.done && (_a = _e["return"])) _a.call(_e);
        }
        finally { if (e_1) throw e_1.error; }
    }
    try {
        for (var matBlocks_1 = __values(matBlocks), matBlocks_1_1 = matBlocks_1.next(); !matBlocks_1_1.done; matBlocks_1_1 = matBlocks_1.next()) {
            var mat = matBlocks_1_1.value;
            var matResources = mat.Children[0];
            var material = new Material;
            material.name = matResources.ResourceStringList[0];
            var matchingTxi = new TxiBlock_1.TxiBlock;
            try {
                for (var _g = (e_3 = void 0, __values(mat.MapTexturePairs)), _h = _g.next(); !_h.done; _h = _g.next()) {
                    var pair = _h.value;
                    try {
                        for (var txiBlocks_1 = (e_4 = void 0, __values(txiBlocks)), txiBlocks_1_1 = txiBlocks_1.next(); !txiBlocks_1_1.done; txiBlocks_1_1 = txiBlocks_1.next()) {
                            var txi = txiBlocks_1_1.value;
                            var txiResources = txi.Children[0];
                            if (txiResources.ResourceStringList[0] == pair[1]) {
                                matchingTxi = txi;
                                break;
                            }
                        }
                    }
                    catch (e_4_1) { e_4 = { error: e_4_1 }; }
                    finally {
                        try {
                            if (txiBlocks_1_1 && !txiBlocks_1_1.done && (_d = txiBlocks_1["return"])) _d.call(txiBlocks_1);
                        }
                        finally { if (e_4) throw e_4.error; }
                    }
                    var texSlot = new TextureSlot;
                    texSlot.filePath = matchingTxi.TextureFilename;
                    if (pair[0].startsWith("COLORMAP")) {
                        if (matchingTxi.TextureFilename.startsWith("lm")) {
                            texSlot.type = TextureType.Lightmap;
                        }
                        else {
                            texSlot.type = TextureType.Diffuse;
                        }
                    }
                    else if (pair[0].startsWith("NORMALMAP")) {
                        texSlot.type = TextureType.Normals;
                    }
                    else if (pair[0].startsWith("SPECULARMAP")) {
                        texSlot.type = TextureType.Specular;
                    }
                    else if (pair[0].startsWith("TRANSPARENCYMAP")) {
                        texSlot.type = TextureType.Opacity;
                    }
                    else if (pair[0].startsWith("REFLECTIONMAP")) {
                        texSlot.type = TextureType.Reflection;
                    }
                    else {
                        throw new Error("Unknown texture type");
                    }
                    texSlot.index = parseInt(pair[0][pair[0].length - 1]); // Potentially the incorrect way of doing this.
                    material.textureSlots.push(texSlot);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_h && !_h.done && (_c = _g["return"])) _c.call(_g);
                }
                finally { if (e_3) throw e_3.error; }
            }
            materialList.push(material);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (matBlocks_1_1 && !matBlocks_1_1.done && (_b = matBlocks_1["return"])) _b.call(matBlocks_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return materialList;
}
exports.GetMaterials = GetMaterials;
function GetMeshes(srd, materials) {
    var e_5, _a, e_6, _b, e_7, _c;
    var sklBlocks = []; // Don't care about skeleton data, characters don't use it
    var vtxBlocks = []; // Vertex data, NEEDED
    var mshBlocks = []; // Mesh data, NEEDED
    try {
        for (var _d = __values(srd.blocks), _e = _d.next(); !_e.done; _e = _d.next()) {
            var block = _e.value;
            if (block.blockType == "$SKL") {
                sklBlocks.push(block);
            }
            else if (block.blockType == "$VTX") {
                vtxBlocks.push(block);
            }
            else if (block.blockType == "$MSH") {
                mshBlocks.push(block);
            }
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (_e && !_e.done && (_a = _d["return"])) _a.call(_d);
        }
        finally { if (e_5) throw e_5.error; }
    }
    var extractedData = [];
    try {
        for (var mshBlocks_1 = __values(mshBlocks), mshBlocks_1_1 = mshBlocks_1.next(); !mshBlocks_1_1.done; mshBlocks_1_1 = mshBlocks_1.next()) {
            var msh = mshBlocks_1_1.value;
            var vtx = vtxBlocks.find(function (vtx) { return vtx.Children[0].ResourceStringList[0] == msh.VertexBlockName; });
            var vtxResources = vtx.Children[0];
            var externalData = vtxResources.ExternalData[0];
            var curVertexList = [];
            var curNormalList = [];
            var curTexcoordList = [];
            var curWeightList = [];
            try {
                for (var _f = (e_7 = void 0, __values(vtx.VertexDataSections)), _g = _f.next(); !_g.done; _g = _f.next()) {
                    var section = _g.value;
                    externalData.offset = section.StartOffset;
                    for (var vNum = 0; vNum < vtx.VertexCount; ++vNum) {
                        var oldPos = externalData.offset;
                        switch (vtx.VertexDataSections.indexOf(section)) {
                            case 0:
                                var vertex = { x: null, y: null, z: null };
                                vertex.x = externalData.readFloat32() * -1.0;
                                vertex.y = externalData.readFloat32();
                                vertex.z = externalData.readFloat32();
                                curVertexList.push(vertex);
                                var normal = { x: null, y: null, z: null };
                                normal.x = externalData.readFloat32() * -1.0;
                                normal.y = externalData.readFloat32();
                                normal.z = externalData.readFloat32();
                                curNormalList.push(normal);
                                if (vtx.VertexDataSections.length == 1) {
                                    var texcoord = { x: null, y: null };
                                    texcoord.x = Infinity;
                                    texcoord.x = externalData.readFloat32();
                                    while (texcoord.x == Infinity || texcoord.x == null) {
                                        console.log("I'm in here for some reason?");
                                        texcoord.x = externalData.readFloat32();
                                    }
                                    texcoord.y = externalData.readFloat32();
                                    while (texcoord.y == null || texcoord.y == Infinity) {
                                        console.log("I'm in here for some reason?");
                                        texcoord.y = externalData.readFloat32();
                                    }
                                    if (texcoord.x == null || texcoord.y == null || Math.abs(texcoord.x) > 1 || Math.abs(texcoord.y) > 1) {
                                        console.log("INVALID UVs");
                                    }
                                    curTexcoordList.push(texcoord);
                                }
                                break;
                        }
                        var remainingBytes = section.SizePerVertex - (externalData.offset - oldPos);
                        externalData.offset += remainingBytes;
                    }
                    externalData = vtxResources.ExternalData[1];
                    var curIndexList = [];
                    while (externalData.offset < externalData.BaseBuffer.length) {
                        var indices = [];
                        for (var i = 0; i < 3; ++i) {
                            var index = externalData.readUInt16();
                            indices[3 - (i + 1)] = index;
                        }
                        curIndexList.push(indices);
                    }
                    extractedData.push(new MeshData(curVertexList, curNormalList, curTexcoordList, curIndexList, vtx.BindBoneList, curWeightList));
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (_g && !_g.done && (_c = _f["return"])) _c.call(_f);
                }
                finally { if (e_7) throw e_7.error; }
            }
        }
    }
    catch (e_6_1) { e_6 = { error: e_6_1 }; }
    finally {
        try {
            if (mshBlocks_1_1 && !mshBlocks_1_1.done && (_b = mshBlocks_1["return"])) _b.call(mshBlocks_1);
        }
        finally { if (e_6) throw e_6.error; }
    }
    return extractedData;
}
exports.GetMeshes = GetMeshes;
function ChangeMeshes(oldSrd, meshInfo) {
    var e_8, _a;
    var UpdatedSrd = oldSrd;
    var vtxBlocks = [];
    try {
        for (var _b = __values(oldSrd.blocks), _c = _b.next(); !_c.done; _c = _b.next()) {
            var block = _c.value;
            if (block.blockType == "$VTX") {
                vtxBlocks.push({ VtxBlock: block, index: oldSrd.blocks.indexOf(block) });
            }
        }
    }
    catch (e_8_1) { e_8 = { error: e_8_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
        }
        finally { if (e_8) throw e_8.error; }
    }
    var vtx = vtxBlocks.find(function (vtx) { return (vtx.VtxBlock.VertexCount == meshInfo.Vertices.length); });
    var modvtx = vtx.VtxBlock;
    var externalData = modvtx.Children[0].ExternalData[0];
    externalData.offset = vtx.VtxBlock.VertexDataSections[0].StartOffset;
    for (var i = 0; i < meshInfo.Vertices.length; ++i) {
        externalData.writeFloat32(meshInfo.Vertices[i].x / -1.0);
        externalData.writeFloat32(meshInfo.Vertices[i].y);
        externalData.writeFloat32(meshInfo.Vertices[i].z);
        externalData.writeFloat32(meshInfo.Normals[i].x / -1.0);
        externalData.writeFloat32(meshInfo.Normals[i].y);
        externalData.writeFloat32(meshInfo.Normals[i].z);
        if (vtx.VtxBlock.VertexDataSections.length == 1) {
            externalData.writeFloat32(meshInfo.Texcoords[i].x);
            externalData.writeFloat32(meshInfo.Texcoords[i].y);
        }
        externalData.offset += 16;
    }
    modvtx.Children[0].ExternalData[0] = externalData;
    UpdatedSrd.blocks[vtx.index] = modvtx;
    return UpdatedSrd;
}
exports.ChangeMeshes = ChangeMeshes;
