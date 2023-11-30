import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, forkJoin, map, tap } from 'rxjs';
import { Roles } from '../models/user.model';
import { NbAuthService } from '@nebular/auth';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
    constructor(
        private router: Router,
        private nbAuthService: NbAuthService
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
                if (res.getValue().user.role === Roles.USER) {
                    return true;
                }
                this.router.navigate(['/unauthorized'])
                return false;
            })
        )
    }

}