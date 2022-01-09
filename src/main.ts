import { Bats, manage, SpriteSheet, TALL_FONT } from "./batscandraw";
import "./reset.css"

function main() {
    var {draw,update}=setup();
    manage(
        document.getElementById("game") as HTMLCanvasElement,
        {width:320, height:240},
        {draw, update}
    );
}

var DEMO_SPRITES: SpriteSheet = {
    name: "DEMO_SPRITES",
    url: "demo_sprites.png",
    width: 8,
    height: 8,
    transparent: 0,
}

function setup() {
    var frame=0
    return {
        draw: function(bats: Bats) {
            var width=bats.width
            var height=bats.height

            bats.camera(-10,-10);
            bats.clip(18, 4, 240, 240);

            for (var y=0; y<height; y++) {
                for(var x=0; x<width; x++) {
                    var x2 = (x - frame + 128) % 16;
                    var color = bats.x ? 11 : 2;

                    bats.pixel(x, y, (x2+y) % 16 < 8 ? color: 0)
                }
            }

            bats.rectho(0, 0, 16, 16, 7);
            bats.lineho(0, 0, 16, 8, 4);
            bats.circfill(32, 32, 17, 11);
            bats.circ(32, 32, 21, 10);

            bats.print("Hello, world! It's me, bats!!", 0, 64, 7);
            bats.font(TALL_FONT);
            bats.print("Hello, world! It's me, bats!!", 0, 71, 7);

            bats.sheet(DEMO_SPRITES);
            bats.spr(0, 32, 32, 1, 2, false, false);
            bats.spr(1, 37, 35, 1, 2, false, false);
            bats.spr(32, 48, 35, 1, 2, true, false);
            bats.pal(7, 8)
            bats.spr(35, 68, 35, 1, 2, false, true);
            bats.pal()
            bats.spr(35, 58, 35, 1, 2, false, true);
        },
        update: function (bats: Bats) {
            frame += 1
            frame = frame % 64
        }
    }
}
main()