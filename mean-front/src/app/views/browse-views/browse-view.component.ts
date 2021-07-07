import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BookBundle } from 'src/app/models/BookBundle';
import { BookService } from 'src/app/services/book.service';
import { DisciplinesService } from 'src/app/services/disciplines.service';
import { PayloadStruct } from '../../models/Payload';

@Component({
  selector: 'app-browse-view',
  templateUrl: './browse-view.component.html',
  styleUrls: ['./browse-view.component.scss'],
})
export class BrowseViewComponent implements OnInit, OnDestroy {
  title: string = 'Browse Page';

  paginatorAttributes: {
    length: number;
    pageSize: number;
    pageSizeOptions: number[];
  } = {
    length: 0,
    pageSize: 0,
    pageSizeOptions: [],
  };

  disciplines: string[];

  payload: PayloadStruct = {
    search: '',
    discipline: '',
    sortField: 'Title',
    startIndex: 0,
    limit: 0,
    viewStyle: false,
  };

  viewResource: boolean = false;

  dataPacket: BookBundle = { count: 0, data: [] };

  connection_success: boolean;

  private bookSubscription: Subscription;
  private googleBooksSubscription: Subscription;
  private disciplinesSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private disciplinesService: DisciplinesService
  ) {}

  ngOnInit(): void {
    this.mapParameters(this.route.snapshot.queryParamMap);

    this.bookSubscription = this.bookService
      .getBooksUpdateListener()
      .subscribe((serviceData: BookBundle) => {
        this.dataPacket = serviceData;
      });

    this.googleBooksSubscription = this.bookService
      .getGoogleBooksUpdateListener()
      .subscribe((serviceData: BookBundle) => {
        this.dataPacket = serviceData;
      });
    this.disciplinesSubscription = this.disciplinesService
      .getDisciplinesUpdateListener()
      .subscribe((resData: { disciplines: string[]; count: number }) => {
        this.disciplines = resData.disciplines;
      });
    this.disciplinesService.getDisciplines();
    this.updateBookPacket();
  }

  ngOnDestroy(): void {
    this.bookSubscription.unsubscribe();
    this.googleBooksSubscription.unsubscribe();
    this.disciplinesSubscription.unsubscribe();
  }

  mapParameters(parameters): void {
    parameters.keys.forEach((parameter) => {
      this.payload[parameter] = parameters.get(parameter);
    });
    this.payload.limit = parseInt(parameters.get('limit'));
    this.payload.startIndex = parseInt(parameters.get('startIndex'));
    this.payload.viewStyle = 'true' === parameters.get('viewStyle');
  }

  updateBookPacket(): void {
    if (this.viewResource) this.bookService.getGoogleBooks(this.payload);
    else {
      this.bookService.getBooks(this.payload);
    }
  }

  //  Routes to new page with new filters
  routeNewParameters() {
    this.router.navigate(['/browse'], {
      queryParams: { ...this.payload },
    });
    this.updateBookPacket();
    // this.bookService.getGoogleBooks(this.payload);
  }

  onSubmit(): void {
    this.routeNewParameters();
  }

  onPaginate(event: PageEvent): void {
    this.payload.limit = event.pageSize;
    this.payload.startIndex = event.pageIndex * this.payload.limit;
    this.onSubmit();
  }

  onChangeView(event: MatSlideToggleChange): void {
    this.payload.viewStyle = event.checked;
    this.onSubmit();
  }

  onChangeResource(event: MatSlideToggleChange): void {
    this.viewResource = event.checked;
    this.onSubmit();
  }

  onSortSelectChange(): void {
    this.onSubmit();
  }
  onDisciplineSelectChange(): void {
    this.onSubmit();
  }

  likeBook(idBook: number): void {
    console.log(idBook);
    this.bookService.likeBook(idBook).subscribe(
      (result: { success: boolean }) => {
        console.log('Right here');
        this.bookService.getBooks(this.payload);
      },
      (error: HttpErrorResponse) => {}
    );
  }

  unlikeBook(idBook: number): void {
    console.log(idBook);
    this.bookService.unlikeBook(idBook).subscribe(
      (result: { success: boolean }) => {
        console.log('Right here');
        this.bookService.getBooks(this.payload);
      },
      (error: HttpErrorResponse) => {}
    );
  }
}
