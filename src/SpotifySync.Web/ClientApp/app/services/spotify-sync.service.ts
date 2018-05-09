import { Inject, Optional, InjectionToken, Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';
import * as SpotifyWebApi from 'spotify-web-api-js';
import { SpotifyAuthContext } from './spotify-auth-state.service';

export interface SpotifyConfig {
    clientId?: string;
    clientSecret?: string;
    authToken: string;
}

export const SPOTIFY_API_CREDENTIALS = new InjectionToken<SpotifyConfig>(
    'Spotify API Credentials',
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
export class SpotifySyncService {
    private _authContext$ = new BehaviorSubject<SpotifyTokenState | null>(null);

    constructor(
        @Inject(SPOTIFY_API_CREDENTIALS) private _apiCredentials: SpotifyConfig,
        @Inject(SPOTIFY_REDIRECT_URI) private _redirectUri: string,
        @Inject('BASE_URL') private _appBaseHref: string,
        private _http: Http,
    ) {
        // strip trailing slash
        if (this._appBaseHref.charAt(this._appBaseHref.length - 1) === '/') {
            this._appBaseHref = this._appBaseHref.slice(0, -1);
        }
    }

    isAuthorized() {
        const ctx = this._authContext$.value;

        if (!ctx) return false;

        const expirationTimestamp = ctx.timestamp + ctx.expires_in * 1000;

        return expirationTimestamp > Date.now();
    }

    getApiClient() {
        // TODO: reauthorize? redirect if the user needs to authorize again?

        return this._authContext$
            .take(1)
            .filter(Boolean)
            .map(ctx => {
                const api = new SpotifyWebApi();
                api.setAccessToken((ctx && ctx.access_token) || '');
                return api;
            });
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
        const params = fragment.split('&').reduce(
            (agg, one) => {
                const [key, value] = one.split('=');
                agg[key] = decodeURIComponent(value);
                return agg;
            },
            {} as { [key: string]: string },
        );

        const tokenResponse: SpotifyTokenResponse = {
            access_token: params['access_token'] || '',
            expires_in: ~~params['expires_in'],
            state: params['state'] || '',
            token_type: params['token_type'] || '',
        };

        if (tokenResponse.token_type !== 'Bearer') {
            return {
                err: new Error(
                    "Expected token type Bearer, received '" +
                        tokenResponse.token_type,
                ),
            };
        }

        this._authContext$.next({
            ...tokenResponse,
            timestamp: Date.now(),
        });

        return { state: tokenResponse.state };
    }
}
