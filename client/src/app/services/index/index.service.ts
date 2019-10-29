import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Message } from '../../../../../common/communication/message';
import { IDrawing } from '../../../../../common/drawing-information/IDrawing';
import { ITag } from '../../../../../common/drawing-information/ITag';

@Injectable({
  providedIn: 'root',
})
export class IndexService {

  private readonly BASE_URL: string = 'http://localhost:3000/api/index';

  constructor(private http: HttpClient) {
  }

  basicGet(): Observable<Message> {

    return this.http.get<Message>(this.BASE_URL).pipe(
      catchError(this.handleError<Message>('basicGet')),
    );
  }

  saveDrawing(drawing: IDrawing): Observable<boolean> {
    return this.http.post<boolean>(this.BASE_URL + '/save', {drawingToSave: drawing}).pipe(
      catchError(this.handleError<boolean>('save')),
    );
  }

   saveTag(tag: ITag): Observable<boolean> {
    return this.http.post<boolean>(this.BASE_URL + '/tags', { tagToSave: tag }).pipe(
      catchError(this.handleError<boolean>('tags')),
    );
  }

  getTags(): Observable<ITag[]> {
    return this.http.get<ITag[]>(this.BASE_URL + '/gettags').pipe(
      catchError(this.handleError<ITag[]>('gettags')),
    );
  }

  getDrawings(): Observable<IDrawing[]> {
    return this.http.get<IDrawing[]>(this.BASE_URL + '/getdrawings').pipe(
      catchError(this.handleError<IDrawing[]>('getdrawings')),
    );
  }

  // TODO: check what happens if returns undefined
  getDrawing(selectedDrawing: IDrawing): Observable<IDrawing> {
    return this.http.get<IDrawing>(this.BASE_URL + '/getdrawing/' + this.dateToId(selectedDrawing.timestamp)).pipe(
      catchError(this.handleError<IDrawing>('getdrawing')),
    );
  }

  private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
    return (error: Error): Observable<T> => {
      confirm('Request:' + request.valueOf() + ' returned error: ' + error.name + ' with message ' + error.message);
      return of(result as T);
    };
  }

  // TODO: Move to common to share with server/index.service.ts
  private dateToId(date: string): string {
    return date.replace(/[^0-9]/g, '');
  }
}
