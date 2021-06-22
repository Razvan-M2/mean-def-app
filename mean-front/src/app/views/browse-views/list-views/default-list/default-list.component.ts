import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Book } from 'src/app/models/Book';

@Component({
  selector: 'app-default-list',
  templateUrl: './default-list.component.html',
  styleUrls: ['./default-list.component.scss'],
})
export class DefaultListComponent implements OnInit {
  @Input() data: { books: Book[]; search: string };

  @Output() likeBookEvent = new EventEmitter<number>();
  @Output() unlikeBookEvent = new EventEmitter<number>();

  likeIcon: string;

  constructor() {}

  ngOnInit(): void {}

  //  Moved from switchable-list component
  highlightText(text: string): string {
    if (this.data.search.length > 0) {
      var searchKeys = this.data.search.split(' ');
      var formattedText = text;
      searchKeys.forEach((key) => {
        formattedText = formattedText
          .split(key)
          .join(`<span class="highlighted">${key}</span>`);
      });

      return formattedText;
    } else {
      return text;
    }
  }
  reviewBook(liked: boolean, idBook: number): void {
    if (liked) {
      this.unlikeBookEvent.emit(idBook);
    } else {
      this.likeBookEvent.emit(idBook);
    }
  }

  likeBook(idBook: number): void {
    this.likeBookEvent.emit(idBook);
  }

  unlikeBook(idBook: number): void {
    this.unlikeBookEvent.emit(idBook);
  }
}
