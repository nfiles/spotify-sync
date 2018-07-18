import { Inject, InjectionToken, Injectable, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/operator/toPromise';
import 'rxjs/operator/combineLatest';
import * as SpotifyWebApi from 'spotify-web-api-js';
import { Observable } from 'rxjs/Observable';

export interface SpotifyApiKeys {
    clientId?: string;
    clientSecret?: string;
}

export const SPOTIFY_API_KEYS = new InjectionToken<SpotifyApiKeys>(
    'Spotify API Keys',
);

export const SPOTIFY_REDIRECT_URI = new InjectionToken<string>(
    'Spotify Redirect URI',
);

export interface SpotifyAuthResponse {
    access_token: string;
    token_type: string;
    scope: string;
    expires_in: number;
    refresh_token: string;
}

export interface SpotifyAuthState extends SpotifyAuthResponse {
    timestamp: number;
}

export interface SpotifyTokenResponse {
    access_token: string;
    token_type: string;
    /** expiration period in seconds */
    expires_in: number;
    state: string;
}

export interface SpotifyTokenState extends SpotifyTokenResponse {
    timestamp: number;
}

@Injectable()
export class SpotifyApiService implements OnDestroy {
    public isAuthorized$: Observable<boolean>;

    private _authContext$ = new BehaviorSubject<SpotifyTokenState | null>(null);
    private _isDestroyed = new Subject<void>();

    constructor(
        @Inject(SPOTIFY_API_KEYS) private _apiCredentials: SpotifyApiKeys,
        @Inject(SPOTIFY_REDIRECT_URI) private _redirectUri: string,
        @Inject('BASE_URL') private _appBaseHref: string,
    ) {
        // strip trailing slash
        if (this._appBaseHref.charAt(this._appBaseHref.length - 1) === '/') {
            this._appBaseHref = this._appBaseHref.slice(0, -1);
        }

        // load the current context from the cookie
        try {
            const ctx = JSON.parse(document.cookie);
            this._authContext$.next(ctx);
        } catch (ex) {}

        this._authContext$
            .skip(1) // skip the current state
            .takeUntil(this._isDestroyed)
            .subscribe(ctx => {
                // write context changes to the cookie
                document.cookie = JSON.stringify(ctx);
            });

        const isAuthorized = this._authContext$
            .map(_ctx => this.isAuthorized())
            .distinctUntilChanged()
            .publishReplay(1);
        this.isAuthorized$ = isAuthorized;
        isAuthorized.connect();
    }

    ngOnDestroy() {
        this._isDestroyed.next();
    }

    isAuthorized() {
        const ctx = this._authContext$.value;

        if (!ctx) return false;

        const expirationTimestamp = ctx.timestamp + ctx.expires_in * 1000;
        return expirationTimestamp > Date.now();
    }

    getAuthorizationUrl(redirectUri: string) {
        const scopes = [
            'user-read-currently-playing',
            'user-modify-playback-state',
            'user-read-playback-state',
        ].join(' ');

        const params = new URLSearchParams();
        params.append('response_type', 'token');
        this._apiCredentials.clientId &&
            params.append('client_id', this._apiCredentials.clientId);
        params.append('scope', scopes);
        params.append('redirect_uri', this._appBaseHref + this._redirectUri);
        params.append('state', btoa(redirectUri || '/'));

        return `https://accounts.spotify.com/authorize?${params}`;
    }

    authorize(fragment: string): { err?: Error; state?: string } {
        const params = new URLSearchParams(fragment);

        const tokenResponse: SpotifyTokenResponse = {
            access_token: params.get('access_token') || '',
            expires_in: ~~(params.get('expires_in') || 0),
            state: params.get('state') || '',
            token_type: params.get('token_type') || '',
        };

        if (tokenResponse.token_type !== 'Bearer') {
            return {
                err: new Error(
                    "Expected token type Bearer, received '" +
                        tokenResponse.token_type,
                ),
            };
        }

        try {
            tokenResponse.state = atob(tokenResponse.state);
        } catch (ex) {}

        this._authContext$.next({
            ...tokenResponse,
            timestamp: Date.now(),
        });

        return { state: tokenResponse.state };
    }

    async getApiClient() {
        const access_token = await this._authContext$
            .filter(_ => this.isAuthorized())
            .map(_ => {
                const ctx = this._authContext$.value;
                return ctx && ctx.access_token;
            })
            .take(1)
            .toPromise();

        if (!access_token)
            throw new Error('[SpotifyApiService]: no access token found!');

        const api = new SpotifyWebApi();
        api.setAccessToken(access_token);
        return api;
    }
}
