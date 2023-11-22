import { Component } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { NbAuthService } from '@nebular/auth';
import { AuthService } from '../auth/infraestrcuture/auth.service';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { ITokenTypes } from '../models/auth.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  user!: { name:string; role: string };
  unsubscribe$: Subject<void> = new Subject<void>();

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
      private authService: AuthService
    ) {

    this.nbAuthService.onTokenChange()
    .pipe(
      switchMap((userData: any) => {
        let expirationDate;
        let timeToRenovate: number;
        let tokens: ITokenTypes;

        if(userData.token.user) {
          this.user = userData.token.user;
          expirationDate = userData.token.tokens.access.expires;
          tokens = userData.token.tokens;
        } else {
          expirationDate = userData.token.access.expires;
          tokens = userData.token;
        }

        timeToRenovate = new Date(expirationDate).getTime() - new Date().getTime() - 120000;
        // timeToRenovate = new Date(expirationDate).getTime() - new Date().getTime() - 1795000;
        this.authService.setLocalStorage(tokens);
        return this.authService.autoRefreshTokenTimer(timeToRenovate, tokens.refresh.token);

      }),
      switchMap((token: string) => {
        return this.nbAuthService.refreshToken('email', {refreshToken: token} )
      }),
      takeUntil(this.unsubscribe$),
    )
    .subscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  
}
