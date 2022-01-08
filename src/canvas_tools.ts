export class InputState {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    z: boolean;
    x: boolean;

    keyUp(k: KeyboardEvent) {
        this.key(k, false)
    }
    
    keyDown(k: KeyboardEvent) {
        this.key(k, true)
    }

    key(k: KeyboardEvent, on: boolean) {
        switch(k.code) {
            case "ArrowUp": this.up=on; break;
            case "ArrowDown": this.down=on; break;
            case "ArrowLeft": this.left=on; break;
            case "ArrowRight": this.right=on; break;
            case "KeyZ": this.z=on; break;
            case "KeyX": this.x=on; break;
        }
    }
}

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
    var drawTo=ctx.createImageData(width,height);
    var inputState = new InputState();

    document.addEventListener("keydown", (k) => inputState.keyDown(k))
    document.addEventListener("keyup", (k)=>inputState.keyUp(k))

    var onRedraw = (ts: DOMHighResTimeStamp) => {
        var frameTime = (ts - previousTs) * (1/1000)
        previousTs=ts;

        frame+=frameTime*60;

        if (frame>10.0) { frame=0.0 } // ultimately limit the number of frames we get behind
        while (frame>1.0) { update(inputState); frame-=1.0; }
        
        draw(inputState, drawTo);
        ctx.putImageData(drawTo,0,0);

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