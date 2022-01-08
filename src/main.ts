import { Bats, manage } from "./batscandraw";
import "./reset.css"

function main() {
    var {draw,update}=setup();
    manage(
        document.getElementById("game") as HTMLCanvasElement,
        {width:320, height:240},
        {draw, update}
    );
}

function setup() {
    var frame=0
    return {
        draw: function(bats: Bats) {
            var width=bats.width
            var height=bats.height

            
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
        },
        update: function(bats: Bats) {
            frame+=1
            frame=frame%64
        }
    }
}
main()