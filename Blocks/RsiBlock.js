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
exports.RsiBlock = void 0;
var fs_1 = require("fs");
var CustomBuffer_1 = require("../Utils/CustomBuffer");
var block_1 = require("./block");
var ResourceInfo = /** @class */ (function () {
    function ResourceInfo() {
    }
    return ResourceInfo;
}());
var RsiBlock = /** @class */ (function (_super) {
    __extends(RsiBlock, _super);
    function RsiBlock() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ResourceInfoList = [];
        _this.ExternalData = [];
        return _this;
    }
    RsiBlock.prototype.Deserialize = function (data, srdiPath, srdvPath) {
        var e_1, _a;
        this.Unknown10 = data.readByte();
        this.Unknown11 = data.readByte();
        this.Unknown12 = data.readByte();
        this.FallbackResourceInfoCount = data.readByte();
        this.ResourceInfoCount = data.readInt16();
        this.FallbackResourceInfoSize = data.readInt16();
        this.ResourceInfoSize = data.readInt16();
        this.Unknown1A = data.readInt16();
        this.resourceStringListOffset = data.readInt32();
        var resourceInfoCount = (this.ResourceInfoCount != 0 ? this.ResourceInfoCount : this.FallbackResourceInfoCount);
        this.ResourceInfoList = [];
        for (var i = 0; i < resourceInfoCount; ++i) {
            var size = 4;
            if (this.ResourceInfoSize > 0) {
                size = this.ResourceInfoSize / 4;
            }
            else if (this.FallbackResourceInfoSize > 0) {
                size = this.FallbackResourceInfoSize / 4;
            }
            var timesRan = 0;
            this.info = new ResourceInfo();
            this.info.Values = [];
            for (var r = 0; r < size; ++r) {
                this.info.Values.push(data.readInt32());
                timesRan++;
            }
            this.ResourceInfoList.push(this.info);
        }
        var dataLength = (this.resourceStringListOffset - data.offset);
        this.ResourceData = data.readBuffer(dataLength);
        this.ResourceStringList = [];
        while (data.offset < data.BaseBuffer.length) {
            this.ResourceStringList.push(data.readString());
        }
        try {
            for (var _b = __values(this.ResourceInfoList), _c = _b.next(); !_c.done; _c = _b.next()) {
                var resourceInfo = _c.value;
                var maskedOffset = resourceInfo.Values[0] & 0x1FFFFFFF;
                var location = resourceInfo.Values[0] & ~0x1FFFFFFF;
                switch (location) {
                    case 0x20000000:
                        if (srdiPath != null) {
                            var file = fs_1.readFileSync(srdiPath);
                            var buffer = new CustomBuffer_1.CustomBuffer(file.length, file);
                            buffer.offset = maskedOffset;
                            var size = resourceInfo.Values[1];
                            data = buffer.readBuffer(size);
                            this.ExternalData.push(data);
                        }
                        break;
                    case 0x40000000:
                        if (srdvPath != null) {
                            var file = fs_1.readFileSync(srdvPath);
                            var buffer = new CustomBuffer_1.CustomBuffer(file.length, file);
                            buffer.offset = maskedOffset;
                            var size = resourceInfo.Values[1];
                            data = buffer.readBuffer(size);
                            this.ExternalData.push(data);
                        }
                        break;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    RsiBlock.prototype.Serialize = function (size, srdi, srdv) {
        var buffer = new CustomBuffer_1.CustomBuffer(size);
        buffer.writeByte(this.Unknown10);
        buffer.writeByte(this.Unknown11);
        buffer.writeByte(this.Unknown12);
        buffer.writeByte(this.FallbackResourceInfoCount);
        buffer.writeInt16(this.ResourceInfoCount);
        buffer.writeInt16(this.FallbackResourceInfoSize);
        buffer.writeInt16(this.ResourceInfoSize);
        buffer.writeInt16(this.Unknown1A);
        buffer.writeInt32(this.resourceStringListOffset);
        var resourceInfoCount = (this.ResourceInfoCount != 0 ? this.ResourceInfoCount : this.FallbackResourceInfoCount);
        var resourceInfoListIndex = 0;
        for (var i = 0; i < resourceInfoCount; ++i) {
            var size = 4;
            if (this.ResourceInfoSize > 0) {
                size = this.ResourceInfoSize / 4;
            }
            else if (this.FallbackResourceInfoSize > 0) {
                size = this.FallbackResourceInfoSize / 4;
            }
            var resourceValueIndex = 0;
            for (var r = 0; r < size; ++r) {
                buffer.writeInt32(this.ResourceInfoList[resourceInfoListIndex].Values[resourceValueIndex]);
                resourceValueIndex++;
            }
            resourceInfoListIndex++;
        }
        buffer.writeBuffer(this.ResourceData);
        var ResourceStringListIndex = 0;
        for (var i = 0; i < this.ResourceStringList.length; ++i) {
            buffer.writeString(this.ResourceStringList[ResourceStringListIndex]);
            ResourceStringListIndex++;
        }
        for (var i = 0; i < this.ResourceInfoList.length; ++i) {
            var maskedOffset = this.ResourceInfoList[i].Values[0] & 0x1FFFFFFF;
            var location = this.ResourceInfoList[i].Values[0] & ~0x1FFFFFFF;
            var externalDataIndex = 0;
            switch (location) {
                case 0x20000000:
                    if (srdi != null) {
                        var file = fs_1.readFileSync(srdi);
                        var srdiBuffer = new CustomBuffer_1.CustomBuffer(file.length, file);
                        srdiBuffer.offset = maskedOffset;
                        var size = this.ResourceInfoList[i].Values[1];
                        srdiBuffer.writeBuffer(this.ExternalData[externalDataIndex]);
                        externalDataIndex++;
                        fs_1.writeFileSync(srdi, srdiBuffer.BaseBuffer);
                    }
                    break;
                case 0x40000000:
                    if (srdv != null) {
                        var file = fs_1.readFileSync(srdv);
                        var srdvBuffer = new CustomBuffer_1.CustomBuffer(file.length, file);
                        srdvBuffer.offset = maskedOffset;
                        var size = this.ResourceInfoList[i].Values[1];
                        srdvBuffer.writeBuffer(this.ExternalData[externalDataIndex]);
                        externalDataIndex++;
                        fs_1.writeFileSync(srdv, srdvBuffer.BaseBuffer);
                    }
                    break;
            }
        }
        buffer.offset = 0;
        return buffer;
    };
    RsiBlock.prototype.GetInfo = function () {
        var info = "Block Type " + this.blockType + "\n";
        info += "FallbackResourceInfoCount: " + this.FallbackResourceInfoCount + "\n";
        info += "ResourceInfoCount: " + this.ResourceInfoCount + "\n";
        info += "FallbackResourceInfoSize: " + this.FallbackResourceInfoSize + "\n";
        info += "ResourceInfoSize: " + this.ResourceInfoSize + "\n";
        info += "ResourceInfoList: " + this.ResourceInfoList + "\n";
        info += "ResourceData: " + this.ResourceData + "\n";
        info += "ResourceStringList: " + this.ResourceStringList + "\n";
        info += "ExternalData: " + this.ExternalData + "\n";
        return info;
    };
    return RsiBlock;
}(block_1.Block));
exports.RsiBlock = RsiBlock;
