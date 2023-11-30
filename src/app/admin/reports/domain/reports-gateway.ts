import { Observable } from "rxjs";
import { IErrorDTO } from "src/app/models/error.model";
import { IPaginationDTO } from "src/app/models/pagination.model";
import { IReportDTO } from "src/app/models/report.model";

export abstract class ReportsGateway {
    abstract getAll(queryParams?:string): Observable<IPaginationDTO<IReportDTO>>;
    abstract getByUser(queryParams?:string): Observable<IPaginationDTO<IReportDTO>>;
    abstract createReport(formBody: Partial<IReportDTO>): Observable<IReportDTO>;
    abstract createMultipleReport(formBody: Partial<IReportDTO>[]): Observable<IReportDTO>
    abstract updateReport(id:string, reqBody: Partial<IReportDTO>): Observable<void | IErrorDTO>;
    abstract deleteReport(id: string): Observable<void | IErrorDTO>;
}