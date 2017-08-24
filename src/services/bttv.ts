import * as Rx from 'rxjs-es/Rx';
import * as $ from 'jquery';

import { Emote } from '../emote';

export interface IBTTVEmote {
    id: string;
    channel: string;
    code: string;
    imageType: string;
}

interface IBTTVRestrictions {
    channels: string[];
    games: string[];
}

// this allows us to cast the emote response
interface IBTTVEmoteRepsonse {
    status: number;
    urlTemplate: string;
    bots?: String[];
    emotes: IBTTVEmote[];
    restrictions?: IBTTVRestrictions;
}

export class BTTV {
    
    readonly API_BASE_URL: string = 'https://api.betterttv.net/2/';

    public async GetEmotes(channel?: string): Promise<Emote[]> {
        let url: string = this.API_BASE_URL;

        if(channel !== undefined) {
            url += 'channels/' + channel;
        }
        else {
            url += 'emotes';
        }

        return Rx.Observable.ajax({
                url: url,
                method: 'GET',
                responseType: 'json'
            })
            .map(e => e.response)
            .map((json: IBTTVEmoteRepsonse) => {
                let result: Array<Emote> = [];

                let templateUrl: string = 'http:' + json.urlTemplate.replace(/\{\{image\}\}/, "1x");

                if(json !instanceof Error) {
                    json.emotes.forEach((emoticon) => {
                        result.push({
                            id: emoticon.id, 
                            matchString: emoticon.code, 
                            url: templateUrl.replace(/\{\{id\}\}/, emoticon.id)
                        });
                    });
                }
    
                return result;
            })
            .toPromise()
            .catch((e: any) => {
                console.log("Error grabbing BTTV emotes: ", e);
                return [];
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
