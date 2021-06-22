import { Component, Input, OnInit } from '@angular/core';
import { Book } from 'src/app/models/Book';

@Component({
  selector: 'app-grid-list',
  templateUrl: './grid-list.component.html',
  styleUrls: ['./grid-list.component.scss'],
})
export class GridListComponent implements OnInit {
  @Input() data: { books: Book[]; search: string };
  // @Input()
  // set data(newData: { books: Book[]; search: string }) {
  //   this.data = newData;
  //   console.log(this.data);
  // }

  constructor() {}

  ngOnInit(): void {
    console.log(this.data);
  }
}
