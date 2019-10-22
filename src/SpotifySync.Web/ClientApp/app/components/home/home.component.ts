import { Component } from '@angular/core';
import { FormGroup, FormControl, ValidatorFn } from '@angular/forms';

export const ValidateSessionId: ValidatorFn = ctrl => {
    const value = String(ctrl.value || '');

    if (!value) return { empty: true };

    if (value === 'share') return { share: true };

    return null;
};

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent {
    form = new FormGroup({
        sessionId: new FormControl('', ValidateSessionId),
    });

    logout() {
        // TODO: clear state and sign out of spotify
    }
}
