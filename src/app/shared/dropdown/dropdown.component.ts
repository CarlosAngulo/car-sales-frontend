import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { NbComponentSize } from '@nebular/theme';
import { Observable, map, of } from 'rxjs';

export class IDropdownOption {
  label!: string;
  value?: string | number | boolean | null;
}

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit, OnChanges {
  @ViewChild('autoInput') input!: ElementRef;
  @Input() value!: IDropdownOption | string | number | boolean | undefined;
  @Input() fieldSize!: NbComponentSize;
  @Input() class!: string;
  @Input() options!: IDropdownOption[];
  @Output() onOptionChange = new EventEmitter<IDropdownOption>()
  filteredOptions$!: Observable<IDropdownOption[]>;
  defaultValue = '';

  constructor() { }

  private filterUsers(value: IDropdownOption | string): IDropdownOption[] {
    const filterValue = typeof(value) === 'string' ? value.toLowerCase() : value.label.toLowerCase();
    return this.options.filter(option => option.label.toLowerCase().includes(filterValue));
  }

  ngOnInit(): void {
    this.filteredOptions$ = of(this.options);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('value' in changes || 'options' in changes) {
      this.selectOptionFromValue();
    }
  }

  private selectOptionFromValue(): void {
    if (this.options && this.value !== undefined && this.value !== null) {
      // console.log(this.options, this.value, this.value instanceof IDropdownOption)
      const value = typeof this.value === 'object' && 'label' in this.value && 'value' in this.value
        ? this.value.value
        : this.value;
      // console.log(value)
      const option = this.options.find((item) => item.value === value);
      // console.log(option)
      this.defaultValue = option?.label || '';
    }
  }

  onChange(): void {
    this.filteredOptions$ = this.getFilteredUsers(this.input.nativeElement.value);
  }

  onSelectionChange(event: IDropdownOption): void {
    this.filteredOptions$ = this.getFilteredUsers(event);
    this.filteredOptions$.subscribe(val => this.onOptionChange.next(val[0]))
  }

  getFilteredUsers(value: IDropdownOption | string): Observable<IDropdownOption[]> {
    return of(value).pipe(
      map(filterString => this.filterUsers(filterString)),
    );
  }
}
