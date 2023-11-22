import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IPaginationMeta } from 'src/app/models/pagination.model';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  pageList!: number[];
  @Output() onPageChange = new EventEmitter<number>();
  @Input() currentPage!: number;
  @Input() set pagination (val: IPaginationMeta) {
    if (!val) return;
    this.currentPage = val.page;
    this.pageList = Array(val.totalPages)
      .fill(0, 0, val.totalPages)
      .map((x, i)=>  i + 1 );
  };

  onPageClick(page: number) {
    this.onPageChange.emit(page)
  }

  onChangePage(val: number) {
    this.onPageChange.emit(this.currentPage + val)
  }
}
