import { InternalSpriteSheet } from "./spritesheet";

export class Resources {
    #spritesheets: Map<string, InternalSpriteSheet>
    #palette: Uint8ClampedArray

    constructor(palette: Uint8ClampedArray) {
        this.#spritesheets = new Map();

        this.#palette = palette
    }

    getSpriteSheetForFont(font: Font):  InternalSpriteSheet {
        return this.getSpriteSheet(font.name, font.url, font.width, font.height)
    }

    getSpriteSheet(name: string, url: string, w: number, h: number): InternalSpriteSheet {
        var ss = this.#spritesheets.get(name);
        if (ss !== undefined) { return ss; }

        // default to a blank spritesheet
        this.#spritesheets.set(name, new InternalSpriteSheet(new Uint8ClampedArray(0), 0, 0, w, h));

        var img = new Image();
        img.onload = (e) => {
            // TODO: Use offscreencanvas
            var cnv = document.createElement("canvas");
            cnv.width = img.naturalWidth;
            cnv.height = img.naturalHeight;
            let ctx = cnv.getContext("2d")
            ctx.imageSmoothingEnabled=false;
            ctx.drawImage(img, 0, 0);
            let data = ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight)

            this.#spritesheets.set(name, this.#processSpriteSheet(data, w, h));
        }
        img.onerror = (e) => {
            console.error(`could not load spritesheet ${url}: ${e}`)
        }
        img.src = url

        return this.#spritesheets.get(name)
    }

    #processSpriteSheet(data, spriteWidth: number, spriteHeight: number): InternalSpriteSheet {
        var mapper = new ColorMapper(this.#palette);

        var pixels = new Uint8ClampedArray(data.data.length);
        for (var i = 0; i < data.data.length; i+=4) {
            var color;
            if (data.data[i+3] < 128) {
                color=255;  // transparent
            } else {
                color=mapper.assoc(data.data[i], data.data[i+1], data.data[i+2]);
            }

            pixels[i/4] = color;
        }

        return new InternalSpriteSheet(pixels, data.width, data.height, spriteWidth, spriteHeight)
    }
}

class ColorMapper {
    #palette: Uint8ClampedArray
    #pixelToPalette: Map<number, number>

    constructor(palette: Uint8ClampedArray) {
        this.#palette = palette;
        this.#pixelToPalette = new Map();

        for (var i = 0; i < palette.length; i+=3) {
            var r = palette[i];
            var g = palette[i+1];
            var b = palette[i+2];
            var hashKey = r + g * 256 + b * 256 * 256;
            this.#pixelToPalette.set(hashKey, i/3);
        }
    }

    assoc(r: number, g: number, b: number): number {
        var hashKey = r + g * 256 + b * 256 * 256;
        var result = this.#pixelToPalette.get(hashKey);
        if (result != undefined) {
            return result
        }

        var error=[]
        for (var pali=0; pali < this.#palette.length; pali+=3) {
            // redmean: https://en.wikipedia.org/wiki/Color_difference#sRGB
            var r1 = r;
            var g1 = g;
            var b1 = b;
            var r2 = this.#palette[pali];
            var g2 = this.#palette[pali + 1];
            var b2 = this.#palette[pali + 2];

            var rbar = (r1 + r2) / 2
            var delta = Math.sqrt(
                (2 + rbar/256) * (r2 - r1) * (r2 - r1) +
                4 * (g2 - g1) * (g2 - g1) + 
                (2 + (255 - rbar)/256) *(b2 - b1) * (b2 - b1)
            )
            error.push(delta)
        }

        result = error.indexOf(Math.min(...error))

        this.#pixelToPalette[hashKey] = result;
        return result
    }
}

export interface Font {
    name: string
    url: string
    width: number
    height: number
    char0: number
}