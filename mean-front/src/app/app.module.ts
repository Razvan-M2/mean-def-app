import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';

import { BookService } from './services/book.service';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { RegisterViewComponent } from './views/register-view/register-view.component';
import { LoginViewComponent } from './views/login-view/login-view.component';
import { HeadBarComponent } from './components-primary/head-bar/head-bar.component';
import { BrowseViewComponent } from './views/browse-views/browse-view.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SingleItemComponent } from './views/single-item/single-item.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AdminViewComponent } from './views/admin-view/admin-view.component';
import { PageHeaderComponent } from './components-primary/page-header/page-header.component';
import { KeywordsService } from './services/keywords.service';
import { AdminAddKeyword } from './views/admin-view/admin-add-keyword.component';
import { HomeViewComponent } from './views/home-view/home-view.component';
import { GridListComponent } from './views/browse-views/list-views/grid-list/grid-list.component';
import { DefaultListComponent } from './views/browse-views/list-views/default-list/default-list.component';
import { AuthInterceptor } from './interceptors/AuthInterceptor';
import { ErrorInterceptor } from './interceptors/ErrorInterceptor';
import { ErrorService } from './services/error.service';
import { ConfirmLogoutComponent } from './components-primary/head-bar/confirm-logout/confirm-logout.component';
import { ErrorComponent } from './components-primary/error/error.component';
import { RecommendedViewComponent } from './views/recommended-view/recommended-view.component';

// import { SwitchableListsRoutingModule } from './views/browse-views/switchable-lists/switchable-lists-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    RegisterViewComponent,
    LoginViewComponent,
    HeadBarComponent,
    BrowseViewComponent,
    SingleItemComponent,
    AdminViewComponent,
    PageHeaderComponent,
    AdminAddKeyword,
    HomeViewComponent,
    GridListComponent,
    DefaultListComponent,
    ConfirmLogoutComponent,
    ErrorComponent,
    RecommendedViewComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDividerModule,
    MatGridListModule,
    MatCardModule,
    MatPaginatorModule,
    MatListModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatSnackBarModule,
  ],
  providers: [
    HttpClient,
    BookService,
    KeywordsService,
    Title,
    ErrorService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
