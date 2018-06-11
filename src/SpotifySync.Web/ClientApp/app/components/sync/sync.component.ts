import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
    selector: 'spotify-sync',
    templateUrl: 'sync.component.html',
})
export class SpotifySync implements OnDestroy {
    isLoading = true;
    isSharing = false;

    private _isDestroyed = new Subject<void>();

    constructor(private _route: ActivatedRoute, private _router: Router) {
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
    }

    ngOnDestroy() {
        this._isDestroyed.next();
    }
}
