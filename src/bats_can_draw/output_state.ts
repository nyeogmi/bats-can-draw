import { PICO8_FONT_PNG } from "./blobs";
import { Font, Resources, SpriteSheet } from "./resources";
import { PICO8_FONT } from "./stock";

export class OutputState {
    readonly data: Uint8ClampedArray;

    readonly width: number
    readonly height: number

    readonly #resources: Resources

    #font: Font
    #sheet: SpriteSheet | null

    // used by camera command
    #cameraX: number
    #cameraY: number

    // used by clip command
    #clipX0: number
    #clipY0: number
    #clipX1: number
    #clipY1: number

    // used by pal command
    #pal: Uint8ClampedArray
    #palt: Uint8ClampedArray

    constructor(data: Uint8ClampedArray, width: number, height: number, resources: Resources) {
        this.data = data

        this.width = width
        this.height = height

        this.#resources = resources

        this.#font = PICO8_FONT
        this.#sheet = null
        this.font(PICO8_FONT)

        this.#cameraX = 0
        this.#cameraY = 0

        this.#pal = new Uint8ClampedArray(256)
        this.#palt = new Uint8ClampedArray(256)

        this.#clipX0=0
        this.#clipY0=0
        this.#clipX1=width
        this.#clipY1=height

        this.pal()
        this.palt()
        this.clip()
    }

    unsafePixel(x: number, y: number, color: number) {
        // TODO: After implementing clipping, do it here
        if (x >= this.#clipX0 && y >= this.#clipY0 && x < this.#clipX1 && y < this.#clipY1) {
            var ix = y * this.width + x;
            this.data[ix] = color;
        }
    }

