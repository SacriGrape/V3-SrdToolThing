var encoding = require('encoding-japanese');

export class CustomBuffer {
    BaseBuffer: Buffer
    offset: number

    constructor(size: number, buffer?: Buffer) {
        if (buffer == null) {
            this.BaseBuffer = Buffer.alloc(size)
        } else {
            this.BaseBuffer = buffer
        }

        this.offset = 0
    }

    readInt32(): number {
        var value = this.BaseBuffer.readInt32LE(this.offset)
        this.offset += 4
        return value
    }

    writeInt32(value: number) {
        this.BaseBuffer.writeInt32LE(value, this.offset)
        this.offset += 4
    }

    readInt32BE(): number {
        var value = this.BaseBuffer.readInt32BE(this.offset)
        this.offset += 4
        return value
    }

    writeInt32BE(value: number) {
        this.BaseBuffer.writeInt32BE(value, this.offset)
        this.offset += 4
    }

    readUInt32(): number {
        var value = this.BaseBuffer.readUInt32LE(this.offset)
        this.offset += 4
        return value
    }

    writeUInt32(value: number) {
        this.BaseBuffer.writeUInt32LE(value, this.offset)
        this.offset += 4
    }

    readInt16(): number {
        var value = this.BaseBuffer.readInt16LE(this.offset)
        this.offset += 2
        return value
    }

    writeInt16(value: number) {
        this.BaseBuffer.writeInt16LE(value, this.offset)
        this.offset += 2
    }

    readUInt16(): number {
        var value = this.BaseBuffer.readUInt16LE(this.offset)
        this.offset += 2
        return value
    }
    
    writeUInt16(value: number) {
        this.BaseBuffer.writeUInt16LE(value, this.offset)
        this.offset += 2
    }

    readFloat32(): number {
        var value = this.BaseBuffer.readFloatLE(this.offset)
        this.offset += 4
        return value
    }
    
    writeFloat32(value: number): void {
        this.BaseBuffer.writeFloatLE(value, this.offset)
        this.offset += 4
    }

    readByte(): number {
        var value = this.BaseBuffer.readUInt8(this.offset)
        this.offset += 1
        return value
    }

    writeByte(value: number): void {
        this.BaseBuffer.writeUInt8(value, this.offset)
        this.offset += 1
    }

    readString(): string {
        var chars = []
        var lastByte = null
        while (lastByte != 0) {
            lastByte = this.readByte()
            if (lastByte != 0) {
                chars.push(String.fromCharCode(lastByte))
            }
        }
        return chars.join("")
    }

    writeString(value: string): void {
        for (var i = 0; i < value.length; ++i) {
            this.writeByte(value.charCodeAt(i))
        }
        this.writeByte(0)
    }

    readShiftJisString(): String {
        var bytes = []
        var buffer = this.readBuffer(32)
        this.offset -= 32
        while (true) {
            bytes.push(buffer.readByte())
            if (bytes[bytes.length - 1] == 0) {
                break
            }
        }
        var byteArray: number[] = encoding.convert(bytes, 'SJIS', 'UNICODE')
        byteArray.pop()
        var newString = Buffer.from(byteArray).toString()
        return newString
    }

    writeShiftJisString(value: String): void {
        var string: string = encoding.convert(value, 'UNICODE', 'SJIS')
        var buffer = Buffer.alloc(string.length + 1)
        for (var i = 0; i < string.length; ++i) {
            buffer.writeUInt8(string.charCodeAt(i), i)
        }
        buffer.writeUInt8(0, string.length)
        this.writeBuffer(new CustomBuffer(buffer.length, buffer))
    }

    readArrayAsString(size: number): string {
        var chars = []
        for (var i = 0; i < size; ++i) {
            var lastByte = this.readByte()
            chars.push(String.fromCharCode(lastByte))
        }
        return chars.join("")
    }

    writeArrayAsString(value: string): void {
        for (var i = 0; i < value.length; ++i) {
            this.writeByte(value.charCodeAt(i))
        }
    }


    readPadding(size: number): void {
        if (this.offset % 16 != 0) {
            var remainder = this.offset % 16
            while (remainder != 0) {
                this.offset++
                remainder = this.offset % 16
            }
        }
    }

    readBuffer(size: number): CustomBuffer {
        var buffer = this.BaseBuffer.slice(this.offset, this.offset + size)
        this.offset += size
        return new CustomBuffer(size, buffer)
    }

    writeBuffer(buffer: CustomBuffer): void {
        buffer.BaseBuffer.copy(this.BaseBuffer, this.offset)
        this.offset += buffer.BaseBuffer.length
    }
}