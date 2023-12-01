import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMenuItem, NbMenuService } from '@nebular/theme';
import { NbAuthService } from '@nebular/auth';
import { AuthService } from '../auth/infraestrcuture/auth.service';
import { Subject, filter, map, of, switchMap, takeUntil, tap } from 'rxjs';
import { ITokenTypes } from '../models/auth.model';
import { Router } from '@angular/router';

export enum UserMenu {
  PROFILE = 'Profile',
  LOGOUT = 'Logout',
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  user!: { name: string; role: string };
  unsubscribe$: Subject<void> = new Subject<void>();

  userMenu = [
    { title: UserMenu.LOGOUT },
  ];

  items: NbMenuItem[] = [
    {
      title: 'Reports',
      icon: 'layout-outline',
      link: 'reports'
    },
    {
      title: 'Users',
      icon: 'people-outline',
      link: 'users'
    }
  ];

  constructor(
    private nbAuthService: NbAuthService,
    private authService: AuthService,
    private nbMenuService: NbMenuService,
    private router: Router
  ) {
    this.nbAuthService.onTokenChange()
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap((userData: any) => {
          let expirationDate;
          let timeToRenovate: number;
          let tokens: ITokenTypes;
          let user = userData.token.user;
          this.user = user;
          expirationDate = userData.token.tokens.access.expires;
          tokens = userData.token.tokens;

          // timeToRenovate = new Date(expirationDate).getTime() - new Date().getTime() - 50000;
          // timeToRenovate = new Date(expirationDate).getTime() - new Date().getTime() - 1795000;
          timeToRenovate = new Date(expirationDate).getTime() - new Date().getTime() - 120000;
          this.authService.setLocalStorage(user, tokens);
          return this.authService.autoRefreshTokenTimer(timeToRenovate, tokens.refresh.token);

        }),
        switchMap((token: string) => {
          return this.nbAuthService.refreshToken('email', { refreshToken: token })
        }),
      )
      .subscribe({
        next: () => {},
        error: () => {}
      });
  }

  ngOnInit(): void {
    this.nbMenuService.onItemClick()
    .pipe(
      takeUntil(this.unsubscribe$),
      filter(({ tag }) => tag === 'userContextMenu'),
      map(({ item: { title } }) => title),
      switchMap((title) => {
        if (title === UserMenu.LOGOUT) {
          return this.authService.logout(this.authService.refreshTokenString)
          .pipe(
            switchMap(() => of({logout: true}))
          )
        } else {
          return of('profile')
        }
      })
    )
    .subscribe((resp: any) => {
      if(resp.logout) {
        this.router.navigate(['/auth/login'])
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
