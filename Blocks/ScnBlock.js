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
exports.ScnBlock = void 0;
var CustomBuffer_1 = require("../Utils/CustomBuffer");
var block_1 = require("./block");
var ScnBlock = /** @class */ (function (_super) {
    __extends(ScnBlock, _super);
    function ScnBlock() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.SceneRootNodes = [];
        _this.UnknownStrings = [];
        return _this;
    }
    ScnBlock.prototype.Deserialize = function (data, srdiPath, srdvPath) {
        this.Unknown10 = data.readUInt32();
        this.sceneRootNodeIndexOffset = data.readUInt16();
        this.sceneRootNodeIndexCount = data.readUInt16();
        this.unknownStringIndexOffset = data.readUInt16();
        this.unknownStringIndexCount = data.readUInt16();
        data.offset = this.sceneRootNodeIndexOffset;
        for (var i = 0; i < this.sceneRootNodeIndexCount; ++i) {
            this.stringOffset = data.readUInt16();
            var oldPos = data.offset;
            data.offset = this.stringOffset;
            this.SceneRootNodes.push(data.readString());
            data.offset = oldPos;
        }
        data.offset = this.unknownStringIndexOffset;
        for (var i = 0; i < this.unknownStringIndexCount; ++i) {
            this.stringOffset = data.readUInt16();
            var oldPos = data.offset;
            data.offset = this.stringOffset;
            this.UnknownStrings.push(data.readString());
            data.offset = oldPos;
        }
    };
    ScnBlock.prototype.Serialize = function (size, srdi, srdv) {
        var buffer = new CustomBuffer_1.CustomBuffer(size);
        buffer.writeInt32(this.Unknown10);
        buffer.writeUInt16(this.sceneRootNodeIndexOffset);
        buffer.writeUInt16(this.sceneRootNodeIndexCount);
        buffer.writeUInt16(this.unknownStringIndexOffset);
        buffer.writeUInt16(this.unknownStringIndexCount);
        buffer.offset = this.sceneRootNodeIndexOffset;
        for (var i = 0; i < this.sceneRootNodeIndexCount; ++i) {
            buffer.writeUInt16(this.stringOffset);
            var oldPos = buffer.offset;
            buffer.offset = this.stringOffset;
            buffer.writeString(this.SceneRootNodes[i]);
            buffer.offset = oldPos;
        }
        buffer.offset = this.unknownStringIndexOffset;
        for (var i = 0; i < this.unknownStringIndexCount; ++i) {
            buffer.writeUInt16(this.stringOffset);
            var oldPos = buffer.offset;
            buffer.offset = this.stringOffset;
            buffer.writeString(this.UnknownStrings[i]);
            buffer.offset = oldPos;
        }
        buffer.offset = 0;
        return buffer;
    };
    ScnBlock.prototype.GetInfo = function () {
        return "Block Type " + this.blockType + "\nScene Root Nodes: " + this.SceneRootNodes + "\n";
    };
    return ScnBlock;
}(block_1.Block));
exports.ScnBlock = ScnBlock;
