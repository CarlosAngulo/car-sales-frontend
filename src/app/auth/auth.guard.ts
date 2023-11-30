import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, forkJoin, map, tap } from 'rxjs';
import { UserService } from '../user/user.service';
import { Roles } from '../models/user.model';
import { NbAuthService } from '@nebular/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private nbAuthService: NbAuthService,
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ) : boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        
        return forkJoin([this.isAuthenticated(),this.isAdmin()])
        .pipe(
            map((res: boolean[]) => res[0] && res [1])
        )
    }

    isAuthenticated(): Observable<boolean> {
        return this.nbAuthService.isAuthenticated()
        .pipe( 
            tap((authenticated: boolean ) =>!authenticated && this.router.navigate(['/auth/login']))
        )
    }

    isAdmin(): Observable<boolean> {
        return this.nbAuthService.getToken()
        .pipe(
            map((res: any) => {
                if (res.getValue().user.role === Roles.ADMIN) {
                    return true;
                }
                this.router.navigate(['/user'])
                return false;
            })
        )
    }

    isSessionActive(): boolean {
        const authAppToken = localStorage.getItem('auth_app_token');
        if (!authAppToken) return false;
        const expiration: string = JSON.parse(authAppToken).value?.tokens?.access?.expires;
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