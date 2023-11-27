import { Observable } from "rxjs";
import { ITokenTypes } from "src/app/models/auth.model";

export abstract class AuthGateway {
    abstract refreshToken(queryParams?:string): Observable<ITokenTypes>;
    abstract logout(refreshToken:string): void;
}