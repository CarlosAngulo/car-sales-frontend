import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from '../../../environment/environment';
import { HttpClient } from "@angular/common/http";
import { StoresGateway } from "../domain/stores-gateway";
import { IPaginationDTO } from "src/app/models/pagination.model";
import { IUserDTO } from "src/app/models/user.model";
import { IErrorDTO } from "src/app/models/responses.model";
import { IStoreDTO } from "src/app/models/store.model";

@Injectable({
    providedIn: 'root'
})
export class StoresService extends StoresGateway {

    url = environment.apiURL;

    constructor(private http: HttpClient) {
        super();
    }

    getAll(queryParams?:string): Observable<IStoreDTO[]> {
        const url = queryParams ? `${this.url}/stores?${queryParams}` : `${this.url}/stores`;
        return this.http.get<IUserDTO[]>(url)
    }

    createStore(name: string, active?: boolean): Observable<IUserDTO> {
        return this.http.post<IUserDTO>(`${this.url}/stores`, {
            name,
            active
        })
    }

    deleteStore(id:string): Observable<void | IErrorDTO> {
        return this.http.delete<void | IErrorDTO>(`${this.url}/stores/${id}`);
    }

    updateStore(id: string, body: IStoreDTO): Observable<void | IErrorDTO> {
        return this.http.patch<void | IErrorDTO>(`${this.url}/stores/${id}`, body)
    }
}