import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './components/app/app.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';
import { SigninSpotifyComponent } from './components/signin-spotify/signin-spotify.component';
import { IsAuthorizedGuard } from './services/is-authorized.guard';
import { SpotifySync } from './components/sync/sync.component';
import {
    SpotifySyncService,
    SpotifyConfig,
    SPOTIFY_REDIRECT_URI,
} from './services/spotify-sync.service';
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
        SpotifySync,
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
                path: 'sync',
                component: SpotifySync,
                canActivate: [IsAuthorizedGuard],
            },
            { path: '**', redirectTo: 'home' },
        ]),
    ],
    providers: [
        IsAuthorizedGuard,
        SpotifySyncService,
        SpotifyAuthContextService,
        { provide: SPOTIFY_REDIRECT_URI, useFactory: getSpotifyRedirectUri },
    ],
})
export class AppModuleShared {}
