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
exports.TxiBlock = void 0;
var CustomBuffer_1 = require("../Utils/CustomBuffer");
var block_1 = require("./block");
var TxiBlock = /** @class */ (function (_super) {
    __extends(TxiBlock, _super);
    function TxiBlock() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TxiBlock.prototype.Deserialize = function (data, srdiPath, srdvPath) {
        this.Unknown10 = data.readInt32();
        this.Unknown14 = data.readInt32();
        this.Unknown18 = data.readFloat32();
        this.Unknown1C = data.readByte();
        this.Unknown1D = data.readByte();
        this.Unknown1E = data.readByte();
        this.Unknown1F = data.readByte();
        this.Unknown20 = data.readInt32();
        this.TextureFilename = data.readShiftJisString().toString();
    };
    TxiBlock.prototype.Serialize = function (size, srdi, srdv) {
        var buffer = new CustomBuffer_1.CustomBuffer(size);
        buffer.writeInt32(this.Unknown10);
        buffer.writeInt32(this.Unknown14);
        buffer.writeFloat32(this.Unknown18);
        buffer.writeByte(this.Unknown1C);
        buffer.writeByte(this.Unknown1D);
        buffer.writeByte(this.Unknown1E);
        buffer.writeByte(this.Unknown1F);
        buffer.writeInt32(this.Unknown20);
        buffer.writeShiftJisString(this.TextureFilename);
        buffer.offset = 0;
        return buffer;
    };
    TxiBlock.prototype.GetInfo = function () {
        return "Block Type " + this.blockType + "\nTexture Filename: " + this.TextureFilename + "\n";
    };
    return TxiBlock;
}(block_1.Block));
exports.TxiBlock = TxiBlock;
