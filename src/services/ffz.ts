import * as Rx from 'rxjs-es/Rx';
import * as $ from 'jquery';

import { Emote } from '../emote';

interface IFFZEmote {
    id: string;
    name: string;
    owner: any;

    width: number;
    height: number;
    margins: any;
    offset: any;

    urls: {
        [key: string]: { url: string }
    };

    modifier: boolean;
    hidden: boolean;
    public: boolean;
    css: string;
}

interface IFFZSet {
    _type: number;
    icon: string;
    id: string;
    title: string;

    emoticons: IFFZEmote[];
}

interface IFFZEmoteResponse {
    room?: String[];
    default_sets?: number[]; // for global emotes
    users?: any;

    sets: {
        [key: string]: IFFZSet;
    };
}

export class FFZ {

    readonly API_BASE_URL: string = 'https://cors-anywhere.herokuapp.com/https://api.frankerfacez.com/v1/';

    public async GetEmotes(channel?: string): Promise<Emote[]> {
        let url: string = this.API_BASE_URL;

        if(channel !== undefined) {
            url += 'room/' + channel;
        }
        else {
            url += 'set/global';
        }

        return Rx.Observable.ajax({
                url: url,
                method: 'GET',
                responseType: 'json'
            })
            .map((e: any) => e.response)
            .map((json: IFFZEmoteResponse) => {
                let result: Array<Emote> = [];

                for(let k in json.sets) {
                    let elem: IFFZSet = json.sets[k];

                    elem.emoticons.forEach((emoticon) => {
                        result.push({
                            id: emoticon.id, 
                            matchString: emoticon.name, 
                            url: 'https:' + emoticon.urls["1"]
                        });
                    });
                }
                
                return result;
            })
            .toPromise()
            .catch((e: any) => {
                console.log("Error grabbing FFZ emotes: ", e);
                return [];
            });
    }

}

export * from './ffz';