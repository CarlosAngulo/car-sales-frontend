import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from '../../../environment/environment';
import { HttpClient } from "@angular/common/http";
import { ReportsGateway } from "../domain/reports-gateway";
import { IPaginationDTO } from "src/app/models/pagination.model";
import { IErrorDTO } from "src/app/models/error.model";
import { IReportDTO } from "src/app/models/report.model";

@Injectable({
    providedIn: 'root'
})
export class ReportsService extends ReportsGateway {

    url = environment.apiURL;

    constructor(private http: HttpClient) {
        super();
    }

    getAll(queryParams?:string): Observable<IPaginationDTO<IReportDTO>> {
        const url = queryParams ? `${this.url}/reports?${queryParams}` : `${this.url}/reports`;
        return this.http.get<IPaginationDTO<IReportDTO>>(url)
    }

    createReport(formBody: Partial<IReportDTO>): Observable<IReportDTO> {
        return this.http.post<IReportDTO>(`${this.url}/reports`, formBody)
    }

    deleteReport(id:string): Observable<void | IErrorDTO> {
        return this.http.delete<void | IErrorDTO>(`${this.url}/reports/${id}`);
    }

    updateReport(id:string, reqBody: Partial<IReportDTO>): Observable<void | IErrorDTO> {
        return this.http.patch<void | IErrorDTO>(`${this.url}/reports/${id}`, reqBody);
    }
}