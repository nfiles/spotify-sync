import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/take';
import { SpotifySyncService } from '../../services/spotify-sync.service';

@Component({
    selector: 'signin-spotify',
    templateUrl: 'signin-spotify.component.html',
})
export class SigninSpotifyComponent {
    err: any;

    constructor(
        private _spotifySync: SpotifySyncService,
        private _router: Router,
        private _route: ActivatedRoute,
    ) {
        this._route.fragment.take(1).subscribe(
            fragment => {
                const { err, state } = this._spotifySync.authorize(fragment);
                if (err) {
                    this.err = err;
                    console.error(err);
                    return;
                }

                // it should contain a redirect uri for within the app
                this._router.navigateByUrl(state || '/');
            },
            err => {
                this.err = err;
                console.error('error!', err);
            },
        );
    }
}
