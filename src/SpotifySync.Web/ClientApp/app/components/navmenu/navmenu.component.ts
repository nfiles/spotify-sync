import { Component } from '@angular/core';
import { SpotifyApiService } from '../../services/spotify-api.service';

@Component({
    selector: 'nav-menu',
    templateUrl: './navmenu.component.html',
    styleUrls: ['./navmenu.component.css'],
})
export class NavMenuComponent {
    constructor(public spotifyApi: SpotifyApiService) {}

    logout() {}
}
