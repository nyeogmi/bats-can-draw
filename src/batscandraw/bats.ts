import { InputState } from "./input_state";
import { OutputState } from "./output_state";

export class Bats {
    #inputState: InputState;
    #output: OutputState|null;

    width: number;
    height: number;

    constructor(inputState: InputState, output: OutputState|null, width: number, height: number) {
        this.#inputState = inputState;
        this.#output = output;

        this.width = width;
        this.height = height;
    }

    get up(): boolean { return this.#inputState.up; }
    get down(): boolean { return this.#inputState.down; }
    get left(): boolean { return this.#inputState.left; }
    get right(): boolean { return this.#inputState.right; }
    get z(): boolean { return this.#inputState.z; }
    get x(): boolean { return this.#inputState.x; }

    #unsafeOutput(): OutputState {
        if (this.#output == null) {
            throw new TypeError("this Bats has no output")
        }
        return this.#output
    }

    pixel(x: number, y: number, color: number) {
        this.#unsafeOutput().pixel(x, y, color)
    }

    rect(x0: number, y0: number, x1: number, y1: number, color: number) {
        this.#unsafeOutput().rect(x0, y0, x1, y1, color)
    }

    rectfill(x0: number, y0: number, x1: number, y1: number, color: number) {
        this.#unsafeOutput().rectfill(x0, y0, x1, y1, color)
    }

    rectho(x0: number, y0: number, x1: number, y1: number, color: number) {
        this.#unsafeOutput().rectho(x0, y0, x1, y1, color)
    }

    recthofill(x0: number, y0: number, x1: number, y1: number, color: number) {
        this.#unsafeOutput().recthofill(x0, y0, x1, y1, color)
    }

    line(x0: number, y0: number, x1: number, y1: number, color: number) {
        this.#unsafeOutput().line(x0, y0, x1, y1, color)
    }

    lineho(x0: number, y0: number, x1: number, y1: number, color: number) {
        this.#unsafeOutput().lineho(x0, y0, x1, y1, color)
    }

    circ(x0: number, y0: number, r: number, color: number) {
        this.#unsafeOutput().circ(x0, y0, r, color)
    }

    circfill(x0: number, y0: number, r: number, color: number) {
        this.#unsafeOutput().circfill(x0, y0, r, color)
    }
}