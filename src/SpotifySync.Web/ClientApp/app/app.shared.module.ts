import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './components/app/app.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';
import { SigninSpotifyComponent } from './components/signin-spotify/signin-spotify.component';
import { SpotifySyncComponent } from './components/sync/sync.component';
import { NowPlayingComponent } from './components/now-playing/now-playing.component';
import { IsAuthorizedGuard } from './services/is-authorized.guard';
import {
    SpotifyApiService,
    SPOTIFY_REDIRECT_URI,
} from './services/spotify-api.service';
import { SpotifyAuthContextService } from './services/spotify-auth-state.service';

export function getSpotifyRedirectUri() {
    return '/signin-spotify';
}

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        HomeComponent,
        SigninSpotifyComponent,
        SpotifySyncComponent,
        NowPlayingComponent,
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'signin-spotify', component: SigninSpotifyComponent },
            {
                path: 'sync/:sessionId',
                component: SpotifySyncComponent,
                canActivate: [IsAuthorizedGuard],
            },
            { path: '**', redirectTo: 'home' },
        ]),
    ],
    providers: [
        IsAuthorizedGuard,
        SpotifyApiService,
        SpotifyAuthContextService,
        { provide: SPOTIFY_REDIRECT_URI, useFactory: getSpotifyRedirectUri },
    ],
})
export class AppModuleShared {}
