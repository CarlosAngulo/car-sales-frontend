import { Observable } from "rxjs";
import { IErrorDTO, IsucessDTO } from "src/app/models/responses.model";
import { IPaginationDTO } from "src/app/models/pagination.model";
import { IUsedInDTO, IUserDTO } from "src/app/models/user.model";

export abstract class UsersGateway {
    abstract getAll(queryParams?:string): Observable<IPaginationDTO<IUserDTO>>;
    abstract getById(userId: string): Observable<IUserDTO>;
    abstract updateUser(body: IUserDTO): Observable<IUserDTO>;
    abstract createUser(name:string, email:string, role: string): Observable<IUserDTO>;
    abstract deleteUser(id: string): Observable<IsucessDTO | IErrorDTO | IUsedInDTO>;
}