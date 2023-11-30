import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { Papa } from 'ngx-papaparse';
import { CSVMapper } from '../reports/mappers/csv.mapper';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
  fileName = '';
  headerMapping: {[key:string]: string}= {
    'Last Response Date': 'lastResponse',
    'Make Sold/Serviced': 'solidService',
    'Positive?': 'positive',
    'Private Messages': 'privateMessages',
    'Public Messages': 'publicMessages',
    'Rating': 'rating',
    'Reported': 'reported',
    'Screen Name': 'salesPerson',
    'Source': 'plaform',
    'Submitted': 'submitted',
    'Tagged': 'tagged',
  }

  constructor(
    protected ref: NbDialogRef<any>,
    private papa: Papa
  ) {}

  customHeaderMapping(header: string): string {
    const headerMapping: {[key:string]: string}= {
      'Last Response Date': 'lastResponse',
      'Make Sold/Serviced': 'solidService',
      'Positive?': 'positive',
      'Private Messages': 'privateMessages',
      'Public Messages': 'publicMessages',
      'Rating': 'rating',
      'Reported': 'reported',
      'Screen Name': 'salesPerson',
      'Source': 'plaform',
      'Submitted': 'submitted',
      'Tagged': 'tagged',
    }
    return headerMapping[header] || '';
  }

  

  onFileSelected(event: any) {
      const file:File = event.target.files[0];

      if (file) {
          this.fileName = file.name;
          if (file.name.endsWith('.csv')) {
            const reader = new FileReader();
            reader.onload = (e:any) => {
              const csvData = e.target.result as string;
              this.parseCSV(csvData);
            };
            reader.readAsText(file);
          }
          // const formData = new FormData();
          // formData.append("thumbnail", file);
          // this.http.post("/api/thumbnail-upload", formData);
          // upload$.subscribe();
      }
  }

  parseCSV(csvData: string) {
    this.papa. parse(csvData, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        this.ref.close(new CSVMapper(result.data).mapped);
      },
      error: (error) => {
        console.error('Error al analizar el archivo CSV:', error);
      }
    });
  }

  cancel() {
    this.ref.close();
  }
}
