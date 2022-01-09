import { Bats } from "./bats";
import { InputState } from "./input_state";
import { OutputState } from "./output_state";
import { Resources } from "./resources";

var palette=new Uint8ClampedArray([
    0x00, 0x00, 0x00,
    0x1d, 0x2b, 0x53,
    0x7e, 0x25, 0x53,
    0x00, 0x87, 0x51,
    0xab, 0x52, 0x36,
    0x5f, 0x57, 0x4f,
    0xc2, 0xc3, 0xc7,
    0xff, 0xf1, 0xe8,
    0xff, 0x00, 0x4d,
    0xff, 0xa3, 0x00,
    0xff, 0xec, 0x27,
    0x00, 0xe4, 0x36,
    0x29, 0xad, 0xff,
    0x83, 0x76, 0x9c,
    0xff, 0x77, 0xa8,
    0xff, 0xcc, 0xaa,
])

export function manage(
    element: HTMLCanvasElement,
    {width, height}: {width: number, height: number},
    {draw, update}
) {
    restyle(element, {width, height});
    var ctx: CanvasRenderingContext2D = element.getContext("2d")
    ctx.imageSmoothingEnabled=false;
    
    var frame=0.0

    var previousTs=null
    var rawBuf=ctx.createImageData(width,height);
    var paletteBuf=new Uint8ClampedArray(width * height);
    var inputState = new InputState();
    var resources = new Resources(palette);

    document.addEventListener("keydown", (k) => inputState.keyDown(k))
    document.addEventListener("keyup", (k)=>inputState.keyUp(k))

    for (var i=0; i < rawBuf.data.length; i++) {
        rawBuf.data[i]=255;
    }

    var onRedraw = (ts: DOMHighResTimeStamp) => {
        var frameTime = (ts - previousTs) * (1/1000)
        previousTs=ts;

        frame+=frameTime*60;

        if (frame>10.0) { frame=0.0 } // ultimately limit the number of frames we get behind
        while (frame>1.0) { 
            update(new Bats(inputState, null, resources, width, height)); 
            frame-=1.0; 
        }
        
        // fill with color 0
        for(var i=0; i < width * height;i++) { paletteBuf[i]=0; }

        draw(new Bats(inputState, new OutputState(paletteBuf, width, height, resources), resources, width, height));

        for(var j=0; j<3; j++) {
            for(var i=0; i < width * height;i++) {
                rawBuf.data[i*4+j]=palette[(paletteBuf[i]*3+j)%palette.length]
            }
        }
        ctx.putImageData(rawBuf,0,0);

        window.requestAnimationFrame(onRedraw)
    }
    window.requestAnimationFrame(onRedraw)
}

function restyle(
    element: HTMLCanvasElement, 
    {width, height}: {width: number, height: number},
) {
    element.width=width;
    element.height=height;
    element.style.aspectRatio="" + (width/height);
    element.style.width="100%";
    element.style.height="100%";
    element.style.objectFit="contain";
    element.style.margin="auto";
    element.style.display="block";

    element.style.imageRendering="pixelated";
}