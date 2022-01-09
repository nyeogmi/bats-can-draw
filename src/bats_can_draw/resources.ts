import { InternalSpriteSheet } from "./spritesheet";

export class Resources {
    _spritesheets: Map<string, InternalSpriteSheet>
    _palette: Uint8ClampedArray

    constructor(palette: Uint8ClampedArray) {
        this._spritesheets = new Map();

        this._palette = palette
    }

    getSpriteSheetForSpriteSheet(spritesheet: SpriteSheet):  InternalSpriteSheet {
        return this.getSpriteSheet(spritesheet.name, spritesheet.url, spritesheet.width, spritesheet.height, spritesheet.transparent ?? 255)
    }

    getSpriteSheetForFont(font: Font):  InternalSpriteSheet {
        return this.getSpriteSheet(font.name, font.url, font.width, font.height, 255)
    }

    getSpriteSheet(name: string, url: string, w: number, h: number, transparent: number): InternalSpriteSheet {
        var ss = this._spritesheets.get(name);
        if (ss !== undefined) { return ss; }

        // default to a blank spritesheet
        this._spritesheets.set(name, new InternalSpriteSheet(new Uint8ClampedArray(0), 0, 0, w, h));

        var img = new Image();
        img.onload = (e) => {
            // TODO: Use offscreencanvas
            var cnv = document.createElement("canvas");
            cnv.width = img.naturalWidth;
            cnv.height = img.naturalHeight;
            let ctx = cnv.getContext("2d")
            if (ctx == null) { throw new TypeError("couldn't get 2d drawing context"); }
            ctx.imageSmoothingEnabled=false;
            ctx.drawImage(img, 0, 0);
            let data = ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight)

            this._spritesheets.set(name, this._processSpriteSheet(data, w, h, transparent));
        }
        img.onerror = (e) => {
            console.error(`could not load spritesheet ${url}: ${e}`)
        }
        img.src = url

        ss = this._spritesheets.get(name)
        if (ss === undefined) {
            throw new TypeError("spritesheet was somehow undefined")
        }
        return ss;
    }

    _processSpriteSheet(data: ImageData, spriteWidth: number, spriteHeight: number, transparent: number): InternalSpriteSheet {
        var mapper = new ColorMapper(this._palette);

        var pixels = new Uint8ClampedArray(data.data.length);
        for (var i = 0; i < data.data.length; i+=4) {
            var color;
            if (data.data[i+3] < 128) {
                color=255;  // transparent
            } else {
                color=mapper.assoc(data.data[i], data.data[i+1], data.data[i+2]);
            }

            if (color == transparent) { color = 255; }

            pixels[i/4] = color;
        }

        return new InternalSpriteSheet(pixels, data.width, data.height, spriteWidth, spriteHeight)
    }
}

class ColorMapper {
    _palette: Uint8ClampedArray
    _pixelToPalette: Map<number, number>

    constructor(palette: Uint8ClampedArray) {
        this._palette = palette;
        this._pixelToPalette = new Map();

        for (var i = 0; i < palette.length; i+=3) {
            var r = palette[i];
            var g = palette[i+1];
            var b = palette[i+2];
            var hashKey = r + g * 256 + b * 256 * 256;
            this._pixelToPalette.set(hashKey, i/3);
        }
    }

    assoc(r: number, g: number, b: number): number {
        var hashKey = r + g * 256 + b * 256 * 256;
        var result = this._pixelToPalette.get(hashKey);
        if (result != undefined) {
            return result
        }

        var error=[]
        for (var pali=0; pali < this._palette.length; pali+=3) {
            // redmean: https://en.wikipedia.org/wiki/Color_difference_sRGB
            var r1 = r;
            var g1 = g;
            var b1 = b;
            var r2 = this._palette[pali];
            var g2 = this._palette[pali + 1];
            var b2 = this._palette[pali + 2];

            var rbar = (r1 + r2) / 2
            var delta = Math.sqrt(
                (2 + rbar/256) * (r2 - r1) * (r2 - r1) +
                4 * (g2 - g1) * (g2 - g1) + 
                (2 + (255 - rbar)/256) *(b2 - b1) * (b2 - b1)
            )
            error.push(delta)
        }

        result = error.indexOf(Math.min(...error))

        this._pixelToPalette.set(hashKey, result);
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

export interface SpriteSheet {
    name: string
    url: string
    width: number
    height: number
    transparent?: number
}