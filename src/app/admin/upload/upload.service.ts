import { Injectable } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { CSVMapper } from '../reports/mappers/csv.mapper';

@Injectable({
    providedIn: 'root'
})
export class UploadCSVService {
    fileName = '';
    headerMapping: { [key: string]: string } = {
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

    constructor(private papa: Papa) {}

    customHeaderMapping(header: string): string {
        const headerMapping: { [key: string]: string } = {
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

    parseCSV(csvData: string) {
        return this.papa.parse(csvData,
            {
                header: true,
                skipEmptyLines: true,
                complete: (result) => new CSVMapper(result.data).mapped,
                error: (error) => ({error})
            }
        );
    }
}