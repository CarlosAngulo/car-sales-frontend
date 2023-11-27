import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMenuItem, NbMenuService } from '@nebular/theme';
import { NbAuthService } from '@nebular/auth';
import { AuthService } from '../auth/infraestrcuture/auth.service';
import { Subject, filter, map, of, switchMap, takeUntil, tap } from 'rxjs';
import { ITokenTypes } from '../models/auth.model';
import { Router } from '@angular/router';

export enum UserMenu {
  PROFILE = 'Profile',
  LOGOUT = 'Logout'
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
    { title: UserMenu.PROFILE },
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
    },
    {
      title: 'Process',
      icon: { icon: 'settings-2-outline', pack: 'eva' },
    },
  ];

  constructor(
    private nbAuthService: NbAuthService,
    private authService: AuthService,
    private nbMenuService: NbMenuService,
    private router: Router
  ) {
    this.nbAuthService.onAuthenticationChange().subscribe(console.log)

    this.nbAuthService.onTokenChange()
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap((userData: any) => {
          console.log('token changed')
          let expirationDate;
          let timeToRenovate: number;
          let tokens: ITokenTypes;
          this.user = userData.token.user;
          expirationDate = userData.token.tokens.access.expires;
          tokens = userData.token.tokens;

          timeToRenovate = new Date(expirationDate).getTime() - new Date().getTime() - 50000;
          // timeToRenovate = new Date(expirationDate).getTime() - new Date().getTime() - 1795000;
          this.authService.setLocalStorage(tokens);
          return this.authService.autoRefreshTokenTimer(timeToRenovate, tokens.refresh.token);

        }),
        switchMap((token: string) => {
          console.log('refreshing Token', token)
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
