import { Component, OnInit, TemplateRef } from '@angular/core';
import { UsersGateway } from '../users/domain/users-gateway';
import { IUserDTO } from 'src/app/models/user.model';
import { IDropdownOption } from 'src/app/shared/dropdown/dropdown.component';
import { NbComponentSize, NbDialogService } from '@nebular/theme';
import { ReportsGateway } from './domain/reports-gateway';
import { IReportDTO } from 'src/app/models/report.model';
import { forkJoin, of, switchMap } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormValidatorsService } from 'src/app/shared/services/form-validators.service';
import { UploadComponent } from '../upload/upload.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  providers: [ FormValidatorsService ]
})
export class ReportsComponent implements OnInit {
  customColumn = 'client';
  users!: IUserDTO[];
  reports!: IReportDTO[];
  salesPeople!: IDropdownOption[];
  isNewReportVisible = false;
  currentReportEdit = '';
  componentSize!: NbComponentSize;
  reportForm!: FormGroup;
  revisionMode = false;
  houses: IDropdownOption[] = [
    {label: 'Maple Shade', value: 1},
    {label: 'Nissan', value: 2},
    {label: 'Trooper', value: 3},
    {label: 'Philadelphia', value: 4},
  ];


  tableHeaders = ["Client", "Sales Person", "Picture", "Paid ", "Positive", "Rating", "Submited", "Plaform", "Actions"];

  booleanDropOptions: IDropdownOption[] = [
    { label: 'Yes', value: true },
    { label: 'No', value: false }
  ];

  constructor(
    private readonly usersService: UsersGateway,
    private readonly reportsService: ReportsGateway,
    private dialogService: NbDialogService,
    private fb: FormBuilder,
    private formValidators: FormValidatorsService
  ) { }

  ngOnInit(): void {
    this.loadReports();
    this.createReportForm();
  }

  loadReports() {
    const reportsObs =  this.reportsService.getAll('sortBy=createdAt:desc');
    const usersObs = this.usersService.getAll('role=user&sortBy=createdAt:desc');
    forkJoin([usersObs, reportsObs]).subscribe(
      ([users, reports]) => {
        this.users = users.results
        this.salesPeople = users.results.map((user) => ({
          label: user.name,
          value: user.id
        }));
        this.reports = reports.results.map((report) => ({
          ...report,
          salesPerson: this.users.find((salesPerson) => {
            const id = 'id' in salesPerson ? salesPerson.id : '';
            return id === report.salesPerson
          })
        }))
      }
    );
  }

  editReport(id: string = '') {
    this.currentReportEdit = id;
    this.isNewReportVisible = false;
  }

  onUserSelected(event: IDropdownOption, index: number) {
    const selectedUser = this.users.find((user) => user.id === event.value);
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
      picture: [false, [this.formValidators.booleanValidator()]],
      paid: [null, [this.formValidators.numericValidator()]],
      positive: [null, [this.formValidators.booleanValidator()]],
      rating: [null, [this.formValidators.numericValidator()]],
      submitted: [null, [this.formValidators.dateValidator()]],
      platform: [null, []]
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
    console.log(this.reportForm)
    this.reportsService.createReport(this.reportForm.value)
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

  updateReport(value: any, field: string, id: string, textfield?: boolean) {
    if (this.currentReportEdit || this.revisionMode) return;
    if (textfield) {
      value = value.srcElement?.value
    }
    if (value.label) {
      value = value.value;
    }
    console.log(value, field, id)
    this.reportsService.updateReport(id, { [field]: value })
    .subscribe(res => console.log('updated ', res))
  }

  deleteRegister(dialog: TemplateRef<any>, reportID: string) {
    this.dialogService.open(dialog, {
      context: 'this is some additional data passed to dialog'
    })
    .onClose
    .pipe(
      switchMap((deleting: boolean) => deleting ? this.reportsService.deleteReport(reportID) : of({}))
    )
    .subscribe((deletedReport: any) => {
      console.log(deletedReport)
      if (!deletedReport.id) return;
      const index = this.reports.findIndex(report => report.id === deletedReport.id);
      this.reports.splice(index, 1);
    });
  }

  uploadFile() {
    this.dialogService.open(UploadComponent, {})
    .onClose.subscribe((res: any) => {
      this.revisionMode = true;
      this.reports = res;
      console.table(res);
    });
  }

  onSaveImport() {
    this.revisionMode = false;
    this.loadReports();
  }
  
  onCancelImport() {
    this.revisionMode = false;
    this.loadReports();
  }

  onHouseSelect(event: any) {
    console.log(event)
  }

}
