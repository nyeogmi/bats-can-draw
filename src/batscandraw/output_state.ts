export class OutputState {
    data: Uint8ClampedArray;

    width: number
    height: number

    constructor(data: Uint8ClampedArray, width: number, height: number) {
        this.data = data

        this.width = width
        this.height = height
    }

    unsafePixel(x: number, y: number, color: number) {
        // pixel without any rounding or clipping
        var ix = y * this.width + x;
        this.data[ix]=color;
    }

    unsafePixelClip(x: number, y: number, color: number) {
        // TODO: After implementing clipping, do it here
        this.unsafePixel(x, y, color)
    }

    pixel(x0: number, y0: number, color: number) {
        this.unsafePixel(Math.floor(x0), Math.floor(y0), color)
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

        for (var x=xMin; x < xMax; x++) {
            this.unsafePixelClip(x, yMin, color)
            this.unsafePixelClip(x, yMax-1, color)
        }
        for (var y=yMin+1; y < yMax-1; y++) { // don't hit any pixels twice
            this.unsafePixelClip(xMin, y, color)
            this.unsafePixelClip(xMax-1, y, color)
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

        for (var y = yMin; y < yMax; y++) {
            for (var x = xMin; x < xMax; x++) {
                this.unsafePixel(x, y, color)
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

        // TODO: Do clipping here some other way
        if (dx > dy) {
            var fraction = dy - (dx >> 1);
            while (true) {
                if (x0 == x1) { break; }
                this.unsafePixelClip(x0, y0, color)

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
                this.unsafePixelClip(x0, y0, color);

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

        while (x >= y) {
            this.unsafePixelClip(x0 + x, y0 + y, color)
            this.unsafePixelClip(x0 - x, y0 + y, color)
            this.unsafePixelClip(x0 + x, y0 - y, color)
            this.unsafePixelClip(x0 - x, y0 - y, color)
            this.unsafePixelClip(x0 + y, y0 + x, color)
            this.unsafePixelClip(x0 - y, y0 + x, color)
            this.unsafePixelClip(x0 + y, y0 - x, color)
            this.unsafePixelClip(x0 - y, y0 - x, color)

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

        while (x >= y) {
            for (var x_=x0-x; x_ <= x0+x; x_++) {
                this.unsafePixelClip(x_, y0 + y, color)
                this.unsafePixelClip(x_, y0 - y, color)
            }
            for (var x_=x0-y; x_ <= x0+y; x_++) {
                this.unsafePixelClip(x_, y0 + x, color)
                this.unsafePixelClip(x_, y0 - x, color)
            }

            y += 1; err += dy; dy += 2;
            if (2 * err + dx > 0) {
                x -= 1; err += dx; dx += 2;
            }
        }
    }
}