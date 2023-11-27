import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    template: 'redirecting...'
})
export class LoginRedirectComponent {
    constructor(router: Router) {
        router.navigate(['auth/login']);
    }
}