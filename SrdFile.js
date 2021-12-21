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
exports.SrdFile = void 0;
var fs_1 = require("fs");
var CfhBlock_1 = require("./Blocks/CfhBlock");
var Ct0Block_1 = require("./Blocks/Ct0Block");
var CustomBuffer_1 = require("./Utils/CustomBuffer");
var RsfBlock_1 = require("./Blocks/RsfBlock");
var RsiBlock_1 = require("./Blocks/RsiBlock");
var ScnBlock_1 = require("./Blocks/ScnBlock");
var TxiBlock_1 = require("./Blocks/TxiBlock");
var TxrBlock_1 = require("./Blocks/TxrBlock");
var VtxBlock_1 = require("./Blocks/VtxBlock");
var MshBlock_1 = require("./Blocks/MshBlock");
var TreBlock_1 = require("./Blocks/TreBlock");
var MatBlock_1 = require("./Blocks/MatBlock");
var tempNumber = 0;
var SrdFile = /** @class */ (function () {
    function SrdFile() {
        this.blocks = [];
        this.writingInfo = [];
        this.size = 0;
    }
    SrdFile.prototype.loadFromPath = function (path, srdiPath, srdvPath) {
        var buffer = fs_1.readFileSync(path);
        var data = new CustomBuffer_1.CustomBuffer(buffer.length, buffer);
        this.size = buffer.length;
        this.readBlocks(data, srdiPath, srdvPath);
    };
    SrdFile.prototype.readBlocks = function (data, srdiPath, srdvPath) {
        var e_1, _a;
        while (data.offset < data.BaseBuffer.length) {
            var writingInfoData = {};
            var blockType = data.readArrayAsString(4);
            writingInfoData.blockType = blockType;
            var block;
            switch (blockType) {
                case "$CFH":
                    block = new CfhBlock_1.CfhBlock();
                    break;
                case "$RSF":
                    block = new RsfBlock_1.RsfBlock();
                    break;
                case "$TXR":
                    block = new TxrBlock_1.TxrBlock();
                    break;
                case "$RSI":
                    block = new RsiBlock_1.RsiBlock();
                    break;
                case "$CT0":
                    block = new Ct0Block_1.Ct0Block();
                    break;
                case "$TXI":
                    block = new TxiBlock_1.TxiBlock();
                    break;
                case "$VTX":
                    block = new VtxBlock_1.VtxBlock();
                    break;
                case "$SCN":
                    block = new ScnBlock_1.ScnBlock();
                    break;
                case "$MAT":
                    block = new MatBlock_1.MatBlock();
                    break;
                case "$MSH":
                    block = new MshBlock_1.MshBlock();
                    break;
                case "$TRE":
                    block = new TreBlock_1.TreBlock();
                    break;
                default:
                    console.log("I DON'T EXIST");
                    break;
            }
            block.blockType = blockType;
            var dataLength = data.readInt32BE();
            writingInfoData.dataLength = dataLength;
            var subdataLength = data.readInt32BE();
            writingInfoData.subdataLength = subdataLength;
            block.Unknown0C = data.readInt32BE();
            var rawData = data.readBuffer(dataLength);
            writingInfoData.rawData = rawData;
            block.Deserialize(rawData, srdiPath, srdvPath);
            data.readPadding(16);
            var rawSubData = data.readBuffer(subdataLength);
            writingInfoData.rawSubData = new CustomBuffer_1.CustomBuffer(subdataLength, rawSubData.BaseBuffer);
            this.writingInfo.push(writingInfoData);
            var tempFile = new SrdFile();
            block.Children = tempFile.readBlocks(rawSubData, srdiPath, srdvPath);
            data.readPadding(16);
            this.blocks.push(block);
            data.readPadding(16);
            try {
                for (var _b = (e_1 = void 0, __values(tempFile.writingInfo)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var writingData = _c.value;
                    this.writingInfo.push(writingData);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            fs_1.writeFileSync("writingInfo.json", JSON.stringify(this.writingInfo, null, 4));
        }
        return this.blocks;
    };
    SrdFile.prototype.writeBlocks = function (size, srdv, srdi, writingInfo, writingIndex) {
        tempNumber++;
        var buffer = new CustomBuffer_1.CustomBuffer(size);
        var blockNumber = 0;
        for (var i = 0; i < this.blocks.length; i++) {
            var block = this.blocks[i];
            var data = writingInfo[writingIndex];
            writingIndex++;
            blockNumber++;
            buffer.writeArrayAsString(block.blockType);
            buffer.writeInt32BE(data.dataLength);
            buffer.writeInt32BE(data.subdataLength);
            buffer.writeInt32BE(block.Unknown0C);
            var moddedBlockBuffer = block.Serialize(data.dataLength, srdi, srdv);
            buffer.writeBuffer(moddedBlockBuffer);
            buffer.readPadding(16);
            var tempSrd = new SrdFile();
            tempSrd.blocks = block.Children;
            var tempBuffer = tempSrd.writeBlocks(data.subdataLength, srdv, srdi, writingInfo, writingIndex);
            writingIndex += tempSrd.blocks.length;
            buffer.writeBuffer(tempBuffer);
            buffer.readPadding(16);
        }
        buffer.offset = 0;
        return buffer;
    };
    return SrdFile;
}());
exports.SrdFile = SrdFile;
