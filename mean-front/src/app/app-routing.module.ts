import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { AdminViewComponent } from './views/admin-view/admin-view.component';
import { BrowseViewComponent } from './views/browse-views/browse-view.component';
import { HomeViewComponent } from './views/home-view/home-view.component';
import { LoginViewComponent } from './views/login-view/login-view.component';
import { RecommendedViewComponent } from './views/recommended-view/recommended-view.component';
import { RegisterViewComponent } from './views/register-view/register-view.component';
import { SingleItemComponent } from './views/single-item/single-item.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginViewComponent,
    data: { title: 'Login Page' },
  },
  {
    path: 'register',
    component: RegisterViewComponent,
    data: { title: 'Register Page' },
  },
  {
    path: '',
    component: HomeViewComponent,
    data: { title: 'GraphBook Home' },
  },
  {
    path: 'browse',
    component: BrowseViewComponent,
    data: { title: 'GraphBook Browse' },
  },
  {
    path: 'browse/:id',
    component: SingleItemComponent,
    data: { title: 'GraphBook' },
  },
  {
    path: 'book-recommendations',
    component: RecommendedViewComponent,
    data: { title: 'GraphBook Recommendations' },
    canActivate: [AuthGuard],
  },
  {
    path: 'admin',
    component: AdminViewComponent,
    data: { title: 'Admin' },
    canActivate: [AuthGuard, RoleGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
