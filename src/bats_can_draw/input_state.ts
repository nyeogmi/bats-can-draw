export class InputState {
    up: boolean = false;
    down: boolean = false;
    left: boolean = false;
    right: boolean = false;
    z: boolean = false;
    x: boolean = false;

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
