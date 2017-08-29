import * as Rx from 'rxjs-es/Rx';
import * as $ from 'jquery';

import { BTTV } from './services/bttv';
import { FFZ } from './services/ffz';
import { Util } from './services/util';
import { Emote } from './emote';
import { BTDInterface } from './btdinterface';
import { CookieStorage, ILocalStorage } from './services/localstorage';

export class App {
    bttv: BTTV;
    ffz: FFZ;
    localStorage: ILocalStorage;
    interface: BTDInterface;

    $chatContainer: JQuery<HTMLElement>;
    isHooked: boolean = false;
    channelName: string;

    channelBttvEmotes: Emote[]  = [];
    globalBttvEmotes: Emote[]   = [];
    bttvEmotes: Emote[]         = [];

    channelFfzEmotes: Emote[]   = [];
    globalFfzEmotes: Emote[]    = [];
    ffzEmotes: Emote[]          = [];

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

    async getChannelInfo() {
        let $elem: JQuery<HTMLElement> = $("p[data-a-target='chat__header-channel-name']");
        this.channelName = $elem.text();

        console.log("> Viewing channel: " + this.channelName);

        if(this.localStorage.get("btd:show-bttv") == 'true') {
            this.channelBttvEmotes = await this.bttv.GetEmotes(this.channelName);
            console.log("Channel BTTV emotes: ", this.channelBttvEmotes);
        }

        if(this.localStorage.get("btd:show-ffz") == 'true') {
            this.channelFfzEmotes = await this.ffz.GetEmotes(this.channelName);
            console.log("Channel FFZ emotes: ", this.channelFfzEmotes);
        }

        this.grabChannelChat();
    }

    async grabChannelChat() {
        this.$chatContainer = $(".chat-list");

        Util.addCSSRule(".chat-list__lines > div", { display: "none" });
        Util.addCSSRule(".chat-list__lines > div[data-parsed='true']", { display: "block" });

        // let's set up an Rx producer so we can detect new messages
        let $channelMessages: JQuery<HTMLElement> = $(".chat-list__lines").children().not("[data-parsed='true']");

        if(this.channelBttvEmotes && this.localStorage.get("btd:show-bttv") == 'true') this.bttvEmotes = this.globalBttvEmotes.concat(this.channelBttvEmotes);
        if(this.channelFfzEmotes && this.localStorage.get("btd:show-ffz") == 'true') this.ffzEmotes = this.globalFfzEmotes.concat(this.channelFfzEmotes);

        this.interface.addBTTVEmotes(this.bttvEmotes);
        this.interface.addFFZEmotes(this.ffzEmotes);

        let allEmotes: Emote[] = this.bttvEmotes.concat(this.ffzEmotes);

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
                        $(elem).html(Util.parseMessage(text, allEmotes));
                    });
                }
            });


            $channelMessages.attr("data-parsed", "true");
        });
    
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
                    setTimeout(() => {
                        this.getChannelInfo()
                        .then(() => {
                            this.interface.clearEmotes();
                            this.interface.hook();

                            if(this.channelBttvEmotes) this.bttvEmotes = this.globalBttvEmotes.concat(this.channelBttvEmotes);
                            if(this.channelFfzEmotes) this.ffzEmotes = this.globalFfzEmotes.concat(this.channelFfzEmotes);
                    
                            this.interface.addBTTVEmotes(this.bttvEmotes);
                            this.interface.addFFZEmotes(this.ffzEmotes);
                        });
                    }, 1000);
                }

                this.localStorage.set("btd:last-href", location);
            }

        }, 100);
    }

    setupLocalStorage() {
        if(!this.localStorage.exists("btd:installed")) {
            this.localStorage.set("btd:installed", true);
            
            this.localStorage.set("btd:show-deleted", true);
            this.localStorage.set("btd:show-bttv", true);
            this.localStorage.set("btd:show-ffz", true);
        }
    }

    async initialize(): Promise<void> {
        if(this.localStorage.get("btd:show-bttv") == 'true') {
            this.globalBttvEmotes = await this.bttv.GetEmotes();

            console.log("Global BTTV emotes: ", this.globalBttvEmotes);
        }

        if(this.localStorage.get("btd:show-ffz") == 'true') {
            this.globalFfzEmotes = await this.ffz.GetEmotes();

            console.log("Global FFZ emotes: ", this.globalFfzEmotes);
        }

        if(this.isHooked) {
            await this.getChannelInfo();
        }
    }

    constructor() {
        this.isHooked = this.hook();
        
        this.bttv = new BTTV();
        this.ffz = new FFZ();

        this.localStorage = new CookieStorage();
        this.interface = new BTDInterface(this.localStorage);

        this.interface.hook();

        this.setupLocalStorage();
        this.initialize();

        this.listenForEvents();
    }
}

export * from "./app";
