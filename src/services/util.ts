import * as $ from 'jquery';

export class Util {
    static addCssRule(rule: string, css: any) {
        let css_str: string = JSON.stringify(css).replace(/"/g, "").replace(/,/g, ";");
        $("<style>").prop("type", "text/css").html(rule + css_str).appendTo("head");
    }
} 

export * from './util';