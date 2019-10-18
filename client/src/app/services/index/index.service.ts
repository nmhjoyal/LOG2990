import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Message } from '../../../../../common/communication/message';
import { IDrawing } from '../drawing-storage/IDrawing';

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

  async saveDrawing(drawing: IDrawing): Promise<boolean> {
    return this.http
      .post('http://localhost:3000/save', { drawingToSave: drawing })
      .toPromise().then((response: any) => {
        if (response.json()) {
          console.log('SAVED');
          return true;
        }
        console.log('SAVE FAILED');
        return false;
      });
  }

  async saveTag(tag: any) {
    return this.http
    .post('http://localhost:3000/tags', { tagToSave: tag })
    .toPromise().then((response: any) => {
      if (response.json()) {
        console.log(tag + 'SAVED');
        return true;
      }
      console.log(tag + 'SAVE FAILED');
      return false;
    });
  }

  private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
    return (error: Error): Observable<T> => {
      confirm('Request:' + request.valueOf + ' returned error: ' + error.name + ' with message ' + error.message);
      return of(result as T);
    };
  }
}
