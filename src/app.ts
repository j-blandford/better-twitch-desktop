/// <reference path ="../node_modules/@types/jquery/index.d.ts"/> 
import * as $ from 'jquery';
import { BTTV } from './services/bttv';

export class App {
    isHooked: boolean = false;
    channelName: string;
    bttvEmotes: Map<string, string>;

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

        this.bttvEmotes = BTTV.getChannelEmotes(this.channelName);
    }

    constructor() {
        this.isHooked = this.hook();

        if(this.isHooked) {
            this.addChatButton();
            this.getChannelInfo();
        }
    }
}

export * from "./app";
