import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Book } from 'src/app/models/Book';
import { AuthService } from 'src/app/services/auth.service';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-recommended-view',
  templateUrl: './recommended-view.component.html',
  styleUrls: ['./recommended-view.component.scss'],
})
export class RecommendedViewComponent implements OnInit {
  private recommendedBooksSubscription: Subscription;
  books: { book: Book; recommendation: Book }[];

  constructor(
    private bookService: BookService,
    private matSnackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.recommendedBooksSubscription = this.bookService
      .getRecommendedBooksUpdateListener()
      .subscribe((serviceData: { book: Book; recommendation: Book }[]) => {
        this.books = serviceData;
      });
    this.bookService.getRecommendedBooks();
  }

  reviewBook(liked: boolean, idBook: number): void {
    if (liked) {
      this.unlikeBook(idBook);
    } else {
      this.likeBook(idBook);
    }
  }

  likeBook(idBook: number): void {
    console.log(idBook);
    this.bookService.likeBook(idBook).subscribe(
      (result: { success: boolean }) => {
        console.log('Right here');
        this.matSnackBar.open('Action Success!', 'Close', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        this.bookService.getRecommendedBooks();
      }
      // (error: HttpErrorResponse) => {}
    );
  }

  unlikeBook(idBook: number): void {
    console.log(idBook);
    this.bookService.unlikeBook(idBook).subscribe(
      (result: { success: boolean }) => {
        console.log('Right here');
        this.matSnackBar.open('Action Success!', 'Close', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        this.bookService.getRecommendedBooks();
      }
      // (error: HttpErrorResponse) => {}
    );
  }
}
