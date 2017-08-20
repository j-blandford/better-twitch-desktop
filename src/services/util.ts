import * as $ from 'jquery';
import { Emote } from '../emote';

export class Util {
    static addCssRule(rule: string, css: any) {
        let css_str: string = JSON.stringify(css).replace(/"/g, "").replace(/,/g, ";");
        $("<style>").prop("type", "text/css").html(rule + css_str).appendTo("head");
    }

    static RegExpEscape(s: string): string {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    static parseMessage(message: string, emotes: Emote[]): string {
        emotes.forEach((emoticon) => {
            message = message.replace(new RegExp("(^|\\s+)" + Util.RegExpEscape(emoticon.matchString) + "(\\s+|$)", "gm")," <img src='" + emoticon.url + "'/>"); //class='emoticon bttv-" + emoticon.id + "' 
        });

        return message;
    }
} 

export * from './util';