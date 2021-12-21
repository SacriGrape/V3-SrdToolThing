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
exports.TxrBlock = void 0;
var CustomBuffer_1 = require("../Utils/CustomBuffer");
var block_1 = require("./block");
var TextureFormat;
(function (TextureFormat) {
    TextureFormat[TextureFormat["Unknown"] = 0] = "Unknown";
    TextureFormat[TextureFormat["ARGB8888"] = 1] = "ARGB8888";
    TextureFormat[TextureFormat["BGR565"] = 2] = "BGR565";
    TextureFormat[TextureFormat["BGRA4444"] = 5] = "BGRA4444";
    TextureFormat[TextureFormat["DXT1RGB"] = 15] = "DXT1RGB";
    TextureFormat[TextureFormat["DXT5"] = 17] = "DXT5";
    TextureFormat[TextureFormat["BC5"] = 20] = "BC5";
    TextureFormat[TextureFormat["BC4"] = 22] = "BC4";
    TextureFormat[TextureFormat["Indexed8"] = 26] = "Indexed8";
    TextureFormat[TextureFormat["BPTC"] = 28] = "BPTC";
})(TextureFormat || (TextureFormat = {}));
var TxrBlock = /** @class */ (function (_super) {
    __extends(TxrBlock, _super);
    function TxrBlock() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TxrBlock.prototype.Deserialize = function (data, srdiPath, srdvPath) {
        this.Unknown10 = data.readInt32();
        this.Swizzle = data.readUInt16();
        this.DisplayWidth = data.readUInt16();
        this.DisplayHeight = data.readUInt16();
        this.Scanline = data.readUInt16();
        this.Format = data.readByte();
        this.Unknown1D = data.readByte();
        this.Palette = data.readByte();
        this.PaletteId = data.readByte();
    };
    TxrBlock.prototype.Serialize = function (size, srdi, srdv) {
        var buffer = new CustomBuffer_1.CustomBuffer(size);
        buffer.writeInt32(this.Unknown10);
        buffer.writeUInt16(this.Swizzle);
        buffer.writeUInt16(this.DisplayWidth);
        buffer.writeUInt16(this.DisplayHeight);
        buffer.writeUInt16(this.Scanline);
        buffer.writeByte(this.Format);
        buffer.writeByte(this.Unknown1D);
        buffer.writeByte(this.Palette);
        buffer.writeByte(this.PaletteId);
        buffer.offset = 0;
        return buffer;
    };
    TxrBlock.prototype.GetInfo = function () {
        var info = "Block Type " + this.blockType + "\n";
        info += "Swizzle: " + this.Swizzle + "\n";
        info += "Display Width: " + this.DisplayWidth + "\n";
        info += "Display Height: " + this.DisplayHeight + "\n";
        info += "Scanline: " + this.Scanline + "\n";
        info += "Format: " + this.Format + "\n";
        info += "Palette: " + this.Palette + "\n";
        info += "Palette Id: " + this.PaletteId + "\n";
        return info;
    };
    return TxrBlock;
}(block_1.Block));
exports.TxrBlock = TxrBlock;
