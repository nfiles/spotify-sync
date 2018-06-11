import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    RouterStateSnapshot,
} from '@angular/router';

import { SpotifySyncService } from './spotify-sync.service';

@Injectable()
export class IsAuthorizedGuard implements CanActivate {
    constructor(
        private _spotifyService: SpotifySyncService,
        @Inject(PLATFORM_ID) private _platformId: any,
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (
            // just allow everything through if we're doing server-side rendering
            // this will probably (?) change later
            this._platformId === 'server' ||
            this._spotifyService.isAuthorized()
        ) {
            return true;
        }

        const authUrl = this._spotifyService.getAuthorizationUrl(state.url);
        window.location.href = authUrl;

        return false;
    }
}
