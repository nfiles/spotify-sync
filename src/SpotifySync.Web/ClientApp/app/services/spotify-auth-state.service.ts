import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

export interface SpotifyAuthContext {
    // client id?
    // client secret?

    appSecret: string;
}

@Injectable()
export class SpotifyAuthContextService {
    context$: Observable<SpotifyAuthContext>;

    private _context = new ReplaySubject<SpotifyAuthContext>(1);

    constructor() {
        this.context$ = this._context.asObservable();
    }

    setAppSecret(context: SpotifyAuthContext): void {
        this._context.next(context);
    }
}
