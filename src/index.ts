/// <reference path ="../node_modules/@types/jquery/index.d.ts"/> 
import * as $ from 'jquery';

import printMe from './print';

(function () {
    printMe();
    var newDiv = document.createElement("div");
    $(newDiv).click(function() {
        printMe();
    });
    $("body").append(newDiv);
})();
