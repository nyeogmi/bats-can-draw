import { InputState } from "./input_state";
import { OutputState } from "./output_state";
import { Font, Resources, SpriteSheet } from "./resources";

export class Bats {
    _inputState: InputState;
    _output: OutputState|null;
    _resources: Resources;

    width: number;
    height: number;

    constructor(inputState: InputState, output: OutputState|null, resources: Resources, width: number, height: number) {
        this._inputState = inputState;
        this._output = output;
        this._resources = resources;

        this.width = width;
        this.height = height;
    }

    get up(): boolean { return this._inputState.up; }
    get down(): boolean { return this._inputState.down; }
    get left(): boolean { return this._inputState.left; }
    get right(): boolean { return this._inputState.right; }
    get z(): boolean { return this._inputState.z; }
    get x(): boolean { return this._inputState.x; }

    _unsafeOutput(): OutputState {
        if (this._output == null) {
            throw new TypeError("this Bats has no output")
        }
        return this._output
    }

    pixel(x: number, y: number, color: number) {
        this._unsafeOutput().pixel(x, y, color)
    }

    rect(x0: number, y0: number, x1: number, y1: number, color: number) {
        this._unsafeOutput().rect(x0, y0, x1, y1, color)
    }

    rectfill(x0: number, y0: number, x1: number, y1: number, color: number) {
        this._unsafeOutput().rectfill(x0, y0, x1, y1, color)
    }

    rectho(x0: number, y0: number, x1: number, y1: number, color: number) {
        this._unsafeOutput().rectho(x0, y0, x1, y1, color)
    }

    recthofill(x0: number, y0: number, x1: number, y1: number, color: number) {
        this._unsafeOutput().recthofill(x0, y0, x1, y1, color)
    }

    line(x0: number, y0: number, x1: number, y1: number, color: number) {
        this._unsafeOutput().line(x0, y0, x1, y1, color)
    }

    lineho(x0: number, y0: number, x1: number, y1: number, color: number) {
        this._unsafeOutput().lineho(x0, y0, x1, y1, color)
    }

    circ(x0: number, y0: number, r: number, color: number) {
        this._unsafeOutput().circ(x0, y0, r, color)
    }

    circfill(x0: number, y0: number, r: number, color: number) {
        this._unsafeOutput().circfill(x0, y0, r, color)
    }

    preloadFont(font: Font) {
        this._resources.getSpriteSheetForFont(font);
    }

    font(font: Font) {
        this._unsafeOutput().font(font)
    }

    print(text: string, x: number, y: number, color: number) {
        this._unsafeOutput().print(text, x, y, color)
    }

    preloadSheet(sheet: SpriteSheet) {
        this._resources.getSpriteSheetForSpriteSheet(sheet);
    }

    sheet(sheet: SpriteSheet) {
        this._unsafeOutput().sheet(sheet)
    }

    spr(n: number, x: number, y: number, w: number, h: number, flip_x: boolean, flip_y: boolean) {
        this._unsafeOutput().spr(n, x, y, w, h, flip_x, flip_y)
    }

    pal(c0?: number,  c1?: number) {
        this._unsafeOutput().pal(c0, c1)
    }

    palt(c0?: number,  transparent?: boolean) {
        this._unsafeOutput().palt(c0, transparent)
    }

    camera(x: number, y: number) {
        this._unsafeOutput().camera(x, y)
    }

    clip(x?: number, y?: number, w?: number, h?: number, previous?: boolean) {
        this._unsafeOutput().clip(x, y, w, h, previous)
    }
}
