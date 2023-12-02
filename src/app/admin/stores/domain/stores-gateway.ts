import { Observable } from "rxjs";
import { IErrorDTO } from "src/app/models/responses.model";
import { IStoreDTO } from "src/app/models/store.model";

export abstract class StoresGateway {
    abstract getAll(queryParams?:string): Observable<IStoreDTO[]>;
    abstract createStore(name:string, active?:boolean): Observable<IStoreDTO>;
    abstract deleteStore(id: string): Observable<void | IErrorDTO>;
    abstract updateStore(id: string, body: IStoreDTO ): Observable<void | IErrorDTO>;
}