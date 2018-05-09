import { Component, Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';

export interface SpotifyAuthContext {
    // client id?
    // client secret?

    appSecret: string;
}

@Injectable()
export class SpotifyAuthContextService {
    appSecret$: Observable<SpotifyAuthContext>;

    private _appSecret = new ReplaySubject<SpotifyAuthContext>(1);

    constructor() {
        this.appSecret$ = this._appSecret.asObservable();
    }

    setAppSecret(appSecret: SpotifyAuthContext): void {
        this._appSecret.next(appSecret);
    }
}
