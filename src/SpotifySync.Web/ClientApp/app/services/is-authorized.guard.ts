import { Injectable, Inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    RouterStateSnapshot,
} from '@angular/router';
import { Http } from '@angular/http';

import { SpotifySyncService } from './spotify-sync.service';

@Injectable()
export class IsAuthorizedGuard implements CanActivate {
    constructor(private _spotifyService: SpotifySyncService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this._spotifyService.isAuthorized()) {
            return true;
        }

        window.location.href = this._spotifyService.getAuthorizationUrl(
            state.url,
        );

        return false;
    }
}
