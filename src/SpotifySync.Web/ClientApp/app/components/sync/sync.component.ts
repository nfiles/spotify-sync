import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/share';
import 'rxjs/add/observable/interval';
import { SpotifyApiService } from '../../services/spotify-api.service';

@Component({
    selector: 'spotify-sync',
    templateUrl: 'sync.component.html',
})
export class SpotifySyncComponent implements OnDestroy {
    isLoading = true;
    isSharing = false;
    playbackState$: Observable<SpotifyApi.CurrentPlaybackResponse>;

    private readonly pollInterval = 2000;
    private _isDestroyed = new Subject<void>();

    constructor(
        _route: ActivatedRoute,
        private _spotifyApi: SpotifyApiService,
    ) {
        _route.paramMap.takeUntil(this._isDestroyed).subscribe(params => {
            const sessionId = params.get('sessionId');
            if (!sessionId) return;

            if (sessionId === 'share') {
                // TODO: register with the service somehow
                this.isSharing = true;
            } else {
                // TODO: listen to the service somehow
                this.isSharing = false;
            }

            this.isLoading = false;
        });

        this.playbackState$ = Observable.interval(this.pollInterval)
            .takeUntil(this._isDestroyed)
            .switchMap(() => this._spotifyApi.getApiClient())
            .switchMap(api => api.getMyCurrentPlaybackState())
            .share();
    }

    ngOnDestroy() {
        this._isDestroyed.next();
    }
}
