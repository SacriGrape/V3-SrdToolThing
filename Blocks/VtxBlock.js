"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.VtxBlock = void 0;
var block_1 = require("./block");
var CustomBuffer_1 = require("../Utils/CustomBuffer");
var VertexDataSection = /** @class */ (function () {
    function VertexDataSection(startOffset, sizePerVertex) {
        this.StartOffset = startOffset;
        this.SizePerVertex = sizePerVertex;
    }
    return VertexDataSection;
}());
var VtxBlock = /** @class */ (function (_super) {
    __extends(VtxBlock, _super);
    function VtxBlock() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.UnknownShortList = [];
        _this.VertexDataSections = [];
        _this.BindBoneList = [];
        _this.UnknownFloatList = [];
        _this.unknownShortList = [];
        _this.boneNameOffsets = [];
        _this.unknownFloatList = [];
        return _this;
    }
    VtxBlock.prototype.Deserialize = function (data, srdiPath, srdvPath) {
        this.VectorCount = data.readInt32();
        this.Unknown14 = data.readInt16();
        this.MeshType = data.readInt16();
        this.VertexCount = data.readInt32();
        this.Unknown1C = data.readInt16();
        this.Unknown1E = data.readByte();
        this.vertexSubBlockCount = data.readByte();
        this.bindBoneRootOffset = data.readUInt16();
        this.vertexSubBlockListOffset = data.readUInt16();
        this.unknownFloatListOffset = data.readUInt16();
        this.bindBoneListOffset = data.readUInt16();
        this.unknown28 = data.readUInt32();
        data.readPadding(16);
        while (data.offset < this.vertexSubBlockListOffset) {
            this.unknownShortList.push(data.readInt16());
        }
        data.offset = this.vertexSubBlockListOffset;
        for (var i = 0; i < this.vertexSubBlockCount; ++i) {
            this.VertexDataSections.push(new VertexDataSection(data.readUInt32(), data.readUInt32()));
        }
        data.offset = this.bindBoneRootOffset;
        this.BindBoneRoot = data.readInt16();
        if (this.bindBoneListOffset != 0) {
            data.offset = this.bindBoneListOffset;
        }
        this.BindBoneList = [];
        while (data.offset < this.unknownFloatListOffset) {
            var boneNameOffset = data.readUInt16();
            this.boneNameOffsets.push(boneNameOffset);
            console.log(data.offset);
            if (boneNameOffset == 0) {
                console.log("BREAKING");
                break;
            }
            var oldPos = data.offset;
            data.offset = boneNameOffset;
            var readString = data.readString();
            console.log(readString);
            this.BindBoneList.push(readString);
            data.offset = oldPos;
        }
        data.offset = this.unknownFloatListOffset;
        for (var i = 0; i < this.VectorCount / 2; ++i) {
            this.unknownFloatList.push(data.readFloat32());
            this.unknownFloatList.push(data.readFloat32());
            this.unknownFloatList.push(data.readFloat32());
        }
    };
    VtxBlock.prototype.Serialize = function (size, srdiPath, srdvPath) {
        var e_1, _a;
        var buffer = new CustomBuffer_1.CustomBuffer(size);
        buffer.writeInt32(this.VectorCount);
        buffer.writeInt16(this.Unknown14);
        buffer.writeInt16(this.MeshType);
        buffer.writeInt32(this.VertexCount);
        buffer.writeInt16(this.Unknown1C);
        buffer.writeByte(this.Unknown1E);
        buffer.writeByte(this.vertexSubBlockCount);
        buffer.writeUInt16(this.bindBoneRootOffset);
        buffer.writeUInt16(this.vertexSubBlockListOffset);
        buffer.writeUInt16(this.unknownFloatListOffset);
        buffer.writeUInt16(this.bindBoneListOffset);
        buffer.writeUInt32(this.unknown28);
        buffer.readPadding(16);
        var index = 0;
        while (buffer.offset < this.vertexSubBlockListOffset) {
            buffer.writeInt16(this.unknownShortList[index]);
            index++;
        }
        buffer.offset = this.vertexSubBlockListOffset;
        for (var i = 0; i < this.vertexSubBlockCount; ++i) {
            buffer.writeUInt32(this.VertexDataSections[i].StartOffset);
            buffer.writeUInt32(this.VertexDataSections[i].SizePerVertex);
        }
        buffer.offset = this.bindBoneRootOffset;
        buffer.writeInt16(this.BindBoneRoot);
        if (this.bindBoneListOffset != 0) {
            buffer.offset = this.bindBoneListOffset;
        }
        index = 0;
        while (buffer.offset < this.unknownFloatListOffset) {
            buffer.writeUInt16(this.boneNameOffsets[index]);
            if (this.boneNameOffsets[index] == 0) {
                break;
            }
            var oldPos = buffer.offset;
            buffer.offset = this.boneNameOffsets[index];
            buffer.writeString(this.BindBoneList[index]);
            buffer.offset = oldPos;
            index++;
        }
        buffer.offset = this.unknownFloatListOffset;
        try {
            for (var _b = __values(this.unknownFloatList), _c = _b.next(); !_c.done; _c = _b.next()) {
                var float = _c.value;
                buffer.writeFloat32(float);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        buffer.offset = 0;
        return buffer;
    };
    VtxBlock.prototype.GetInfo = function () {
        var info = "Block Type " + this.blockType + "\n";
        info += "Vector Count: " + this.VectorCount + "\n";
        info += "Mesh Type: " + this.MeshType + "\n";
        info += "Vertex Count: " + this.VertexCount + "\n";
        info += "Vertex Data Sections: " + this.VertexDataSections.length + "\n";
        info += "Bind Bone Root: " + this.BindBoneRoot + "\n";
        info += "Bind Bone List: " + this.BindBoneList + "\n";
        return info;
    };
    return VtxBlock;
}(block_1.Block));
exports.VtxBlock = VtxBlock;
