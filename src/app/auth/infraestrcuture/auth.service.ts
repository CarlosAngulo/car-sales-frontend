import { Injectable } from "@angular/core";
import { Observable, of, switchMap, take, tap, timer } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { IAuthDTO, ITokenTypes } from "src/app/models/auth.model";
import { AuthGateway } from "../domain/auth-gateway";
import { environment } from '../../environment/environment';
import { UserService } from "src/app/user/user.service";
import { IUserDTO, Roles, TRole } from "src/app/models/user.model";

@Injectable({
    providedIn: 'root'
})
export class AuthService extends AuthGateway {

    private url = `${environment.apiURL}/auth`;
    private _refreshToken = '';

    constructor(
        private http: HttpClient,
        private userService: UserService
    ) {
        super();
    }

    refreshToken(refreshToken: string): Observable<IAuthDTO> {
        const url = `${this.url}/refresh-tokens`;
        return this.http.post<IAuthDTO>(url, { refreshToken })
        .pipe(
            tap({
                next: (res) => {
                    this.userService.user = res.data.user;
                }
            })
        );
    }

    autoRefreshToken(timeLeft: number, refreshToken: string): Observable<IAuthDTO> {
        return timer(timeLeft)
        .pipe(
            take(1),
            switchMap((_) => this.refreshToken(refreshToken))
        )
    }

    autoRefreshTokenTimer(timeLeft: number, refreshToken: string) {
        return timer(timeLeft)
        .pipe(
            take(1),
            switchMap((_) => of(refreshToken))
        )
    }

    setLocalStorage(user: IUserDTO, tokens: ITokenTypes) {
        this.userService.user = user;
        this._refreshToken = tokens.refresh.token;
        localStorage.setItem('accessToken', tokens.access.token );
        localStorage.setItem('accessTokenExpiration', tokens.access.expires);
    }
    
    deleteLocalStorage() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('accessTokenExpiration');
        localStorage.removeItem('auth_app_token');
    }

    get refreshTokenString(): string {
        return this._refreshToken;
    }

    logout(refreshToken:string) {
        const url = `${this.url}/logout`;
        return this.http.post<ITokenTypes>(url, { refreshToken })
        .pipe(
            tap(() =>this.deleteLocalStorage())
        )
    }


}