import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/interval';
import { SpotifyApiService } from '../../services/spotify-api.service';
import {
    SessionSyncService,
    SyncStatus,
} from '../../services/session-sync.service';
import { SyncSession } from '../../models/sync-session.model';

@Component({
    selector: 'spotify-sync',
    templateUrl: 'sync.component.html',
})
export class SpotifySyncComponent implements OnDestroy {
    isLoading = true;
    playbackState$: Observable<SpotifyApi.CurrentPlaybackResponse>;
    session: SyncSession | string | null = null;

    private readonly pollInterval = 2000;
    private _isDestroyed = new Subject<void>();

    constructor(
        private _route: ActivatedRoute,
        private _spotifyApi: SpotifyApiService,
        private _sessionSyncService: SessionSyncService,
    ) {
        this._route.paramMap
            .takeUntil(this._isDestroyed)
            .subscribe(async params => {
                const sessionId = params.get('sessionId');
                if (!sessionId) return;

                const { status } = this._sessionSyncService;
                if (status === SyncStatus.Listening) {
                    await this._sessionSyncService.stopListening();
                } else if (status === SyncStatus.Hosting) {
                    await this._sessionSyncService.stopSharing();
                }

                if (sessionId === 'share') {
                    // TODO: register with the service somehow
                    this.session = await this._sessionSyncService.startSharing();
                } else {
                    // TODO: listen to the service somehow
                    await this._sessionSyncService.startListening(sessionId);
                    this.session = sessionId;
                }

                this.isLoading = false;
            });

        const playbackState$ = Observable.interval(this.pollInterval)
            .takeUntil(this._isDestroyed)
            .switchMap(() => this._spotifyApi.getApiClient())
            .switchMap(api => api.getMyCurrentPlaybackState())
            .publishReplay(1);
        playbackState$.connect();
        this.playbackState$ = playbackState$;
    }

    isListening() {
        return this._sessionSyncService.status === SyncStatus.Listening;
    }

    isSharing() {
        return this._sessionSyncService.status === SyncStatus.Hosting;
    }

    ngOnDestroy() {
        this._isDestroyed.next();
    }
}
