import { Component } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  user!: {name:string; role: string};

  items: NbMenuItem[] = [
    {
      title: 'Users',
      icon: 'people-outline',
      link: 'users'
    },
    {
      title: 'Reports',
      icon: 'layout-outline',
      link: 'reports'
    },
    {
      title: 'Process',
      icon: { icon: 'settings-2-outline', pack: 'eva' },
    },
  ];

  constructor(private authService: NbAuthService) {
    this.authService.onTokenChange()
    .subscribe((userData: any) => {
      console.log(userData)
      localStorage.setItem('accessToken', userData.token.tokens.access.token);
      localStorage.setItem('accessTokenExpiration', userData.token.tokens.access.expires);
      this.user = userData.token.user;
    });
  }
  
}
