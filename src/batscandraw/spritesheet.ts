export class InternalSpriteSheet {
    readonly data: Uint8ClampedArray;

    readonly dataWidth: number
    readonly dataHeight: number

    readonly spriteWidth: number
    readonly spriteHeight: number

    constructor(
        data: Uint8ClampedArray, 
        dataWidth: number, dataHeight: number,
        spriteWidth: number, spriteHeight: number
    ) {
        this.data = data

        this.dataWidth = dataWidth
        this.dataHeight = dataHeight

        this.spriteWidth = spriteWidth
        this.spriteHeight = spriteHeight
    }

    drawSprite(ix: number, wx: number, wy: number, callback) {
        var tilesWide = Math.floor(this.dataWidth / this.spriteWidth)
        var tilesTall = Math.floor(this.dataHeight / this.spriteHeight)

        var cellX, cellY;
        if (tilesWide == 0) {
            cellX = 0;
            cellY = 0;
        } else {
            cellX = ix % tilesWide
            cellY = Math.floor(ix / tilesWide)
        }

        var originX = this.spriteWidth * cellX;
        var originY = this.spriteHeight * cellY;

        for (var cy = 0; cy < wy; cy++) {
            for (var cx = 0; cx < wx; cx++) {
                var cellHereX = cellX + cx;
                var cellHereY = cellY + cy;

                if ((0 <= cellHereX && cellHereX < tilesWide) &&
                    (0 <= cellHereY && cellHereY < tilesTall)) 
                { 
                    for (var py = 0; py < this.spriteHeight; py++) {
                        for (var px = 0; px < this.spriteWidth; px++) {
                            var pixelHereX = cellHereX * this.spriteWidth + px;
                            var pixelHereY = cellHereY * this.spriteHeight + py;

                            callback(
                                pixelHereX - originX, 
                                pixelHereY - originY, 
                                this.data[this.dataWidth * pixelHereY + pixelHereX]
                            )
                        }
                    }
                } else {
                    for (var py = 0; py < this.spriteHeight; py++) {
                        for (var px = 0; px < this.spriteWidth; px++) {
                            var pixelHereX = cellHereX * this.spriteWidth + px;
                            var pixelHereY = cellHereY * this.spriteHeight + py;

                            callback(
                                pixelHereX - originX, 
                                pixelHereY - originY, 
                                255,  // pretend the tile was fully transparent
                            )
                        }
                    }
                }
            }
        }
        
    }
}