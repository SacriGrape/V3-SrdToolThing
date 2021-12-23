import { CustomBuffer } from "./CustomBuffer";

export function CompareBuffers(buffer1: CustomBuffer, buffer2: CustomBuffer) {
    var byteArray1 = BufferToArray(buffer1)
    var byteArray2 = BufferToArray(buffer2)

    console.log(byteArray1 == byteArray2)
    return (byteArray1 == byteArray2)
}

export function CompareArrays<T>(array1: T[], array2: T[]) {
    var isEqual = true
    isEqual = array1.length == array2.length
    for (var i = 0; i < array1.length; i++) {
        isEqual = array1[i] == array2[i]
        if (!isEqual) {
            break
        }
    }
    return isEqual
}

export function BufferToArray(buffer: CustomBuffer) {
    var byteArray = []
    var oldPos = buffer.offset
    buffer.offset = 0
    while (buffer.offset < buffer.BaseBuffer.length) {
        byteArray.push(buffer.readByte())
    }
    buffer.offset = oldPos
}