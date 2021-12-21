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
var e_1, _a, e_2, _b, e_3, _c;
exports.__esModule = true;
var fs_1 = require("fs");
var SrdFile_1 = require("./SrdFile");
var VertexReader_1 = require("./VertexReader");
var plotly = require('plotly')("SacriPudding", "7hoiRWFuameWaTJMbp4l");
var file = new SrdFile_1.SrdFile;
var path = "C:\\Users\\evan6\\Desktop\\testModel\\model.srd";
file.loadFromPath(path, path + "i", path + "v");
var block = file.blocks.find(function (b) { return b.blockType == "$VTX"; });
fs_1.writeFileSync("block.json", JSON.stringify(block, null, 2));
var materials = VertexReader_1.GetMaterials(file);
var meshes = VertexReader_1.GetMeshes(file, materials);
var obj = "";
try {
    for (var meshes_1 = __values(meshes), meshes_1_1 = meshes_1.next(); !meshes_1_1.done; meshes_1_1 = meshes_1.next()) {
        var meshData = meshes_1_1.value;
        try {
            for (var _d = (e_2 = void 0, __values(meshData.Vertices)), _e = _d.next(); !_e.done; _e = _d.next()) {
                var vertex = _e.value;
                obj += "v " + vertex.x + " " + vertex.y + " " + vertex.z + "\n";
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_b = _d["return"])) _b.call(_d);
            }
            finally { if (e_2) throw e_2.error; }
        }
        try {
            for (var _f = (e_3 = void 0, __values(meshData.Indices)), _g = _f.next(); !_g.done; _g = _f.next()) {
                var indice = _g.value;
                obj += "f " + (indice[0] + 1) + "/" + (indice[1] + 1) + "/" + (indice[2] + 1);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_g && !_g.done && (_c = _f["return"])) _c.call(_f);
            }
            finally { if (e_3) throw e_3.error; }
        }
    }
}
catch (e_1_1) { e_1 = { error: e_1_1 }; }
finally {
    try {
        if (meshes_1_1 && !meshes_1_1.done && (_a = meshes_1["return"])) _a.call(meshes_1);
    }
    finally { if (e_1) throw e_1.error; }
}
var newFile = file.writeBlocks(file.size, path + "v", path + "i", file.writingInfo, 0);
fs_1.writeFileSync(path, newFile.BaseBuffer);
