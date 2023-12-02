import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { environment } from '../../../environment/environment';
import { HttpClient } from "@angular/common/http";
import { UsersGateway } from "../domain/users-gateway";
import { IPaginationDTO } from "src/app/models/pagination.model";
import { IUsedInDTO, IUserDTO } from "src/app/models/user.model";
import { IErrorDTO, IsucessDTO } from "src/app/models/responses.model";

@Injectable({
    providedIn: 'root'
})
export class UsersService extends UsersGateway {

    url = environment.apiURL;

    constructor(private http: HttpClient) {
        super();
    }

    getAll(queryParams?:string): Observable<IPaginationDTO<IUserDTO>> {
        const url = queryParams ? `${this.url}/users?${queryParams}` : `${this.url}/users`;
        return this.http.get<IPaginationDTO<IUserDTO>>(url)
    }

    createUser(name: string, email: string, role: string): Observable<IUserDTO> {
        return this.http.post<IUserDTO>(`${this.url}/users`, {
            name,
            email,
            role
        })
    }

    deleteUser(id:string): Observable<IsucessDTO | IErrorDTO | IUsedInDTO> {
        return this.http.delete<IsucessDTO | IErrorDTO | IUsedInDTO>(`${this.url}/users/${id}`);
    }

    getById(id: string): Observable<IUserDTO> {
        return this.http.get<IUserDTO>(`${this.url}/users/${id}`);
    }

    updateUser(body: IUserDTO): Observable<IUserDTO> {
        return this.http.patch<IUserDTO>(`${this.url}/users/${body.id}`, {
            email: body.email,
            name: body.name,
            role: body.role
        });
    }
}