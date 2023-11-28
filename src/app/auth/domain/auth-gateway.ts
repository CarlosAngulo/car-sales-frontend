import { Observable } from "rxjs";
import { IAuthDTO, ITokenTypes } from "src/app/models/auth.model";

export abstract class AuthGateway {
    abstract refreshToken(queryParams?:string): Observable<IAuthDTO>;
    abstract logout(refreshToken:string): void;
}