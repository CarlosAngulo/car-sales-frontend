export interface IResultMap {
    [key:string]: any
}

export interface ICustomMappingSetup {
    [key:string]: {
        label: string,
        type: string
    }
}

export class CSVMapper {
    private _customMapping: ICustomMappingSetup= {
        'Last Response Date': {
            label: 'lastResponse',
            type: 'date'
        },
        'Make Sold/Serviced': {
            label: 'solidService',
            type: 'string'
        },
        'Positive?': {
            label: 'positive',
            type: 'boolean'
        },
        'Private Messages': {
            label: 'privateMessages',
            type: 'number'
        },
        'Public Messages': {
            label: 'publicMessages',
            type: 'number'
        },
        'Rating': {
            label: 'rating',
            type: 'number'
        },
        'Reported': {
            label: 'reported',
            type: 'boolean'
        },
        'Screen Name': {
            label: 'client',
            type: 'string'
        },
        'Source': {
            label: 'platform',
            type: 'string'
        },
        'Submitted': {
            label: 'submitted',
            type: 'date'
        },
        'Tagged': {
            label: 'tagged',
            type: 'number'
        },
        'Facebook': {
            label: 'facebook',
            type: 'string'
        },
    }
    private _obj!: IResultMap[];

    constructor(obj: IResultMap[]) {
        this._obj = obj;
    }

    get mapped(): IResultMap[] {
        return this._obj.map((row: any)=> {
            const newRow: any = {};
            for (const originalHeader in row) {
                if (originalHeader in this._customMapping) {
                    newRow[this._customMapping[originalHeader].label] = this.mapType(row[originalHeader], this._customMapping[originalHeader].type);
                } else {
                    newRow[originalHeader] = row[originalHeader]
                }
            }
            return newRow;
        })
    }

    get customMapping(): ICustomMappingSetup {
        return this._customMapping;
    }

    private mapType(value:string, type:string) {
        if (value.trim() === '') return undefined;

        let newValue!: any;
        switch (type) {
            case 'string':
                newValue = value
                break;
            case 'number':
                newValue = isNaN(Number(value)) ? undefined : Number(value)
                break;
            case 'boolean':
                newValue = value.toLowerCase() === 'yes' ? true : false
                break;
            case 'date':
                const date = new Date(value)
                newValue = !isNaN(date.getTime()) ? date : undefined
                break
            default:
                newValue = value
                break;
        }
        return newValue;
    }
}