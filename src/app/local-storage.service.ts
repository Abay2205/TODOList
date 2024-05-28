import { Injectable } from '@angular/core';
import {Todo} from "./todos.interface";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  public saveData(key: string, value: Todo[]) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public getData(key: string) {
    const todosString = localStorage.getItem(key)
    if (todosString) {
      return JSON.parse(todosString);
    } else {
      return [];
    }
  }
  public removeData(key: string) {
    localStorage.removeItem(key);
  }

  public clearData() {
    localStorage.clear();
  }
}
