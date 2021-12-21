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
exports.MshBlock = void 0;
var CustomBuffer_1 = require("../Utils/CustomBuffer");
var block_1 = require("./block");
var MshBlock = /** @class */ (function (_super) {
    __extends(MshBlock, _super);
    function MshBlock() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.MappedStrings = [];
        return _this;
    }
    MshBlock.prototype.Deserialize = function (data, srdiPath, srdvPath) {
        this.Unknown10 = data.readUInt32();
        this.VertexBlockNameOffset = data.readUInt16();
        this.MaterialNameOffset = data.readUInt16();
        this.unknownStringOffset = data.readUInt16();
        this.Unknown1A = data.readUInt16();
        this.Unknown1C = data.readUInt16();
        this.StringMapDataAlmostEndOffset = data.readUInt16();
        this.Unknown20 = data.readByte();
        this.Unknown21 = data.readByte();
        this.Unknown22 = data.readByte();
        this.Unknown23 = data.readByte();
        while (data.offset < (this.StringMapDataAlmostEndOffset + 4)) {
            this.strOff = data.readUInt16();
            var oldPos = data.offset;
            data.offset = this.strOff;
            this.MappedStrings.push(data.readString());
            data.offset = oldPos;
        }
        data.offset = this.VertexBlockNameOffset;
        this.VertexBlockName = data.readString();
        data.offset = this.MaterialNameOffset;
        this.MaterialName = data.readString();
        data.offset = this.unknownStringOffset;
        this.UnknownString = data.readString();
    };
    MshBlock.prototype.Serialize = function (size, srdi, srdv) {
        var buffer = new CustomBuffer_1.CustomBuffer(size);
        buffer.writeInt32(this.Unknown10);
        buffer.writeUInt16(this.VertexBlockNameOffset);
        buffer.writeUInt16(this.MaterialNameOffset);
        buffer.writeUInt16(this.unknownStringOffset);
        buffer.writeUInt16(this.Unknown1A);
        buffer.writeUInt16(this.Unknown1C);
        buffer.writeUInt16(this.StringMapDataAlmostEndOffset);
        buffer.writeByte(this.Unknown20);
        buffer.writeByte(this.Unknown21);
        buffer.writeByte(this.Unknown22);
        buffer.writeByte(this.Unknown23);
        for (var i = 0; i < this.MappedStrings.length; i++) {
            buffer.writeUInt16(this.strOff);
            var oldPos = buffer.offset;
            buffer.offset = this.strOff;
            buffer.writeString(this.MappedStrings[i]);
            buffer.offset = oldPos;
        }
        buffer.offset = this.VertexBlockNameOffset;
        buffer.writeString(this.VertexBlockName);
        buffer.offset = this.MaterialNameOffset;
        buffer.writeString(this.MaterialName);
        buffer.offset = this.unknownStringOffset;
        buffer.writeString(this.UnknownString);
        buffer.offset = 0;
        return buffer;
    };
    MshBlock.prototype.GetInfo = function () {
        return "Block Type " + this.blockType + "\n" +
            ("Vertex Block Name: " + this.VertexBlockName + "\n") +
            ("Material Name: " + this.MaterialName + "\n") +
            ("Unknown String: " + this.UnknownString + "\n") +
            ("Mapped Strings: " + this.MappedStrings + "\n");
    };
    return MshBlock;
}(block_1.Block));
exports.MshBlock = MshBlock;
