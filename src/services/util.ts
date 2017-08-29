import * as $ from 'jquery';
import { Emote } from '../emote';

export class Util {
    static addCSSRule(rule: string, css: any) {
        let css_str: string = JSON.stringify(css, null, "\t").replace(/"/g, "").replace(/,\n/g, ";\n");
        $("<style>").prop("type", "text/css").html(rule + css_str).appendTo("head");
    }

    static addCSS(css: string) {
        $("<style>").prop("type", "text/css").html(css).appendTo("head");
    }

    static RegExpEscape(s: string): string {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    static parseMessage(message: string, emotes: Emote[]): string {
        emotes.forEach((emoticon) => {
            message = message.replace(new RegExp("(^|\\s+)" + Util.RegExpEscape(emoticon.matchString) + "(?=(\\s|$))", "gm")," <img src='" + emoticon.url + "'/>"); //class='emoticon bttv-" + emoticon.id + "' 
        });

        return message;
    }
} 

export * from './util';