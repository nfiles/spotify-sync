import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    RouterStateSnapshot,
} from '@angular/router';

import { SpotifyApiService } from './spotify-api.service';

@Injectable()
export class IsAuthorizedGuard implements CanActivate {
    constructor(
        private _spotifyApi: SpotifyApiService,
        @Inject(PLATFORM_ID) private _platformId: Object,
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (
            // just allow everything through if we're doing server-side rendering
            // this will probably (?) change later
            this._platformId === 'server' ||
            this._spotifyApi.isAuthorized()
        ) {
            return true;
        }

        const authUrl = this._spotifyApi.getAuthorizationUrl(state.url);
        window.location.href = authUrl;

        return false;
    }
}
