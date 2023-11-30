import { Component, EventEmitter, OnInit } from '@angular/core';
import { NbAuthService } from '@nebular/auth';
import { Observable, switchMap, tap } from 'rxjs';
import { ReportsGateway } from 'src/app/admin/reports/domain/reports-gateway';
import { IPaginationDTO } from 'src/app/models/pagination.model';
import { IReportDTO } from 'src/app/models/report.model';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  showReports = false;
  reports!: IReportDTO[];
  tableHeaders = ["Client", "Paid ", "Positive", "Rating", "Submited", "Store"];
  loading = false;
  paid = 0;
  totalReviews = 0;
  
  constructor(
    private readonly reportsService: ReportsGateway
  ) {}

  ngOnInit(): void {
  }

  getReports$(queryParams?: {[key:string]: any}):  Observable<IPaginationDTO<IReportDTO>> {
    this.reports = [];
    this.loading = true;
    let query = `sortBy=createdAt:asc`;

    for (const key in queryParams) {
      if (Object.prototype.hasOwnProperty.call(queryParams, key)) {
        query += `&${key}=${queryParams[key]}`;
      }
    }

    return this.reportsService.getByUser(query)
    .pipe(
      tap((_) => this.loading = false)
    );
  }

  onDateRangeSelected(event: any) {
    if (event.start && event.end) {
      this.getReports$({startDate: new Date(event.start), endDate: new Date( event.end)})
      .subscribe((res) => {
        this.reports = res.results;
        this.totalReviews = res.totalResults || 0;
        this.paid = res.results.reduce((acc, curr) => {
          return (curr.paid || 0) + acc
        }, 0)
      })
    }
  }


}