    pixel(x0: number, y0: number, color: number) {
        let realColor = this.#pal[color]

        this.unsafePixel(Math.floor(x0) + this.#cameraX, Math.floor(y0) + this.#cameraY, realColor)
    }

    rect(x0: number, y0: number, x1: number, y1: number, color: number) {
        x0 = Math.floor(x0);
        y0 = Math.floor(y0);
        x1 = Math.floor(x1);
        y1 = Math.floor(y1);

        // rect, half-open ranges
        let xMin = Math.min(x0, x1)
        let yMin = Math.min(y0, y1)
        let xMax = Math.max(x0, x1)
        let yMax = Math.max(y0, y1)

        this.rectho(xMin, yMin, xMax+1, yMax+1, color)
    }

    rectfill(x0: number, y0: number, x1: number, y1: number, color: number) {
        x0 = Math.floor(x0);
        y0 = Math.floor(y0);
        x1 = Math.floor(x1);
        y1 = Math.floor(y1);

        // rect, half-open ranges
        let xMin = Math.min(x0, x1)
        let yMin = Math.min(y0, y1)
        let xMax = Math.max(x0, x1)
        let yMax = Math.max(y0, y1)

        this.recthofill(xMin, yMin, xMax+1, yMax+1, color)
    }

    // half-open version of rect, unlike pico-8's
    rectho(x0: number, y0: number, x1: number, y1: number, color: number) {
        x0 = Math.floor(x0);
        y0 = Math.floor(y0);
        x1 = Math.floor(x1);
        y1 = Math.floor(y1);

        // rect, half-open ranges
        let xMin = Math.min(x0, x1)
        let yMin = Math.min(y0, y1)
        let xMax = Math.max(x0, x1)
        let yMax = Math.max(y0, y1)

        if (xMax == xMin + 1 || yMax == yMin + 1) {
            // height == 0 or width == 0: exit early
            return
        }

        xMin += this.#cameraX;
        yMin += this.#cameraY;
        xMax += this.#cameraX;
        yMax += this.#cameraY;

        let realColor = this.#pal[color]
        for (var x=xMin; x < xMax; x++) {
            this.unsafePixel(x, yMin, realColor)
            this.unsafePixel(x, yMax-1, realColor)
        }
        for (var y=yMin+1; y < yMax-1; y++) { // don't hit any pixels twice
            this.unsafePixel(xMin, y, realColor)
            this.unsafePixel(xMax-1, y, realColor)
        }
    }

    recthofill(x0: number,  y0: number, x1: number, y1: number, color: number) {
        x0 = Math.floor(x0);
        y0 = Math.floor(y0);
        x1 = Math.floor(x1);
        y1 = Math.floor(y1);

        // rect, half-open ranges
        let xMin = Math.min(x0, x1)
        let yMin = Math.min(y0, y1)
        let xMax = Math.max(x0, x1)
        let yMax = Math.max(y0, y1)

        if (xMax == xMin + 1 || yMax == yMin + 1) {
            // height == 0 or width == 0: exit early
            return
        }

        xMin += this.#cameraX;
        yMin += this.#cameraY;
        xMax += this.#cameraX;
        yMax += this.#cameraY;

        let realColor = this.#pal[color]
        for (var y = yMin; y < yMax; y++) {
            for (var x = xMin; x < xMax; x++) {
                this.unsafePixel(x, y, realColor)
            }
        }
    }

    lineho(x0: number, y0: number, x1: number, y1: number, color: number) {
        x0 = Math.floor(x0);
        y0 = Math.floor(y0);
        x1 = Math.floor(x1);
        y1 = Math.floor(y1);

        // rect, half-open ranges
        var dx = x1 - x0;
        var dy = y1 - y0;

        let stepX = dx < 0 ? -1 : 1;
        let stepY = dy < 0 ? -1 : 1;

        dx *= stepX;
        dx <<= 2;
        dy <<= 2;

        x0 += this.#cameraX;
        y0 += this.#cameraY;
        x1 += this.#cameraX;
        y1 += this.#cameraY;

        let realColor = this.#pal[color]
        if (dx > dy) {
            var fraction = dy - (dx >> 1);
            while (true) {
                if (x0 == x1) { break; }
                this.unsafePixel(x0, y0, realColor)

                x0 += stepX;
                if (fraction >= 0) {
                    y0 += stepY;
                    fraction -= dx;
                }
                fraction += dy;
            }
        }
        else {
            var fraction = dx - (dy >> 1);
            while (true) {
                if (y0 == y1) { break; }
                this.unsafePixel(x0, y0, realColor);

                if (fraction >= 0) {
                    x0 += stepX;
                    fraction -= dy;
                }
                y0 += stepY;
                fraction += dx;
            }
        }
    }

    line(x0: number, y0: number, x1: number, y1: number, color: number) {
        this.lineho(x0, y0, x1, y1, color);
        this.pixel(x1, y1, color);
    }

    circ(x0: number, y0: number, r: number, color: number) {
        x0 = Math.floor(x0);
        y0 = Math.floor(y0);
        r = Math.floor(Math.abs(r))

        var x = r;
        var y = 0;
        var dx = 1 - 2 * r;
        var dy = 1;
        var err = 0;

        x0 += this.#cameraX;
        y0 += this.#cameraY;

        let realColor = this.#pal[color]
        while (x >= y) {
            this.unsafePixel(x0 + x, y0 + y, realColor)
            this.unsafePixel(x0 - x, y0 + y, realColor)
            this.unsafePixel(x0 + x, y0 - y, realColor)
            this.unsafePixel(x0 - x, y0 - y, realColor)
            this.unsafePixel(x0 + y, y0 + x, realColor)
            this.unsafePixel(x0 - y, y0 + x, realColor)
            this.unsafePixel(x0 + y, y0 - x, realColor)
            this.unsafePixel(x0 - y, y0 - x, realColor)

            y += 1; err += dy; dy += 2;
            if (2 * err + dx > 0) {
                x -= 1; err += dx; dx += 2;
            }
        }
    }

    circfill(x0: number, y0: number, r: number, color: number) {
        x0 = Math.floor(x0);
        y0 = Math.floor(y0);
        r = Math.floor(Math.abs(r))

        var x = r;
        var y = 0;
        var dx = 1 - 2 * r;
        var dy = 1;
        var err = 0;

        x0 += this.#cameraX;
        y0 += this.#cameraY;

        let realColor = this.#pal[color]
        while (x >= y) {
            for (var x_=x0-x; x_ <= x0+x; x_++) {
                this.unsafePixel(x_, y0 + y, realColor)
                this.unsafePixel(x_, y0 - y, realColor)
            }
            for (var x_=x0-y; x_ <= x0+y; x_++) {
                this.unsafePixel(x_, y0 + x, realColor)
                this.unsafePixel(x_, y0 - x, realColor)
            }

            y += 1; err += dy; dy += 2;
            if (2 * err + dx > 0) {
                x -= 1; err += dx; dx += 2;
            }
        }
    }

    font(font: Font) {
        this.#font=font;
        this.#resources.getSpriteSheetForFont(this.#font)  // preload
    }

    print(text: string, x: number, y: number, color: number) {
        var ss = this.#resources.getSpriteSheetForFont(this.#font)
        let realColor = this.#pal[color]

        x += this.#cameraX;
        y += this.#cameraY;

        for (var c of text) {
            ss.drawSprite(c.charCodeAt(0)-this.#font.char0, 1, 1, (px, py, v) => {
                if (v == 255) { return; }
                this.pixel(x+px, y+py, realColor)
            })
            x += ss.spriteWidth;
        }
    }

