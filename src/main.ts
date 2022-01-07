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
            for(var i=0; i<idata.width * idata.height * 4; i++) {
                idata.data[i]=i%4==3?frame*2+128:i%4==0?255:0;
            }
        },
        update: function() {
            frame+=1
            frame=frame%64
        }
    }
}
main()