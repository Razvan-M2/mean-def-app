import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DisciplinesService } from '../../services/disciplines.service';

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.scss'],
})
export class HomeViewComponent implements OnInit, OnDestroy {
  title = 'Home Page';
  data: { disciplines: string[]; count: number } = {
    disciplines: [],
    count: 0,
  };
  searchText = new FormControl('', [Validators.required]);
  selectedDiscipline: string = '';
  private disciplineSubscription: Subscription;

  constructor(
    private router: Router,
    private disciplineService: DisciplinesService
  ) {}

  ngOnInit(): void {
    this.disciplineSubscription = this.disciplineService
      .getDisciplinesUpdateListener()
      .subscribe((postData: { disciplines: string[]; count: number }) => {
        this.data = postData;
      });
    this.disciplineService.getDisciplines();
  }

  onSubmit(): void {
    if (this.searchText.valid) {
      this.router.navigate(['/browse'], {
        queryParams: {
          search: this.searchText.value,
          discipline: this.selectedDiscipline,
          sortField: 'Title',
          startIndex: 0,
          limit: 8,
          viewStyle: false,
        },
      });
    }
  }

  getErrorMessage(): string {
    return 'You must enter a value';
  }

  ngOnDestroy(): void {
    this.disciplineSubscription.unsubscribe();
  }
}
