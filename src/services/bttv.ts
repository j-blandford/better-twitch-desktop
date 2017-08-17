import * as Rx from 'rxjs-es/Rx';
import * as $ from 'jquery';

import { Emote } from '../emote';

export interface IBTTVEmote {
    id: string;
    channel: string;
    code: string;
    imageType: string;
}

// this allows us to cast the emote response
interface IBTTVEmoteRepsonse {
    status: number;
    urlTemplate: string;
    bots?: String[];
    emotes: IBTTVEmote[];
}

export class BTTV {
    
    readonly API_BASE_URL: string = 'https://api.betterttv.net/2/';

    public GetBTTVEmotes$(channel: string): Rx.Observable<Emote[]> {
        let url: string = this.API_BASE_URL + 'channels/' + channel;

        return Rx.Observable.ajax({
                url: url,
                method: 'GET',
                responseType: 'json'
            })
            .map(e => e.response)
            .map((json: IBTTVEmoteRepsonse) => {
                let result: Array<Emote> = [];

                let templateUrl: string = 'http:' + json.urlTemplate.replace(/\{\{image\}\}/, "1x");

                json.emotes.forEach((emoticon) => {
                    result.push({id: emoticon.id, matchString: emoticon.code, url: templateUrl.replace(/\{\{id\}\}/, emoticon.id)});
                });

                return result;
            });
    }
    
    getChannelEmotes(channel: string) : Emote[] {
        let emotes = new Map<string, string>();
        let parsedEmotes: Emote[] = [];
        let url: string = this.API_BASE_URL + "channel/" + channel;

        return parsedEmotes;
    }
}

export * from './bttv';
