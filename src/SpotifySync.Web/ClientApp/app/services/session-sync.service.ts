import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@aspnet/signalr';
import { SyncSession } from '../models/sync-session.model';

export enum SyncStatus {
    None,
    Ready,

    StartListening,
    Listening,
    StopListening,

    StartHosting,
    Hosting,
    StopHosting,
}

export type CurrentSession = SyncSession | string | null;

@Injectable()
export class SessionSyncService {
    private readonly _hub: Promise<HubConnection>;
    private readonly _init: Promise<void>;

    private _currentSession: CurrentSession = null;
    private _status = SyncStatus.None;

    constructor(@Inject(PLATFORM_ID) private _platformId: any) {
        if (this._platformId === 'server') {
            this._hub = Promise.resolve({} as HubConnection);
            this._init = Promise.resolve();
            return;
        }

        const hub = new HubConnectionBuilder()
            .withUrl('/hub/sync')
            .configureLogging(LogLevel.Information)
            .build();

        this._init = hub.start();
        this._init.catch(err =>
            console.error('[SessionSyncService] failed to start', err),
        );

        this._hub = this._init.then(() => {
            this._status = SyncStatus.Ready;
            return hub;
        });

        hub.on('send', data => console.log('send:', data));

        (window as any)['send'] = async (method: string, ...data: any[]) =>
            (await this._hub).invoke(method, ...data).then(console.log);
    }

    get status() {
        return this._status;
    }

    get session(): CurrentSession {
        if (!this._currentSession || typeof this._currentSession === 'string')
            return this._currentSession;

        return { ...this._currentSession };
    }

    async startSharing() {
        const hub = await this._hub;

        // can't already be sharing
        if (this.status !== SyncStatus.Ready) {
            console.error('cannot start sharing');
            return null;
        }

        this._status = SyncStatus.StartHosting;
        const session = await hub.invoke<SyncSession>('startSession');
        this._status = SyncStatus.Hosting;

        return session;
    }

    async stopSharing() {
        const hub = await this._hub;

        if (this.status !== SyncStatus.Hosting) {
            console.error('not sharing, cannot stop');
            return null;
        }

        if (!this.session || typeof this.session === 'string') {
            console.error('no session, cannot stop sharing');
            return null;
        }

        this._status = SyncStatus.StopHosting;
        const success = await hub.invoke<boolean>(
            'stopSession',
            this.session.sessionId,
            this.session.hostKey,
        );
        this._status = SyncStatus.Ready;

        return success;
    }

    async startListening(sessionId: string) {
        const hub = await this._hub;

        if (this._currentSession) {
            console.error(
                'already in a session, cannot start another',
                this._currentSession,
            );
            return false;
        }

        if (this.status !== SyncStatus.Ready) {
            console.error(
                'cannot start listening',
                this.status,
                SyncStatus[this.status],
            );
            return false;
        }

        this._status = SyncStatus.StartListening;
        const success = await hub.invoke<boolean>('startListening', sessionId);

        if (!success) {
            console.error('failed to start listening', success);
            this._currentSession = null;
            this._status = SyncStatus.Ready;
            return false;
        }

        this._currentSession = sessionId;
        this._status = SyncStatus.Listening;

        return true;
    }

    async stopListening() {
        const hub = await this._hub;
        const sessionId = this._currentSession;

        if (!sessionId || typeof sessionId !== 'string') {
            console.error('no listening session, cannot stop', sessionId);
            return false;
        }

        if (this.status !== SyncStatus.Listening) {
            console.error(
                'not listening, cannot stop',
                this.status,
                SyncStatus[this.status],
            );
            return false;
        }

        this._status = SyncStatus.StopListening;
        const success = await hub.invoke<boolean>('stopListening', sessionId);

        if (!success) {
            this._currentSession = null;
            this._status = SyncStatus.Ready;
            return false;
        }

        this._currentSession = null;
        this._status = SyncStatus.Ready;

        return success;
    }
}
