import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppModuleShared } from './app.shared.module';
import { AppComponent } from './components/app/app.component';
import {
    SPOTIFY_API_KEYS,
    SpotifyApiKeys,
} from './services/spotify-api.service';

declare const spotifyConfig: SpotifyApiKeys;

export function getSpotifyConfig(): SpotifyApiKeys {
    try {
        return spotifyConfig || {};
    } catch (ex) {
        return {};
    }
}

@NgModule({
    bootstrap: [AppComponent],
    imports: [BrowserModule, AppModuleShared],
    providers: [
        { provide: SPOTIFY_API_KEYS, useFactory: getSpotifyConfig },
        { provide: 'BASE_URL', useFactory: getBaseUrl },
    ],
})
export class AppModule {}

export function getBaseUrl() {
    return document.getElementsByTagName('base')[0].href;
}
