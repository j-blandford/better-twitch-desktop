export class BTTV {
    static readonly API_BASE_URL: string = "https://api.betterttv.net/2/";
    
    static getChannelEmotes(channel: string) : Map<string, string> {
        let emotes = new Map<string, string>();
        let url: string = BTTV.API_BASE_URL + "channel/" + channel;

        return emotes;
    }
}

export * from './bttv';
