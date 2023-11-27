import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ) : boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

        if (this.isSessionActive()) {
            return true;
        } else {
            this.router.navigate(['/auth/login']);
            return false;
        }
    }

    isSessionActive(): boolean {
        const authAppToken = localStorage.getItem('auth_app_token');
        if (!authAppToken) return false;
        console.log(JSON.parse(authAppToken).value)
        const expiration: string = JSON.parse(authAppToken).value?.tokens?.access?.expires || JSON.parse(authAppToken).value?.access?.expires;
        console.log(expiration)
        if (!expiration) return false;

        const milliseconds = new Date(expiration).getTime() - new Date().getTime();

        const seconds = Math.floor(milliseconds / 1000);

        const minutes = Math.floor(seconds / 60);

        const hours = Math.floor(minutes / 60);

        const remainingHours = hours % 24;
        const remainingMinutes = minutes % 60;
        const remainingSeconds = seconds % 60;

        if (milliseconds > 0) {
            console.log(`Your session expires in: ${remainingHours} : ${remainingMinutes} : ${remainingSeconds} `);
        } else {
            console.log('Your session is expired!')
        }

        return new Date().getTime() < new Date(expiration).getTime();
    }

}