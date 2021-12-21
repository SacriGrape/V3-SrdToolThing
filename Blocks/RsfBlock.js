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
exports.RsfBlock = void 0;
var CustomBuffer_1 = require("../Utils/CustomBuffer");
var block_1 = require("./block");
var RsfBlock = /** @class */ (function (_super) {
    __extends(RsfBlock, _super);
    function RsfBlock() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RsfBlock.prototype.Deserialize = function (data, srdiPath, srdvPath) {
        this.Unknown10 = data.readInt32();
        this.Unknown14 = data.readInt32();
        this.Unknown18 = data.readInt32();
        this.Unknown1C = data.readInt32();
        this.FolderName = data.readString();
    };
    RsfBlock.prototype.Serialize = function (size, srdi, srdv) {
        var buffer = new CustomBuffer_1.CustomBuffer(size);
        buffer.writeInt32(this.Unknown10);
        buffer.writeInt32(this.Unknown14);
        buffer.writeInt32(this.Unknown18);
        buffer.writeInt32(this.Unknown1C);
        buffer.writeString(this.FolderName);
        buffer.offset = 0;
        return buffer;
    };
    RsfBlock.prototype.GetInfo = function () {
        return "Block Type " + this.blockType + "\nFolder Name: " + this.FolderName + "\n";
    };
    return RsfBlock;
}(block_1.Block));
exports.RsfBlock = RsfBlock;