    sheet(sheet: SpriteSheet) {
        this.#sheet=sheet;
        this.#resources.getSpriteSheetForSpriteSheet(this.#sheet)  // preload
    }

    spr(n: number, x: number, y: number, w: number, h: number, flip_x: boolean, flip_y: boolean) {
        if (this.#sheet == null) { return }

        var ss = this.#resources.getSpriteSheetForSpriteSheet(this.#sheet);
        var width = w * ss.spriteWidth;
        var height = h * ss.spriteHeight;

        x += this.#cameraX;
        y += this.#cameraY;

        let palt = this.#palt;
        ss.drawSprite(n, w, h, (px, py, v) => {
            if (flip_x) { px = width - px - 1 }
            if (flip_y) { py = height - py - 1 }

            if (palt[v] != 0) { return; }
            let realColor = this.#pal[v]
            this.pixel(x+px, y+py, realColor)
        })
    }

    pal(c0?: number,  c1?: number) {
        if (c0 === undefined && c1 === undefined) {
            // reset palette
            for (var i = 0; i<256; i++) {
                this.#pal[i] = i;
            }
        } else if (c0 === undefined || c1 === undefined) {
            throw TypeError("either both arguments must be present or neither");
        } else {
            this.#pal[c0] = c1;
        }
    }

    palt(c0?: number, transparent?: boolean) {
        if (c0 === undefined && transparent === undefined) {
            for (var i = 0; i<256; i++) {
                this.#palt[i] = 0
            }
            this.#palt[255] = 1
        } else if (c0 === undefined || transparent === undefined) {
            throw TypeError("either both arguments must be present or neither")
        } else {
            this.#palt[c0] = transparent ? 1 : 0;
        }
    }

    camera(x: number, y: number) {
        this.#cameraX = -x;
        this.#cameraY = -y;
    }

    clip(x?: number, y?: number, w?: number, h?: number, previous?: boolean) {
        if (typeof x == "undefined" && typeof y == "undefined" && typeof w == "undefined" && typeof h == "undefined") {
            this.#clipX0 = 0
            this.#clipY0 = 0
            this.#clipX1 = this.width
            this.#clipY1 = this.height
        } else if (typeof x == "undefined" || typeof y == "undefined" || typeof w == "undefined" || typeof h == "undefined") { 
            throw TypeError("either four arguments must be present, five, or neither");
        } else {
            let x0 = x;
            let y0 = y;
            let x1 = x + w;
            let y1 = y + h;

            if (previous) {
                x0 = Math.max(this.#clipX0, x0);
                y0 = Math.max(this.#clipY0, y0);
                x1 = Math.min(this.#clipX1, x1);
                y1 = Math.min(this.#clipY1, y1);
            }

            this.#clipX0=x0;
            this.#clipY0=y0;
            this.#clipX1=x1;
            this.#clipY1=y1;
        }
    }
}