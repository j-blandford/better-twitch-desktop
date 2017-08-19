import * as $ from 'jquery';

import { Util } from './services/util';

export class BTDInterface {
    hook() {
        // Give dark usernames a bit of a shadow for contrast
        Util.addCssRule(".chat-line__message--username", {
            "text-shadow": "0px 0px 2px rgb(0, 0, 0)"
        });

        let $cogIconContainer = $(".chat-settings > div");

        if($cogIconContainer.children().length < 4) {
            // we haven't hooked into the settings "cog" menu yet
            // also this needs to be refactored into React JSX
            let $newDiv = $("<div/>")
                .attr("id", "btd-settings")
                .append($("<div />")
                    .addClass("mg-t-1")
                    .append($("<button/>")
                        .addClass("tw-button")
                        .append($("<span/>")
                            .addClass("tw-button__text")
                            .text("BTD Settings")
                        )
                    )
                )
                .appendTo($cogIconContainer);

            console.log("[SUC] Added buttons to interface");
        }
    }
} 

export * from './btdinterface';