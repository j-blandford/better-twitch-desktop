import { Emote } from '../emote';

export interface ILocalStorage {
    get(key: string): string;
    set(key: string, value: any): void;
    delete(key: string): void;
    exists(key: string): boolean;
}

export class LocalStorage implements ILocalStorage {
    get(key: string): string {
        return window.localStorage[key];
    }

    set(key: string, value: any) {
         window.localStorage[key] = value;
    }
    
    delete(key: string) {
        window.localStorage[key] = undefined;
    }

    exists(key: string): boolean {
        return window.localStorage[key] != undefined;
    }
} 

export * from './localstorage';