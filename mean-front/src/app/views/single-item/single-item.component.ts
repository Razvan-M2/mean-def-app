import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from 'src/app/models/Book';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-single-item',
  templateUrl: './single-item.component.html',
  styleUrls: ['./single-item.component.scss'],
})
export class SingleItemComponent implements OnInit {
  private id: string;
  book: Book;
  constructor(private route: ActivatedRoute, private bookService: BookService) {
    this.id = '';
    // this.book = {};
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      this.bookService.getBook(this.id).subscribe((bookData) => {
        this.book = bookData.data;
        console.log(this.book);
      });
    });
  }

  ngOnInit(): void {}

  reviewBook(liked: boolean, idBook: number): void {
    if (liked) {
      this.bookService.likeBook(idBook);
    } else {
      this.bookService.unlikeBook(idBook);
    }
  }
}
