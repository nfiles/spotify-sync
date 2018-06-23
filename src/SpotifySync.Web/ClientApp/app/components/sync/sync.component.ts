import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import { SpotifyApiService } from '../../services/spotify-api.service';

export interface CurrentlyPlaying {
    contextType: SpotifyApi.ContextObjectType;
    name: string;
}

@Component({
    selector: 'spotify-sync',
    templateUrl: 'sync.component.html',
})
export class SpotifySyncComponent implements OnDestroy {
    isLoading = true;
    isSharing = false;

    result: SpotifyApi.CurrentPlaybackResponse | null = null;

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

        // is this too complicated? should the api client just return a promise with the api client?
        this._spotifyApi
            .getApiClient()
            .then(api => api.getMyCurrentPlaybackState())
            .then(result => (this.result = result));
    }

    ngOnDestroy() {
        this._isDestroyed.next();
    }
}
