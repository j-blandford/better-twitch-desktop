import * as Rx from 'rxjs-es/Rx';
import * as $ from 'jquery';

import { BTTV } from './services/bttv';
import { Util } from './services/util';
import { Emote } from './emote';

export class App {
    isHooked: boolean = false;
    channelName: string;
    bttvEmotes: Emote[];
    bttv: BTTV;
    $chatContainer: JQuery<HTMLElement>;

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
        let $elem: JQuery<HTMLElement> = $("p[data-a-target='chat__header-channel-name']");
        this.channelName = $elem.text();

        console.log("> Viewing channel: " + this.channelName);

        this.bttv.GetBTTVEmotes$(this.channelName).subscribe(value => {
            this.bttvEmotes = value;
        });
    }

    grabChannelChat() {
        this.$chatContainer = $(".chat-list");

        Util.addCssRule(".chat-list__lines > div", { display: "none" });
        Util.addCssRule(".chat-list__lines > div[data-parsed='true']", { display: "block" });

        // let's set up an Rx producer so we can detect new messages
        let $channelMessages: JQuery<HTMLElement> = $(".chat-list__lines").children().not("[data-parsed='true']");

        let messageStream$ = Rx.Observable.interval(50)
            .switchMap(() => $(".chat-list__lines").children().not("[data-parsed='true']"))
            .map(response => $(response))
            .subscribe((data) => {
                $channelMessages = data;

                // "$channelMessages" contains our new messages.
                // now we can parse the new chat message's text

                $channelMessages.each(function(i) {
                    let username: string = $(this).find("[data-a-target='chat-message-username']").text();

                    $(this).find("[data-a-target='chat-message-username']").text("TESTERINO");
                });

                $channelMessages.attr("data-parsed", "true");

                console.log(data.find("[data-a-target='chat-message-text']").text());
            });
    }

    constructor() {
        this.isHooked = this.hook();

        if(this.isHooked) {
            this.bttv = new BTTV();
            this.addChatButton();
            this.getChannelInfo();
            this.grabChannelChat();
        }
    }
}

export * from "./app";
