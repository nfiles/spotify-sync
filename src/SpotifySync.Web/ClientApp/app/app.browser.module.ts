import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppModuleShared } from './app.shared.module';
import { AppComponent } from './components/app/app.component';
import {
    SPOTIFY_API_CREDENTIALS,
    SpotifyConfig,
} from './services/spotify-sync.service';

declare const spotifyConfig: SpotifyConfig;

export function getSpotifyConfig(): SpotifyConfig {
    try {
        return spotifyConfig || {};
    } catch (ex) {
        return { authToken: '' };
    }
}

@NgModule({
    bootstrap: [AppComponent],
    imports: [BrowserModule, AppModuleShared],
    providers: [
        { provide: SPOTIFY_API_CREDENTIALS, useFactory: getSpotifyConfig },
        { provide: 'BASE_URL', useFactory: getBaseUrl },
    ],
})
export class AppModule {}

export function getBaseUrl() {
    return document.getElementsByTagName('base')[0].href;
}
