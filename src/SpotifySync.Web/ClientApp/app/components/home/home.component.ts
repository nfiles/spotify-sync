import { Component } from '@angular/core';
import { SessionSyncService } from '../../services/session-sync.service';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
})
export class HomeComponent {
    constructor(private _sessionSync: SessionSyncService) {}
}
