import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule } from '@nebular/theme';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {
  NbPasswordAuthStrategy,
  NbAuthModule,
  NbAuthSimpleToken
} from '@nebular/auth';
import { environment } from './environment/environment';
import { AuthTokenInterceptor } from './auth/auth-token.interceptor';
import { AuthGateway } from './auth/domain/auth-gateway';
import { AuthService } from './auth/infraestrcuture/auth.service';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';

@NgModule({
  declarations: [
    AppComponent,
    NotfoundComponent,
    UnauthorizedComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NbEvaIconsModule,
    NbThemeModule.forRoot({ name: 'user-theme' }),
    NbAuthModule.forRoot({
      strategies: [
        NbPasswordAuthStrategy.setup({
          name: 'email',
          baseEndpoint: environment.apiURL,
          token: {
            class: NbAuthSimpleToken,
            key: 'data'
          },
          refreshToken: {
            endpoint: '/auth/refresh-tokens',
            method: 'post',
            redirect: {
              failure: 'auth',
              success: 'admin'
            }
          },
          login: {
            endpoint: '/auth/login',
            redirect: {
              success: 'admin',
              failure: null,
            },
          },
          requestPass: {
            endpoint: '/auth/forgot-password',
            method: 'post',
            redirect: {
              success: null,
              failure: null,
            },
          },
          resetPass: {
            endpoint: '/auth/reset-password',
            method: 'post',
            redirect: {
              success: null,
              failure: null
            },
            resetPasswordTokenKey: 'token'
          }
        }),
      ],
      forms: {
        login: {
          redirectDelay: 200
        }
      },
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthTokenInterceptor,
      multi: true
    },
    {
      provide: AuthGateway,
      useClass: AuthService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
