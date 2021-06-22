import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class DisciplinesService {
  private data: { disciplines: string[]; count: number } = {
    count: 0,
    disciplines: [],
  };
  private disciplinesUpdated = new Subject<{
    disciplines: any[];
    count: number;
  }>();

  constructor(
    private httpClient: HttpClient,
    private matSnackBar: MatSnackBar
  ) {}

  getDisciplines() {
    const endPoint = '/api/disciplines';
    this.httpClient
      .get<{ disciplines: string[]; success: true; count: number }>(
        environment.apiUrl + endPoint
      )
      .pipe(
        map(
          (resData: {
            disciplines: string[];
            success: true;
            count: number;
          }) => {
            return { disciplines: resData.disciplines, count: resData.count };
          }
        )
      )
      .subscribe(
        (transformedData) => {
          this.data = transformedData;
          this.disciplinesUpdated.next({
            disciplines: [...this.data.disciplines],
            count: transformedData.count,
          });
        },
        (error: Error) => {
          this.matSnackBar.open('Error requesting data to server', 'Close', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
          this.disciplinesUpdated.next({
            disciplines: [],
            count: 0,
          });
        }
      );
  }
  getDisciplinesUpdateListener() {
    return this.disciplinesUpdated.asObservable();
  }
}
