import { Component, ElementRef, OnInit, TemplateRef } from '@angular/core';
import { UsersGateway } from '../users/domain/users-gateway';
import { IUserDTO } from 'src/app/models/user.model';
import { IDropdownOption } from 'src/app/shared/dropdown/dropdown.component';
import { NbComponentSize, NbDialogService, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { ReportsGateway } from './domain/reports-gateway';
import { IReportDTO } from 'src/app/models/report.model';
import { Observable, catchError, delay, forkJoin, of, switchMap, tap } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormValidatorsService } from 'src/app/shared/services/form-validators.service';
import { StoresGateway } from '../stores/domain/stores-gateway';
import { IPaginationDTO, IPaginationMeta } from 'src/app/models/pagination.model';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { CSVMapper } from '../reports/mappers/csv.mapper';
import { Papa } from 'ngx-papaparse';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  providers: [ FormValidatorsService ]
})
export class ReportsComponent implements OnInit {
  loading = true;
  customColumn = 'client';
  users!: IUserDTO[];
  reports!: IReportDTO[];
  salesPeople!: IDropdownOption[];
  isNewReportVisible = false;
  currentReportEdit = '';
  componentSize!: NbComponentSize;
  reportForm!: FormGroup;
  revisionMode = false;
  selectedStore!: any;
  stores: IDropdownOption[] = [
    {label: 'Maple Shade', value: 1},
    {label: 'Nissan', value: 2},
    {label: 'Trooper', value: 3},
    {label: 'Philadelphia', value: 4},
  ];
  pagination!: IPaginationMeta;
  currentEditedReport!: IReportDTO | undefined;
  toastrPositions = NbGlobalPhysicalPosition;

  tableHeaders = ["Client", "Sales Person", "Picture", "Paid ", "Positive", "Rating", "Submited", "Plaform", "Actions"];

  booleanDropOptions: IDropdownOption[] = [
    { label: 'Yes', value: true },
    { label: 'No', value: false }
  ];

  constructor(
    private readonly usersService: UsersGateway,
    private readonly reportsService: ReportsGateway,
    private readonly storesService: StoresGateway,
    private readonly dialogService: NbDialogService,
    private readonly fb: FormBuilder,
    private readonly formValidators: FormValidatorsService,
    private readonly papa: Papa,
    private toastrService: NbToastrService
  ) { }

  ngOnInit(): void {
    this.loadStoresAndReports();
    this.createReportForm();
  }

  getReports$(queryParams?: {[key:string]: any}):  Observable<IPaginationDTO<IReportDTO>> {
    this.reports = [];
    this.loading = true;
    let query = `sortBy=createdAt:desc&store=${this.currentStoreName}`;
    for (const key in queryParams) {
      if (Object.prototype.hasOwnProperty.call(queryParams, key)) {
        query += `&${key}=${queryParams[key]}`;
      }
    }
    return this.reportsService.getAll(query)
    .pipe(
      tap((_) => this.loading = false)
    );
  }

  loadStoresAndReports() {
    this.storesService.getAll()
    .pipe(
      switchMap((stores)=> {
        this.stores = stores.map((store) => ({
          label: store.name,
          value: store.id
        }));
        this.selectedStore = this.currentStoreName || this.stores[0].value;

        return forkJoin([
          this.getReports$(),
          this.usersService.getAll('role=user&sortBy=createdAt:desc')
        ])
      })
    )
    .subscribe(([reports, users]) => {
      this.users = users.results;
      this.salesPeople = users.results.map((user) => ({
        label: user.name,
        value: user.id
      }));

      this.loadReportList(reports)
    });
  }

  get currentStoreName(): string | undefined {
    return this.stores.find((store) => store.value === this.selectedStore)?.label || undefined;
  }

  loadReportList(reports: IPaginationDTO<IReportDTO>) {
    this.pagination = {
      limit: reports.limit,
      page: reports.page,
      totalPages: reports.totalPages,
      totalResults: reports.totalResults
    };
    
    this.reports = reports.results.map((report) => ({
      ...report,
      salesPerson: this.users.find((salesPerson) => {
        const id = 'id' in salesPerson ? salesPerson.id : '';
        return id === report.salesPerson
      })
    }))
    console.log(this.reports)
  }

  editReport(id: string = '') {
    this.currentReportEdit = id;
    this.isNewReportVisible = false;
  }

  showAddReport(val: boolean = true) {
    this.currentReportEdit = '';
    this.isNewReportVisible = val;
    if (!val) {
      this.reportForm.reset();
    }
    this.createReportForm();
  }

  createReportForm() {
    this.reportForm = this.fb.group({
      client: ['', [Validators.required]],
      salesPerson: ['', [Validators.required]],
      picture: [false, [this.formValidators.boolean()]],
      paid: [null, [this.formValidators.numeric()]],
      positive: [null, [this.formValidators.boolean()]],
      rating: [null, [this.formValidators.numeric()]],
      submitted: [null, [this.formValidators.date()]],
      platform: [null, []],
    })
  }

