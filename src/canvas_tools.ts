export function manage(
    element: HTMLCanvasElement,
    {width, height}: {width: number, height: number},
    {draw, update}
) {
    restyle(element, {width, height});
    var ctx: CanvasRenderingContext2D = element.getContext("2d")
    
    var frame=0.0
    var previousTs=null
    var onRedraw = (ts: DOMHighResTimeStamp) => {
        frame+=(ts-previousTs) * (60/1000)
        previousTs=ts;

        while (frame>0.0) { update(); frame-=1.0; }
        
        var drawTo=ctx.createImageData(width, height);
        draw(drawTo);
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
}