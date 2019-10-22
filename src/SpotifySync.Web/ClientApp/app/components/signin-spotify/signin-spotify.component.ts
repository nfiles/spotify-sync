import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/take';
import { SpotifyApiService } from '../../services/spotify-api.service';

@Component({
    selector: 'signin-spotify',
    templateUrl: 'signin-spotify.component.html',
})
export class SigninSpotifyComponent {
    err: any;

    constructor(
        private _spotifyApi: SpotifyApiService,
        private _router: Router,
        private _route: ActivatedRoute,
    ) {
        this._route.fragment.take(1).subscribe(
            fragment => {
                const { err, state } = this._spotifyApi.authorize(
                    fragment || '',
                );
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
