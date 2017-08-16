import * as $ from 'jquery';

import { BTTV } from './services/bttv';
import { Emote } from './emote';

export class App {
    isHooked: boolean = false;
    channelName: string;
    bttvEmotes: Emote[];
    bttv: BTTV;

    hook(): boolean {

        if(document.getElementsByClassName("player-fullscreen-overlay") !== null) {
            console.log("[SUC] Hooked into Twitch interface!");
            return true;
        }
        else {
            console.log("[ERR] Could not find Twitch player");
            return false;
        }
    }

    addChatButton() {
        // let element: Element = document.getElementsByClassName("tw-form__icon-group--right")[0];
    }

    getChannelInfo() {
        let elem: JQuery<HTMLElement> = $("p[data-a-target='chat__header-channel-name']");
        this.channelName = elem.text();

        console.log("> Viewing channel: " + this.channelName);

        this.bttv.GetBTTVEmotes$(this.channelName).subscribe(value => console.log(value));
    }

    constructor() {
        this.isHooked = this.hook();

        if(this.isHooked) {
            this.bttv = new BTTV();
            this.addChatButton();
            this.getChannelInfo();
        }
    }
}

export * from "./app";
