import { Emote } from '../emote';

export interface ILocalStorage {
    get(key: string): any;
    set(key: string, value: any): void;
    delete(key: string): void;
    exists(key: string): boolean;
}

export class LocalStorage implements ILocalStorage {
    get(key: string): any {
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

export class CookieStorage implements ILocalStorage {
    get(key: string): any {
        let a = `; ${document.cookie}`.match(`;\\s*${key}=([^;]+)`);
        return a ? a[1] : '';
    }

    set(key: string, value: any) {
        document.cookie = `${key}=${value};  expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
    }
   
    delete(key: string) {
        document.cookie = `${key}=;  expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }

    exists(key: string): boolean {
        let a = `; ${document.cookie}`.match(`;\\s*${key}=([^;]+)`);
        return a ? true : false;
    }
}

export * from './localstorage';