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
exports.__esModule = true;
exports.MatBlock = void 0;
var CustomBuffer_1 = require("../Utils/CustomBuffer");
var MapToArray_1 = require("../Utils/MapToArray");
var block_1 = require("./block");
var MatBlock = /** @class */ (function (_super) {
    __extends(MatBlock, _super);
    function MatBlock() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.MapTexturePairs = new Map();
        _this.TextureNameOffsets = [];
        _this.MapNameOffsets = [];
        return _this;
    }
    MatBlock.prototype.Deserialize = function (data, srdiPath, srdvPath) {
        this.Unknown10 = data.readInt32();
        this.Unknown14 = data.readFloat32();
        this.Unknown18 = data.readFloat32();
        this.Unknown1C = data.readFloat32();
        this.Unknown20 = data.readUInt16();
        this.Unknown22 = data.readUInt16();
        this.StringMapStart = data.readUInt16();
        this.stringMapCount = data.readUInt16();
        data.offset = this.StringMapStart;
        for (var i = 0; i < this.stringMapCount; ++i) {
            var textureNameOffset = data.readUInt16();
            this.TextureNameOffsets.push(textureNameOffset);
            var mapNameOffset = data.readUInt16();
            this.MapNameOffsets.push(mapNameOffset);
            var oldPos = data.offset;
            data.offset = textureNameOffset;
            var textureName = data.readString();
            data.offset = mapNameOffset;
            var mapName = data.readString();
            data.offset = oldPos;
            this.MapTexturePairs.set(mapName, textureName);
        }
    };
    MatBlock.prototype.Serialize = function (size, srdi, srdv) {
        var buffer = new CustomBuffer_1.CustomBuffer(size);
        buffer.writeInt32(this.Unknown10);
        buffer.writeFloat32(this.Unknown14);
        buffer.writeFloat32(this.Unknown18);
        buffer.writeFloat32(this.Unknown1C);
        buffer.writeUInt16(this.Unknown20);
        buffer.writeUInt16(this.Unknown22);
        buffer.writeUInt16(this.StringMapStart);
        buffer.writeUInt16(this.stringMapCount);
        buffer.offset = this.StringMapStart;
        for (var i = 0; i < this.stringMapCount; ++i) {
            buffer.writeUInt16(this.TextureNameOffsets[i]);
            buffer.writeUInt16(this.MapNameOffsets[i]);
            var oldPos = buffer.offset;
            buffer.offset = this.TextureNameOffsets[i];
            var mapValues = MapToArray_1.MapToArray(this.MapTexturePairs);
            buffer.writeString(mapValues[i][1]);
            buffer.offset = this.MapNameOffsets[i];
            buffer.writeString(mapValues[i][0]);
            buffer.offset = oldPos;
        }
        buffer.offset = 0;
        return buffer;
    };
    MatBlock.prototype.GetInfo = function () {
        return "Block Type " + this.blockType + "\nMap Texture Pairs: " + this.MapTexturePairs + "\n";
    };
    return MatBlock;
}(block_1.Block));
exports.MatBlock = MatBlock;
