/// <reference path ="../node_modules/@types/jquery/index.d.ts"/> 
import * as $ from 'jquery';

import { App } from './app';
import printMe from './print';

(function () {
    printMe();

    let MainApp: App = new App();

    // var newDiv = document.createElement("div");
    // $(newDiv).click(function() {
    //     printMe();
    // });
    // $("body").append(newDiv);
})();
