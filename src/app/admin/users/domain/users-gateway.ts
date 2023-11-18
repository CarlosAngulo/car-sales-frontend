import { Observable } from "rxjs";
import { IErrorDTO } from "src/app/models/error.model";
import { IPaginationDTO } from "src/app/models/pagination.model";
import { IUserDTO } from "src/app/models/user.model";

export abstract class UsersGateway {
    abstract getAll(queryParams?:string): Observable<IPaginationDTO<IUserDTO>>;
    abstract createUser(name:string, email:string, role: string): Observable<IUserDTO>;
    abstract deleteUser(id: string): Observable<void | IErrorDTO>;
}