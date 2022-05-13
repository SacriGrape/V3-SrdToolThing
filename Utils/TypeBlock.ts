import { CfhBlock } from '../Blocks/CfhBlock'
import { Ct0Block } from '../Blocks/Ct0Block'
import { RsfBlock } from '../Blocks/RsfBlock'
import { RsiBlock } from '../Blocks/RsiBlock'
import { ScnBlock } from '../Blocks/ScnBlock'
import { TxiBlock } from '../Blocks/TxiBlock'
import { TxrBlock } from '../Blocks/TxrBlock'
import { VtxBlock } from '../Blocks/VtxBlock'
import { MshBlock } from '../Blocks/MshBlock'
import { TreBlock } from '../Blocks/TreBlock'
import { MatBlock } from '../Blocks/MatBlock'

export function TypeBlock(BlockType: string, unTypedBlock?: any): any {
    let block;
    switch(unTypedBlock.BlockType) {
        case "$CFH":
            if (unTypedBlock == undefined) {
                block = new CfhBlock()
            } else {
                block = unTypedBlock as CfhBlock
            }
            break;
        case "$CT0":
            if (unTypedBlock == undefined) {
                block = new Ct0Block()
            } else {
                block = unTypedBlock as Ct0Block
            }
            break;
        case "$RSF":
            if (unTypedBlock == undefined) {
                block = new RsfBlock()
            } else {
                block = unTypedBlock as RsfBlock
            }
            break;
        case "$RSI":
            if (unTypedBlock == undefined) {
                block = new RsiBlock()
            } else {
                block = unTypedBlock as RsiBlock
            }
            break;
        case "$SCN":
            if (unTypedBlock == undefined) {
                block = new ScnBlock()
            } else {
                block = unTypedBlock as ScnBlock
            }
            break;
        case "$TXI":
            if (unTypedBlock == undefined) {
                block = new TxiBlock()
            } else {
                block = unTypedBlock as TxiBlock
            }
            break;
        case "$TXR":
            if (unTypedBlock == undefined) {
                block = new TxrBlock()
            } else {
                block = unTypedBlock as TxrBlock
            }
            break;
        case "$VTX":
            if (unTypedBlock == undefined) {
                block = new VtxBlock()
            } else {
                block = unTypedBlock as VtxBlock
            }
            break;
        case "$MSH":
            if (unTypedBlock == undefined) {
                block = new MshBlock()
            } else {
                block = unTypedBlock as MshBlock
            }
            break;
        case "$TRE":
            if (unTypedBlock == undefined) {
                block = new TreBlock()
            } else {
                block = unTypedBlock as TreBlock
            }
            break;
        case "$MAT":
            if (unTypedBlock == undefined) {
                block = new MatBlock()
            } else {
                block = unTypedBlock as MatBlock
            }
            break;
        default:
            throw `ERROR: Unable to type block of type: ${BlockType}`
        }
    return block
}