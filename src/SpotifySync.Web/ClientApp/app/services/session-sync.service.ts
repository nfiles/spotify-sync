import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@aspnet/signalr';

@Injectable()
export class SessionSyncService {
    private _hub: HubConnection;

    constructor(@Inject(PLATFORM_ID) private _platformId: any) {
        if (this._platformId === 'server') {
            this._hub = {} as HubConnection;
            return;
        }

        this._hub = new HubConnectionBuilder()
            .withUrl('/hub/sync')
            .configureLogging(LogLevel.Information)
            .build();

        this._hub.start().catch(err => console.error(err));

        this._hub.on('send', data => console.log('send:', data));

        (window as any)['send'] = (data: any) =>
            this._hub && this._hub.invoke('send', data);
    }

    startSession() {
        this._hub.invoke('');
    }
}
