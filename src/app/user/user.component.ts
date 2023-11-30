import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbAuthService } from '@nebular/auth';
import { Subject, filter, map, of, switchMap, takeUntil } from 'rxjs';
import { ITokenTypes } from '../models/auth.model';
import { AuthService } from '../auth/infraestrcuture/auth.service';
import { UserMenu } from '../admin/admin.component';
import { NbMenuService } from '@nebular/theme';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  unsubscribe$: Subject<void> = new Subject<void>();
  user!: { name: string; role: string };
  
  userMenu = [
    { title: UserMenu.PROFILE },
    { title: UserMenu.LOGOUT },
  ];

  constructor(
    private nbAuthService: NbAuthService,
    private authService: AuthService,
    private router: Router
    // private nbMenuService: NbMenuService,
  ){
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
    // this.nbMenuService.onItemClick()
    // .pipe(
    //   takeUntil(this.unsubscribe$),
    //   filter(({ tag }) => tag === 'userContextMenu'),
    //   map(({ item: { title } }) => title),
    //   switchMap((title) => {
    //     if (title === UserMenu.LOGOUT) {
    //       return this.authService.logout(this.authService.refreshTokenString)
    //       .pipe(
    //         switchMap(() => of({logout: true}))
    //       )
    //     } else {
    //       return of('profile')
    //     }
    //   })
    // )
    // .subscribe((resp: any) => {
    //   if(resp.logout) {
    //     // this.router.navigate(['/auth/login'])
    //   }
    // });
  }

  navigateTo(route: string) {
    this.router.navigate([route])
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
