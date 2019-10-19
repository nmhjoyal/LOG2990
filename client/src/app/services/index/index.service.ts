import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Message } from '../../../../../common/communication/message';
import { IDrawing } from '../../../../../common/drawing-information/IDrawing';

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

   saveTag(tag: any): Observable<boolean> {

    return this.http.post<boolean>(this.BASE_URL + '/tags', { tagToSave: tag }).pipe(
      catchError(this.handleError<boolean>('tags')),
    );
  }

  private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
    return (error: Error): Observable<T> => {
      confirm('Request:' + request.valueOf + ' returned error: ' + error.name + ' with message ' + error.message);
      return of(result as T);
    };
  }
}