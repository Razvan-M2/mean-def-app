import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BookBundle } from '../models/BookBundle';
import { Book } from '../models/Book';
import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { PayloadStruct } from '../models/Payload';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowseViewComponent } from '../views/browse-views/browse-view.component';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private books: BookBundle = { count: 0, data: [] };
  private googleBooks: BookBundle = { count: 0, data: [] };
  private booksUpdated = new Subject<BookBundle>();
  private googleBooksUpdated = new Subject<BookBundle>();
  private recommendedBooksUpdated = new Subject<
    { book: Book; recommendation: Book }[]
  >();

  constructor(
    private httpClient: HttpClient,
    private matSnackBar: MatSnackBar
  ) {}

  getBooks(filters: PayloadStruct) {
    const endPoint = '/api/books';
    const queryParams = `?search=${filters.search}&discipline=${filters.discipline}&startIndex=${filters.startIndex}&limit=${filters.limit}&sortField=${filters.sortField}`;
    // console.log(filters);
    this.httpClient
      .get<{ data: Book[]; success: boolean; length: number }>(
        environment.apiUrl + endPoint + queryParams
      )
      .pipe(
        map((resData: { data: Book[]; success: boolean; length: number }) => {
          return {
            count: resData.length,
            data: resData.data,
          };
        })
      )
      .subscribe(
        (transformedData: BookBundle) => {
          this.books = transformedData;

          this.booksUpdated.next({
            data: [...this.books.data],
            count: transformedData.count,
          });
          if (this.books.count > 0) {
            return true;
          } else {
            this.matSnackBar.open('No books were found', 'Close', {
              duration: 1500,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
            return false;
          }
        },
        (error: HttpErrorResponse) => {
          console.log(error);
          this.booksUpdated.next({
            data: [],
            count: 0,
          });
          return false;
        }
      );
  }

  getGoogleBooks(filters: {
    search: string;
    sortField: string;
    startIndex: number;
    limit: number;
  }) {
    const endPoint = '/api/google_books';

    const queryParams = `?search=${filters.search}&startIndex=${filters.startIndex}&limit=${filters.limit}&sortField=${filters.sortField}`;
    this.httpClient
      .get<{ success: boolean; data: BookBundle }>(
        environment.apiUrl + endPoint + queryParams
      )
      .pipe(
        map((resData: { success: boolean; data: BookBundle }) => {
          return {
            ...resData.data,
          };
        })
      )
      .subscribe(
        (transformedData: BookBundle) => {
          this.googleBooks = transformedData;
          this.googleBooksUpdated.next({ ...this.googleBooks });
        },
        (error: Error) => {
          this.googleBooksUpdated.next({
            data: [],
            count: 0,
          });
        }
      );
  }

  getBook(id: string) {
    const endPoint = '/api/books/' + id;
    return this.httpClient.get<{ data: any; success: boolean }>(
      environment.apiUrl + endPoint
    );
  }

  likeBook(idBook: number): Observable<{ success: boolean }> {
    const endPoint = '/api/users/likebook/' + idBook;
    return this.httpClient.post<{ success: boolean }>(
      environment.apiUrl + endPoint,
      {}
    );
  }

  unlikeBook(idBook: number): Observable<{ success: boolean }> {
    const endPoint = '/api/users/unlikebook/' + idBook;
    return this.httpClient.post<{ success: boolean }>(
      environment.apiUrl + endPoint,
      {}
    );
  }

  getRecommendedBooks(): boolean {
    const endPoint = '/api/users/books-recommended';
    this.httpClient
      .get<{ data: { book: Book; recommendation: Book }[]; success: boolean }>(
        environment.apiUrl + endPoint
      )
      .subscribe(
        (resData: {
          data: { book: Book; recommendation: Book }[];
          success: boolean;
        }) => {
          console.log(resData.data);
          this.recommendedBooksUpdated.next([...resData.data]);
          return true;
        },
        (error: HttpErrorResponse) => {
          console.log(error);
          this.matSnackBar.open('Error requesting data to server', '', {
            duration: 1500,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
          this.booksUpdated.next({
            data: [],
            count: 0,
          });
          return false;
        }
      );
    return false;
  }

  getBooksUpdateListener() {
    return this.booksUpdated.asObservable();
  }

  getGoogleBooksUpdateListener() {
    return this.googleBooksUpdated.asObservable();
  }

  getRecommendedBooksUpdateListener() {
    return this.recommendedBooksUpdated.asObservable();
  }
}
