import { Component } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
} from '@angular/router';

@Component({
    selector: 'spotify-sync',
    templateUrl: 'sync.component.html',
})
export class SpotifySync implements CanActivate {
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // TODO: make this only allow one connection per account?

        return true;
    }
}
