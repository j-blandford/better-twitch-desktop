"use strict";

import printMe from './print.js';
import $ from 'jquery';

(function () {
    var newDiv = document.createElement("div");
    $(newDiv).click(function() {
        printMe();
    });
    $("body").append(newDiv);
})();
