"use strict";
exports.__esModule = true;
exports.CustomBuffer = void 0;
var encoding = require('encoding-japanese');
var CustomBuffer = /** @class */ (function () {
    function CustomBuffer(size, buffer) {
        if (buffer == null) {
            this.BaseBuffer = Buffer.alloc(size);
        }
        else {
            this.BaseBuffer = buffer;
        }
        this.offset = 0;
    }
    CustomBuffer.prototype.readInt32 = function () {
        var value = this.BaseBuffer.readInt32LE(this.offset);
        this.offset += 4;
        return value;
    };
    CustomBuffer.prototype.writeInt32 = function (value) {
        this.BaseBuffer.writeInt32LE(value, this.offset);
        this.offset += 4;
    };
    CustomBuffer.prototype.readInt32BE = function () {
        var value = this.BaseBuffer.readInt32BE(this.offset);
        this.offset += 4;
        return value;
    };
    CustomBuffer.prototype.writeInt32BE = function (value) {
        this.BaseBuffer.writeInt32BE(value, this.offset);
        this.offset += 4;
    };
    CustomBuffer.prototype.readUInt32 = function () {
        var value = this.BaseBuffer.readUInt32LE(this.offset);
        this.offset += 4;
        return value;
    };
    CustomBuffer.prototype.writeUInt32 = function (value) {
        this.BaseBuffer.writeUInt32LE(value, this.offset);
        this.offset += 4;
    };
    CustomBuffer.prototype.readInt16 = function () {
        var value = this.BaseBuffer.readInt16LE(this.offset);
        this.offset += 2;
        return value;
    };
    CustomBuffer.prototype.writeInt16 = function (value) {
        this.BaseBuffer.writeInt16LE(value, this.offset);
        this.offset += 2;
    };
    CustomBuffer.prototype.readUInt16 = function () {
        var value = this.BaseBuffer.readUInt16LE(this.offset);
        this.offset += 2;
        return value;
    };
    CustomBuffer.prototype.writeUInt16 = function (value) {
        this.BaseBuffer.writeUInt16LE(value, this.offset);
        this.offset += 2;
    };
    CustomBuffer.prototype.readFloat32 = function () {
        var value = this.BaseBuffer.readFloatLE(this.offset);
        this.offset += 4;
        return value;
    };
    CustomBuffer.prototype.writeFloat32 = function (value) {
        this.BaseBuffer.writeFloatLE(value, this.offset);
        this.offset += 4;
    };
    CustomBuffer.prototype.readByte = function () {
        var value = this.BaseBuffer.readUInt8(this.offset);
        this.offset += 1;
        return value;
    };
    CustomBuffer.prototype.writeByte = function (value) {
        this.BaseBuffer.writeUInt8(value, this.offset);
        this.offset += 1;
    };
    CustomBuffer.prototype.readString = function () {
        var chars = [];
        var lastByte = null;
        while (lastByte != 0) {
            lastByte = this.readByte();
            if (lastByte != 0) {
                chars.push(String.fromCharCode(lastByte));
            }
        }
        return chars.join("");
    };
    CustomBuffer.prototype.writeString = function (value) {
        for (var i = 0; i < value.length; ++i) {
            this.writeByte(value.charCodeAt(i));
        }
        this.writeByte(0);
    };
    CustomBuffer.prototype.readShiftJisString = function () {
        var bytes = [];
        var buffer = this.readBuffer(32);
        this.offset -= 32;
        while (true) {
            bytes.push(buffer.readByte());
            if (bytes[bytes.length - 1] == 0) {
                break;
            }
        }
        var byteArray = encoding.convert(bytes, 'SJIS', 'UNICODE');
        byteArray.pop();
        var newString = Buffer.from(byteArray).toString();
        return newString;
    };
    CustomBuffer.prototype.writeShiftJisString = function (value) {
        var string = encoding.convert(value, 'UNICODE', 'SJIS');
        var buffer = Buffer.alloc(string.length + 1);
        for (var i = 0; i < string.length; ++i) {
            buffer.writeUInt8(string.charCodeAt(i), i);
        }
        buffer.writeUInt8(0, string.length);
        this.writeBuffer(new CustomBuffer(buffer.length, buffer));
    };
    CustomBuffer.prototype.readArrayAsString = function (size) {
        var chars = [];
        for (var i = 0; i < size; ++i) {
            var lastByte = this.readByte();
            chars.push(String.fromCharCode(lastByte));
        }
        return chars.join("");
    };
    CustomBuffer.prototype.writeArrayAsString = function (value) {
        for (var i = 0; i < value.length; ++i) {
            this.writeByte(value.charCodeAt(i));
        }
    };
    CustomBuffer.prototype.readPadding = function (size) {
        if (this.offset % 16 != 0) {
            var remainder = this.offset % 16;
            while (remainder != 0) {
                this.offset++;
                remainder = this.offset % 16;
            }
        }
    };
    CustomBuffer.prototype.readBuffer = function (size) {
        var buffer = this.BaseBuffer.slice(this.offset, this.offset + size);
        this.offset += size;
        return new CustomBuffer(size, buffer);
    };
    CustomBuffer.prototype.writeBuffer = function (buffer) {
        buffer.BaseBuffer.copy(this.BaseBuffer, this.offset);
        this.offset += buffer.BaseBuffer.length;
    };
    return CustomBuffer;
}());
exports.CustomBuffer = CustomBuffer;
