import "./reset.css"
import * as canvas_tools from "./canvas_tools"

function main() {
    var {draw,update}=setup();
    canvas_tools.manage(
        document.getElementById("game") as HTMLCanvasElement,
        {width:128, height:128},
        {draw, update}
    );
}

function setup() {
    var frame=0
    return {
        draw: function(idata: ImageData) {
            var width=idata.width
            var height=idata.height
            var data=idata.data

            for (var y=0; y<height; y++) {
                for(var x=0; x<width; x++) {
                    var ix = (y * width + x) * 4;
                    var x2 = (x - frame + 128) % 16;
                    data[ix+0] = (x2+y)%16 < 8 ? 0: 255;
                    data[ix+1] = 0;
                    data[ix+2] = 0;
                    data[ix+3] = 255;
                }
            }
        },
        update: function() {
            frame+=1
            frame=frame%64
        }
    }
}
main()