export class App {
    isHooked: boolean = false;

    hook(): boolean {
        console.log("[SUC] Hooked into Twitch interface!")
        return true;
    }

    constructor() {
        this.isHooked = this.hook();

        if(this.isHooked) {

        }
    }
}

export * from "./app";
