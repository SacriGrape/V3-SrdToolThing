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
exports.TreBlock = void 0;
var CustomBuffer_1 = require("../Utils/CustomBuffer");
var block_1 = require("./block");
var TreeNode = /** @class */ (function () {
    function TreeNode(value) {
        this.Children = [];
        this.StringValue = value;
    }
    return TreeNode;
}());
var TreBlock = /** @class */ (function (_super) {
    __extends(TreBlock, _super);
    function TreBlock() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.UnknownMatrix = [];
        _this.stringOffsets = [];
        _this.endpointOffsets = [];
        _this.currentEndpointCounts = [];
        _this.nodeDepths = [];
        _this.unknown0As = [];
        _this.unknown0Bs = [];
        _this.unknown0Cs = [];
        _this.nodes = [];
        _this.endpointStringOffsets = [];
        _this.unknown04s = [];
        _this.endpoints = [];
        return _this;
    }
    TreBlock.prototype.Deserialize = function (data, srdiPath, srdvPath) {
        this.maxTreeDepth = data.readUInt32();
        this.Unknown14 = data.readUInt16();
        this.totalEntryCount = data.readUInt16();
        this.Unknown18 = data.readUInt16();
        this.totalEndpointCount = data.readUInt16();
        this.unknownFloatListOffset = data.readUInt32();
        var stringDataStart = -1;
        for (var i = 0; i < this.totalEntryCount; ++i) {
            var stringOffset = data.readUInt32();
            this.stringOffsets.push(stringOffset);
            if (stringDataStart == -1) {
                stringDataStart = stringOffset;
            }
            var endpointOffset = data.readUInt32();
            this.endpointOffsets.push(endpointOffset);
            var currentEndpointCount = data.readByte();
            this.currentEndpointCounts.push(currentEndpointCount);
            var nodeDepth = data.readByte();
            this.nodeDepths.push(nodeDepth);
            var unknown0A = data.readByte();
            this.unknown0As.push(unknown0A);
            var unknown0B = data.readByte();
            this.unknown0Bs.push(unknown0B);
            var unknown0C = data.readUInt32();
            this.unknown0Cs.push(unknown0C);
            var lastPos = data.offset;
            data.offset = stringOffset;
            var node = new TreeNode(data.readString());
            this.nodes.push(node);
            data.offset = lastPos;
            if (endpointOffset != 0) {
                var lastPos2 = data.offset;
                data.offset = endpointOffset;
                for (var j = 0; j < currentEndpointCount; ++j) {
                    var endpointStringOffset = data.readUInt32();
                    this.endpointStringOffsets.push(endpointStringOffset);
                    var unknown04 = data.readUInt32();
                    this.unknown04s.push(unknown04);
                    var lastPos3 = data.offset;
                    data.offset = endpointStringOffset;
                    var endpoint = new TreeNode(data.readString());
                    node.Children.push(endpoint);
                    data.offset = lastPos3;
                }
                data.offset = lastPos2;
            }
            if (i == 0) {
                this.RootNode = node;
            }
            else {
                var parentNode = this.RootNode;
                for (var depth = 0; depth < (nodeDepth - 1); ++depth) {
                    parentNode = parentNode.Children[0];
                }
                parentNode.Children.push(node);
            }
        }
        data.offset = this.unknownFloatListOffset;
        while (data.offset < stringDataStart) {
            this.UnknownMatrix.push(data.readFloat32());
            this.UnknownMatrix.push(data.readFloat32());
            this.UnknownMatrix.push(data.readFloat32());
            this.UnknownMatrix.push(data.readFloat32());
            this.UnknownMatrix.push(data.readFloat32());
            this.UnknownMatrix.push(data.readFloat32());
            this.UnknownMatrix.push(data.readFloat32());
            this.UnknownMatrix.push(data.readFloat32());
            this.UnknownMatrix.push(data.readFloat32());
            this.UnknownMatrix.push(data.readFloat32());
            this.UnknownMatrix.push(data.readFloat32());
            this.UnknownMatrix.push(data.readFloat32());
            this.UnknownMatrix.push(data.readFloat32());
            this.UnknownMatrix.push(data.readFloat32());
            this.UnknownMatrix.push(data.readFloat32());
            this.UnknownMatrix.push(data.readFloat32());
        }
    };
    TreBlock.prototype.Serialize = function (size, srdi, srdv) {
        var buffer = new CustomBuffer_1.CustomBuffer(size);
        buffer.writeUInt32(this.maxTreeDepth);
        buffer.writeUInt16(this.Unknown14);
        buffer.writeUInt16(this.totalEntryCount);
        buffer.writeUInt16(this.Unknown18);
        buffer.writeUInt16(this.totalEndpointCount);
        buffer.writeUInt32(this.unknownFloatListOffset);
        var stringDataStart = -1;
        for (var i = 0; i < this.totalEntryCount; ++i) {
            buffer.writeUInt32(this.stringOffsets[i]);
            if (stringDataStart == -1) {
                stringDataStart = this.stringOffsets[i];
            }
            buffer.writeUInt32(this.endpointOffsets[i]);
            buffer.writeByte(this.currentEndpointCounts[i]);
            buffer.writeByte(this.nodeDepths[i]);
            buffer.writeByte(this.unknown0As[i]);
            buffer.writeByte(this.unknown0Bs[i]);
            buffer.writeUInt32(this.unknown0Cs[i]);
            var lastPos = buffer.offset;
            buffer.offset = this.stringOffsets[i];
            buffer.writeString(this.nodes[i].StringValue);
            buffer.offset = lastPos;
            var index = 0;
            if (this.endpointOffsets[i] != 0) {
                var lastPos2 = buffer.offset;
                buffer.offset = this.endpointOffsets[i];
                for (var j = 0; j < this.currentEndpointCounts[i]; ++j) {
                    buffer.writeUInt32(this.endpointStringOffsets[index]);
                    buffer.writeUInt32(this.unknown04s[index]);
                    var lastPos3 = buffer.offset;
                    buffer.offset = this.endpointStringOffsets[index];
                    buffer.writeString(this.nodes[i].Children[j].StringValue);
                    buffer.offset = lastPos3;
                }
                buffer.offset = lastPos2;
                index++;
            }
        }
        buffer.offset = this.unknownFloatListOffset;
        for (var i = 0; i < this.UnknownMatrix.length; i++) {
            buffer.writeFloat32(this.UnknownMatrix[i]);
        }
        buffer.offset = 0;
        return buffer;
    };
    TreBlock.prototype.GetInfo = function () {
        return "Block Type " + this.blockType + "\nRoot Node: " + this.RootNode.StringValue + "\n";
    };
    return TreBlock;
}(block_1.Block));
exports.TreBlock = TreBlock;
