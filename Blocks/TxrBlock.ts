import { CustomBuffer } from "../Utils/CustomBuffer"
import { Block } from "./block"

enum TextureFormat {
    Unknown = 0x00,
    ARGB8888 = 0x01,
    BGR565 = 0x02,
    BGRA4444 = 0x05,
    DXT1RGB = 0x0F,
    DXT5 = 0x11,
    BC5 = 0x14,
    BC4 = 0x16,
    Indexed8 = 0x1A,
    BPTC = 0x1C
}

export class TxrBlock extends Block {
}