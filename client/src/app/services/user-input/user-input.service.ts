import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserInputService {

  userInput = 10;

  yee(num: number): void {
    this.userInput = num;
  }
}
