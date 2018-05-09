import { Component } from '@angular/core';
import { SpotifySyncService } from '../../services/spotify-sync.service';

@Component({
    selector: 'nav-menu',
    templateUrl: './navmenu.component.html',
    styleUrls: ['./navmenu.component.css'],
})
export class NavMenuComponent {
    constructor(public spotifySync: SpotifySyncService) {}
}
