import * as Rx from 'rxjs-es/Rx';
import * as $ from 'jquery';

import { BTTV } from './services/bttv';
import { Util } from './services/util';
import { Emote } from './emote';

export class App {
    isHooked: boolean = false;
    channelName: string;
    channelBttvEmotes: Emote[];
    globalBttvEmotes: Emote[];
    bttv: BTTV;
    $chatContainer: JQuery<HTMLElement>;

    bttvEmotes: Emote[];

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
            this.channelBttvEmotes = value;
            console.log("Channel BTTV emotes: ", this.channelBttvEmotes);

            this.grabChannelChat();
        });
    }

    grabChannelChat() {
        this.$chatContainer = $(".chat-list");

        Util.addCssRule(".chat-list__lines > div", { display: "none" });
        Util.addCssRule(".chat-list__lines > div[data-parsed='true']", { display: "block" });

        // let's set up an Rx producer so we can detect new messages
        let $channelMessages: JQuery<HTMLElement> = $(".chat-list__lines").children().not("[data-parsed='true']");

        if(this.channelBttvEmotes !== null) {
            this.bttvEmotes = this.globalBttvEmotes.concat(this.channelBttvEmotes);

            let messageStream$ = Rx.Observable.interval(50)
            .switchMap(() => $(".chat-list__lines").children().not("[data-parsed='true']"))
            .map(response => $(response))
            .subscribe((data) => {
                $channelMessages = data;

                var context = this;
                $channelMessages.each(function(i) {
                    let username: string = $(this).find("[data-a-target='chat-message-username']").text();
                    let $messageStrings: JQuery<HTMLElement> = $(this).find("[data-a-target='chat-message-text']");

                    if(context.bttvEmotes != undefined) {
                        $messageStrings.each(function(k, elem) {
                            let text: string = $(elem).text();
                            $(elem).html(Util.parseMessage(text, context.bttvEmotes));
                        });
                    }

                    //$(this).find("[data-a-target='chat-message-username']").text("TESTERINO");
                });

                $channelMessages.attr("data-parsed", "true");

                console.log(data.find("[data-a-target='chat-message-text']").text());
            });
        }
    }

    constructor() {
        this.isHooked = this.hook();
        this.bttv = new BTTV();
        
        this.bttv.GetBTTVEmotes$().subscribe(value => {
            this.globalBttvEmotes = value;
            console.log("Global BTTV emotes: ", this.globalBttvEmotes);
        });

        if(this.isHooked) {
            this.addChatButton();
            this.getChannelInfo();
        }
    }
}

export * from "./app";
