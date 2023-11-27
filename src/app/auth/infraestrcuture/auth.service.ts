import { Injectable } from "@angular/core";
import { Observable, mergeMap, of, switchMap, take, tap, timer } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { ITokenTypes, ITokensDTO } from "src/app/models/auth.model";
import { AuthGateway } from "../domain/auth-gateway";
import { environment } from '../../environment/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService extends AuthGateway {

    private url = `${environment.apiURL}/auth`;
    private _refreshToken = '';

    constructor(private http: HttpClient) {
        super();
    }

    refreshToken(refreshToken: string): Observable<ITokenTypes> {
        const url = `${this.url}/refresh-tokens`;
        return this.http.post<ITokenTypes>(url, { refreshToken });
    }

    autoRefreshToken(timeLeft: number, refreshToken: string) {
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

    setLocalStorage(tokens: ITokenTypes) {
        console.log('>>>> setting localStorage', tokens)
        this._refreshToken = tokens.refresh.token;
        localStorage.setItem('accessToken', tokens.access.token );
        localStorage.setItem('accessTokenExpiration', tokens.access.expires);
        // localStorage.removeItem('auth_app_token'); 
    }
    
    deleteLocalStorage() {
        console.log('>>>> removing localStorage')
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