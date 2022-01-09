import { PICO8_FONT_PNG, SMALL_FONT_PNG, TALL_FONT_PNG } from "./blobs";
import { Font, Resources } from "./resources";

export var PICO8_FONT: Font = {
    name: "PICO8_FONT",
    url: PICO8_FONT_PNG,
    width: 4,
    height: 6,
    char0: " ".charCodeAt(0)
}

export var SMALL_FONT: Font = {
    name: "SMALL_FONT",
    url: SMALL_FONT_PNG,
    width: 8,
    height: 8,
    char0: "\x00".charCodeAt(0)
}

export var TALL_FONT: Font = {
    name: "TALL_FONT",
    url: TALL_FONT_PNG,
    width: 8,
    height: 16,
    char0: "\x00".charCodeAt(0)
}