import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
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
  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private matSnackBar: MatSnackBar
  ) {
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
    console.log(this.book);
    console.log('You reviewed a Book!');
    console.log(liked);
    if (liked) {
      this.bookService.unlikeBook(idBook).subscribe(
        (response: { success: boolean }) => {
          this.book.liked = false;
          this.book.endorsements--;
        },
        (error: HttpErrorResponse) => {
          console.log(error);
          this.matSnackBar.open('You are not authenticated!', 'Close', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        }
      );
    } else {
      this.bookService.likeBook(idBook).subscribe(
        (response: { success: boolean }) => {
          this.book.liked = true;
          this.book.endorsements++;
        },
        (error: HttpErrorResponse) => {
          console.log(error);
          this.matSnackBar.open('You are not authenticated!', 'Close', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        }
      );
    }
  }
}
