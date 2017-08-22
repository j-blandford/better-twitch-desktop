import * as Rx from 'rxjs-es/Rx';
import * as $ from 'jquery';

import { BTTV } from './services/bttv';
import { Util } from './services/util';
import { Emote } from './emote';
import { BTDInterface } from './btdinterface';
import { LocalStorage, ILocalStorage } from './services/localstorage';

export class App {
    bttv: BTTV;
    localStorage: ILocalStorage;
    interface: BTDInterface;

    $chatContainer: JQuery<HTMLElement>;
    isHooked: boolean = false;
    channelName: string;
    channelBttvEmotes: Emote[];
    globalBttvEmotes: Emote[];
    bttvEmotes: Emote[];

    hook(): boolean {
        if(document.getElementsByClassName("player-fullscreen-overlay") !== null) {
            console.log("[BTD] Hooked into Twitch player!");
            return true;
        }
        else {
            console.log("[ERR] Could not find Twitch player");
            return false;
        }
    }

    async addChatButton() {
        // let element: Element = document.getElementsByClassName("tw-form__icon-group--right")[0];
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    }

    async getChannelInfo() {
        let $elem: JQuery<HTMLElement> = $("p[data-a-target='chat__header-channel-name']");
        this.channelName = $elem.text();

        console.log("> Viewing channel: " + this.channelName);

        this.channelBttvEmotes = await this.bttv.GetBTTVEmotes(this.channelName);

        console.log("Channel BTTV emotes: ", this.channelBttvEmotes);

        this.grabChannelChat();
    }

    async grabBTTVGlobalEmotes() {
        this.globalBttvEmotes = await this.bttv.GetBTTVEmotes();

        console.log("Global BTTV emotes: ", this.globalBttvEmotes);
    }

    async grabChannelChat() {
        this.$chatContainer = $(".chat-list");

        Util.addCssRule(".chat-list__lines > div", { display: "none" });
        Util.addCssRule(".chat-list__lines > div[data-parsed='true']", { display: "block" });

        // let's set up an Rx producer so we can detect new messages
        let $channelMessages: JQuery<HTMLElement> = $(".chat-list__lines").children().not("[data-parsed='true']");

        if(this.channelBttvEmotes !== null) {
            this.bttvEmotes = this.globalBttvEmotes.concat(this.channelBttvEmotes);

            this.interface.addEmotes(this.bttvEmotes);

            Rx.Observable.interval(50)
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
                });


                $channelMessages.attr("data-parsed", "true");
            });
        }
    }

    setupLocalStorage() {
        if(this.localStorage.exists("btd:installed")) {
            this.localStorage.set("btd:installed", true);
            this.localStorage.set("btd:show-deleted", true);
        }
    }

    async initialize() {
        await this.grabBTTVGlobalEmotes();

        if(this.isHooked) {
        //    await this.addChatButton();
            await this.getChannelInfo();
        }
    }
    
    listenForEvents() {
        this.localStorage.set("btd:last-href", window.location.pathname);

        // This function is used to poll for location changes
        setInterval(() => {
            let lastLocation: string = this.localStorage.get("btd:last-href"); 
            let location: string = window.location.pathname;

            if(location != lastLocation) {
                console.log("Changed page!");
                
                if(location.match("channel") && !lastLocation.match("channel")) {
                    // we've just navigated to a new channel, we need to hook into the interface now
                    this.interface.hook();
                }

                this.localStorage.set("btd:last-href", location);
            }

        }, 100);
    }

    constructor() {
        this.isHooked = this.hook();
        
        this.bttv = new BTTV();
        this.localStorage = new LocalStorage();
        this.interface = new BTDInterface();

        this.interface.hook();

        this.setupLocalStorage();
        this.initialize();

        this.listenForEvents();
    }
}

export * from "./app";
