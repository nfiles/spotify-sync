import { Component, Input } from '@angular/core';

@Component({
    selector: 'now-playing',
    templateUrl: 'now-playing.component.html',
    styleUrls: ['now-playing.component.css'],
})
export class NowPlayingComponent {
    @Input() state?: SpotifyApi.CurrentPlaybackResponse;
}
