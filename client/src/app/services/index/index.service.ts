import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IDrawing } from '../../../../../common/drawing-information/IDrawing';
import { ITag } from '../../../../../common/drawing-information/ITag';

@Injectable({
  providedIn: 'root',
})
export class IndexService {

  private readonly BASE_URL: string = 'http://localhost:3000/api/index';

  constructor(private http: HttpClient) {
  }

  saveDrawing(drawing: IDrawing): Observable<boolean | undefined> {
    return this.http.post<boolean>(this.BASE_URL + '/save', { drawingToSave: drawing }).pipe(
      catchError(this.handleError<boolean>('save')),
    );
  }

  saveTag(tag: ITag): Observable<boolean | undefined> {
    return this.http.post<boolean>(this.BASE_URL + '/tags', { tagToSave: tag }).pipe(
      catchError(this.handleError<boolean>('tags')),
    );
  }

  getTags(): Observable<ITag[] | undefined> {
    return this.http.get<ITag[]>(this.BASE_URL + '/gettags').pipe(
      catchError(this.handleError<ITag[]>('gettags')),
    );
  }

  getDrawings(): Observable<IDrawing[] | undefined> {
    return this.http.get<IDrawing[]>(this.BASE_URL + '/getdrawings').pipe(
      catchError(this.handleError<IDrawing[]>('getdrawings')),
    );
  }

  getDrawing(selectedDrawing: IDrawing): Observable<IDrawing | undefined> {
    return this.http.get<IDrawing>(this.BASE_URL + '/getdrawing/' + this.dateToId(selectedDrawing.timestamp)).pipe(
      catchError(this.handleError<IDrawing>('getdrawing')),
    );
  }

  private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
    return (error: Error): Observable<T> => {
      confirm('Request:' + request.valueOf + ' returned error: ' + error.name + ' with message ' + error.message);
      return of(result as T);
    };
  }

  private dateToId(date: string): string {
    return date.replace(/[^0-9]/g, '');
  }
}