  updateNewReport(value: any, field: string, textfield?: boolean) {
    if (textfield) {
      value = value.srcElement?.value
    }
    if (value.label) {
      value = value.value;
    }
    this.reportForm.get(field)?.setValue(value);
  }

  onCreateReportSubmit() {
    const reportData = {
      ...this.reportForm.value,
      store: this.currentStoreName
    }
    this.reportsService.createReport(reportData)
    .subscribe((report: IReportDTO) => {
      this.showAddReport(false);
      this.reports.unshift({
        ...report,
        salesPerson: this.users.find((salesPerson) => {
          const id = 'id' in salesPerson ? salesPerson.id : '';
          return id === report.salesPerson
        })
      })
    })
  }

  onEditReportRecordSubmit() {
    if (this.currentEditedReport?.id) {
      this.reportsService.updateReport(this.currentEditedReport?.id, this.currentEditedReport)
      .pipe(
        switchMap((res) => {
          this.currentReportEdit = '';
          this.currentEditedReport = undefined;
          this.showToastr('The review has been updated.')
          return this.getReports$();
        })
      )
      .subscribe((res) => {
        this.loadReportList(res);
      })
    }
  }

  updateReport(value: any, field: keyof IReportDTO, id: string | number, textfield?: boolean) {
    if (textfield) {
      value = value.srcElement?.value
    }

    if (value.label) {
      value = value.value;
    }

    if (this.revisionMode) {
      const index = Number(id);
      let currentRegister = {
        ...this.reports[index],
        [field]: field === 'salesPerson' ? this.users.find((salesPerson) => value === salesPerson.id) : value
      };
      this.reports[index] = currentRegister;
      return;
    };
    
    if (this.currentReportEdit) {
      if (!this.currentEditedReport) {
        this.currentEditedReport = this.reports.find((report) => report.id === id);
      } 
      if (this.currentEditedReport) {
        this.currentEditedReport = {
          ...this.currentEditedReport,
          salesPerson: this.users.find((salesPerson) => {
            const id = 'id' in salesPerson ? salesPerson.id : '';
            return id === this.currentEditedReport?.salesPerson
          }),
          [field]: value
        }
      }
      return;
    }
    
    this.reportsService.updateReport(id.toString(), { [field]: value })
    .subscribe(res => console.log('updated ', res))
  }

  deleteRegister(reportID: string, index: number) {
    if(this.revisionMode) {
      this.reports.splice(index, 1);
      return;
    }
    this.dialogService.open(ConfirmDialogComponent, {
      context: {
        icon: 'alert-triangle',
        title: 'Delete register',
        message: 'Are you sure you want to delete this register?'
      }
    })
    .onClose
    .pipe(
      switchMap((deleting: boolean) => deleting ? this.reportsService.deleteReport(reportID.toString()) : of({}))
    )
    .subscribe((deletedReport: any) => {
      if (!deletedReport.id) return;
      const index = this.reports.findIndex(report => report.id === deletedReport.id);
      this.reports.splice(index, 1);
    });
  }

  parseCSV(csvData: string) {
    this.papa.parse(csvData,
      {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          this.uploadFile(new CSVMapper(result.data).mapped)
        },
        error: (error) => ({error})
      }
    );
  }

  onFileSelected(event: any) {
    const file:File = event.target.files[0];
    if (file?.name.endsWith('.csv')) {
      const reader = new FileReader();
      reader.onload = (e:any) => {
        const csvData = e.target.result as string;
        this.parseCSV(csvData);
      };
      reader.readAsText(file);
    }
  }

  uploadFile(data:any) {
    if(data?.error) return; 
    this.selectedStore = undefined;
    this.revisionMode = true;
    this.reports = data;
  }

  onSaveImport() {
    if (!this.selectedStore) return;
    
    const reports = this.reports.map((report) => {
      const salesPerson = report.salesPerson as IUserDTO;
      return {
        ...report,
        salesPerson: salesPerson?.id,
        store: this.currentStoreName
      }
    });

    this.reportsService.createMultipleReport(reports)
    .pipe(
      catchError((err) => of({error: err}))
    )
    .subscribe((res: any) => {
      if (!res.error) {
        this.revisionMode = false;
        this.getReports$()
        .subscribe((res) =>this.loadReportList(res));
      }
    });
  }
  
  onCancelImport() {
    this.revisionMode = false;
    this.selectedStore = this.currentStoreName || this.stores[0].value;
    this.getReports$()
    .subscribe((res) =>this.loadReportList(res));
  }

  onStoreSelect(event: IDropdownOption) {
    this.getReports$()
    .subscribe((res) =>this.loadReportList(res))
  }

  onPageChange(event: number) {
    this.getReports$({'page': event})
    .subscribe((res) =>this.loadReportList(res))
  }

  showToastr(message: string, status: string = 'Success', position = this.toastrPositions.BOTTOM_LEFT ) {
    this.toastrService.show(
      status,
      message,
      {
        position,
        status: status.toLowerCase()
      }
    );
    return;
  }
}
